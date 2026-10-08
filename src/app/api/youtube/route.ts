import { NextRequest, NextResponse } from "next/server";
import { getYoutubeFeed } from "@/lib/youtube";

/**
 * Últimos vídeos do canal da BLOKO e diretos a decorrer (um por campo, se for caso disso).
 * Parâmetros: `filter` (texto que o título tem de conter, ex.: "torneio social") e `limit`.
 * A resposta fica 45 s em cache no CDN, por isso muitos visitantes = poucos pedidos ao YouTube.
 */
export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams;
  const filter = params.get("filter")?.slice(0, 60) || undefined;
  const limit = Math.min(Math.max(Number(params.get("limit") ?? "6") || 6, 1), 12);

  const feed = await getYoutubeFeed({ filter, limit });

  return NextResponse.json(feed, {
    headers: { "Cache-Control": "public, s-maxage=45, stale-while-revalidate=60" },
  });
}
