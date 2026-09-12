import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createAdminSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const { username, password, remember } = await request.json().catch(() => ({}));

  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedHashB64 = process.env.ADMIN_PASSWORD_HASH_B64;

  if (!expectedUser || !expectedHashB64) {
    return NextResponse.json(
      { error: "Admin não configurado no servidor." },
      { status: 500 }
    );
  }

  const expectedHash = Buffer.from(expectedHashB64, "base64").toString("utf8");

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const userMatches = username === expectedUser;
  const passMatches = await bcrypt.compare(password, expectedHash);

  if (!userMatches || !passMatches) {
    return NextResponse.json(
      { error: "Utilizador ou palavra-passe incorretos." },
      { status: 401 }
    );
  }

  await createAdminSessionCookie(remember === true);
  return NextResponse.json({ ok: true });
}
