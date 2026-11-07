import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createPtSessionCookie } from "@/lib/pt-session";

export const dynamic = "force-dynamic";

/**
 * Login partilhado dos professores e funcionários. Aceita o utilizador/palavra-passe do admin
 * (ADMIN_USERNAME / ADMIN_PASSWORD_HASH_B64) e, se existirem, um par próprio (PT_USERNAME / PT_PASSWORD_HASH_B64).
 * Mesmo entrando com as credenciais do admin por aqui, a sessão é só de professor (calendário de aulas/PTs).
 */
export async function POST(request: Request) {
  const { username, password } = await request.json().catch(() => ({}));

  const accepted = [
    [process.env.PT_USERNAME, process.env.PT_PASSWORD_HASH_B64],
    [process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD_HASH_B64],
  ].filter((c): c is [string, string] => Boolean(c[0] && c[1]));
  if (accepted.length === 0) {
    return NextResponse.json({ error: "O acesso dos professores ainda não está configurado." }, { status: 500 });
  }
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  // Compara sempre com todos (sem parar no primeiro) para o tempo de resposta não revelar nada.
  let valid = false;
  for (const [user, hashB64] of accepted) {
    const hash = Buffer.from(hashB64, "base64").toString("utf8");
    const userMatches = username.trim().toLowerCase() === user.trim().toLowerCase();
    const passMatches = await bcrypt.compare(password, hash);
    if (userMatches && passMatches) valid = true;
  }
  if (!valid) {
    return NextResponse.json({ error: "Utilizador ou palavra-passe incorretos." }, { status: 401 });
  }

  // Ainda sem nome: o professor escolhe quem é no passo seguinte.
  await createPtSessionCookie();
  return NextResponse.json({ ok: true });
}
