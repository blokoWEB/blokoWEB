const fs = require("fs");
const sharp = require("sharp");
const { createClient } = require("@supabase/supabase-js");

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
const MAX_DIMENSION = 1600;
const QUALITY = 72;
const CONCURRENCY = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function listAll(prefix) {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, { limit: 1000 });
  if (error) throw error;
  return data || [];
}

async function compressFile(path) {
  const { data, error } = await supabase.storage.from(BUCKET).download(path);
  if (error) throw error;
  const inputBuffer = Buffer.from(await data.arrayBuffer());
  const originalSize = inputBuffer.length;

  const outputBuffer = await sharp(inputBuffer)
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();

  if (outputBuffer.length >= originalSize) {
    return { path, originalSize, newSize: originalSize, skipped: true };
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, outputBuffer, { contentType: "image/jpeg", upsert: true });
  if (uploadError) throw uploadError;

  return { path, originalSize, newSize: outputBuffer.length, skipped: false };
}

async function compressFileWithRetry(path, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await compressFile(path);
    } catch (err) {
      if (attempt === retries) return { path, error: err.message };
      await sleep(1000 * attempt);
    }
  }
}

async function processBatch(paths) {
  const results = [];
  for (let i = 0; i < paths.length; i += CONCURRENCY) {
    const chunk = paths.slice(i, i + CONCURRENCY);
    const chunkResults = await Promise.all(chunk.map((p) => compressFileWithRetry(p)));
    results.push(...chunkResults);
    await sleep(150);
  }
  return results;
}

async function main() {
  const types = await listAll("");
  let totalOriginal = 0;
  let totalNew = 0;
  let totalFiles = 0;
  let totalErrors = 0;

  for (const t of types) {
    const slugs = await listAll(t.name);
    for (const s of slugs) {
      const fullPath = `${t.name}/${s.name}/full`;
      const files = await listAll(fullPath);
      const imageFiles = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name));
      if (imageFiles.length === 0) continue;

      console.log(`\n=== ${fullPath} (${imageFiles.length} files) ===`);
      const paths = imageFiles.map((f) => `${fullPath}/${f.name}`);
      const results = await processBatch(paths);

      let folderOriginal = 0;
      let folderNew = 0;
      for (const r of results) {
        totalFiles++;
        if (r.error) {
          totalErrors++;
          console.log(`  ERROR ${r.path}: ${r.error}`);
          continue;
        }
        folderOriginal += r.originalSize;
        folderNew += r.newSize;
      }
      totalOriginal += folderOriginal;
      totalNew += folderNew;
      console.log(
        `  ${(folderOriginal / 1024 / 1024).toFixed(1)}MB -> ${(folderNew / 1024 / 1024).toFixed(1)}MB`
      );
    }
  }

  console.log(`\n=== TOTAL ===`);
  console.log(`Files processed: ${totalFiles}, errors: ${totalErrors}`);
  console.log(`${(totalOriginal / 1024 / 1024).toFixed(1)}MB -> ${(totalNew / 1024 / 1024).toFixed(1)}MB`);
  console.log(`Saved: ${((totalOriginal - totalNew) / 1024 / 1024).toFixed(1)}MB`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
