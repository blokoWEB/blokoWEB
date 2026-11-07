import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { lisbonParts, lisbonToDate, lisbonWeekday, recurringStarts } from "@/lib/lisbon-time";
import type {
  PtKind,
  PtLogEntry,
  PtScope,
  PtSession,
  PtStudent,
  PtTeacher,
  PtTeacherKind,
} from "@/lib/pt-types";

/**
 * Lógica do servidor da gestão de PTs / aulas de padel. As rotas só validam o login e chamam
 * estas funções. Todas as horas são horas de Lisboa; tudo o que muda fica no histórico (pt_log).
 */

export const PT_ACTOR = "Administração";
const MAX_OCCURRENCES = 104;
const WEEKDAYS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export class PtError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

type Db = SupabaseClient;
type SessionRow = Omit<PtSession, "students">;

function check(error: { message: string } | null) {
  if (!error) return;
  if (/schema cache|does not exist|relation .* does not/i.test(error.message)) {
    throw new PtError(
      "As tabelas de PTs ainda não existem na base de dados: corre o ficheiro supabase/pt-schema.sql no SQL Editor do Supabase.",
      503
    );
  }
  throw new PtError(error.message, 500);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "ter 10/11 18:15" no relógio de Lisboa. */
export function fmtLisbon(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  const p = lisbonParts(d);
  return `${WEEKDAYS[lisbonWeekday(d)]} ${pad(p.day)}/${pad(p.month)} ${pad(p.hour)}:${pad(p.minute)}`;
}

function intIn(value: unknown, min: number, max: number, label: string): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n < min || n > max) {
    throw new PtError(`${label} tem de estar entre ${min} e ${max}.`);
  }
  return n;
}

function cleanName(raw: unknown): string {
  const name = String(raw ?? "").replace(/\s+/g, " ").trim();
  if (!name) throw new PtError("Indica o nome do aluno.");
  if (name.length > 60) throw new PtError("O nome do aluno é demasiado grande (máximo 60 letras).");
  return name;
}

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

function parseDate(value: unknown, label = "A data"): Date {
  const d = new Date(String(value));
  if (!value || Number.isNaN(d.getTime())) throw new PtError(`${label} é inválida.`);
  return d;
}

/** Soma meses ao calendário de Lisboa, mantendo a hora (31/jan + 1 mês = 28/fev). */
export function addMonthsLisbon(start: Date, months: number): Date {
  const p = lisbonParts(start);
  const lastDay = new Date(Date.UTC(p.year, p.month - 1 + months + 1, 0)).getUTCDate();
  const t = new Date(Date.UTC(p.year, p.month - 1 + months, Math.min(p.day, lastDay)));
  return lisbonToDate(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate(), p.hour, p.minute);
}

export type Recurrence = { months?: number; until?: string; every_days?: number };

/** Datas de uma aula e das suas repetições: "durante N meses" = até ao mesmo dia N meses depois (exclusive). */
export function occurrenceStarts(start: Date, rec?: Recurrence | null): Date[] {
  if (!rec || (!rec.months && !rec.until)) return [start];
  const every = rec.every_days === undefined ? 7 : intIn(rec.every_days, 1, 60, "O intervalo (dias)");
  let until: Date;
  if (rec.months) {
    until = new Date(addMonthsLisbon(start, intIn(rec.months, 1, 24, "A duração (meses)")).getTime() - 1);
  } else {
    until = parseDate(rec.until, "A data de fim");
  }
  if (until <= start) return [start];
  return recurringStarts(start, every, until, MAX_OCCURRENCES);
}

async function logRows(
  sb: Db,
  rows: { session_id: string; action: string; detail?: string | null; actor?: string }[]
) {
  if (!rows.length) return;
  const { error } = await sb
    .from("pt_log")
    .insert(rows.map((r) => ({ actor: PT_ACTOR, detail: null, ...r })));
  check(error);
}

