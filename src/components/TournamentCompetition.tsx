"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock, RefreshCw, Trophy, Users } from "lucide-react";
import TournamentSchedule from "@/components/TournamentSchedule";
import TournamentGroups from "@/components/TournamentGroups";
import TournamentBracket from "@/components/TournamentBracket";
import { todayInLisbon } from "@/lib/tournament-status";
import type { TournamentScheduleData } from "@/lib/tournament-schedule";

type Tab = "jogos" | "grupos" | "quadro";

const POLL_LIVE_MS = 30_000;
const POLL_IDLE_MS = 5 * 60_000;

const tabs: { id: Tab; label: string; icon: typeof Clock }[] = [
  { id: "jogos", label: "Jogos", icon: Clock },
  { id: "grupos", label: "Grupos", icon: Users },
  { id: "quadro", label: "Quadro", icon: Trophy },
];

function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Lisbon",
  });
}

export default function TournamentCompetition({
  slug,
  initial,
}: {
  slug: string;
  initial: TournamentScheduleData;
}) {
  const [data, setData] = useState<TournamentScheduleData>(initial);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pollMs, setPollMs] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("jogos");
  const [categoryName, setCategoryName] = useState<string | null>(() => {
    // Abre na categoria que tem um jogo a decorrer; senão, na primeira.
    const live = initial.categories.find((c) => c.groups.some((g) => /em jogo/i.test(g.status ?? "")));
    return live?.name ?? initial.categories[0]?.name ?? null;
  });

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/torneios/cronograma?slug=${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("falhou");
      const next: TournamentScheduleData = await res.json();
      // Se a PadelTeams falhar por instantes e devolver algo vazio, mantém o que já tínhamos.
      setData((prev) => ({
        ...next,
        days: next.days.map((d, i) =>
          d.courts.length === 0 && prev.days[i] && prev.days[i].courts.length > 0 ? prev.days[i] : d
        ),
        categories: next.categories.length > 0 ? next.categories : prev.categories,
      }));
      setFailed(false);
    } catch {
      setFailed(true);
    } finally {
      setRefreshing(false);
    }
  }, [slug]);

  // Atualização automática: de 30 em 30 s nos dias do torneio, de 5 em 5 min antes de começar, e nada depois de acabar.
  const first = initial.days[0]?.date;
  const last = initial.days[initial.days.length - 1]?.date;
  const initialUpdatedAt = initial.updatedAt;
  useEffect(() => {
    if (!first || !last) return;

    function computeInterval(): number | null {
      const today = todayInLisbon();
      if (today > last!) return null;
      return today >= first! ? POLL_LIVE_MS : POLL_IDLE_MS;
    }

    // Fora do corpo síncrono do efeito: o intervalo depende da data do navegador.
    // Os dados que vêm com a página podem ter minutos (página guardada): atualiza logo ao abrir.
    const first0 = setTimeout(() => {
      const interval = computeInterval();
      setPollMs(interval);
      if (interval !== null && Date.now() - new Date(initialUpdatedAt).getTime() > 15_000) {
        refresh();
      }
    }, 0);
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const interval = computeInterval();
        setPollMs(interval);
        if (interval !== null) refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(first0);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [first, last, initialUpdatedAt, refresh]);

  useEffect(() => {
    if (pollMs === null) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, pollMs);
    return () => clearInterval(id);
  }, [pollMs, refresh]);

  const liveNow = data.days.some((d) => d.courts.some((c) => c.matches.some((m) => m.status === "live")));
  const category = data.categories.find((c) => c.name === categoryName) ?? data.categories[0];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div
          className="grid w-full grid-cols-3 gap-1 rounded-full border border-white/10 bg-white/5 p-1 sm:w-auto"
          role="group"
          aria-label="Competição"
        >
          {tabs.map(({ id, label, icon: Icon }) => {
            if (id !== "jogos" && data.categories.length === 0) return null;
            return (
              <button
                key={id}
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
                className={`touch-manipulation inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-display text-xs uppercase tracking-wide transition-colors sm:px-6 ${
                  tab === id
                    ? "bg-[var(--color-lime)] text-black"
                    : "text-[var(--color-text-muted)] hover:text-white"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          {liveNow && (
            <span className="inline-flex items-center gap-1.5 font-display uppercase text-[var(--color-lime)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-lime)] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-lime)]" />
              </span>
              Ao vivo
            </span>
          )}
          <button
            onClick={refresh}
            disabled={refreshing}
            className="touch-manipulation inline-flex min-h-9 items-center gap-1.5 transition-colors hover:text-white disabled:opacity-60"
            aria-label="Atualizar agora"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            {failed ? "Sem ligação, a tentar de novo" : `Atualizado às ${formatClock(data.updatedAt)}`}
          </button>
        </div>
      </div>

      {tab !== "jogos" && data.categories.length > 0 && (
        <div
          className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          role="group"
          aria-label="Categoria"
        >
          {data.categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategoryName(c.name)}
              aria-pressed={c.name === category?.name}
              className={`touch-manipulation min-h-10 shrink-0 rounded-full border px-5 text-xs transition-colors ${
                c.name === category?.name
                  ? "border-[var(--color-lime)] text-[var(--color-lime)]"
                  : "border-white/10 text-[var(--color-text-muted)] hover:text-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {tab === "jogos" && (
        <TournamentSchedule days={data.days} defaultDayIndex={data.defaultDayIndex} />
      )}
      {tab === "grupos" && <TournamentGroups category={category} />}
      {tab === "quadro" && <TournamentBracket category={category} />}
    </div>
  );
}
