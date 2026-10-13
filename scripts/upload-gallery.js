/**
 * Prepara e envia fotos para a galeria (bucket "gallery" do Supabase).
 *
 *   node scripts/upload-gallery.js <pasta-local> <destino> [--upload] [--out <pasta>]
 *
 * <destino> = torneios/<slug>/<dia>  (ex.: torneios/torneio-social-outubro-2026/dia-1)
 * Cada foto gera <destino>/full/<nome>.jpg (1600 px, mozjpeg) e <destino>/thumb/<nome>.jpg (500 px).
 *
 * Sem --upload só simula: calcula tamanhos e a previsão de uso. Com --out grava o resultado numa
 * pasta local para inspeção. Com --upload recusa enviar se a previsão passar de 85 % do plano gratuito.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const positional = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--out");
const [srcDir, dest] = positional;
const UPLOAD = flag("--upload");
const OUT_DIR = opt("--out");

if (!srcDir || !dest || !/^(torneios|eventos)\/[a-z0-9-]+\/[a-z0-9-]+$/.test(dest)) {
  console.error("Uso: node scripts/upload-gallery.js <pasta-local> <torneios|eventos>/<slug>/<dia> [--upload] [--out <pasta>]");
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).trim()];
    })
);
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = "gallery";

const FULL_EDGE = 1600;
const FULL_QUALITY = 72;
const THUMB_EDGE = 500;
const THUMB_QUALITY = 70;
const CONCURRENCY = 3;

const PLAN_BYTES = 1024 ** 3; // plano gratuito: 1 GB
const LIMIT = 0.85;
// O painel do Supabase mostra ~15 % mais do que a soma dos ficheiros que a API lista.
const DASHBOARD_FACTOR = 1.15;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mb = (b) => (b / 1048576).toFixed(1);

function safeName(file) {
  const base = path.parse(file).name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^A-Za-z0-9._-]/g, "_");
  return `${base}.jpg`;
}

async function bucketUsage() {
  let total = 0;
  async function walk(prefix) {
    let offset = 0;
    for (;;) {
      const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000, offset });
      if (error) throw error;
      for (const it of data || []) {
        const p = prefix ? `${prefix}/${it.name}` : it.name;
        if (it.id === null) await walk(p);
        else total += it.metadata?.size ?? 0;
      }
      if (!data || data.length < 1000) break;
      offset += 1000;
    }
  }
  await walk("");
  return total;
}

async function existingNames(kind) {
  const names = new Set();
  let offset = 0;
  for (;;) {
    const { data, error } = await supabase.storage.from(BUCKET).list(`${dest}/${kind}`, { limit: 1000, offset });
    if (error || !data) break;
    for (const it of data) if (it.id !== null) names.add(it.name);
    if (data.length < 1000) break;
    offset += 1000;
  }
  return names;
}

async function makeVersions(file) {
  const input = fs.readFileSync(path.join(srcDir, file));
  if (input.length === 0) throw new Error("ficheiro vazio");
  const base = sharp(input).rotate();
  const [full, thumb] = await Promise.all([
    base
      .clone()
      .resize({ width: FULL_EDGE, height: FULL_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: FULL_QUALITY, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toBuffer(),
    base
      .clone()
      .resize({ width: THUMB_EDGE, height: THUMB_EDGE, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: THUMB_QUALITY, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toBuffer(),
  ]);
  return { full, thumb };
}

async function uploadWithRetry(p, buf, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { error } = await supabase.storage.from(BUCKET).upload(p, buf, { contentType: "image/jpeg", upsert: false });
    if (!error) return null;
    if (/already exists|Duplicate/i.test(error.message)) return "já existe";
    if (attempt === retries) return error.message;
    await sleep(1000 * attempt);
  }
}

async function main() {
  const files = fs.readdirSync(srcDir).filter((f) => /\.jpe?g$/i.test(f)).sort();
  if (files.length === 0) throw new Error("Sem JPEGs em " + srcDir);

  // nomes finais únicos (dois ficheiros não podem ficar com o mesmo nome depois de limpar)
  const seen = new Set();
  const items = files.map((f) => {
    let name = safeName(f);
    while (seen.has(name)) name = name.replace(/\.jpg$/, "_x.jpg");
    seen.add(name);
    return { file: f, name };
  });

  console.log(`${items.length} fotos em ${srcDir} -> ${dest}`);
  const results = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const chunk = items.slice(i, i + CONCURRENCY);
    const done = await Promise.all(
      chunk.map(async (it) => {
        try {
          return { ...it, ...(await makeVersions(it.file)) };
        } catch (e) {
          return { ...it, error: e.message };
        }
      })
    );
    results.push(...done);
  }

  const good = results.filter((r) => !r.error);
  const bad = results.filter((r) => r.error);
  const fullBytes = good.reduce((n, r) => n + r.full.length, 0);
  const thumbBytes = good.reduce((n, r) => n + r.thumb.length, 0);
  const newBytes = fullBytes + thumbBytes;
  console.log(
    `prontas: ${good.length} | com erro: ${bad.length} | grandes ${mb(fullBytes)} MB (média ${(fullBytes / good.length / 1024).toFixed(0)} KB) | miniaturas ${mb(thumbBytes)} MB (média ${(thumbBytes / good.length / 1024).toFixed(0)} KB) | novo total ${mb(newBytes)} MB`
  );
  for (const r of bad) console.log("  ERRO", r.file, "-", r.error);

  if (OUT_DIR) {
    for (const r of good) {
      for (const kind of ["full", "thumb"]) {
        const dir = path.join(OUT_DIR, kind);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, r.name), r[kind]);
      }
    }
    console.log("gravado em", OUT_DIR);
  }

  const current = await bucketUsage();
  const projected = current * DASHBOARD_FACTOR + newBytes;
  console.log(
    `uso atual (API) ${mb(current)} MB (~${mb(current * DASHBOARD_FACTOR)} MB no painel) | previsão depois ${mb(projected)} MB = ${((projected / PLAN_BYTES) * 100).toFixed(1)} % do plano (limite do script: ${LIMIT * 100} %)`
  );

  if (!UPLOAD) {
    console.log("Simulação: nada foi enviado. Usa --upload para enviar.");
    return;
  }
  if (projected > PLAN_BYTES * LIMIT) {
    console.error("RECUSADO: o envio passaria o limite de segurança. Nada foi enviado.");
    process.exit(2);
  }

  const have = new Set([...(await existingNames("full"))]);
  let uploaded = 0;
  const failed = [];
  for (let i = 0; i < good.length; i += CONCURRENCY) {
    const chunk = good.slice(i, i + CONCURRENCY);
    await Promise.all(
      chunk.map(async (r) => {
        if (have.has(r.name)) return failed.push(`${r.name}: já existe no destino, não substituído`);
        const e1 = await uploadWithRetry(`${dest}/full/${r.name}`, r.full);
        const e2 = await uploadWithRetry(`${dest}/thumb/${r.name}`, r.thumb);
        if (e1 || e2) failed.push(`${r.name}: ${e1 || ""} ${e2 || ""}`.trim());
        else uploaded++;
      })
    );
    await sleep(150);
    if ((i / CONCURRENCY) % 10 === 0) console.log(`  ${Math.min(i + CONCURRENCY, good.length)}/${good.length}`);
  }
  console.log(`enviadas: ${uploaded} | falhadas: ${failed.length}`);
  for (const f of failed) console.log("  FALHOU", f);
  const after = await bucketUsage();
  console.log(`uso depois (API): ${mb(after)} MB (~${((after * DASHBOARD_FACTOR / PLAN_BYTES) * 100).toFixed(1)} % do plano)`);
}

main().catch((e) => {
  console.error("ERRO", e.message || e);
  process.exit(1);
});
