"use client";

import { useMemo, useState } from "react";
import { Clock, MapPin, Search, X } from "lucide-react";
import { courtSponsors } from "@/lib/site-data";
import type { ScheduleCourt, ScheduleMatch } from "@/lib/padelteams";

export type DaySchedule = {
  label: string;
  courts: ScheduleCourt[];
};

type FoundMatch = ScheduleMatch & { day: string; dayIndex: number; court: string };

// Placeholder — os 4 campos reais do BLOKO, mostrados vazios até a PadelTeams
// publicar o sorteio, para a secção já aparecer pronta a receber os jogos.
const placeholderCourts: ScheduleCourt[] = courtSponsors.map((c) => ({
  court: `Campo ${c.court}${c.sponsor ? ` — ${c.sponsor}` : ""}`,
  matches: [],
}));

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export default function TournamentSchedule({ days }: { days: DaySchedule[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
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
    return results.sort(
      (a, b) =>
        a.dayIndex - b.dayIndex || Number(a.tbd) - Number(b.tbd) || a.time.localeCompare(b.time)
    );
  }, [days, search]);

  if (days.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
        Cronograma em breve — publicado pela organização perto da data.
      </div>
    );
  }

  const isSearching = search.trim().length > 0;
  const active = days[activeIndex];
  const courts = active.courts.length > 0 ? active.courts : placeholderCourts;

  return (
    <div>
      <div className="relative max-w-md mb-8">
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
          <div className="space-y-3">
            {searchResults.map((match, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 flex flex-wrap items-center gap-4">
                <div
                  className={`flex items-center gap-1.5 text-sm font-display shrink-0 ${
                    match.tbd ? "text-[var(--color-text-muted)]" : "text-white"
                  }`}
                >
                  <Clock size={13} className="text-[var(--color-text-muted)]" />
                  {match.time}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] shrink-0">
                  <MapPin size={13} /> {match.court}
                </div>
                <div className="text-xs uppercase tracking-wide text-[var(--color-lime)] shrink-0">
                  {match.day}
                </div>
                <div className="text-sm text-white flex-1 min-w-[180px]">
                  <span className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mr-1">
                    {match.category}
                    {match.group ? ` · ${match.group}` : ""}
                  </span>
                  {match.team1} vs {match.team2}
                </div>
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
          <div className="flex flex-wrap gap-2 mb-6">
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

          <div className="grid sm:grid-cols-2 gap-5">
            {courts.map((court) => (
              <div key={court.court} className="glass-card rounded-2xl p-5">
                <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-4 flex items-center gap-2">
                  <MapPin size={15} /> {court.court}
                </h3>
                {court.matches.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-muted)]">Sem jogos agendados ainda.</p>
                ) : (
                  <div className="space-y-3">
                    {court.matches.map((match, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                      >
                        <div
                          className={`flex items-center gap-1.5 text-xs font-display shrink-0 w-24 ${
                            match.tbd ? "text-[var(--color-text-muted)]" : "text-white"
                          }`}
                        >
                          <Clock size={12} className="text-[var(--color-text-muted)]" />
                          {match.time}
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)] flex-1">
                          <span className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mr-1">
                            {match.category}
                            {match.group ? ` · ${match.group}` : ""}
                          </span>
                          {match.team1} vs {match.team2}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