async function attachStudents(sb: Db, rows: SessionRow[]): Promise<PtSession[]> {
  const byId = new Map<string, PtStudent[]>();
  for (let i = 0; i < rows.length; i += 80) {
    const ids = rows.slice(i, i + 80).map((r) => r.id);
    const { data, error } = await sb
      .from("pt_students")
      .select("id, session_id, name, attended")
      .in("session_id", ids)
      .order("created_at");
    check(error);
    for (const s of (data ?? []) as PtStudent[]) {
      byId.set(s.session_id, [...(byId.get(s.session_id) ?? []), s]);
    }
  }
  return rows.map((r) => ({ ...r, students: byId.get(r.id) ?? [] }));
}

async function sessionRow(sb: Db, id: string): Promise<SessionRow> {
  const { data, error } = await sb.from("pt_sessions").select("*").eq("id", id).maybeSingle();
  check(error);
  if (!data) throw new PtError("Aula não encontrada.", 404);
  return data as SessionRow;
}

/** Esta aula (scope "this") ou esta e as seguintes da série (scope "following"). */
async function targetRows(sb: Db, current: SessionRow, scope: PtScope | undefined): Promise<SessionRow[]> {
  if (scope !== "following" || !current.series_id) return [current];
  const { data, error } = await sb
    .from("pt_sessions")
    .select("*")
    .eq("series_id", current.series_id)
    .gte("starts_at", current.starts_at)
    .order("starts_at");
  check(error);
  return (data ?? []) as SessionRow[];
}

async function studentRows(sb: Db, sessionIds: string[]): Promise<PtStudent[]> {
  const out: PtStudent[] = [];
  for (let i = 0; i < sessionIds.length; i += 80) {
    const { data, error } = await sb
      .from("pt_students")
      .select("id, session_id, name, attended")
      .in("session_id", sessionIds.slice(i, i + 80));
    check(error);
    out.push(...((data ?? []) as PtStudent[]));
  }
  return out;
}

async function applyUpdates(sb: Db, updates: { id: string; patch: Record<string, unknown> }[]) {
  for (let i = 0; i < updates.length; i += 10) {
    const results = await Promise.all(
      updates.slice(i, i + 10).map((u) => sb.from("pt_sessions").update(u.patch).eq("id", u.id))
    );
    for (const r of results) check(r.error);
  }
}

async function reload(sb: Db, ids: string[]): Promise<PtSession[]> {
  const rows: SessionRow[] = [];
  for (let i = 0; i < ids.length; i += 80) {
    const { data, error } = await sb
      .from("pt_sessions")
      .select("*")
      .in("id", ids.slice(i, i + 80))
      .order("starts_at");
    check(error);
    rows.push(...((data ?? []) as SessionRow[]));
  }
  return attachStudents(sb, rows);
}

// ---------------------------------------------------------------------------
// Professores
// ---------------------------------------------------------------------------

export async function listTeachers(sb: Db): Promise<PtTeacher[]> {
  const { data, error } = await sb.from("pt_teachers").select("*").order("created_at");
  check(error);
  return (data ?? []) as PtTeacher[];
}

async function teacherById(sb: Db, id: unknown): Promise<PtTeacher> {
  const { data, error } = await sb.from("pt_teachers").select("*").eq("id", String(id)).maybeSingle();
  check(error);
  if (!data) throw new PtError("Professor não encontrado.", 404);
  return data as PtTeacher;
}

export async function createTeacher(
  sb: Db,
  input: { name?: unknown; kind?: unknown; color?: unknown }
): Promise<PtTeacher> {
  const name = String(input.name ?? "").replace(/\s+/g, " ").trim();
  if (!name || name.length > 60) throw new PtError("Indica o nome do professor (máximo 60 letras).");
  const kind = input.kind === "padel" ? "padel" : input.kind === "ginasio" ? "ginasio" : null;
  if (!kind) throw new PtError("Indica se é professor de ginásio ou de padel.");
  const color = /^#[0-9a-fA-F]{6}$/.test(String(input.color ?? "")) ? String(input.color) : "#a9c81e";
  const { data, error } = await sb.from("pt_teachers").insert({ name, kind, color }).select().single();
  if (error?.code === "23505") throw new PtError("Já existe um professor com esse nome.");
  check(error);
  return data as PtTeacher;
}

