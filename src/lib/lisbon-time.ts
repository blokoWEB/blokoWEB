/**
 * Horas de Lisboa. A hora de verão/inverno muda duas vezes por ano (último domingo de Março e de
 * Outubro), por isso uma aula "às 18:15" tem de ficar às 18:15 do relógio o ano inteiro e não um
 * instante UTC fixo. Estas funções convertem entre o relógio de Lisboa e o instante UTC.
 */
const TZ = "Europe/Lisbon";

const partsFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export type LisbonParts = { year: number; month: number; day: number; hour: number; minute: number };

/** Ano, mês, dia, hora e minuto no relógio de Lisboa para um instante. */
export function lisbonParts(date: Date): LisbonParts {
  const p = Object.fromEntries(partsFormat.formatToParts(date).map((x) => [x.type, x.value]));
  return {
    year: Number(p.year),
    month: Number(p.month),
    day: Number(p.day),
    hour: Number(p.hour),
    minute: Number(p.minute),
  };
}

/** Diferença (em ms) entre o relógio de Lisboa e UTC num dado instante (0 no inverno, 1 h no verão). */
function offsetMs(date: Date): number {
  const p = lisbonParts(date);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Math.floor(date.getTime() / 60000) * 60000;
}

/** O instante UTC em que o relógio de Lisboa marca esta data e hora. */
export function lisbonToDate(year: number, month: number, day: number, hour: number, minute: number): Date {
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  let guess = asUtc - offsetMs(new Date(asUtc));
  // Perto da mudança de hora o desvio muda entre a estimativa e o resultado: corrige uma vez.
  guess = asUtc - offsetMs(new Date(guess));
  return new Date(guess);
}

/** "2026-10-27T18:15" (como um <input type="datetime-local">) interpretado no relógio de Lisboa. */
export function lisbonLocalInputToDate(value: string): Date {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return new Date(NaN);
  return lisbonToDate(Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]));
}

/** Um instante como "2026-10-27T18:15" no relógio de Lisboa, para pré-preencher um datetime-local. */
export function dateToLisbonLocalInput(date: Date): string {
  const p = lisbonParts(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

/**
 * `count` ocorrências de uma aula a cada `everyDays` dias, todas à mesma hora do relógio de Lisboa
 * (a hora não "salta" quando o relógio avança ou recua). Pára no `until` (inclusivo).
 */
export function recurringStarts(start: Date, everyDays: number, until: Date, max = 104): Date[] {
  const first = lisbonParts(start);
  const out: Date[] = [];
  for (let i = 0; i < max; i++) {
    // Soma dias ao calendário (não 24 h ao instante): Date.UTC normaliza fins de mês.
    const d = new Date(Date.UTC(first.year, first.month - 1, first.day + i * everyDays));
    const next = lisbonToDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), first.hour, first.minute);
    if (next > until) break;
    out.push(next);
  }
  return out;
}

/** Dia da semana (0 = domingo … 6 = sábado) de um instante, no relógio de Lisboa. */
export function lisbonWeekday(iso: string | Date): number {
  const p = lisbonParts(typeof iso === "string" ? new Date(iso) : iso);
  return new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();
}
