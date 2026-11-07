/**
 * Chamadas do calendário de PT & Padel às rotas /api/pt/*. Cada função devolve os dados ou lança um
 * Error com a mensagem em português que veio do servidor (para mostrar à administração).
 */
import type { PtLogEntry, PtScope, PtSession, PtTeacher, PtTeacherKind } from "@/lib/pt-types";

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Algo correu mal. Tenta outra vez.");
  return data as T;
}

const send = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
});

export const ptApi = {
  teachers: () => call<{ teachers: PtTeacher[] }>("/api/pt/teachers").then((d) => d.teachers),
  createTeacher: (b: { name: string; kind: PtTeacherKind; color: string }) =>
    call<{ teacher: PtTeacher }>("/api/pt/teachers", send("POST", b)).then((d) => d.teacher),
  updateTeacher: (id: string, b: { name?: string; color?: string; active?: boolean }) =>
    call<{ teacher: PtTeacher }>(`/api/pt/teachers/${id}`, send("PATCH", b)).then((d) => d.teacher),

  sessions: (from: string, to: string) =>
    call<{ sessions: PtSession[] }>(
      `/api/pt/sessions?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
    ).then((d) => d.sessions),
  create: (b: {
    teacher_id: string;
    starts_at: string;
    duration_minutes: number;
    capacity: number;
    notes?: string;
    students?: string[];
    recurrence?: { months: number } | null;
  }) => call<{ sessions: PtSession[] }>("/api/pt/sessions", send("POST", b)).then((d) => d.sessions),
  update: (
    id: string,
    b: {
      starts_at?: string;
      duration_minutes?: number;
      capacity?: number;
      notes?: string;
      teacher_id?: string;
      scope: PtScope;
    }
  ) => call<{ sessions: PtSession[] }>(`/api/pt/sessions/${id}`, send("PATCH", b)).then((d) => d.sessions),
  setStatus: (id: string, status: "agendada" | "cancelada", scope: PtScope) =>
    call<{ sessions: PtSession[] }>(`/api/pt/sessions/${id}`, send("PATCH", { status, scope })).then(
      (d) => d.sessions
    ),
  log: (id: string) => call<{ log: PtLogEntry[] }>(`/api/pt/sessions/${id}/log`).then((d) => d.log),

  addStudent: (id: string, name: string, scope: PtScope) =>
    call<{ sessions: PtSession[]; skipped: string[] }>(
      `/api/pt/sessions/${id}/students`,
      send("POST", { name, scope })
    ),
  setAttended: (studentId: string, attended: boolean) =>
    call<{ sessions: PtSession[] }>(`/api/pt/students/${studentId}`, send("PATCH", { attended })).then(
      (d) => d.sessions
    ),
  removeStudent: (studentId: string, scope: PtScope) =>
    call<{ sessions: PtSession[] }>(`/api/pt/students/${studentId}?scope=${scope}`, send("DELETE")).then(
      (d) => d.sessions
    ),
  finish: (id: string, student?: string) =>
    call<{ sessions: PtSession[] }>(`/api/pt/sessions/${id}/finish`, send("POST", { student })).then(
      (d) => d.sessions
    ),
};
