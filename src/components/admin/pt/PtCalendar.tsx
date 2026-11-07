"use client";

/**
 * Calendário semanal de PT & aulas de padel (só administração).
 * Cada cartão é uma aula: arrasta-se para outro dia/hora (de 15 em 15 min), clica-se para ver alunos,
 * presenças e histórico. Aulas alteradas mostram "FOI ALTERADO". No telemóvel mostra-se um dia de cada vez
 * e o arrastar começa com um toque longo (para não atrapalhar o deslizar da página).
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus, Repeat, Settings2, X } from "lucide-react";
import type { PtScope, PtSession, PtTeacher } from "@/lib/pt-types";
import { ptApi } from "./pt-api";
import PtSessionDialog, { type DialogMode } from "./PtSessionDialog";
import PtTeachersDialog from "./PtTeachersDialog";
import {
  DAY_LABELS,
  HOUR_PX,
  SNAP_MIN,
  addDays,
  calKey,
  calOf,
  calWeekdayIdx,
  dayLabel,
  dayStartIso,
  endTimeOf,
  fmtWhen,
  hhmm,
  layoutDay,
  minutesOfDay,
  mondayOf,
  shortName,
  timeOf,
  toIso,
  todayCal,
  weekLabel,
  type Cal,
} from "./pt-utils";

const FALLBACK_COLOR = "#7c8794";
const WIDE_QUERY = "(min-width: 900px)";

function useWide(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(WIDE_QUERY);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(WIDE_QUERY).matches,
    () => true
  );
}

type Loaded = { key: string; rows: PtSession[]; error?: string };
type Drag = { id: string; dayIdx: number; minutes: number };

const time = (iso: string) => new Date(iso).getTime();

export default function PtCalendar({ canManageTeachers = true }: { canManageTeachers?: boolean }) {
  const wide = useWide();
  const [now, setNow] = useState(() => Date.now());
  const [weekStart, setWeekStart] = useState<Cal>(() => mondayOf(todayCal()));
  const [selectedDay, setSelectedDay] = useState(() => calWeekdayIdx(todayCal()));
  const [teachers, setTeachers] = useState<PtTeacher[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [tick, setTick] = useState(0);
  const [dialog, setDialog] = useState<DialogMode | null>(null);
  const [teachersOpen, setTeachersOpen] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [pendingMove, setPendingMove] = useState<{ session: PtSession; startsAt: string } | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const justDragged = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    ptApi
      .teachers()
      .then((list) => !cancelled && setTeachers(list))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const from = dayStartIso(weekStart);
  const to = dayStartIso(addDays(weekStart, 7));
  const fetchKey = `${calKey(weekStart)}#${tick}`;

  useEffect(() => {
    let cancelled = false;
    ptApi
      .sessions(from, to)
      .then((rows) => !cancelled && setLoaded({ key: fetchKey, rows }))
      .catch((e: Error) => !cancelled && setLoaded({ key: fetchKey, rows: [], error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [fetchKey, from, to]);

  const ready = loaded?.key === fetchKey;
  const rows = useMemo(() => (ready && loaded ? loaded.rows : []), [ready, loaded]);
  const error = ready ? loaded?.error : undefined;

  /** Junta aulas novas/alteradas à semana mostrada (as que saíram da semana desaparecem). */
  const merge = useCallback(
    (changed: PtSession[]) => {
      const lo = time(from);
      const hi = time(to);
      setLoaded((prev) => {
        if (!prev || prev.key !== fetchKey) return prev;
        const map = new Map(prev.rows.map((s) => [s.id, s]));
        for (const r of changed) {
          const t = time(r.starts_at);
          if (t >= lo && t < hi) map.set(r.id, r);
          else map.delete(r.id);
        }
        return { ...prev, rows: [...map.values()].sort((a, b) => time(a.starts_at) - time(b.starts_at)) };
      });
    },
    [fetchKey, from, to]
  );

  function showFlash(message: string) {
    setFlash(message);
    setTimeout(() => setFlash((m) => (m === message ? null : m)), 6000);
  }

  function goToDate(iso: string) {
    const c = calOf(iso);
    setWeekStart(mondayOf(c));
    setSelectedDay(calWeekdayIdx(c));
  }

  function shiftWeek(n: number) {
    setWeekStart((w) => addDays(w, 7 * n));
  }

  function goToday() {
    goToDate(new Date().toISOString());
  }

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const today = calKey(calOf(new Date(now)));
  const teacherById = useMemo(() => new Map(teachers.map((t) => [t.id, t])), [teachers]);
  const visible = useMemo(() => (filter ? rows.filter((s) => s.teacher_id === filter) : rows), [rows, filter]);

  const { startH, endH } = useMemo(() => {
    let a = 7;
    let b = 22;
    for (const s of rows) {
      const sm = minutesOfDay(s.starts_at);
      a = Math.min(a, Math.floor(sm / 60));
      b = Math.max(b, Math.ceil((sm + s.duration_minutes) / 60));
    }
    return { startH: a, endH: Math.min(b, 24) };
  }, [rows]);
  const startMin = startH * 60;
  const endMin = endH * 60;
  const gridHeight = (endH - startH) * HOUR_PX;

  const byDay = useMemo(() => {
    const map = new Map<string, PtSession[]>();
    for (const s of visible) {
      const k = calKey(calOf(s.starts_at));
      map.set(k, [...(map.get(k) ?? []), s]);
    }
    return days.map((d) => layoutDay(map.get(calKey(d)) ?? []));
  }, [visible, days]);

  const stats = useMemo(() => {
    const live = visible.filter((s) => s.status !== "cancelada");
    return {
      lessons: live.length,
      done: live.filter((s) => time(s.starts_at) + s.duration_minutes * 60000 < now).length,
      students: live.reduce((n, s) => n + s.students.length, 0),
      altered: live.filter((s) => s.altered).length,
      cancelled: visible.length - live.length,
    };
  }, [visible, now]);

  const perTeacher = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of rows) if (s.status !== "cancelada") m.set(s.teacher_id, (m.get(s.teacher_id) ?? 0) + 1);
    return m;
  }, [rows]);

  // ------------------------------------------------------------------ mover (arrastar)
  async function doMove(s: PtSession, startsAt: string, scope: PtScope) {
    setPendingMove(null);
    merge([{ ...s, starts_at: startsAt }]);
    try {
      merge(await ptApi.update(s.id, { starts_at: startsAt, scope }));
    } catch (e) {
      merge([s]);
      showFlash(e instanceof Error ? e.message : "Não foi possível mover a aula.");
    }
  }

  function requestMove(s: PtSession, dayIdx: number, minutes: number) {
    const startsAt = toIso(days[dayIdx], minutes);
    if (time(startsAt) === time(s.starts_at)) return;
    if (s.series_id) setPendingMove({ session: s, startsAt });
    else void doMove(s, startsAt, "this");
  }

  function onCardPointerDown(e: React.PointerEvent<HTMLElement>, s: PtSession, dayIdx: number) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const touch = e.pointerType !== "mouse";
    const rect = e.currentTarget.getBoundingClientRect();
    const grabY = e.clientY - rect.top;
    const sx = e.clientX;
    const sy = e.clientY;
    const dur = Math.max(s.duration_minutes, SNAP_MIN);
    let dragging = false;
    let target: Drag = { id: s.id, dayIdx, minutes: minutesOfDay(s.starts_at) };
    let timer: ReturnType<typeof setTimeout> | undefined;

    const locate = (x: number, y: number): Drag => {
      let best = target.dayIdx;
      let bestDist = Infinity;
      colRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      const col = colRefs.current[best];
      if (!col) return target;
      const top = col.getBoundingClientRect().top;
      const raw = startMin + ((y - grabY - top) / HOUR_PX) * 60;
      const snapped = Math.round(raw / SNAP_MIN) * SNAP_MIN;
      return { id: s.id, dayIdx: best, minutes: Math.max(startMin, Math.min(snapped, endMin - dur)) };
    };

    const begin = () => {
      dragging = true;
      setDrag(target);
      if (touch) navigator.vibrate?.(12);
    };

    const onMove = (ev: PointerEvent) => {
      if (!dragging) {
        const dist = Math.hypot(ev.clientX - sx, ev.clientY - sy);
        if (touch) {
          if (dist > 10) cleanup(); // está a deslizar a página, não a arrastar
        } else if (dist > 5) {
          begin();
        }
        if (!dragging) return;
      }
      target = locate(ev.clientX, ev.clientY);
      setDrag(target);
      if (ev.clientY < 90) window.scrollBy(0, -14);
      else if (ev.clientY > window.innerHeight - 90) window.scrollBy(0, 14);
    };
    const onTouchMove = (ev: TouchEvent) => {
      if (dragging && ev.cancelable) ev.preventDefault(); // enquanto arrasta, a página não desliza
    };
    const onUp = () => {
      const wasDragging = dragging;
      cleanup();
      if (wasDragging) {
        justDragged.current = true;
        setTimeout(() => (justDragged.current = false), 80);
        requestMove(s, target.dayIdx, target.minutes);
      } else {
        setDialog({ type: "edit", session: s });
      }
    };
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      window.removeEventListener("touchmove", onTouchMove);
      setDrag(null);
    };
    const onCancel = () => cleanup();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    if (touch) {
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      timer = setTimeout(begin, 320);
    }
  }

  function createAt(e: React.MouseEvent<HTMLDivElement>, dayIdx: number) {
    if (justDragged.current) return;
    const top = e.currentTarget.getBoundingClientRect().top;
    const raw = startMin + ((e.clientY - top) / HOUR_PX) * 60;
    const minutes = Math.max(startMin, Math.min(Math.floor(raw / 30) * 30, endMin - 60));
    setDialog({ type: "create", startsAt: toIso(days[dayIdx], minutes), teacherId: filter ?? undefined });
  }

  function newLesson() {
    const d = wide ? (calKey(days[0]) <= today && today <= calKey(days[6]) ? calOf(new Date(now)) : days[0]) : days[selectedDay];
    setDialog({ type: "create", startsAt: toIso(d, 18 * 60), teacherId: filter ?? undefined });
  }

  const shownDays = wide ? [0, 1, 2, 3, 4, 5, 6] : [selectedDay];
  const hours = Array.from({ length: endH - startH }, (_, i) => startH + i);
  const gutter = wide ? "48px" : "40px";
  const columns = `${gutter} repeat(${shownDays.length}, minmax(0, 1fr))`;
  const setupMissing = error?.includes("pt-schema.sql");

  return (
    <div>
      {/* barra de cima */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => shiftWeek(-1)} className="h-10 w-10 grid place-items-center rounded-full border border-white/15 text-white hover:border-white/40" aria-label="Semana anterior">
            <ChevronLeft size={18} />
          </button>
          <button onClick={goToday} className="h-10 px-4 rounded-full border border-white/15 font-display uppercase text-[11px] tracking-wide hover:border-white/40">
            Hoje
          </button>
          <button onClick={() => shiftWeek(1)} className="h-10 w-10 grid place-items-center rounded-full border border-white/15 text-white hover:border-white/40" aria-label="Semana seguinte">
            <ChevronRight size={18} />
          </button>
          <span className="ml-1 font-display uppercase text-sm tracking-wide">{weekLabel(weekStart)}</span>
        </div>
        <div className="flex items-center gap-2">
          {canManageTeachers && (
            <button onClick={() => setTeachersOpen(true)} className="flex items-center gap-2 h-10 px-4 rounded-full border border-white/15 text-sm text-white hover:border-white/40">
              <Settings2 size={15} /> Professores
            </button>
          )}
          <button onClick={newLesson} className="flex items-center gap-2 h-10 px-5 rounded-full bg-[var(--color-lime)] text-black font-display uppercase text-[11px] tracking-wide">
            <Plus size={15} /> Nova aula
          </button>
        </div>
      </div>

      {/* filtro por professor */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilter(null)}
          className={`font-display uppercase text-[11px] tracking-wide px-4 py-2 rounded-full border transition-colors ${
            filter === null ? "bg-white text-black border-white" : "border-white/15 text-[var(--color-text-muted)] hover:text-white"
          }`}
        >
          Todos
        </button>
        {teachers
          .filter((t) => t.active || perTeacher.has(t.id))
          .map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(filter === t.id ? null : t.id)}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-colors ${
                filter === t.id ? "text-black border-transparent" : "border-white/15 text-white/80 hover:text-white"
              }`}
              style={filter === t.id ? { background: t.color } : undefined}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: filter === t.id ? "#0c1016" : t.color }} />
              {t.name}
              <span className={filter === t.id ? "text-black/70" : "text-[var(--color-text-muted)]"}>{perTeacher.get(t.id) ?? 0}</span>
            </button>
          ))}
      </div>

      {/* resumo da semana */}
      <p className="text-sm text-[var(--color-text-muted)] mb-4">
        <b className="text-white">{stats.lessons}</b> {stats.lessons === 1 ? "aula" : "aulas"} ·{" "}
        <b className="text-white">{stats.done}</b> {stats.done === 1 ? "já dada" : "já dadas"} ·{" "}
        <b className="text-white">{stats.lessons - stats.done}</b> por dar · <b className="text-white">{stats.students}</b>{" "}
        {stats.students === 1 ? "aluno" : "alunos"}
        {stats.altered > 0 && (
          <>
            {" "}· <b className="text-amber-300">{stats.altered}</b> {stats.altered === 1 ? "alterada" : "alteradas"}
          </>
        )}
        {stats.cancelled > 0 && (
          <>
            {" "}· <b className="text-red-400">{stats.cancelled}</b> {stats.cancelled === 1 ? "cancelada" : "canceladas"}
          </>
        )}
      </p>

      {flash && (
        <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>{flash}</span>
          <button onClick={() => setFlash(null)} aria-label="Fechar aviso">
            <X size={16} />
          </button>
        </div>
      )}

      {/* dias (telemóvel) */}
      {!wide && (
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {days.map((d, i) => {
            const n = rows.filter((s) => calKey(calOf(s.starts_at)) === calKey(d) && s.status !== "cancelada").length;
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`rounded-xl border py-2 text-center transition-colors ${
                  selectedDay === i ? "bg-white text-black border-white" : calKey(d) === today ? "border-[var(--color-lime)]/60 text-white" : "border-white/12 text-[var(--color-text-muted)]"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wide">{DAY_LABELS[i]}</span>
                <span className="block font-display text-sm">{d.d}</span>
                <span className="block text-[10px] h-3">{n > 0 ? `${n}` : ""}</span>
              </button>
            );
          })}
        </div>
      )}

      {error ? (
        <div className="glass-card rounded-2xl p-6">
          <p className="font-display uppercase text-sm tracking-wide mb-2 text-amber-300">
            {setupMissing ? "Falta preparar a base de dados" : "Não foi possível carregar o calendário"}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mb-4">{error}</p>
          <button onClick={() => setTick((t) => t + 1)} className="rounded-full border border-white/15 px-5 py-2 text-sm hover:border-white/40">
            Tentar outra vez
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden relative">
          {!ready && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/40">
              <Loader2 className="animate-spin text-[var(--color-lime)]" size={24} />
            </div>
          )}
          {/* cabeçalho dos dias */}
          <div className="grid border-b border-white/10 bg-black/20" style={{ gridTemplateColumns: columns }}>
            <div />
            {shownDays.map((i) => (
              <div key={i} className={`py-2.5 text-center text-xs uppercase tracking-wide ${calKey(days[i]) === today ? "text-[var(--color-lime)] font-semibold" : "text-[var(--color-text-muted)]"}`}>
                {dayLabel(days[i])}
              </div>
            ))}
          </div>
          {/* grelha */}
          <div className="grid" style={{ gridTemplateColumns: columns }}>
            <div className="relative" style={{ height: gridHeight }}>
              {hours.map((h, i) => (
                <span key={h} className="absolute right-1.5 -translate-y-1/2 text-[10px] text-[var(--color-text-muted)]" style={{ top: i * HOUR_PX, display: i === 0 ? "none" : undefined }}>
                  {hhmm(h * 60)}
                </span>
              ))}
            </div>
            {shownDays.map((i) => (
              <div
                key={i}
                ref={(el) => {
                  colRefs.current[i] = el;
                }}
                onClick={(e) => createAt(e, i)}
                className="relative border-l border-white/[0.07] cursor-cell"
                style={{
                  height: gridHeight,
                  backgroundImage: `repeating-linear-gradient(to bottom, rgba(255,255,255,0.07) 0, rgba(255,255,255,0.07) 1px, transparent 1px, transparent ${HOUR_PX}px)`,
                }}
              >
                {calKey(days[i]) === today && now >= time(toIso(days[i], startMin)) && now < time(toIso(days[i], endMin - 1)) && (
                  <div className="absolute left-0 right-0 z-10 pointer-events-none h-px bg-red-400" style={{ top: ((minutesOfDay(new Date(now).toISOString()) - startMin) / 60) * HOUR_PX }}>
                    <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-red-400" />
                  </div>
                )}
                {byDay[i].map(({ item: s, lane, lanes }) => (
                  <SessionCard
                    key={s.id}
                    s={s}
                    color={teacherById.get(s.teacher_id)?.color ?? FALLBACK_COLOR}
                    teacherName={teacherById.get(s.teacher_id)?.name ?? "?"}
                    top={((minutesOfDay(s.starts_at) - startMin) / 60) * HOUR_PX}
                    lane={lane}
                    lanes={lanes}
                    ghost={drag?.id === s.id}
                    now={now}
                    onPointerDown={(e) => onCardPointerDown(e, s, i)}
                    onOpen={() => setDialog({ type: "edit", session: s })}
                  />
                ))}
                {drag && drag.dayIdx === i && (() => {
                  const s = rows.find((x) => x.id === drag.id);
                  if (!s) return null;
                  const color = teacherById.get(s.teacher_id)?.color ?? FALLBACK_COLOR;
                  return (
                    <div
                      className="absolute left-1 right-1 z-30 rounded-lg border-2 border-dashed px-2 py-1 pointer-events-none text-[11px] font-semibold text-white"
                      style={{
                        top: ((drag.minutes - startMin) / 60) * HOUR_PX,
                        height: Math.max((s.duration_minutes / 60) * HOUR_PX, 24),
                        borderColor: color,
                        background: `color-mix(in srgb, ${color} 30%, transparent)`,
                      }}
                    >
                      {hhmm(drag.minutes)}–{hhmm(drag.minutes + s.duration_minutes)}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      )}

      {!error && ready && rows.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] mt-4">
          Sem aulas nesta semana. Carrega num espaço do calendário (ou em &ldquo;Nova aula&rdquo;) para marcar uma.
        </p>
      )}
      <p className="text-xs text-[var(--color-text-muted)] mt-4">
        {wide ? "Arrasta uma aula para mudar o dia/hora." : "Mantém o dedo numa aula para a arrastar."} Clica numa aula para
        ver os alunos, as presenças e o histórico. As horas são as de Lisboa.
      </p>
      {canManageTeachers && (
        <p className="text-xs text-[var(--color-text-muted)] mt-2">
          Os professores entram em <b className="text-white">bloko.com.pt/admin/professores</b> com o utilizador partilhado
          e escolhem o nome deles; o histórico de cada aula mostra quem alterou.
        </p>
      )}

      {/* aula repetida arrastada: só esta ou também as seguintes? */}
      {pendingMove && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="font-display uppercase text-lg mb-2">Mudar esta aula?</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-5">
              De <b className="text-white">{fmtWhen(pendingMove.session.starts_at)}</b> para{" "}
              <b className="text-white">{fmtWhen(pendingMove.startsAt)}</b>. Esta aula faz parte de uma série.
            </p>
            <div className="space-y-2">
              <button onClick={() => doMove(pendingMove.session, pendingMove.startsAt, "this")} className="w-full rounded-full bg-[var(--color-lime)] text-black py-3 font-display uppercase text-xs tracking-wide">
                Só esta aula
              </button>
              <button onClick={() => doMove(pendingMove.session, pendingMove.startsAt, "following")} className="w-full rounded-full border border-white/20 py-3 font-display uppercase text-xs tracking-wide hover:border-white/50">
                Esta e as seguintes
              </button>
              <button onClick={() => setPendingMove(null)} className="w-full py-2 text-sm text-[var(--color-text-muted)] hover:text-white">
                Deixar como estava
              </button>
            </div>
          </div>
        </div>
      )}

      {dialog && (
        <PtSessionDialog
          key={dialog.type === "edit" ? dialog.session.id : `new-${dialog.startsAt}`}
          mode={dialog}
          teachers={teachers}
          onClose={() => setDialog(null)}
          onChanged={(changed, jumpTo) => {
            merge(changed);
            if (jumpTo) goToDate(jumpTo);
          }}
        />
      )}
      {teachersOpen && canManageTeachers && <PtTeachersDialog teachers={teachers} onClose={() => setTeachersOpen(false)} onChanged={setTeachers} />}
    </div>
  );
}

function SessionCard({
  s,
  color,
  teacherName,
  top,
  lane,
  lanes,
  ghost,
  now,
  onPointerDown,
  onOpen,
}: {
  s: PtSession;
  color: string;
  teacherName: string;
  top: number;
  lane: number;
  lanes: number;
  ghost: boolean;
  now: number;
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onOpen: () => void;
}) {
  const cancelled = s.status === "cancelada";
  const height = Math.max((s.duration_minutes / 60) * HOUR_PX - 2, 22);
  const done = time(s.starts_at) + s.duration_minutes * 60000 < now;
  const names = s.students.map((x) => shortName(x.name)).join(", ");
  const present = s.students.filter((x) => x.attended).length;
  const w = 100 / lanes;
  const badge =
    s.altered || cancelled ? (
      <span
        className={`whitespace-nowrap rounded px-1 py-px font-display uppercase text-[8px] leading-tight tracking-wide ${
          cancelled ? "bg-red-500 text-white" : "bg-amber-400 text-black"
        }`}
      >
        {cancelled ? "Cancelada" : "Foi alterado"}
      </span>
    ) : null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${teacherName}, ${timeOf(s.starts_at)}`}
      onPointerDown={onPointerDown}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="absolute rounded-lg overflow-hidden px-1.5 py-1 text-left cursor-grab active:cursor-grabbing select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={{
        top,
        height,
        left: `calc(${lane * w}% + 2px)`,
        width: `calc(${w}% - 4px)`,
        background: `color-mix(in srgb, ${color} 22%, #0c1016)`,
        borderLeft: `4px solid ${color}`,
        boxShadow: s.altered && !cancelled ? "0 0 0 1.5px #fbbf24" : undefined,
        opacity: ghost ? 0.3 : cancelled ? 0.55 : done ? 0.8 : 1,
        WebkitTouchCallout: "none",
        zIndex: 5,
      }}
    >
      <div className="flex items-center justify-between gap-1 text-[11px] font-semibold leading-tight text-white">
        <span className={`truncate ${cancelled ? "line-through" : ""}`}>
          {timeOf(s.starts_at)}–{endTimeOf(s)}
        </span>
        {height < 40 && badge ? (
          badge
        ) : (
          <span className="flex items-center gap-1 shrink-0 font-normal text-white/70">
            {s.series_id && <Repeat size={10} />}
            {s.students.length}/{s.capacity}
          </span>
        )}
      </div>
      {height >= 40 && (
        <p className={`text-[11px] leading-tight text-white/85 truncate ${cancelled ? "line-through" : ""}`}>
          <span style={{ color }}>{teacherName.split(" ")[0]}</span> · {names || "sem alunos"}
        </p>
      )}
      {height >= 58 && present > 0 && <p className="text-[10px] text-[var(--color-lime)] truncate">✓ {present} compareceu</p>}
      {height >= 40 && badge && <span className="absolute bottom-1 right-1">{badge}</span>}
    </div>
  );
}