export async function updateTeacher(
  sb: Db,
  id: string,
  input: { name?: unknown; color?: unknown; active?: unknown }
): Promise<PtTeacher> {
  await teacherById(sb, id);
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) {
    const name = String(input.name).replace(/\s+/g, " ").trim();
    if (!name || name.length > 60) throw new PtError("Nome inválido (máximo 60 letras).");
    patch.name = name;
  }
  if (input.color !== undefined) {
    if (!/^#[0-9a-fA-F]{6}$/.test(String(input.color))) throw new PtError("Cor inválida.");
    patch.color = String(input.color);
  }
  if (input.active !== undefined) patch.active = Boolean(input.active);
  if (!Object.keys(patch).length) return teacherById(sb, id);
  const { data, error } = await sb.from("pt_teachers").update(patch).eq("id", id).select().single();
  if (error?.code === "23505") throw new PtError("Já existe um professor com esse nome.");
  check(error);
  return data as PtTeacher;
}

// ---------------------------------------------------------------------------
// Aulas
// ---------------------------------------------------------------------------

export async function listSessions(sb: Db, from: string, to: string): Promise<PtSession[]> {
  const f = parseDate(from, "O início do período");
  const t = parseDate(to, "O fim do período");
  const { data, error } = await sb
    .from("pt_sessions")
    .select("*")
    .gte("starts_at", f.toISOString())
    .lt("starts_at", t.toISOString())
    .order("starts_at");
  check(error);
  return attachStudents(sb, (data ?? []) as SessionRow[]);
}

export type CreateInput = {
  teacher_id?: unknown;
  starts_at?: unknown;
  duration_minutes?: unknown;
  capacity?: unknown;
  notes?: unknown;
  students?: unknown;
  recurrence?: Recurrence | null;
};

export async function createSessions(sb: Db, input: CreateInput, actor = PT_ACTOR): Promise<PtSession[]> {
  const teacher = await teacherById(sb, input.teacher_id);
  if (!teacher.active) throw new PtError("Este professor está desativado.");
  const start = parseDate(input.starts_at, "A data e hora");
  const duration = intIn(input.duration_minutes ?? 60, 5, 480, "A duração (minutos)");
  const capacity = intIn(input.capacity ?? 1, 1, 30, "O máximo de alunos");

  const names: string[] = [];
  for (const raw of Array.isArray(input.students) ? input.students : []) {
    const n = cleanName(raw);
    if (!names.some((x) => sameName(x, n))) names.push(n);
  }
  if (names.length > capacity) {
    throw new PtError(`Escolheste ${names.length} alunos mas o máximo é ${capacity}.`);
  }

  const starts = occurrenceStarts(start, input.recurrence);
  const seriesId = starts.length > 1 ? randomUUID() : null;
  const kind: PtKind = teacher.kind === "padel" ? "aula_padel" : "pt";
  const notes = String(input.notes ?? "").trim() || null;

  const { data, error } = await sb
    .from("pt_sessions")
    .insert(
      starts.map((s) => ({
        teacher_id: teacher.id,
        kind,
        starts_at: s.toISOString(),
        duration_minutes: duration,
        capacity,
        notes,
        series_id: seriesId,
      }))
    )
    .select("*");
  check(error);
  const rows = ((data ?? []) as SessionRow[]).sort((a, b) => a.starts_at.localeCompare(b.starts_at));

  if (names.length) {
    const { error: e2 } = await sb
      .from("pt_students")
      .insert(rows.flatMap((r) => names.map((name) => ({ session_id: r.id, name }))));
    check(e2);
  }

  await logRows(
    sb,
    rows.map((r) => ({
      session_id: r.id,
      actor,
      action: "created",
      detail:
        `Aula criada (${teacher.name}) · ${fmtLisbon(r.starts_at)} · ${duration} min · máx. ${capacity}` +
        (names.length ? ` · alunos: ${names.join(", ")}` : "") +
        (rows.length > 1 ? ` · série de ${rows.length} aulas` : ""),
    }))
  );
  return reload(sb, rows.map((r) => r.id));
}

