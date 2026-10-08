export type PadelteamsStats = {
  categorias?: number;
  participantes?: number;
  jogadores?: number;
  ranking?: boolean;
};

export type MatchStatus = "scheduled" | "live" | "finished" | "other";

export type SetScore = {
  /** Jogos ganhos pela equipa 1 / equipa 2 nesse set. */
  t1: number;
  t2: number;
  /** Pontos do tie-break (se existirem), por equipa. */
  tb1?: number;
  tb2?: number;
};

export type ScheduleMatch = {
  /** "18:00", "A definir" (hora ainda por marcar) ou "" quando o jogo já terminou (a PadelTeams deixa de mostrar a hora). */
  time: string;
  tbd: boolean;
  status: MatchStatus;
  category: string;
  group: string;
  team1: string;
  team2: string;
  /** Resultado por set, na ordem em que foram jogados (jogos terminados ou em curso). */
  sets: SetScore[];
  /** 1 ou 2 quando a PadelTeams marca uma equipa vencedora. */
  winner?: 1 | 2;
  /** Texto de estado da PadelTeams, ex.: "Em Jogo 55 min". */
  statusText?: string;
  /** Minutos de jogo, quando o jogo está em curso. */
  liveMinutes?: number;
};

export type ScheduleCourt = {
  /** "Campo 1 · McDonald’s" */
  court: string;
  number: number;
  matches: ScheduleMatch[];
};

function extractNumber(html: string, label: string): number | undefined {
  const re = new RegExp(
    `table-title[^>]*>\\s*${label}\\s*<\\/td>\\s*<td[^>]*>\\s*([\\d]+)\\s*<\\/td>`,
    "i"
  );
  const match = html.match(re);
  return match ? Number(match[1]) : undefined;
}

function extractBoolean(html: string, label: string): boolean | undefined {
  const re = new RegExp(
    `table-title[^>]*>\\s*${label}\\s*<\\/td>\\s*<td[^>]*>\\s*(Sim|Não)\\s*<\\/td>`,
    "i"
  );
  const match = html.match(re);
  if (!match) return undefined;
  return match[1].toLowerCase() === "sim";
}

/**
 * Lê estatísticas públicas de inscrição de uma página de competição da PadelTeams
 * (categorias, participantes, jogadores, se tem ranking). A página é HTML
 * renderizado no servidor deles, sem API — isto é uma extração best-effort por
 * regex; qualquer falha (rede, alteração de markup) devolve null em vez de
 * rebentar a página do BLOKO.
 */
