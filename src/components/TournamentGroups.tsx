"use client";

import { Check } from "lucide-react";
import type { CategoryInfo, GroupInfo, GroupTeam } from "@/lib/padelteams";

function StatusPill({ status }: { status?: string }) {
  if (!status) return null;
  const live = /em jogo/i.test(status);
  return live ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-lime)]/15 px-2.5 py-1 font-display text-[10px] uppercase text-[var(--color-lime)]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-lime)] opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-lime)]" />
      </span>
      Em jogo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 font-display text-[10px] uppercase text-[var(--color-text-muted)]">
      <Check size={10} /> {status}
    </span>
  );
}

/** Número de uma coluna; "–" quando a dupla ainda não jogou, para não encher o cartão de zeros. */
function StatCell({ value, played, title }: { value?: number; played: boolean; title: string }) {
  return (
    <span
      className={`w-6 text-center text-sm font-medium tabular-nums ${
        played && value ? "text-white" : "text-[var(--color-text-muted)]/60"
      }`}
      title={title}
    >
      {played ? value : "–"}
    </span>
  );
}

function TeamRow({ team, showStats }: { team: GroupTeam; showStats: boolean }) {
  const played = (team.played ?? 0) > 0;
  return (
    <li className="flex items-center gap-3">
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-xs ${
          team.qualifies
            ? "bg-[var(--color-lime)] text-black"
            : "border border-white/15 text-[var(--color-text-muted)]"
        }`}
        title={team.qualifies ? "Passa à fase seguinte" : "Não passa à fase seguinte"}
      >
        {team.position}
      </span>
      <span
        className={`min-w-0 flex-1 truncate text-sm ${
          team.qualifies ? "text-white" : "text-[var(--color-text-muted)]"
        }`}
      >
        {team.name}
      </span>
      {showStats && (
        <span className="flex shrink-0">
          <StatCell value={team.played} played={played} title="Jogos" />
          <StatCell value={team.won} played={played} title="Vitórias" />
          <StatCell value={team.lost} played={played} title="Derrotas" />
        </span>
      )}
    </li>
  );
}

/**
 * Ordena as duplas por mais vitórias (depois menos derrotas, diferença de jogos e a ordem da PadelTeams).
 * Os lugares de apuramento mantêm-se em número, mas passam para as primeiras duplas desta ordem.
 */
function sortByWins(group: GroupInfo): GroupInfo {
  if (!group.teams.some((t) => t.played !== undefined)) return group;
  const qualifiers = group.teams.filter((t) => t.qualifies).length;
  const diff = (t: GroupTeam) => (t.gamesFor ?? 0) - (t.gamesAgainst ?? 0);
  const sorted = group.teams
    .map((team, index) => ({ team, index }))
    .sort(
      (a, b) =>
        (b.team.won ?? 0) - (a.team.won ?? 0) ||
        (a.team.lost ?? 0) - (b.team.lost ?? 0) ||
        diff(b.team) - diff(a.team) ||
        a.index - b.index
    )
    .map(({ team }, i) => ({ ...team, position: i + 1, qualifies: i < qualifiers }));
  return { ...group, teams: sorted };
}

function GroupCard({ group: rawGroup }: { group: GroupInfo }) {
  const group = sortByWins(rawGroup);
  const showStats = group.teams.some((t) => t.played !== undefined);
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-display uppercase text-sm text-[var(--color-lime)]">{group.name}</h3>
        <StatusPill status={group.status} />
      </div>
      {showStats && (
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
          <span>Dupla</span>
          <span className="flex">
            <span className="w-6 text-center" title="Jogos">J</span>
            <span className="w-6 text-center" title="Vitórias">V</span>
            <span className="w-6 text-center" title="Derrotas">D</span>
          </span>
        </div>
      )}
      <ul className="space-y-3">
        {group.teams.map((t) => (
          <TeamRow key={t.name} team={t} showStats={showStats} />
        ))}
      </ul>
      {showStats && (
        <p className="mt-3 text-[11px] text-[var(--color-text-muted)]">
          J jogos · V vitórias · D derrotas. Ordenado por mais vitórias.
        </p>
      )}
      {group.classificationUrl && (
        <a
          href={group.classificationUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-xs text-[var(--color-text-muted)] underline-offset-4 hover:text-white hover:underline"
        >
          Classificação completa
        </a>
      )}
    </div>
  );
}

export default function TournamentGroups({ category }: { category: CategoryInfo | undefined }) {
  if (!category || category.groups.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
        Os grupos ainda não foram publicados.
      </div>
    );
  }

  const qualifiersPerGroup = category.groups[0].teams.filter((t) => t.qualifies).length;
  const s = category.stats;

  return (
    <div>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        {qualifiersPerGroup > 0 && (
          <>
            Passam à fase seguinte as {qualifiersPerGroup} primeiras duplas de cada grupo{" "}
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-lime)] align-middle" />.{" "}
          </>
        )}
        {s && (
          <>
            Nesta categoria: {s.terminado} jogo{s.terminado === 1 ? "" : "s"} terminado
            {s.terminado === 1 ? "" : "s"}
            {s.emJogo > 0 ? `, ${s.emJogo} em jogo` : ""}, {s.programado + s.pendente} por jogar.
          </>
        )}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {category.groups.map((g) => (
          <GroupCard key={g.name} group={g} />
        ))}
      </div>
    </div>
  );
}
