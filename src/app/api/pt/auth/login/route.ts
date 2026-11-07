import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createPtSessionCookie } from "@/lib/pt-session";

export const dynamic = "force-dynamic";

/** Login partilhado dos professores (um só utilizador e palavra-passe para todos). */
export async function POST(request: Request) {
  const { username, password, remember } = await request.json().catch(() => ({}));

  const expectedUser = process.env.PT_USERNAME;
  const expectedHashB64 = process.env.PT_PASSWORD_HASH_B64;
  if (!expectedUser || !expectedHashB64) {
    return NextResponse.json({ error: "O acesso dos professores ainda não está configurado." }, { status: 500 });
  }
  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const expectedHash = Buffer.from(expectedHashB64, "base64").toString("utf8");
  const userMatches = username.trim().toLowerCase() === expectedUser.trim().toLowerCase();
  const passMatches = await bcrypt.compare(password, expectedHash);
  if (!userMatches || !passMatches) {
    return NextResponse.json({ error: "Utilizador ou palavra-passe incorretos." }, { status: 401 });
  }

  // Ainda sem nome: o professor escolhe quem é no passo seguinte.
  await createPtSessionCookie({ remember: remember === true });
  return NextResponse.json({ ok: true });
}
