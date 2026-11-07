"use client";

/**
 * Janela de uma aula/PT: criar (com repetição por meses) ou ver/alterar uma existente — dia e hora,
 * duração, máximo de alunos, alunos (só o nome), presenças, "terminou", cancelar e o histórico.
 * Só a administração a vê. Chama as rotas /api/pt/* através de `ptApi`.
 */
import { useEffect, useMemo, useState } from "react";
import { Ban, Check, Flag, History, Loader2, Plus, Repeat, RotateCcw, Trash2, UserPlus, X } from "lucide-react";
import { lisbonLocalInputToDate } from "@/lib/lisbon-time";
import { PT_KIND_LABEL, type PtLogEntry, type PtScope, type PtSession, type PtTeacher } from "@/lib/pt-types";
import { ptApi } from "./pt-api";
import { ACTION_LABEL, endTimeOf, fmtWhen, isPast, toLocalInput } from "./pt-utils";

export type DialogMode =
  | { type: "create"; startsAt: string; teacherId?: string }
  | { type: "edit"; session: PtSession };

type Props = {
  mode: DialogMode;
  teachers: PtTeacher[];
  onClose: () => void;
  /** Aulas novas/alteradas (para o calendário atualizar); `jumpTo` leva o calendário à semana certa. */
  onChanged: (sessions: PtSession[], jumpTo?: string) => void;
};

const SNAP_STEP = 300; // segundos: o seletor de hora salta de 5 em 5 minutos
const DURATIONS = [30, 45, 60, 75, 90, 120];
const MONTH_CHOICES = [1, 2, 3, 4, 5, 6, 9, 12];

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">{text}</span>
      {children}
    </label>
  );
}

/** Quantas aulas dá uma série semanal de N meses (igual ao servidor, salvo fins de mês). */
function seriesCount(startLocal: string, months: number): number {
  const m = startLocal.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m || !months) return 1;
  const a = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const b = Date.UTC(+m[1], +m[2] - 1 + months, +m[3]);
  return Math.floor((Math.round((b - a) / 86400000) - 1) / 7) + 1;
}