export type UpdateInput = {
  starts_at?: unknown;
  duration_minutes?: unknown;
  capacity?: unknown;
  notes?: unknown;
  teacher_id?: unknown;
  scope?: PtScope;
};

export async function updateSession(sb: Db, id: string, input: UpdateInput, actor = PT_ACTOR): Promise<PtSession[]> {
  const current = await sessionRow(sb, id);
  const targets = await targetRows(sb, current, input.scope);
  const counts = new Map<string, number>();
  for (const s of await studentRows(sb, targets.map((t) => t.id))) {
    counts.set(s.session_id, (counts.get(s.session_id) ?? 0) + 1);
  }

  const teachers = new Map((await listTeachers(sb)).map((t) => [t.id, t]));
  let newTeacher: PtTeacher | null = null;
  if (input.teacher_id !== undefined && String(input.teacher_id) !== current.teacher_id) {
    newTeacher = await teacherById(sb, input.teacher_id);
    if (!newTeacher.active) throw new PtError("Este professor está desativado.");
  }

  const newStart = input.starts_at !== undefined ? parseDate(input.starts_at, "A data e hora") : null;
  const newLocal = newStart ? lisbonParts(newStart) : null;
  const oldLocal = lisbonParts(new Date(current.starts_at));
  // Dias de diferença no calendário (não em horas), para as seguintes acompanharem o dia escolhido.
  const dayDelta = newLocal
    ? Math.round(
        (Date.UTC(newLocal.year, newLocal.month - 1, newLocal.day) -
          Date.UTC(oldLocal.year, oldLocal.month - 1, oldLocal.day)) /
          86400000
      )
    : 0;
  const duration =
    input.duration_minutes !== undefined ? intIn(input.duration_minutes, 5, 480, "A duração (minutos)") : null;
  const capacity = input.capacity !== undefined ? intIn(input.capacity, 1, 30, "O máximo de alunos") : null;
  const notes = input.notes !== undefined ? String(input.notes ?? "").trim() || null : undefined;

  const now = new Date().toISOString();
  const updates: { id: string; patch: Record<string, unknown> }[] = [];
  const logs: { session_id: string; actor: string; action: string; detail: string }[] = [];

  for (const t of targets) {
    const patch: Record<string, unknown> = {};
    const lines: string[] = [];
    let schedule = false;
    let moved = false;
    const oldStart = new Date(t.starts_at);

    if (newStart && newLocal) {
      let ns = newStart;
      if (t.id !== current.id) {
        const p = lisbonParts(oldStart);
        const shifted = new Date(Date.UTC(p.year, p.month - 1, p.day + dayDelta));
        ns = lisbonToDate(
          shifted.getUTCFullYear(),
          shifted.getUTCMonth() + 1,
          shifted.getUTCDate(),
          newLocal.hour,
          newLocal.minute
        );
      }
      if (ns.getTime() !== oldStart.getTime()) {
        patch.starts_at = ns.toISOString();
        lines.push(`Dia/hora: ${fmtLisbon(oldStart)} → ${fmtLisbon(ns)}`);
        schedule = moved = true;
      }
    }
    if (duration !== null && duration !== t.duration_minutes) {
      patch.duration_minutes = duration;
      lines.push(`Duração: ${t.duration_minutes} → ${duration} min`);
      schedule = true;
    }
    if (capacity !== null && capacity !== t.capacity) {
      const n = counts.get(t.id) ?? 0;
      if (capacity < n) {
        throw new PtError(
          `A aula de ${fmtLisbon(oldStart)} já tem ${n} aluno(s): não dá para reduzir o máximo para ${capacity}.`
        );
      }
      patch.capacity = capacity;
      lines.push(`Máx. alunos: ${t.capacity} → ${capacity}`);
      schedule = true;
    }
    if (newTeacher && newTeacher.id !== t.teacher_id) {
      patch.teacher_id = newTeacher.id;
      patch.kind = newTeacher.kind === "padel" ? "aula_padel" : "pt";
      lines.push(`Professor: ${teachers.get(t.teacher_id)?.name ?? "?"} → ${newTeacher.name}`);
      schedule = true;
    }
    if (notes !== undefined && notes !== (t.notes ?? null)) {
      patch.notes = notes;
      lines.push("Notas atualizadas");
    }
    if (!lines.length) continue;

    patch.updated_at = now;
    if (schedule) {
      patch.altered = true;
      patch.altered_at = now;
    }
    updates.push({ id: t.id, patch });
    logs.push({
      session_id: t.id,
      actor,
      action: moved ? "moved" : schedule ? "changed" : "notes",
      detail: lines.join(" · "),
    });
  }

  await applyUpdates(sb, updates);
  await logRows(sb, logs);
  return reload(sb, targets.map((t) => t.id));
}

