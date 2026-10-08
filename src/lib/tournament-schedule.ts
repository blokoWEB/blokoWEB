import { pastTournaments, upcomingTournaments, type TournamentEntry } from "@/lib/site-data";
import { fetchPadelteamsSchedule, type DayScheduleData } from "@/lib/padelteams";

export const allTournaments: TournamentEntry[] = [...upcomingTournaments, ...pastTournaments];

/** Dia de hoje em Portugal continental, "YYYY-MM-DD". */
export function todayInLisbon(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Lisbon" }).format(now);
}

export type TournamentScheduleData = {
  updatedAt: string;
  days: DayScheduleData[];
  /** Dia a mostrar por omissão: hoje, se for um dia do torneio; senão o primeiro (ainda por vir) ou o último (já passou). */
  defaultDayIndex: number;
};

/**
 * Lê da PadelTeams o cronograma e os resultados de todos os dias de um torneio.
 * `revalidateSeconds` controla durante quanto tempo a resposta da PadelTeams fica em cache
 * (curto, para os resultados aparecerem quase em direto sem sobrecarregar a PadelTeams).
 */
export async function getTournamentSchedule(
  tournament: TournamentEntry,
  revalidateSeconds = 30
): Promise<TournamentScheduleData | null> {
  const cid = tournament.padelteamsCid;
  const dated = (tournament.days ?? []).filter((d): d is typeof d & { date: string } => !!d.date);
  if (!cid || dated.length === 0) return null;

  const days = await fetchPadelteamsSchedule(
    cid,
    dated.map((d) => ({ label: d.label, date: d.date })),
    revalidateSeconds
  );

  const today = todayInLisbon();
  const todayIndex = days.findIndex((d) => d.date === today);
  const defaultDayIndex =
    todayIndex >= 0 ? todayIndex : today > days[days.length - 1].date ? days.length - 1 : 0;

  return { updatedAt: new Date().toISOString(), days, defaultDayIndex };
}
