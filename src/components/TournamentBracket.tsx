"use client";

import type { BracketMatch, CategoryInfo } from "@/lib/padelteams";
import { SetCells } from "@/components/TournamentSchedule";

/** "Vencedor do jogo 3.1" → "Vencedor 3.1"; "1º Grupo A" fica como está. É texto à espera de resultado. */
function isPlaceholder(name: string): boolean {
  return /^(vencedor|perdedor)\b/i.test(name) || /^\d+º\s*grupo/i.test(name) || /a determinar/i.test(name);
}

function shortName(name: string): string {
  return name.replace(/^vencedor do jogo\s*/i, "Vencedor ").replace(/^perdedor do jogo\s*/i, "Perdedor ");
}

function MatchCard({ match }: { match: BracketMatch }) {
  const hasScore = match.sets.length > 0;
  return (
    <div className="glass-card rounded-xl p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-display text-[10px] uppercase text-[var(--color-blue-soft)]">
          Jogo {match.code}
        </span>
      </div>
      <div className="space-y-1.5">
        {([1, 2] as const).map((side) => {
          const name = side === 1 ? match.team1 : match.team2;
          const placeholder = isPlaceholder(name);
          const won = match.winner === side;
          return (
            <div key={side} className="flex items-center justify-between gap-2">
              <span
                className={`min-w-0 truncate text-xs ${
                  placeholder
                    ? "italic text-[var(--color-text-muted)]"
                    : won
                      ? "font-semibold text-white"
                      : "text-white/90"
                }`}
                title={name}
              >
                {shortName(name)}
              </span>
              {hasScore && <SetCells sets={match.sets} side={side} win={won} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TournamentBracket({ category }: { category: CategoryInfo | undefined }) {
  if (!category || category.rounds.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
        O quadro ainda não foi publicado.
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        Depois da fase de grupos, os apurados seguem por eliminatórias:{" "}
        {category.rounds.map((r) => r.name).join(" → ")}. Os nomes aparecem à medida que os jogos
        se decidem.
      </p>
      <p className="mb-3 text-xs text-[var(--color-text-muted)] sm:hidden">
        Desliza para o lado para ver as fases seguintes.
      </p>
      <div className="no-scrollbar -mx-4 snap-x snap-mandatory overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
        <div className="flex gap-4 sm:gap-5">
          {category.rounds.map((round) => (
            <div key={round.name} className="w-[16.5rem] shrink-0 snap-start scroll-ml-4 sm:w-60">
              <p className="mb-3 border-b border-white/10 pb-2 font-display text-xs uppercase tracking-wide text-[var(--color-lime)]">
                {round.name}
              </p>
              <div className="flex flex-col gap-3">
                {round.matches.map((m) => (
                  <MatchCard key={m.code} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