export async function setStatus(
  sb: Db,
  id: string,
  status: "agendada" | "cancelada",
  scope: PtScope | undefined,
  actor = PT_ACTOR
): Promise<PtSession[]> {
  const current = await sessionRow(sb, id);
  const targets = (await targetRows(sb, current, scope)).filter((t) => t.status !== status);
  const now = new Date().toISOString();
  await applyUpdates(
    sb,
    targets.map((t) => ({
      id: t.id,
      patch: { status, altered: true, altered_at: now, updated_at: now },
    }))
  );
  await logRows(
    sb,
    targets.map((t) => ({
      session_id: t.id,
      actor,
      action: status === "cancelada" ? "cancelled" : "restored",
      detail: `${status === "cancelada" ? "Aula cancelada" : "Aula reposta"} (${fmtLisbon(t.starts_at)})`,
    }))
  );
  return reload(sb, (await targetRows(sb, current, scope)).map((t) => t.id));
}

// ---------------------------------------------------------------------------
// Alunos
// ---------------------------------------------------------------------------

export async function addStudent(
  sb: Db,
  sessionId: string,
  rawName: unknown,
  scope: PtScope | undefined,
  actor = PT_ACTOR
): Promise<{ sessions: PtSession[]; skipped: string[] }> {
  const name = cleanName(rawName);
  const current = await sessionRow(sb, sessionId);
  const targets = await targetRows(sb, current, scope);
  const existing = await studentRows(sb, targets.map((t) => t.id));
  const skipped: string[] = [];
  const toInsert: { session_id: string; name: string }[] = [];
  const logs: { session_id: string; actor: string; action: string; detail: string }[] = [];

  for (const t of targets) {
    const here = existing.filter((s) => s.session_id === t.id);
    if (here.some((s) => sameName(s.name, name))) {
      skipped.push(`${fmtLisbon(t.starts_at)}: ${name} já está nesta aula`);
    } else if (here.length >= t.capacity) {
      skipped.push(`${fmtLisbon(t.starts_at)}: aula cheia (${t.capacity})`);
    } else {
      toInsert.push({ session_id: t.id, name });
      logs.push({ session_id: t.id, actor, action: "student_added", detail: `Aluno adicionado: ${name}` });
    }
  }
  if (!toInsert.length) throw new PtError(skipped[0] ?? "Não foi possível adicionar o aluno.");

  const { error } = await sb.from("pt_students").insert(toInsert);
  check(error);
  await logRows(sb, logs);
  return { sessions: await reload(sb, targets.map((t) => t.id)), skipped };
}

