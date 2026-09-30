"use client";

import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import type { ScheduleCourt } from "@/lib/padelteams";

export type DaySchedule = {
  label: string;
  courts: ScheduleCourt[];
};

export default function TournamentSchedule({ days }: { days: DaySchedule[] }) {
  const daysWithGames = days.filter((d) => d.courts.length > 0);
  const [activeIndex, setActiveIndex] = useState(0);

  if (daysWithGames.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
        Cronograma em breve — publicado pela organização perto da data.
      </div>
    );
  }

  const active = daysWithGames[activeIndex];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {daysWithGames.map((d, i) => (
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
        {active.courts.map((court) => (
          <div key={court.court} className="glass-card rounded-2xl p-5">
            <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-4 flex items-center gap-2">
              <MapPin size={15} /> {court.court}
            </h3>
            <div className="space-y-3">
              {court.matches.map((match, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-1.5 text-xs font-display text-white shrink-0 w-16">
                    <Clock size={12} className="text-[var(--color-text-muted)]" />
                    {match.time}
                  </div>
                  <div className="text-sm text-[var(--color-text-muted)] flex-1">
                    <span className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mr-1">
                      {match.category}
                    </span>
                    {match.team1} vs {match.team2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
