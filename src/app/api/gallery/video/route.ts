import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "gallery";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");

  if (!type || !slug || (type !== "torneios" && type !== "eventos")) {
    return NextResponse.json({ error: "Parâmetros type/slug inválidos." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(`${type}/${slug}/video`, { sortBy: { column: "name", order: "asc" } });

    if (error) return NextResponse.json({ videos: [] });

    const files = (data ?? []).filter((f) => f.id !== null);
    const videos = files.map((f) => ({
      name: f.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(`${type}/${slug}/video/${f.name}`).data
        .publicUrl,
    }));

    return NextResponse.json({ videos });
  } catch {
    return NextResponse.json({ videos: [] });
  }
}
