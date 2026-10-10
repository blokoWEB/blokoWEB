import { site } from "@/lib/site-data";

/** Canal "BLOKO - Padel, Gym & Lounge" (o @ do site leva a este id). */
export const YOUTUBE_CHANNEL_ID = "UC7PaC3zNAHbBPwIbrsoHPUg";
export const youtubeChannelUrl = site.youtubeUrl;
export const youtubeLiveUrl = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`;

export type YoutubeVideo = {
  id: string;
  title: string;
  /** Data ISO de publicação (para diretos, quando o direto foi criado). */
  published: string;
};

export type YoutubeFeed = {
  updatedAt: string;
  videos: YoutubeVideo[];
  /** Diretos a decorrer neste momento (pode haver vários: um por campo). */
  live: YoutubeVideo[];
};

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept-Language": "pt-PT,pt;q=0.9",
  // Evita a página de consentimento de cookies do YouTube nas respostas.
  Cookie: "CONSENT=YES+cb; SOCS=CAI",
};

function decodeXml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'");
}

const LOWER_WORDS = new Set(["de", "do", "da", "dos", "das", "e", "a", "o", "no", "na", "em"]);

/** Limpa títulos como "QUINTA 08 -  -  CAMPO ..." e converte MAIÚSCULAS em Título. */
export function prettyTitle(raw: string): string {
  let t = decodeXml(raw).replace(/\s*-\s*(?:-\s*)+/g, " - ").replace(/\s+/g, " ").trim();
  const letters = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
  const upper = letters.length > 0 && letters === letters.toUpperCase();
  if (upper) {
    t = t
      .toLowerCase()
      .split(" ")
      .map((w, i) => (i > 0 && LOWER_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(" ")
      .replace(/Mcdonald's/g, "McDonald's");
  }
  return t;
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

async function fetchVideosFromRss(): Promise<YoutubeVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      { next: { revalidate: 300 }, headers: BROWSER_HEADERS }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap((m) => {
      const id = m[1].match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const title = m[1].match(/<title>([\s\S]*?)<\/title>/)?.[1];
      const published = m[1].match(/<published>([^<]+)<\/published>/)?.[1];
      return id && title && published ? [{ id, title: prettyTitle(title), published }] : [];
    });
  } catch {
    return [];
  }
}

const RELATIVE_UNITS: [RegExp, number][] = [
  [/^seg/i, 1_000],
  [/^min/i, 60_000],
  [/^h/i, 3_600_000],
  [/^dia/i, 86_400_000],
  [/^semana/i, 7 * 86_400_000],
  [/^m[eê]s/i, 30 * 86_400_000],
  [/^ano/i, 365 * 86_400_000],
];

/** "Transmitido há 2 h" / "há 1 dia" → milissegundos passados; null se não houver data relativa. */
function relativeAgeMs(texts: string[]): number | null {
  for (const t of texts) {
    const m = t.match(/há\s+(\d+)\s*([^\s\d]+)/i);
    if (!m) continue;
    const unit = RELATIVE_UNITS.find(([re]) => re.test(m[2]));
    if (unit) return Number(m[1]) * unit[1];
  }
  return null;
}

const unescapeJson = (raw: string): string => {
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return raw;
  }
};

/**
 * Lê a lista de vídeos da página do canal (usada quando o feed RSS falha). A página só dá a
 * idade aproximada ("há 2 h"), por isso `published` é uma estimativa — chega para ordenar e
 * para escolher os vídeos das últimas horas onde se procuram diretos.
 */
export function parseChannelPage(html: string, now = Date.now()): YoutubeVideo[] {
  const starts = [...html.matchAll(/"richItemRenderer":\{"content":\{"lockupViewModel":\{/g)].map(
    (m) => m.index!
  );
  return starts.flatMap((start, i) => {
    const entry = html.slice(start, starts[i + 1] ?? start + 20_000);
    const id = entry.match(/"contentId":"([\w-]{11})"/)?.[1];
    const k = entry.indexOf('"lockupMetadataViewModel"');
    if (!id || k < 0) return [];

    const rawTitle = entry
      .slice(k)
      .match(/^"lockupMetadataViewModel":\{"title":\{"content":"((?:[^"\\]|\\.)*)"/)?.[1];
    if (!rawTitle) return [];

    const end = entry.indexOf('"delimiter"', k);
    const meta = entry.slice(k, end > k ? end : k + 1500);
    const texts = [...meta.matchAll(/"text":\{"content":"((?:[^"\\]|\\.)*)"/g)].map((m) =>
      unescapeJson(m[1])
    );
    const badges = [...entry.matchAll(/"thumbnailBadgeViewModel":\{"text":"([^"]*)"/g)].map(
      (m) => m[1]
    );

    const ageMs = relativeAgeMs(texts);
    const liveish =
      texts.some((t) => /a assistir|em direto|ao vivo|estreia/i.test(t)) ||
      badges.some((b) => /direto|ao vivo|live/i.test(b));
    // Sem data relativa só interessa se parecer um direto (a decorrer ou marcado).
    if (ageMs === null && !liveish) return [];

    return [
      {
        id,
        title: prettyTitle(unescapeJson(rawTitle)),
        published: new Date(now - (ageMs ?? 0)).toISOString(),
      },
    ];
  });
}

let channelPageCache: { at: number; videos: YoutubeVideo[] } | null = null;
const CHANNEL_PAGE_CACHE_MS = 60_000;

async function fetchVideosFromChannelPage(): Promise<YoutubeVideo[]> {
  const now = Date.now();
  if (channelPageCache && now - channelPageCache.at < CHANNEL_PAGE_CACHE_MS) {
    return channelPageCache.videos;
  }
  try {
    const res = await fetch(`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`, {
      // ~1,3 MB: não vai para a cache de dados do Next; guarda-se em memória acima.
      cache: "no-store",
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return channelPageCache?.videos ?? [];
    const videos = parseChannelPage(await res.text(), now);
    if (videos.length === 0) return channelPageCache?.videos ?? [];
    channelPageCache = { at: now, videos };
    return videos;
  } catch {
    return channelPageCache?.videos ?? [];
  }
}

/**
 * Últimos vídeos do canal. Usa o feed RSS público do YouTube (sem chave de API) e, se este
 * falhar (o YouTube devolve 404 por vezes), a página do canal.
 * Devolve [] em qualquer falha — nunca rebenta a página.
 */
export async function fetchLatestVideos(opts?: {
  limit?: number;
  filter?: string;
}): Promise<YoutubeVideo[]> {
  const limit = opts?.limit ?? 6;
  const fromRss = await fetchVideosFromRss();
  const all = fromRss.length > 0 ? fromRss : await fetchVideosFromChannelPage();

  all.sort((x, y) => new Date(y.published).getTime() - new Date(x.published).getTime());

  const filter = opts?.filter ? normalize(opts.filter) : "";
  const filtered = filter ? all.filter((v) => normalize(v.title).includes(filter)) : all;
  return filtered.slice(0, limit);
}

const LIVE_WINDOW_MS = 36 * 60 * 60 * 1000;
const LIVE_CACHE_MS = 45_000;
const LIVE_GRACE_MS = 5 * 60_000;

/** Último estado conhecido de cada vídeo, para uma falha pontual de rede não fazer um direto desaparecer. */
const lastKnown = new Map<string, { live: boolean; at: number }>();
let liveCache: { at: number; key: string; ids: Set<string> } | null = null;

/** true/false conforme a página do vídeo; null se não foi possível saber (rede, bloqueio). */
async function isLiveNow(id: string): Promise<boolean | null> {
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
      // Páginas de ~1,2 MB: não vão para a cache de dados do Next (limite 2 MB); o resultado é guardado aqui.
      cache: "no-store",
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    if (!/"isLiveNow":(true|false)/.test(html)) return null; // página inesperada (consentimento, verificação…)
    return /"isLiveNow":true/.test(html);
  } catch {
    return null;
  }
}

/**
 * Quais dos vídeos recentes estão em direto agora. A BLOKO transmite os 4 campos ao mesmo
 * tempo, por isso podem ser vários. Só vai ver as páginas dos vídeos criados nas últimas
 * 36 h, para não pedir nada ao YouTube quando não há torneio a decorrer.
 */
export async function detectLive(candidates: YoutubeVideo[]): Promise<YoutubeVideo[]> {
  const now = Date.now();
  const recent = candidates
    .filter((v) => now - new Date(v.published).getTime() < LIVE_WINDOW_MS)
    .slice(0, 8);
  if (recent.length === 0) return [];

  const key = recent.map((v) => v.id).join(",");
  if (liveCache && liveCache.key === key && now - liveCache.at < LIVE_CACHE_MS) {
    return recent.filter((v) => liveCache!.ids.has(v.id));
  }

  const results = await Promise.all(recent.map((v) => isLiveNow(v.id)));
  const ids = new Set<string>();
  recent.forEach((v, i) => {
    const r = results[i];
    if (r !== null) {
      lastKnown.set(v.id, { live: r, at: now });
      if (r) ids.add(v.id);
    } else {
      // Não deu para saber: mantém o estado anterior durante alguns minutos.
      const prev = lastKnown.get(v.id);
      if (prev && prev.live && now - prev.at < LIVE_GRACE_MS) ids.add(v.id);
    }
  });
  liveCache = { at: now, key, ids };
  return recent.filter((v) => ids.has(v.id));
}

/** Vídeos recentes + diretos a decorrer, para a rota da API. */
export async function getYoutubeFeed(opts?: { limit?: number; filter?: string }): Promise<YoutubeFeed> {
  // Os diretos procuram-se entre os vídeos mais recentes do canal; depois filtram-se como a lista.
  const latest = await fetchLatestVideos({ limit: 15 });
  const filter = opts?.filter ? normalize(opts.filter) : "";
  const matches = (v: YoutubeVideo) => !filter || normalize(v.title).includes(filter);

  const live = await detectLive(latest.filter(matches));
  const liveIds = new Set(live.map((v) => v.id));
  const videos = latest
    .filter(matches)
    .filter((v) => !liveIds.has(v.id))
    .slice(0, opts?.limit ?? 6);

  return { updatedAt: new Date().toISOString(), videos, live };
}