export default function PtSessionDialog({ mode, teachers, onClose, onChanged }: Props) {
  const creating = mode.type === "create";
  const [session, setSession] = useState<PtSession | null>(mode.type === "edit" ? mode.session : null);
  const activeTeachers = teachers.filter((t) => t.active || t.id === session?.teacher_id);

  // ---- campos do formulário ----
  const initialTeacher =
    (mode.type === "create" && mode.teacherId) || session?.teacher_id || activeTeachers[0]?.id || "";
  const [teacherId, setTeacherId] = useState(initialTeacher);
  const [startLocal, setStartLocal] = useState(
    toLocalInput(mode.type === "create" ? mode.startsAt : mode.session.starts_at)
  );
  const [duration, setDuration] = useState(session?.duration_minutes ?? 60);
  const teacher = teachers.find((t) => t.id === teacherId);
  const [capacityText, setCapacityText] = useState(String(session?.capacity ?? ""));
  const capacity = capacityText === "" ? (teacher?.kind === "padel" ? 4 : 1) : Number(capacityText);
  const [notes, setNotes] = useState(session?.notes ?? "");
  const [months, setMonths] = useState(0);
  const [newStudents, setNewStudents] = useState<string[]>([]);
  const [studentInput, setStudentInput] = useState("");

  // ---- estado da janela ----
  const [scope, setScope] = useState<PtScope>("this");
  const [tab, setTab] = useState<"details" | "log">("details");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [logVersion, setLogVersion] = useState(0);
  const [log, setLog] = useState<{ version: number; for: string; rows: PtLogEntry[]; error?: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sessionId = session?.id;
  useEffect(() => {
    if (tab !== "log" || !sessionId) return;
    let cancelled = false;
    ptApi
      .log(sessionId)
      .then((rows) => !cancelled && setLog({ version: logVersion, for: sessionId, rows }))
      .catch((e: Error) => !cancelled && setLog({ version: logVersion, for: sessionId, rows: [], error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [tab, sessionId, logVersion]);

  const logLoading = !log || log.version !== logVersion || log.for !== sessionId;

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo correu mal.");
    } finally {
      setBusy(false);
    }
  }

  /** Guarda as aulas devolvidas pelo servidor: esta janela e o calendário passam a mostrar o novo estado. */
  function apply(rows: PtSession[]) {
    const mine = rows.find((r) => r.id === sessionId);
    if (mine) setSession(mine);
    setLogVersion((v) => v + 1);
    onChanged(rows);
  }

  // ---------------------------------------------------------------- criar
  function addNewStudent() {
    const name = studentInput.replace(/\s+/g, " ").trim();
    if (!name) return;
    if (newStudents.some((s) => s.toLowerCase() === name.toLowerCase())) {
      setError(`${name} já está na lista.`);
      return;
    }
    if (newStudents.length >= capacity) {
      setError(`O máximo de alunos é ${capacity}. Aumenta o máximo primeiro.`);
      return;
    }
    setError(null);
    setNewStudents((s) => [...s, name]);
    setStudentInput("");
  }

  async function create() {
    await run(async () => {
      if (!teacherId) throw new Error("Escolhe o professor.");
      const date = lisbonLocalInputToDate(startLocal);
      if (Number.isNaN(date.getTime())) throw new Error("Indica o dia e a hora.");
      const pending = studentInput.trim();
      const students = pending ? [...newStudents, pending] : newStudents;
      const rows = await ptApi.create({
        teacher_id: teacherId,
        starts_at: date.toISOString(),
        duration_minutes: duration,
        capacity,
        notes,
        students,
        recurrence: months ? { months } : null,
      });
      onChanged(rows, rows[0]?.starts_at);
      onClose();
    });
  }

  // ---------------------------------------------------------------- editar
  const dirty = useMemo(() => {
    if (!session) return false;
    return (
      teacherId !== session.teacher_id ||
      startLocal !== toLocalInput(session.starts_at) ||
      duration !== session.duration_minutes ||
      capacity !== session.capacity ||
      notes.trim() !== (session.notes ?? "")
    );
  }, [session, teacherId, startLocal, duration, capacity, notes]);

  async function save() {
    if (!session) return;
    await run(async () => {
      const date = lisbonLocalInputToDate(startLocal);
      if (Number.isNaN(date.getTime())) throw new Error("Indica o dia e a hora.");
      apply(
        await ptApi.update(session.id, {
          starts_at: date.toISOString(),
          duration_minutes: duration,
          capacity,
          notes,
          teacher_id: teacherId,
          scope,
        })
      );
    });
  }

  async function addStudent() {
    const name = studentInput.replace(/\s+/g, " ").trim();
    if (!session || !name) return;
    await run(async () => {
      const res = await ptApi.addStudent(session.id, name, scope);
      setStudentInput("");
      if (res.skipped.length) setNotice(`Não entrou em ${res.skipped.length} aula(s): ${res.skipped[0]}`);
      apply(res.sessions);
    });
  }

  const cancelled = session?.status === "cancelada";
  const recurring = Boolean(session?.series_id);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="glass-card w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 relative max-h-[92dvh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-[var(--color-text-muted)] hover:text-white"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {creating ? (
          <h3 className="font-display uppercase text-xl sm:text-2xl mb-5 pr-8">Nova aula / PT</h3>
        ) : session ? (
          <div className="mb-4 pr-8">
            <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1">
              {PT_KIND_LABEL[session.kind]}
              {recurring && (
                <span className="inline-flex items-center gap-1 ml-2 text-[var(--color-text-muted)]">
                  <Repeat size={11} /> em série
                </span>
              )}
            </p>
            <h3 className="font-display uppercase text-xl sm:text-2xl flex flex-wrap items-center gap-x-3 gap-y-1">
              <span style={{ color: teachers.find((t) => t.id === session.teacher_id)?.color }}>
                {teachers.find((t) => t.id === session.teacher_id)?.name ?? "Professor"}
              </span>
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {fmtWhen(session.starts_at)} – {endTimeOf(session)} · {session.students.length}/{session.capacity} alunos
              {isPast(session) && !cancelled ? " · já deu" : ""}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {session.altered && !cancelled && (
                <span className="text-[10px] font-display uppercase tracking-wide px-2 py-0.5 rounded bg-amber-400 text-black">
                  Foi alterado
                </span>
              )}
              {cancelled && (
                <span className="text-[10px] font-display uppercase tracking-wide px-2 py-0.5 rounded bg-red-500/90 text-white">
                  Cancelada
                </span>
              )}
              {session.altered && session.altered_at && (
                <span className="text-xs text-[var(--color-text-muted)]">alterada em {fmtWhen(session.altered_at)}</span>
              )}
            </div>
          </div>
        ) : null}

        {!creating && (
          <div className="flex gap-2 mb-5">
            {(
              [
                ["details", "Detalhes"],
                ["log", "Histórico"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 font-display uppercase text-[11px] tracking-wide px-4 py-2 rounded-full border transition-colors ${
                  tab === key
                    ? "bg-white text-black border-white"
                    : "border-white/15 text-[var(--color-text-muted)] hover:text-white hover:border-white/30"
                }`}
              >
                {key === "log" && <History size={12} />} {label}
              </button>
            ))}
          </div>
        )}

        {tab === "log" && session ? (
          <div className="space-y-2">
            {logLoading ? (
              <div className="flex items-center gap-3 text-[var(--color-text-muted)] text-sm">
                <Loader2 className="animate-spin" size={16} /> A carregar…
              </div>
            ) : log?.error ? (
              <p className="text-sm text-red-400">{log.error}</p>
            ) : log && log.rows.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">Ainda sem alterações registadas.</p>
            ) : (
              log?.rows.map((l) => (
                <div key={l.id} className="rounded-xl border border-white/10 px-4 py-3">
                  <div className="flex items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
                    <span className="font-display uppercase tracking-wide text-[var(--color-lime)]">
                      {ACTION_LABEL[l.action] ?? l.action}
                    </span>
                    <span>
                      {fmtWhen(l.at)} · {l.actor}
                    </span>
                  </div>
                  {l.detail && <p className="text-sm mt-1.5">{l.detail}</p>}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {recurring && (
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2">
                  Aplicar alterações a
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["this", "Só esta aula"],
                      ["following", "Esta e as seguintes"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setScope(key)}
                      className={`text-sm rounded-lg px-3 py-2 border transition-colors ${
                        scope === key
                          ? "border-[var(--color-lime)] bg-[var(--color-lime)]/10 text-white"
                          : "border-white/10 text-[var(--color-text-muted)] hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Label text="Professor">
                <select className="input" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
                  {activeTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.kind === "padel" ? "padel" : "ginásio"})
                    </option>
                  ))}
                </select>
              </Label>
              <Label text="Dia e hora">
                <input
                  type="datetime-local"
                  step={SNAP_STEP}
                  className="input"
                  value={startLocal}
                  onChange={(e) => setStartLocal(e.target.value)}
                />
              </Label>
              <Label text="Duração">
                <select className="input" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                  {[...new Set([...DURATIONS, duration])]
                    .sort((a, b) => a - b)
                    .map((d) => (
                      <option key={d} value={d}>
                        {d} min
                      </option>
                    ))}
                </select>
              </Label>
              <Label text="Máx. de alunos">
                <input
                  type="number"
                  min={1}
                  max={30}
                  className="input"
                  value={capacityText === "" ? capacity : capacityText}
                  onChange={(e) => setCapacityText(e.target.value)}
                />
              </Label>
            </div>
            <Label text="Notas (opcional)">
              <input
                className="input"
                value={notes}
                maxLength={300}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex.: treino de força, campo 2…"
              />
            </Label>

            {creating && (
              <>
                <Label text="Repetir">
                  <select className="input" value={months} onChange={(e) => setMonths(Number(e.target.value))}>
                    <option value={0}>Não repete (só esta aula)</option>
                    {MONTH_CHOICES.map((m) => (
                      <option key={m} value={m}>
                        Todas as semanas durante {m} {m === 1 ? "mês" : "meses"}
                      </option>
                    ))}
                  </select>
                </Label>
                {months > 0 && (
                  <p className="text-xs text-[var(--color-text-muted)] -mt-2">
                    Cria cerca de {seriesCount(startLocal, months)} aulas, sempre à mesma hora. Podes terminar a série
                    quando o aluno acabar.
                  </p>
                )}
              </>
            )}

            {/* Alunos */}
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2">
                Alunos {session ? `(${session.students.length}/${session.capacity})` : `(${newStudents.length}/${capacity})`}
              </p>
              <div className="space-y-2">
                {creating
                  ? newStudents.map((n) => (
                      <div key={n} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-2.5">
                        <span className="text-sm truncate">{n}</span>
                        <button
                          onClick={() => setNewStudents((s) => s.filter((x) => x !== n))}
                          className="text-[var(--color-text-muted)] hover:text-red-400 shrink-0"
                          aria-label={`Tirar ${n}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  : session?.students.map((st) => (
                      <div key={st.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-xl border border-white/10 px-4 py-2.5">
                        <span className="text-sm truncate min-w-0">{st.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            disabled={busy}
                            onClick={() => run(async () => apply(await ptApi.setAttended(st.id, !st.attended)))}
                            className={`flex items-center gap-1 text-xs rounded-full border px-3 py-1.5 transition-colors ${
                              st.attended
                                ? "border-[var(--color-lime)] bg-[var(--color-lime)]/15 text-[var(--color-lime)]"
                                : "border-white/15 text-[var(--color-text-muted)] hover:text-white"
                            }`}
                          >
                            <Check size={12} /> {st.attended ? "Compareceu" : "Marcar presença"}
                          </button>
                          <button
                            disabled={busy}
                            title="Este aluno terminou as aulas: sai desta e das seguintes"
                            onClick={() => {
                              if (!confirm(`${st.name} terminou as aulas? Sai desta aula e de todas as seguintes (as anteriores ficam no histórico).`)) return;
                              run(async () => apply(await ptApi.finish(session.id, st.name)));
                            }}
                            className="flex items-center gap-1 text-xs rounded-full border border-white/15 px-3 py-1.5 text-[var(--color-text-muted)] hover:text-white"
                          >
                            <Flag size={12} /> Terminou
                          </button>
                          <button
                            disabled={busy}
                            onClick={() => {
                              if (!confirm(`Tirar ${st.name}${scope === "following" ? " desta aula e das seguintes" : " só desta aula"}?`)) return;
                              run(async () => apply(await ptApi.removeStudent(st.id, scope)));
                            }}
                            className="text-[var(--color-text-muted)] hover:text-red-400 p-1.5"
                            aria-label={`Tirar ${st.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                {!creating && session?.students.length === 0 && (
                  <p className="text-sm text-[var(--color-text-muted)]">Sem alunos nesta aula.</p>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  className="input"
                  placeholder="Nome do aluno"
                  value={studentInput}
                  maxLength={80}
                  onChange={(e) => setStudentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    if (creating) addNewStudent();
                    else addStudent();
                  }}
                />
                <button
                  disabled={busy || !studentInput.trim()}
                  onClick={creating ? addNewStudent : addStudent}
                  className="flex items-center gap-1.5 shrink-0 rounded-xl border border-white/15 px-4 text-sm text-white hover:border-[var(--color-lime)] disabled:opacity-40"
                >
                  {creating ? <Plus size={15} /> : <UserPlus size={15} />} Juntar
                </button>
              </div>
            </div>

            {notice && <p className="text-sm text-amber-300">{notice}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}

            {creating ? (
              <button
                disabled={busy}
                onClick={create}
                className="w-full font-display uppercase text-sm tracking-wide rounded-full bg-[var(--color-lime)] text-black py-3.5 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {busy && <Loader2 className="animate-spin" size={16} />}
                {months ? `Criar série (${seriesCount(startLocal, months)} aulas)` : "Criar aula"}
              </button>
            ) : (
              session && (
                <div className="space-y-2 pt-1">
                  <button
                    disabled={busy || !dirty}
                    onClick={save}
                    className="w-full font-display uppercase text-sm tracking-wide rounded-full bg-[var(--color-lime)] text-black py-3.5 disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {busy && <Loader2 className="animate-spin" size={16} />} Guardar alterações
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      disabled={busy}
                      onClick={() => {
                        const verb = cancelled ? "Repor" : "Cancelar";
                        if (!confirm(`${verb} ${scope === "following" ? "esta aula e as seguintes" : "esta aula"}?`)) return;
                        run(async () => apply(await ptApi.setStatus(session.id, cancelled ? "agendada" : "cancelada", scope)));
                      }}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm text-white hover:border-white/40 disabled:opacity-40"
                    >
                      {cancelled ? <RotateCcw size={15} /> : <Ban size={15} />}
                      {cancelled ? "Repor aula" : "Cancelar aula"}
                    </button>
                    {recurring && (
                      <button
                        disabled={busy}
                        onClick={() => {
                          if (!confirm("Terminar as aulas? Esta aula e todas as seguintes ficam canceladas (as anteriores ficam no histórico).")) return;
                          run(async () => apply(await ptApi.finish(session.id)));
                        }}
                        className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-3 text-sm text-white hover:border-white/40 disabled:opacity-40"
                      >
                        <Flag size={15} /> Terminou as aulas (série)
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
