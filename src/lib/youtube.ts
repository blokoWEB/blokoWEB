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

/**
 * Últimos vídeos do canal, pelo feed RSS público do YouTube (sem chave de API).
 * Devolve [] em qualquer falha — nunca rebenta a página.
 */
export async function fetchLatestVideos(opts?: {
  limit?: number;
  filter?: string;
}): Promise<YoutubeVideo[]> {
  const limit = opts?.limit ?? 6;
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`,
      { next: { revalidate: 300 }, headers: BROWSER_HEADERS }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const all: YoutubeVideo[] = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap((m) => {
      const id = m[1].match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
      const title = m[1].match(/<title>([\s\S]*?)<\/title>/)?.[1];
      const published = m[1].match(/<published>([^<]+)<\/published>/)?.[1];
      return id && title && published ? [{ id, title: prettyTitle(title), published }] : [];
    });

    all.sort((x, y) => new Date(y.published).getTime() - new Date(x.published).getTime());

    const filter = opts?.filter ? normalize(opts.filter) : "";
    const filtered = filter ? all.filter((v) => normalize(v.title).includes(filter)) : all;
    return filtered.slice(0, limit);
  } catch {
    return [];
  }
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
