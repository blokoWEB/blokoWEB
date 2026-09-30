export type PadelteamsStats = {
  categorias?: number;
  participantes?: number;
  jogadores?: number;
  ranking?: boolean;
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
