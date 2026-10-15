/**
 * Reduz as fotos pesadas de public/ (as que vêm direto da câmara/Lightroom).
 *
 *   node scripts/optimize-images.js            simula e lista o que faria
 *   node scripts/optimize-images.js --apply    aplica (guarda os originais em ./.imagens-originais, fora do git)
 *
 * Regras: JPEG com mais de 1,5 MB ou lado maior > 3200 px -> lado maior 2560 px, mozjpeg q78,
 * orientação EXIF aplicada (as proporções não mudam). Outras imagens > 600 KB só são listadas
 * (PNG/WebP podem ter transparência ou ser cartazes: decidir caso a caso).
 *
 * Esta pasta serve de entrada ao otimizador do Next, mas fundos CSS e <video poster> chegam ao
 * browser sem passar por ele: ver src/lib/images.ts (optimizedImageUrl).
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(process.cwd(), "public");
const BACKUP = path.join(process.cwd(), ".imagens-originais");
const BIG_BYTES = 1.5 * 1048576;
const REVIEW_BYTES = 600 * 1024;
const MAX_EDGE = 2560;
const QUALITY = 78;
const apply = process.argv.includes("--apply");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );
}

(async () => {
  let saved = 0;
  const review = [];
  for (const file of walk(ROOT)) {
    if (!/\.(jpe?g|png|webp|avif)$/i.test(file)) continue;
    const size = fs.statSync(file).size;
    const rel = path.relative(process.cwd(), file);
    const isJpeg = /\.jpe?g$/i.test(file);
    let meta;
    try {
      meta = await sharp(file).metadata();
    } catch {
      continue;
    }
    const longEdge = Math.max(meta.width || 0, meta.height || 0);
    if (isJpeg && (size > BIG_BYTES || longEdge > MAX_EDGE * 1.25)) {
      const out = await sharp(file)
        .rotate()
        .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toBuffer({ resolveWithObject: true });
      if (out.data.length >= size) continue;
      saved += size - out.data.length;
      console.log(`${apply ? "REDUZIDA " : "reduziria"} ${rel}  ${meta.width}x${meta.height} ${(size / 1048576).toFixed(1)} MB -> ${out.info.width}x${out.info.height} ${(out.data.length / 1024).toFixed(0)} KB`);
      if (apply) {
        const bak = path.join(BACKUP, path.relative(ROOT, file));
        fs.mkdirSync(path.dirname(bak), { recursive: true });
        if (!fs.existsSync(bak)) fs.copyFileSync(file, bak);
        fs.writeFileSync(file, out.data);
      }
    } else if (size > REVIEW_BYTES) {
      review.push(`${rel}  ${meta.width}x${meta.height}  ${(size / 1024).toFixed(0)} KB`);
    }
  }
  console.log(`\n${apply ? "Poupado" : "Poupariam"}: ${(saved / 1048576).toFixed(1)} MB`);
  if (review.length) {
    console.log("\nAcima de 600 KB (rever à mão; não são JPEG pesados de câmara):");
    for (const r of review) console.log("  " + r);
  }
  if (apply && saved > 0) console.log("\nOriginais guardados em .imagens-originais/ (não vai para o git).");
})();