export async function updateStudent(
  sb: Db,
  studentId: string,
  input: { attended?: unknown; name?: unknown },
  actor = PT_ACTOR
): Promise<PtSession[]> {
  const { data, error } = await sb
    .from("pt_students")
    .select("id, session_id, name, attended")
    .eq("id", studentId)
    .maybeSingle();
  check(error);
  if (!data) throw new PtError("Aluno não encontrado.", 404);
  const student = data as PtStudent;

  const patch: Record<string, unknown> = {};
  const lines: string[] = [];
  let action = "attendance";
  if (input.attended !== undefined && Boolean(input.attended) !== student.attended) {
    patch.attended = Boolean(input.attended);
    lines.push(`${student.name} ${patch.attended ? "compareceu" : "faltou"}`);
  }
  if (input.name !== undefined) {
    const name = cleanName(input.name);
    if (name !== student.name) {
      patch.name = name;
      lines.push(`Aluno renomeado: ${student.name} → ${name}`);
      action = "student_renamed";
    }
  }
  if (lines.length) {
    const { error: e2 } = await sb.from("pt_students").update(patch).eq("id", studentId);
    check(e2);
    await logRows(sb, [{ session_id: student.session_id, actor, action, detail: lines.join(" · ") }]);
  }
  return reload(sb, [student.session_id]);
}

export async function removeStudent(
  sb: Db,
  studentId: string,
  scope: PtScope | undefined,
  actor = PT_ACTOR
): Promise<PtSession[]> {
  const { data, error } = await sb
    .from("pt_students")
    .select("id, session_id, name, attended")
    .eq("id", studentId)
    .maybeSingle();
  check(error);
  if (!data) throw new PtError("Aluno não encontrado.", 404);
  const student = data as PtStudent;
  const current = await sessionRow(sb, student.session_id);
  const targets = await targetRows(sb, current, scope);
  const victims = (await studentRows(sb, targets.map((t) => t.id))).filter((s) => sameName(s.name, student.name));

  const { error: e2 } = await sb.from("pt_students").delete().in("id", victims.map((v) => v.id));
  check(e2);
  await logRows(
    sb,
    victims.map((v) => ({
      session_id: v.session_id,
      actor,
      action: "student_removed",
      detail: `Aluno removido: ${v.name}`,
    }))
  );
  return reload(sb, targets.map((t) => t.id));
}

/**
 * "Terminou": sem `student`, a série acaba (esta aula e as seguintes ficam canceladas); com `student`,
 * esse aluno deixa de estar nesta aula e nas seguintes (as anteriores ficam como histórico).
 */
export async function finish(
  sb: Db,
  sessionId: string,
  input: { student?: unknown },
  actor = PT_ACTOR
): Promise<PtSession[]> {
  const current = await sessionRow(sb, sessionId);
  const targets = await targetRows(sb, current, "following");
  const from = fmtLisbon(current.starts_at);

  if (input.student === undefined || input.student === null || input.student === "") {
    const live = targets.filter((t) => t.status !== "cancelada");
    const now = new Date().toISOString();
    await applyUpdates(
      sb,
      live.map((t) => ({ id: t.id, patch: { status: "cancelada", altered: true, altered_at: now, updated_at: now } }))
    );
    await logRows(
      sb,
      live.map((t) => ({
        session_id: t.id,
        actor,
        action: "series_ended",
        detail: `Aulas terminadas: ${live.length} aula(s) a partir de ${from} foram canceladas`,
      }))
    );
    return reload(sb, targets.map((t) => t.id));
  }

  const name = cleanName(input.student);
  const victims = (await studentRows(sb, targets.map((t) => t.id))).filter((s) => sameName(s.name, name));
  if (!victims.length) throw new PtError(`${name} não está nesta aula nem nas seguintes.`);
  const { error } = await sb.from("pt_students").delete().in("id", victims.map((v) => v.id));
  check(error);
  await logRows(
    sb,
    victims.map((v) => ({
      session_id: v.session_id,
      actor,
      action: "student_finished",
      detail: `${v.name} terminou as aulas (retirado a partir de ${from})`,
    }))
  );
  return reload(sb, targets.map((t) => t.id));
}

export async function getLog(sb: Db, sessionId: string): Promise<PtLogEntry[]> {
  await sessionRow(sb, sessionId);
  const { data, error } = await sb
    .from("pt_log")
    .select("*")
    .eq("session_id", sessionId)
    .order("at", { ascending: false });
  check(error);
  return (data ?? []) as PtLogEntry[];
}

export type { PtTeacherKind };