export async function fetchPadelteamsStats(url: string): Promise<PadelteamsStats | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const html = await res.text();

    const stats: PadelteamsStats = {
      categorias: extractNumber(html, "Total categorias"),
      participantes: extractNumber(html, "Total participantes"),
      jogadores: extractNumber(html, "Total jogadores"),
      ranking: extractBoolean(html, "Tem ranking"),
    };

    const hasAny = Object.values(stats).some((v) => v !== undefined);
    return hasAny ? stats : null;
  } catch {
    return null;
  }
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** "BLO - 1 | Campo McDonald`s" → { number: 1, name: "Campo 1 — McDonald’s" } */
function parseCourtName(raw: string): { number: number; name: string } {
  const clean = raw.replace(/`/g, "’").trim();
  const [left, right] = clean.includes("|") ? clean.split("|").map((s) => s.trim()) : ["", clean];
  const numMatch = left.match(/(\d+)\s*$/) ?? right.match(/(\d+)\s*$/);
  const number = numMatch ? Number(numMatch[1]) : 99;
  const sponsor = right.replace(/^campo\s*\d*\s*[-–:]?\s*/i, "").trim();
  const name = numMatch
    ? `Campo ${number}${sponsor ? ` · ${sponsor}` : ""}`
    : right || clean;
  return { number, name };
}

/** Uma célula de resultado: "6", ou "7<sup>5</sup>" (set decidido no tie-break). */
function parseResultCell(cellHtml: string): { games: number; tb?: number } | null {
  const sup = cellHtml.match(/<sup[^>]*>\s*(\d+)\s*<\/sup>/i);
  const games = cellHtml.replace(/<sup[\s\S]*?<\/sup>/gi, "").match(/\d+/);
  if (!games) return null;
  return { games: Number(games[0]), tb: sup ? Number(sup[1]) : undefined };
}

function parseSets(part: string): SetScore[] {
  const rows = [
    ...part.matchAll(
      /<div class="d-flex flex-row[^"]*">\s*((?:<div class="result[^"]*">[\s\S]*?<\/div>\s*)+)<\/div>/g
    ),
  ];
  if (rows.length < 2) return [];
  const cells = (rowHtml: string) =>
    [...rowHtml.matchAll(/<div class="result[^"]*">([\s\S]*?)<\/div>/g)].map((m) =>
      parseResultCell(m[1])
    );
  const a = cells(rows[0][1]);
  const b = cells(rows[1][1]);
  const sets: SetScore[] = [];
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const x = a[i];
    const y = b[i];
    if (!x || !y) continue;
    sets.push({ t1: x.games, t2: y.games, tb1: x.tb, tb2: y.tb });
  }
  return sets;
}

/**
 * Extrai os jogos de uma página "Calendário dia" da PadelTeams (HTML já recebido).
 * Separado do fetch para poder ser testado com HTML guardado.
 *
 * Três tipos de jogo na mesma página:
 *  - por jogar: mostra a hora (bloco "text-success")
 *  - em curso: mostra "Em Jogo N min"
 *  - terminado: mostra o resultado por set e marca winner/loser — a hora deixa de aparecer
 */
export function parseDaySchedule(html: string): ScheduleCourt[] {
  const courtHeaderRe =
    /<div class="col-12 text-bold p-1 mt-3 border-bottom">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>\s*<\/div>/g;
  const sections: { raw: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;
  let lastIndex = -1;
  let lastName: string | null = null;
  while ((m = courtHeaderRe.exec(html)) !== null) {
    if (lastName !== null) sections.push({ raw: lastName, start: lastIndex, end: m.index });
    lastName = stripTags(m[1]);
    lastIndex = courtHeaderRe.lastIndex;
  }
  if (lastName !== null) sections.push({ raw: lastName, start: lastIndex, end: html.length });

  const courts: ScheduleCourt[] = sections.map((sec) => {
    const { number, name } = parseCourtName(sec.raw);
    const chunk = html.slice(sec.start, sec.end);
    const matchChunks = chunk.split('class="w-100 match-').slice(1);

    const matches: ScheduleMatch[] = [];
    for (const part of matchChunks) {
      const teamMatches = [...part.matchAll(/<div class="team-name([^"]*)">([\s\S]*?)<\/div>/g)];
      if (teamMatches.length < 2) continue;

      const catMatch = part.match(/text-center pt-1 ">\s*([^<]+?)\s*<\/div>/);
      const groupMatch = part.match(/fs-s text-center pb-1">([\s\S]*?)<\/div>/);

      const schedMatch = part.match(
        /small text-bold text-success text-center px-2">([\s\S]*?)<\/div>/
      );
      const statusMatch = part.match(/<span class="match-status">([\s\S]*?)<\/span>/);
      const sets = parseSets(part);

      const winner: 1 | 2 | undefined = /\bwinner\b/.test(teamMatches[0][1])
        ? 1
        : /\bwinner\b/.test(teamMatches[1][1])
          ? 2
          : undefined;

      let status: MatchStatus = "other";
      let time = "";
      let tbd = false;
      let statusText: string | undefined;
      let liveMinutes: number | undefined;

      if (statusMatch) {
        statusText = stripTags(statusMatch[1]);
        if (/em jogo/i.test(statusText)) {
          status = "live";
          const mins = statusText.match(/(\d+)\s*min/i);
          liveMinutes = mins ? Number(mins[1]) : undefined;
        } else {
          status = sets.length > 0 ? "finished" : "other";
        }
      } else if (schedMatch) {
        status = "scheduled";
        const parts = schedMatch[1].split("<br>").map((s) => stripTags(s));
        const rawTime = parts[parts.length - 1] ?? "";
        // A PadelTeams guarda 00:00–06:59 em jogos ainda sem hora real (eliminatórias por sortear)
        tbd = /^\d{2}:\d{2}$/.test(rawTime) && rawTime < "07:00";
        time = tbd ? "A definir" : rawTime;
      } else if (sets.length > 0 || winner) {
        status = "finished";
      }

      if (status === "scheduled" && !time) continue;

      matches.push({
        time,
        tbd,
        status,
        category: catMatch ? stripTags(catMatch[1]) : "",
        group: groupMatch ? stripTags(groupMatch[1]) : "",
        team1: stripTags(teamMatches[0][2]),
        team2: stripTags(teamMatches[1][2]),
        sets,
        winner,
        statusText,
        liveMinutes,
      });
    }

    // Mantém a ordem da PadelTeams (já é cronológica); só os jogos sem hora definida vão para o fim.
    const indexed = matches.map((x, i) => ({ x, i }));
    indexed.sort((p, q) => Number(p.x.tbd) - Number(q.x.tbd) || p.i - q.i);

    return { court: name, number, matches: indexed.map((e) => e.x) };
  });

  return courts.filter((c) => c.matches.length > 0).sort((a, b) => a.number - b.number);
}

/**
 * Lê o calendário público de um dia de um torneio da PadelTeams: jogos por jogar
 * (com hora), em curso e terminados (com resultado), agrupados por campo.
 *
 * `cid` é o id da competição na PadelTeams (visível no "k" da página de
 * inscrição: base64 de "cid=<id>"). Devolve [] em qualquer falha (rede,
 * torneio sem calendário publicado ainda, alteração de markup) — nunca
 * rebenta a página do BLOKO.
 */
export async function fetchPadelteamsDaySchedule(
  cid: string,
  date: string,
  revalidateSeconds = 30
): Promise<ScheduleCourt[]> {
  try {
    const key = Buffer.from(`cid=${cid}&cur_day=${date}&view=1`).toString("base64");
    const res = await fetch(`https://padelteams.pt/info/calendar?k=${key}`, {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return [];
    return parseDaySchedule(await res.text());
  } catch {
    return [];
  }
}

