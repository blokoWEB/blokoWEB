import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "gallery";
const DEFAULT_LIMIT = 24;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");
  const offset = Number(searchParams.get("offset") ?? "0");
  const limit = Math.min(Number(searchParams.get("limit") ?? DEFAULT_LIMIT), 60);

  if (!type || !slug || (type !== "torneios" && type !== "eventos")) {
    return NextResponse.json({ error: "Parâmetros type/slug inválidos." }, { status: 400 });
  }

  const base = `${type}/${slug}`;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(BUCKET).list(`${base}/thumb`, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });

    if (error) {
      // Bucket/folder not created yet, or nothing uploaded — treat as an empty gallery.
      return NextResponse.json({ images: [], hasMore: false });
    }

    const files = (data ?? []).filter((f) => f.id !== null); // exclude placeholder folder entries

    const images = files.map((f) => {
      const thumb = supabase.storage.from(BUCKET).getPublicUrl(`${base}/thumb/${f.name}`).data
        .publicUrl;
      const full = supabase.storage.from(BUCKET).getPublicUrl(`${base}/full/${f.name}`).data
        .publicUrl;
      const original = supabase.storage.from(BUCKET).getPublicUrl(`${base}/original/${f.name}`)
        .data.publicUrl;
      return { name: f.name, thumb, full, original };
    });

    return NextResponse.json({ images, hasMore: files.length === limit });
  } catch {
    return NextResponse.json({ images: [], hasMore: false });
  }
}
