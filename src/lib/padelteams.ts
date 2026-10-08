export type PadelteamsStats = {
  categorias?: number;
  participantes?: number;
  jogadores?: number;
  ranking?: boolean;
};

export type ScheduleMatch = {
  time: string;
  tbd: boolean;
  category: string;
  group: string;
  team1: string;
  team2: string;
};

export type ScheduleCourt = {
  court: string;
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
    const res = await fetch(url, { next: { revalidate: 3600 } });
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
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Lê o calendário público de um dia de um torneio da PadelTeams e extrai os
 * jogos ainda por realizar (campo, hora, categoria, equipas), agrupados por
 * campo. Jogos já terminados (que mostram resultado em vez de hora) são
 * ignorados — isto é só para o cronograma, não resultados.
 *
 * `cid` é o id da competição na PadelTeams (visível no "k" da página de
 * inscrição: base64 de "cid=<id>"). Devolve [] em qualquer falha (rede,
 * torneio sem calendário publicado ainda, alteração de markup) — nunca
 * rebenta a página do BLOKO.
 */
export async function fetchPadelteamsDaySchedule(
  cid: string,
  date: string
): Promise<ScheduleCourt[]> {
  try {
    const key = Buffer.from(`cid=${cid}&cur_day=${date}&view=1`).toString("base64");
    const res = await fetch(`https://padelteams.pt/info/calendar?k=${key}`, {
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];
    const html = await res.text();

    const courtHeaderRe =
      /<div class="col-12 text-bold p-1 mt-3 border-bottom">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>\s*<\/div>/g;
    const sections: { name: string; start: number; end: number }[] = [];
    let m: RegExpExecArray | null;
    let lastIndex = -1;
    let lastName: string | null = null;
    while ((m = courtHeaderRe.exec(html)) !== null) {
      if (lastName !== null) sections.push({ name: lastName, start: lastIndex, end: m.index });
      lastName = (stripTags(m[1]).split("|").pop()?.trim() ?? stripTags(m[1])).replace(/`/g, "’");
      lastIndex = courtHeaderRe.lastIndex;
    }
    if (lastName !== null) sections.push({ name: lastName, start: lastIndex, end: html.length });

    const courts: ScheduleCourt[] = sections.map((sec) => {
      const chunk = html.slice(sec.start, sec.end);
      const matchChunks = chunk.split('class="w-100 match-').slice(1);

      const matches: ScheduleMatch[] = [];
      for (const part of matchChunks) {
        const schedMatch = part.match(
          /small text-bold text-success text-center px-2">([\s\S]*?)<\/div>/
        );
        if (!schedMatch) continue; // já terminado (mostra resultado) — não é cronograma

        const parts = schedMatch[1].split("<br>").map((s) => s.trim());
        const rawTime = parts[parts.length - 1] ?? "";
        if (!rawTime) continue;
        // A PadelTeams guarda 00:00–06:59 em jogos ainda sem hora real (eliminatórias por sortear)
        const tbd = /^\d{2}:\d{2}$/.test(rawTime) && rawTime < "07:00";
        const time = tbd ? "A definir" : rawTime;

        const catMatch = part.match(/text-center pt-1 ">\s*([^<]+?)\s*<\/div>/);
        const groupMatch = part.match(/fs-s text-center pb-1">([\s\S]*?)<\/div>/);
        const teamMatches = [...part.matchAll(/team-name [^"]*">([\s\S]*?)<\/div>/g)];

        if (teamMatches.length < 2) continue;

        matches.push({
          time,
          tbd,
          category: catMatch ? stripTags(catMatch[1]) : "",
          group: groupMatch ? stripTags(groupMatch[1]) : "",
          team1: stripTags(teamMatches[0][1]),
          team2: stripTags(teamMatches[1][1]),
        });
      }

      matches.sort((a, b) => Number(a.tbd) - Number(b.tbd) || a.time.localeCompare(b.time));

      return { court: sec.name, matches };
    });

    return courts.filter((c) => c.matches.length > 0);
  } catch {
    return [];
  }
}
