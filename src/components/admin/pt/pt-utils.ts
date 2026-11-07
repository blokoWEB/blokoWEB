/**
 * Auxiliares do calendário de PT & Padel (só para o navegador): dias/horas de Lisboa, posição dos
 * cartões na grelha e nomes legíveis para o histórico. Nada aqui fala com a base de dados.
 */
import { lisbonParts, lisbonToDate, lisbonWeekday } from "@/lib/lisbon-time";
import type { PtSession } from "@/lib/pt-types";

/** Um dia do calendário (sem hora), no relógio de Lisboa. */
export type Cal = { y: number; m: number; d: number };

export const HOUR_PX = 60; // altura de uma hora na grelha
export const SNAP_MIN = 15; // as aulas encaixam de 15 em 15 minutos
export const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export const calKey = (c: Cal) => `${c.y}-${c.m}-${c.d}`;

export function addDays(c: Cal, n: number): Cal {
  const t = new Date(Date.UTC(c.y, c.m - 1, c.d + n));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

export function calOf(value: string | Date): Cal {
  const p = lisbonParts(typeof value === "string" ? new Date(value) : value);
  return { y: p.year, m: p.month, d: p.day };
}

/** A segunda-feira da semana que contém este dia. */
export function mondayOf(c: Cal): Cal {
  const dow = new Date(Date.UTC(c.y, c.m - 1, c.d)).getUTCDay(); // 0 = domingo
  return addDays(c, -((dow + 6) % 7));
}

export const todayCal = (): Cal => calOf(new Date());

/** 0 = segunda … 6 = domingo. */
export const calWeekdayIdx = (c: Cal) => (new Date(Date.UTC(c.y, c.m - 1, c.d)).getUTCDay() + 6) % 7;

/** Início (inclusivo) de um dia em Lisboa, como instante ISO. */
export const dayStartIso = (c: Cal) => lisbonToDate(c.y, c.m, c.d, 0, 0).toISOString();

export function minutesOfDay(iso: string): number {
  const p = lisbonParts(new Date(iso));
  return p.hour * 60 + p.minute;
}

export function toIso(c: Cal, minutes: number): string {
  return lisbonToDate(c.y, c.m, c.d, Math.floor(minutes / 60), minutes % 60).toISOString();
}

const pad = (n: number) => String(n).padStart(2, "0");
export const hhmm = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
export const timeOf = (iso: string) => hhmm(minutesOfDay(iso));
export const endTimeOf = (s: Pick<PtSession, "starts_at" | "duration_minutes">) =>
  hhmm((minutesOfDay(s.starts_at) + s.duration_minutes) % (24 * 60));

export function weekLabel(monday: Cal): string {
  const sunday = addDays(monday, 6);
  const a = `${monday.d}${monday.m === sunday.m ? "" : " " + MONTHS[monday.m - 1]}`;
  return `${a} – ${sunday.d} ${MONTHS[sunday.m - 1]} ${sunday.y}`;
}

export function dayLabel(c: Cal): string {
  return `${DAY_LABELS[calWeekdayIdx(c)]} ${c.d}/${pad(c.m)}`;
}

const dateTimeFmt = new Intl.DateTimeFormat("pt-PT", {
  timeZone: "Europe/Lisbon",
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** "ter, 10/11, 18:15" — para histórico e avisos. */
export const fmtWhen = (iso: string) => dateTimeFmt.format(new Date(iso)).replace(/\./g, "");

/** Valor para <input type="datetime-local"> no relógio de Lisboa (sem passar pelo fuso do computador). */
export function toLocalInput(iso: string): string {
  const p = lisbonParts(new Date(iso));
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

export const isPast = (s: Pick<PtSession, "starts_at" | "duration_minutes">) =>
  new Date(s.starts_at).getTime() + s.duration_minutes * 60000 < Date.now();

export const weekdayIndex = (iso: string) => (lisbonWeekday(iso) + 6) % 7; // 0 = segunda

/** Arruma aulas que se sobrepõem em colunas lado a lado (cada aula recebe `lane` de `lanes`). */
export function layoutDay<T extends { starts_at: string; duration_minutes: number }>(
  list: T[]
): { item: T; lane: number; lanes: number }[] {
  const sorted = [...list].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  const out: { item: T; lane: number; lanes: number }[] = [];
  let cluster: { item: T; lane: number; end: number }[] = [];
  let clusterEnd = -1;

  const flush = () => {
    const lanes = cluster.reduce((m, c) => Math.max(m, c.lane + 1), 1);
    for (const c of cluster) out.push({ item: c.item, lane: c.lane, lanes });
    cluster = [];
  };

  for (const item of sorted) {
    const start = minutesOfDay(item.starts_at);
    const end = start + Math.max(item.duration_minutes, SNAP_MIN);
    if (cluster.length && start >= clusterEnd) flush();
    const taken = new Set(cluster.filter((c) => c.end > start).map((c) => c.lane));
    let lane = 0;
    while (taken.has(lane)) lane++;
    cluster.push({ item, lane, end });
    clusterEnd = cluster.length === 1 ? end : Math.max(clusterEnd, end);
  }
  flush();
  return out;
}

export const ACTION_LABEL: Record<string, string> = {
  created: "Criada",
  moved: "Mudou de dia/hora",
  changed: "Alterada",
  notes: "Notas",
  cancelled: "Cancelada",
  restored: "Reposta",
  student_added: "Aluno adicionado",
  student_removed: "Aluno removido",
  student_renamed: "Aluno renomeado",
  student_finished: "Aluno terminou",
  series_ended: "Aulas terminadas",
  attendance: "Presença",
};

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/** "Maria S." — nome próprio e inicial do último apelido, para caber no cartão. */
export function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
}
