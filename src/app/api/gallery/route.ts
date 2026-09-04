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

  const path = `${type}/${slug}`;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage.from(BUCKET).list(path, {
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
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(`${path}/${f.name}`);
      return { name: f.name, url: pub.publicUrl };
    });

    return NextResponse.json({ images, hasMore: files.length === limit });
  } catch {
    return NextResponse.json({ images: [], hasMore: false });
  }
}
