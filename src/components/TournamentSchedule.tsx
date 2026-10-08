"use client";

import { useMemo, useState } from "react";
import { Check, Clock, MapPin, Search, X } from "lucide-react";
import { courtSponsors } from "@/lib/site-data";
import type { DayScheduleData, ScheduleCourt, ScheduleMatch, SetScore } from "@/lib/padelteams";

export type DaySchedule = DayScheduleData;

type FoundMatch = ScheduleMatch & { day: string; dayIndex: number; court: string };
type Filter = "todos" | "por-jogar" | "ao-vivo" | "terminados";

/** Jogos visíveis por campo antes de carregar em "Ver todos". */
const COLLAPSED_COUNT = 6;

// Placeholder — os 4 campos reais do BLOKO, mostrados vazios até a PadelTeams
// publicar o sorteio, para a secção já aparecer pronta a receber os jogos.
const placeholderCourts: ScheduleCourt[] = courtSponsors.map((c) => ({
  court: `Campo ${c.court}${c.sponsor ? ` — ${c.sponsor}` : ""}`,
  number: c.court,
  matches: [],
}));

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function matchBucket(m: ScheduleMatch): Exclude<Filter, "todos"> {
  if (m.status === "live") return "ao-vivo";
  if (m.status === "finished") return "terminados";
  return "por-jogar";
}

export function SetCells({ sets, side, win }: { sets: SetScore[]; side: 1 | 2; win: boolean }) {
  return (
    <div className="flex gap-2 shrink-0">
      {sets.map((s, i) => {
        const mine = side === 1 ? s.t1 : s.t2;
        const theirs = side === 1 ? s.t2 : s.t1;
        const tb = side === 1 ? s.tb1 : s.tb2;
        const wonSet = mine > theirs;
        return (
          <span
            key={i}
            className={`w-5 text-center text-sm font-semibold tabular-nums ${
              wonSet ? "text-[var(--color-lime)]" : win ? "text-white" : "text-[var(--color-text-muted)]"
            }`}
          >
            {mine}
            {tb !== undefined && <sup className="text-[9px] ml-px">{tb}</sup>}
          </span>
        );
      })}
    </div>
  );
}

function StatusCell({ match }: { match: ScheduleMatch }) {
  if (match.status === "live") {
    return (
      <div className="flex items-center gap-2 text-xs font-display text-[var(--color-lime)] shrink-0 w-24">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-lime)] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-lime)]" />
        </span>
        <span className="leading-tight">
          Em jogo
          {match.liveMinutes !== undefined && (
            <span className="block text-[10px] text-[var(--color-text-muted)]">
              {match.liveMinutes} min
            </span>
          )}
        </span>
      </div>
    );
  }
  if (match.status === "finished") {
    return (
      <div className="flex items-center gap-1.5 text-xs font-display text-[var(--color-text-muted)] shrink-0 w-24">
        <Check size={12} className="text-[var(--color-lime)]" />
        Terminado
      </div>
    );
  }
  if (match.status === "other") {
    return (
      <div className="text-xs font-display text-[var(--color-text-muted)] shrink-0 w-24 leading-tight">
        {match.statusText || "—"}
      </div>
    );
  }
  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-display shrink-0 w-24 ${
        match.tbd ? "text-[var(--color-text-muted)]" : "text-white"
      }`}
    >
      <Clock size={12} className="text-[var(--color-text-muted)]" />
      {match.time}
    </div>
  );
}

function MatchRow({ match, extra }: { match: ScheduleMatch; extra?: React.ReactNode }) {
  const hasScore = match.sets.length > 0;
  const label = (
    <span className="block text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mb-1">
      {match.category}
      {match.group ? ` · ${match.group}` : ""}
    </span>
  );

  return (
    <div className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <StatusCell match={match} />
      <div className="flex-1 min-w-0">
        {extra}
        {label}
        {hasScore ? (
          <div className="space-y-1">
            {([1, 2] as const).map((side) => {
              const name = side === 1 ? match.team1 : match.team2;
              const won = match.winner === side;
              return (
                <div key={side} className="flex items-center justify-between gap-3">
                  <span
                    className={`text-sm truncate ${
                      won ? "text-white font-semibold" : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {name}
                  </span>
                  <SetCells sets={match.sets} side={side} win={won} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-[var(--color-text-muted)]">
            {match.team1} <span className="text-white/40">vs</span> {match.team2}
          </p>
        )}
      </div>
    </div>
  );
}