export type TournamentDayRef = { label: string; date: string };

export type DayScheduleData = {
  label: string;
  date: string;
  courts: ScheduleCourt[];
};

/** Vai buscar todos os dias de um torneio em paralelo. */
export async function fetchPadelteamsSchedule(
  cid: string,
  days: TournamentDayRef[],
  revalidateSeconds = 30
): Promise<DayScheduleData[]> {
  return Promise.all(
    days.map(async (d) => ({
      label: d.label,
      date: d.date,
      courts: await fetchPadelteamsDaySchedule(cid, d.date, revalidateSeconds),
    }))
  );
}

// ---------------------------------------------------------------------------
// Categorias: grupos e quadro (página "Info - Categoria" da PadelTeams)
// ---------------------------------------------------------------------------

export type GroupTeam = {
  /** Posição atual no grupo (classificação provisória). */
  position: number;
  name: string;
  /** Posição que passa à fase seguinte. */
  qualifies: boolean;
  played?: number;
  won?: number;
  lost?: number;
  gamesFor?: number;
  gamesAgainst?: number;
};

export type GroupInfo = {
  name: string;
  /** "Em Jogo", "Terminado"… quando a PadelTeams mostra estado do grupo. */
  status?: string;
  classificationUrl?: string;
  teams: GroupTeam[];
};

export type BracketMatch = {
  /** "2.1", "3.2", "4.1" — número do jogo no quadro. */
  code: string;
  team1: string;
  team2: string;
  sets: SetScore[];
  winner?: 1 | 2;
};

