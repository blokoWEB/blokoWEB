import { NextRequest, NextResponse } from "next/server";
import { allTournaments, getTournamentSchedule } from "@/lib/tournament-schedule";

/**
 * Cronograma e resultados de um torneio, lidos da PadelTeams.
 * A página chama isto de poucos em poucos segundos para se atualizar sozinha durante o torneio.
 * A resposta fica em cache 20 s no CDN: muitos visitantes ao mesmo tempo = um único pedido à PadelTeams.
 */
export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug");
  const tournament = allTournaments.find((t) => t.slug === slug && t.padelteamsCid);
  if (!tournament) {
    return NextResponse.json({ error: "Torneio não encontrado." }, { status: 404 });
  }

  const data = await getTournamentSchedule(tournament, 20);
  if (!data) {
    return NextResponse.json({ error: "Sem cronograma." }, { status: 404 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=20, stale-while-revalidate=40" },
  });
}
