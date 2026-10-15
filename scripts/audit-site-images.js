/**
 * Mede o peso das imagens de cada página do site (o que um telemóvel descarrega).
 *
 *   node scripts/audit-site-images.js [base-url]      (por omissão http://localhost:3000)
 *
 * Percorre o sitemap, lê o HTML de cada página e soma as imagens que lá estão:
 *  - <img> do next/image: escolhe a variante que um telemóvel de 390 px com ecrã 2x pede (~780 px);
 *  - fundos CSS (url(...) em style="…", como o topo das páginas): o ficheiro inteiro, sem otimizar;
 *  - <video poster> e <source>: o vídeo conta à parte (é streaming).
 * Marca a vermelho o que passa dos limites: página > 1,5 MB de imagens ou imagem > 400 KB.
 */
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const PAGE_LIMIT = 1.5 * 1048576;
const IMAGE_LIMIT = 400 * 1024;

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"');

function pickFromSrcset(srcset) {
  const items = srcset.split(",").map((s) => s.trim().split(/\s+/)).filter((p) => p[0]);
  if (items.length === 0) return null;
  const withW = items.filter((p) => /^\d+w$/.test(p[1] || ""));
  if (withW.length) {
    const sorted = withW.map((p) => ({ url: p[0], w: parseInt(p[1]) })).sort((a, b) => a.w - b.w);
    return (sorted.find((x) => x.w >= 780) || sorted[sorted.length - 1]).url;
  }
  const x2 = items.find((p) => p[1] === "2x");
  return (x2 || items[items.length - 1])[0];
}

async function size(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return { bytes: 0, status: res.status };
    const buf = await res.arrayBuffer();
    return { bytes: buf.byteLength, status: res.status };
  } catch {
    return { bytes: 0, status: 0 };
  }
}

const abs = (u) => (u.startsWith("http") ? u : BASE + (u.startsWith("/") ? "" : "/") + u);

(async () => {
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const pages = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const cache = new Map();
  const measure = async (u) => {
    if (!cache.has(u)) cache.set(u, await size(abs(u)));
    return cache.get(u);
  };

  const rows = [];
  const videos = new Set();
  for (const p of [...new Set(pages)]) {
    let html;
    try {
      html = await (await fetch(BASE + p)).text();
    } catch {
      continue;
    }
    const found = new Map(); // url -> tipo
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
      const tag = m[0];
      const srcset = tag.match(/srcSet="([^"]*)"|srcset="([^"]*)"/i);
      const src = tag.match(/\bsrc="([^"]*)"/i);
      const url = srcset ? pickFromSrcset(decode(srcset[1] || srcset[2])) : src && decode(src[1]);
      if (url && !url.startsWith("data:")) found.set(url, "img");
    }
    // O topo das páginas tem duas variantes (telemóvel e computador); conta só a mais leve, que é a
    // que um telemóvel descarrega (a outra está em display:none e o browser não a pede).
    const bgByOrigin = new Map();
    for (const m of html.matchAll(/url\(([^)]+)\)/g)) {
      const u = decode(m[1].replace(/^(?:&quot;|["'])+|(?:&quot;|["'])+$/g, ""));
      const optimized = u.includes("/_next/image?");
      if ((optimized || /\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(u)) && !u.startsWith("data:")) {
        const origin = optimized ? decodeURIComponent((u.match(/[?&]url=([^&]+)/) || [])[1] || u) : u;
        const w = optimized ? parseInt((u.match(/[?&]w=(\d+)/) || [])[1] || "0") : 0;
        const prev = bgByOrigin.get(origin);
        if (!prev || w < prev.w) bgByOrigin.set(origin, { u, w });
      }
    }
    for (const { u } of bgByOrigin.values()) found.set(u, "fundo CSS");
    for (const m of html.matchAll(/<video\b[^>]*poster="([^"]+)"/g)) found.set(decode(m[1]), "poster");
    for (const m of html.matchAll(/<source\b[^>]*src="([^"]+\.(?:mp4|webm))"/g)) videos.add(decode(m[1]));

    let total = 0;
    const items = [];
    for (const [url, kind] of found) {
      const r = await measure(url);
      total += r.bytes;
      items.push({ url, kind, ...r });
    }
    items.sort((a, b) => b.bytes - a.bytes);
    rows.push({ page: p, total, items });
  }

  rows.sort((a, b) => b.total - a.total);
  const kb = (b) => `${(b / 1024).toFixed(0)} KB`.padStart(8);
  let problems = 0;
  for (const r of rows) {
    const bad = r.total > PAGE_LIMIT || r.items.some((i) => i.bytes > IMAGE_LIMIT) || r.items.some((i) => i.status && i.status >= 400);
    if (bad) problems++;
    console.log(`${bad ? "!!" : "ok"} ${kb(r.total)}  ${r.page}  (${r.items.length} imagens)`);
    for (const i of r.items.filter((i) => i.bytes > IMAGE_LIMIT || i.status >= 400 || i.status === 0).slice(0, 4)) {
      console.log(`        ${kb(i.bytes)}  ${i.kind.padEnd(9)} ${i.status >= 400 || i.status === 0 ? `[HTTP ${i.status}] ` : ""}${i.url.slice(0, 110)}`);
    }
  }
  if (videos.size) {
    console.log("\nvídeos (streaming, não contam para o total):");
    for (const v of videos) console.log(`  ${kb((await measure(v)).bytes)}  ${v}`);
  }
  const allBytes = new Map();
  for (const r of rows) for (const i of r.items) allBytes.set(i.url, i.bytes);
  console.log(`\n${rows.length} páginas | ${problems} com avisos (limite: página ${PAGE_LIMIT / 1048576} MB, imagem ${IMAGE_LIMIT / 1024} KB)`);
  process.exit(problems ? 2 : 0);
})();