export type BracketRound = { name: string; matches: BracketMatch[] };

export type CategoryInfo = {
  tid: string;
  name: string;
  groups: GroupInfo[];
  rounds: BracketRound[];
  stats?: { pendente: number; programado: number; emJogo: number; terminado: number };
};

const CATEGORY_ORDER = ["M3", "M4", "M5", "M6", "F6", "X6", "MX"];

function encodeK(params: string): string {
  return encodeURIComponent(Buffer.from(params).toString("base64"));
}

/** Lê a página de uma categoria: grupos (com posições) e quadro de eliminatórias. */
export function parseCategoryPage(html: string): {
  options: { tid: string; name: string; selected: boolean }[];
  groups: GroupInfo[];
  rounds: BracketRound[];
  stats?: CategoryInfo["stats"];
} {
  const select = html.match(/<select id="phase-group"[\s\S]*?<\/select>/)?.[0] ?? "";
  const options = [...select.matchAll(/<option value="(\d+)"([^>]*)>\s*([^<]+?)\s*<\/option>/g)].map((m) => ({
    tid: m[1],
    name: m[3].trim(),
    selected: /selected/.test(m[2]),
  }));

  // --- grupos ---
  const bracketStart = html.indexOf('<div class="fixed-wrapper">');
  const groupsHtml = bracketStart > 0 ? html.slice(0, bracketStart) : html;
  const starts = [...groupsHtml.matchAll(/<div id="grp\d+" class="col-12 col-sm-6[^"]*">/g)].map((m) => m.index!);
  const groups: GroupInfo[] = starts.map((start, i) => {
    const chunk = groupsHtml.slice(start, starts[i + 1] ?? groupsHtml.length);
    const name = stripTags(chunk.match(/text-bold text-center px-2 my-auto">([\s\S]*?)<\/div>/)?.[1] ?? "");
    const status = chunk.match(/competition-status[^>]*>\s*([^<]+?)\s*<\/div>/)?.[1]?.trim();
    const classHref = chunk.match(/href="(\/info\/group-classification\?k=[^"]+)"/)?.[1];
    const teams: GroupTeam[] = [
      ...chunk.matchAll(
        /badge (position-selected|position-not-selected)">(\d+)<\/div>[\s\S]*?<div class="team-name">([\s\S]*?)<\/div>/g
      ),
    ].map((t) => ({ position: Number(t[2]), qualifies: t[1] === "position-selected", name: stripTags(t[3]) }));
    return {
      name,
      status: status || undefined,
      classificationUrl: classHref ? `https://padelteams.pt${classHref}` : undefined,
      teams,
    };
  });

  // --- quadro ---
  const headers = [
    ...html.matchAll(/fs-s bold text-center p-2 border-gradient" style="width:250px;">([^<]+)<\/div>/g),
  ].map((m) => m[1].trim());
  const matchBlocks = [...html.matchAll(/<div class="match border item-link[^"]*">([\s\S]*?)<\/a>/g)].map((m) => m[1]);
  const byPrefix = new Map<number, BracketMatch[]>();
  for (const block of matchBlocks) {
    const code = block.match(/<div class="text-bold p-0">\s*([\d.]+)\s*<\/div>/)?.[1];
    const teamEls = [...block.matchAll(/<span class="team-name([^"]*)">([\s\S]*?)<\/span>/g)];
    if (!code || teamEls.length < 2) continue;
    const prefix = Number(code.split(".")[0]);
    const winner: 1 | 2 | undefined = /\bwinner\b/.test(teamEls[0][1])
      ? 1
      : /\bwinner\b/.test(teamEls[1][1])
        ? 2
        : undefined;
    const arr = byPrefix.get(prefix) ?? [];
    arr.push({
      code,
      team1: stripTags(teamEls[0][2]),
      team2: stripTags(teamEls[1][2]),
      sets: parseSets(block),
      winner,
    });
    byPrefix.set(prefix, arr);
  }
  // Os cabeçalhos vêm da final para trás (Final, 1/2, 1/4…); os números dos jogos crescem para a final.
  const prefixes = [...byPrefix.keys()].sort((a, b) => a - b);
  const namesAsc = [...headers].reverse();
  const rounds: BracketRound[] = prefixes.map((p, i) => ({
    name: namesAsc[i] ?? `Ronda ${i + 1}`,
    matches: byPrefix.get(p)!.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true })),
  }));

  const statsAt = html.indexOf("Estatisticas");
  const text = stripTags(statsAt >= 0 ? html.slice(statsAt) : html);
  const st = text.match(/(\d+)\s+Pendente\s+(\d+)\s+Programado\s+(\d+)\s+Em Jogo\s+(\d+)\s+Terminado/i);
  const stats = st
    ? { pendente: Number(st[1]), programado: Number(st[2]), emJogo: Number(st[3]), terminado: Number(st[4]) }
    : undefined;

  return { options, groups, rounds, stats };
}

/** "Classificação Provisória" de um grupo: J, V, D, jogos ganhos/perdidos por dupla. */
export function parseGroupClassification(html: string): Map<string, Partial<GroupTeam>> {
  const out = new Map<string, Partial<GroupTeam>>();
  // A posição vem num "badge" nas duplas que passam; nas restantes é só o número.
  const rows = [
    ...html.matchAll(/<tr>\s*<td[^>]*>\s*(?:<div class="badge[^"]*">)?\s*(\d+)\s*(?:<\/div>)?\s*<\/td>([\s\S]*?)<\/tr>/g),
  ];
  for (const r of rows) {
    const cells = [...r[2].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => stripTags(c[1]));
    if (cells.length < 6) continue;
    const [name, j, v, d, pg, ps] = cells;
    out.set(name, {
      played: Number(j),
      won: Number(v),
      lost: Number(d),
      gamesFor: Number(pg),
      gamesAgainst: Number(ps),
    });
  }
  return out;
}

async function fetchHtml(url: string, revalidateSeconds: number): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: revalidateSeconds } });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/**
 * Grupos e quadro de todas as categorias de uma competição. Devolve [] em qualquer falha.
 * Só busca a classificação provisória dos grupos que já começaram.
 */