/** Um campo com os seus jogos: mostra os próximos e deixa abrir a lista completa. */
function CourtCard({
  court,
  emptyText,
  showAll,
}: {
  court: ScheduleCourt;
  emptyText: string;
  showAll: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const matches = court.matches;

  // Começa no último resultado antes do primeiro jogo por jogar, para dar contexto.
  const firstPending = matches.findIndex((m) => m.status !== "finished");
  const start = showAll || expanded ? 0 : Math.max(0, (firstPending < 0 ? matches.length : firstPending) - 1);
  const visible = showAll || expanded ? matches : matches.slice(start, start + COLLAPSED_COUNT);
  const hiddenBefore = start;
  const hiddenAfter = matches.length - (start + visible.length);
  const canToggle = !showAll && matches.length > COLLAPSED_COUNT;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-4 flex items-center gap-2">
        <MapPin size={15} /> {court.court}
      </h3>
      {matches.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)]">{emptyText}</p>
      ) : (
        <>
          <div className="space-y-3">
            {visible.map((match, i) => (
              <MatchRow key={i} match={match} />
            ))}
          </div>
          {canToggle && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-4 w-full rounded-full border border-white/10 py-2 text-xs text-[var(--color-text-muted)] hover:border-white/30 hover:text-white transition-colors"
            >
              {expanded
                ? "Mostrar menos"
                : `Ver todos os ${matches.length} jogos${
                    hiddenBefore + hiddenAfter > 0 ? ` (+${hiddenBefore + hiddenAfter})` : ""
                  }`}
            </button>
          )}
        </>
      )}
    </div>
  );
}

const filterLabels: Record<Filter, string> = {
  todos: "Todos",
  "por-jogar": "Por jogar",
  "ao-vivo": "Em jogo",
  terminados: "Resultados",
};

export default function TournamentSchedule({
  days,
  defaultDayIndex = 0,
}: {
  days: DaySchedule[];
  defaultDayIndex?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(defaultDayIndex);
  const [filter, setFilter] = useState<Filter>("todos");
  const [search, setSearch] = useState("");

  const hasAnyRealMatches = days.some((d) => d.courts.length > 0);

  const searchResults = useMemo<FoundMatch[]>(() => {
    const query = normalize(search);
    if (!query) return [];
    const results: FoundMatch[] = [];
    days.forEach((day, dayIndex) => {
      for (const court of day.courts) {
        for (const match of court.matches) {
          if (normalize(match.team1).includes(query) || normalize(match.team2).includes(query)) {
            results.push({ ...match, day: day.label, dayIndex, court: court.court });
          }
        }
      }
    });
    return results.sort((a, b) => a.dayIndex - b.dayIndex);
  }, [days, search]);

  if (days.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
        Cronograma em breve — publicado pela organização perto da data.
      </div>
    );
  }

  const isSearching = search.trim().length > 0;
  const active = days[Math.min(activeIndex, days.length - 1)];

  const counts: Record<Filter, number> = { todos: 0, "por-jogar": 0, "ao-vivo": 0, terminados: 0 };
  for (const c of active.courts) {
    for (const m of c.matches) {
      counts.todos++;
      counts[matchBucket(m)]++;
    }
  }

  const visibleCourts = (active.courts.length > 0 ? active.courts : placeholderCourts).map((c) => ({
    ...c,
    matches: filter === "todos" ? c.matches : c.matches.filter((m) => matchBucket(m) === filter),
  }));
  const showFilters = active.courts.length > 0;

  return (
    <div>
      <div className="relative max-w-md mb-6">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Procura o teu nome..."
          className="input"
          style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
        />
        {isSearching && (
          <button
            onClick={() => setSearch("")}
            aria-label="Limpar pesquisa"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isSearching ? (
        searchResults.length > 0 ? (
          <div className="space-y-3" aria-live="polite">
            {searchResults.map((match, i) => (
              <div key={i} className="glass-card rounded-2xl p-5">
                <MatchRow
                  match={match}
                  extra={
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2 text-xs text-[var(--color-text-muted)]">
                      <span className="uppercase tracking-wide text-[var(--color-lime)]">{match.day}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} /> {match.court}
                      </span>
                    </span>
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
            {hasAnyRealMatches
              ? "Não encontrámos jogos com esse nome."
              : "O sorteio ainda não foi publicado — tenta mais tarde."}
          </div>
        )
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-5">
            {days.map((d, i) => (
              <button
                key={d.label}
                onClick={() => setActiveIndex(i)}
                className={`font-display uppercase text-xs tracking-wide px-5 py-2.5 rounded-full border transition-colors ${
                  i === activeIndex
                    ? "bg-[var(--color-lime)] text-black border-[var(--color-lime)]"
                    : "border-white/15 text-[var(--color-text-muted)] hover:border-white/30 hover:text-white"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filtrar jogos">
              {(Object.keys(filterLabels) as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                    filter === f
                      ? "border-[var(--color-lime)] text-[var(--color-lime)]"
                      : "border-white/10 text-[var(--color-text-muted)] hover:text-white"
                  }`}
                >
                  {filterLabels[f]} <span className="opacity-60">{counts[f]}</span>
                </button>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {visibleCourts.map((court) => (
              <CourtCard
                key={`${active.date}-${filter}-${court.court}`}
                court={court}
                showAll={filter !== "todos"}
                emptyText={
                  active.courts.length === 0 ? "Sem jogos agendados ainda." : "Sem jogos nesta vista."
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
