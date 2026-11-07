import bcrypt from "bcryptjs";

const password = process.argv[2];
// Nome da variável: ADMIN_PASSWORD_HASH_B64 (admin, por defeito) ou PT_PASSWORD_HASH_B64 (professores).
const variable = process.argv[3] || "ADMIN_PASSWORD_HASH_B64";
if (!password) {
  console.error('Uso: node scripts/hash-password.mjs "a-tua-password" [PT_PASSWORD_HASH_B64]');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
// Guardado em base64: um hash bcrypt em texto simples tem "$2b$10$...",
// e o carregador de .env do Next.js interpreta "$2b"/"$10" como variáveis
// de ambiente, corrompendo o valor. Base64 evita esse problema.
const encoded = Buffer.from(hash, "utf8").toString("base64");
console.log("\n" + variable + "=" + encoded + "\n");