export async function fetchPadelteamsCategories(cid: string, revalidateSeconds = 30): Promise<CategoryInfo[]> {
  try {
    const firstHtml = await fetchHtml(
      `https://padelteams.pt/info/tournaments?k=${encodeK(`cid=${cid}`)}`,
      revalidateSeconds
    );
    if (!firstHtml) return [];
    const first = parseCategoryPage(firstHtml);
    if (first.options.length === 0) return [];
    const firstTid = first.options.find((o) => o.selected)?.tid ?? first.options[0].tid;

    const pages = await Promise.all(
      first.options.map(async (o) => {
        if (o.tid === firstTid) return { o, page: first };
        const html = await fetchHtml(
          `https://padelteams.pt/info/tournaments?k=${encodeK(`cid=${cid}&tid=${o.tid}`)}`,
          revalidateSeconds
        );
        return { o, page: html ? parseCategoryPage(html) : null };
      })
    );

    const categories: CategoryInfo[] = [];
    for (const { o, page } of pages) {
      if (!page) continue;
      await Promise.all(
        page.groups
          .filter((g) => g.status && g.classificationUrl)
          .map(async (g) => {
            const html = await fetchHtml(g.classificationUrl!, revalidateSeconds);
            if (!html) return;
            const table = parseGroupClassification(html);
            for (const t of g.teams) Object.assign(t, table.get(t.name) ?? {});
          })
      );
      categories.push({ tid: o.tid, name: o.name, groups: page.groups, rounds: page.rounds, stats: page.stats });
    }

    const rank = (n: string) => {
      const i = CATEGORY_ORDER.indexOf(n);
      return i < 0 ? 99 : i;
    };
    return categories.sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}
