"use client";

import { useEffect, useState } from "react";
import {
  tournamentPhase,
  type TournamentDates,
  type TournamentPhase,
} from "@/lib/tournament-status";

/**
 * Selo "Brevemente" / "A decorrer" de um torneio. O servidor calcula o estado inicial e o navegador
 * volta a calculá-lo, para a página não ficar com um selo desatualizado quando o torneio começa.
 */
export default function TournamentStatusBadge({
  dates,
  initialPhase,
  className = "",
}: {
  dates: TournamentDates;
  initialPhase: TournamentPhase | null;
  className?: string;
}) {
  const [phase, setPhase] = useState<TournamentPhase | null>(initialPhase);

  useEffect(() => {
    setPhase(tournamentPhase(dates));
  }, [dates]);

  if (phase !== "brevemente" && phase !== "a-decorrer") return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-display uppercase tracking-wide rounded-full bg-[var(--color-lime)] text-black glow-lime ${className}`}
    >
      {phase === "a-decorrer" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-black" />
        </span>
      )}
      {phase === "a-decorrer" ? "A decorrer" : "Brevemente"}
    </span>
  );
}
