/** Dia de hoje em Portugal continental, "YYYY-MM-DD". Usável no servidor e no navegador. */
export function todayInLisbon(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Lisbon" }).format(now);
}

export type TournamentPhase = "brevemente" | "a-decorrer" | "terminado";

export type TournamentDates = {
  /** Primeiro e último dia do torneio ("YYYY-MM-DD"), quando conhecidos. */
  start?: string;
  end?: string;
  /** Torneio marcado como "brevemente" sem datas exatas. */
  comingSoon?: boolean;
};

/** Datas de início e fim a partir dos dias do torneio. */
export function tournamentDates(t: {
  days?: { date?: string }[];
  comingSoon?: boolean;
}): TournamentDates {
  const dates = (t.days ?? []).map((d) => d.date).filter((d): d is string => !!d).sort();
  return { start: dates[0], end: dates[dates.length - 1], comingSoon: t.comingSoon };
}

/**
 * "brevemente" antes do primeiro dia, "a-decorrer" entre o primeiro e o último dia (inclusive),
 * "terminado" depois. Sem datas, usa a marca `comingSoon`; sem nada disso devolve null.
 */
export function tournamentPhase(
  dates: TournamentDates,
  today: string = todayInLisbon()
): TournamentPhase | null {
  if (dates.start && dates.end) {
    if (today < dates.start) return "brevemente";
    if (today <= dates.end) return "a-decorrer";
    return "terminado";
  }
  return dates.comingSoon ? "brevemente" : null;
}
