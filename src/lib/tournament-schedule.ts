import { pastTournaments, upcomingTournaments, type TournamentEntry } from "@/lib/site-data";
import {
  fetchPadelteamsCategories,
  fetchPadelteamsSchedule,
  type CategoryInfo,
  type DayScheduleData,
} from "@/lib/padelteams";
import { todayInLisbon } from "@/lib/tournament-status";

export const allTournaments: TournamentEntry[] = [...upcomingTournaments, ...pastTournaments];

export type TournamentScheduleData = {
  updatedAt: string;
  days: DayScheduleData[];
  /** Grupos e quadro de cada categoria. */
  categories: CategoryInfo[];
  /** Dia a mostrar por omissão: hoje, se for um dia do torneio; senão o primeiro (ainda por vir) ou o último (já passou). */
  defaultDayIndex: number;
};

/**
 * Lê da PadelTeams o cronograma, os resultados, os grupos e o quadro de um torneio.
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

  const [days, categories] = await Promise.all([
    fetchPadelteamsSchedule(
      cid,
      dated.map((d) => ({ label: d.label, date: d.date })),
      revalidateSeconds
    ),
    fetchPadelteamsCategories(cid, revalidateSeconds),
  ]);

  const today = todayInLisbon();
  const todayIndex = days.findIndex((d) => d.date === today);
  const defaultDayIndex =
    todayIndex >= 0 ? todayIndex : today > days[days.length - 1].date ? days.length - 1 : 0;

  return { updatedAt: new Date().toISOString(), days, categories, defaultDayIndex };
}
