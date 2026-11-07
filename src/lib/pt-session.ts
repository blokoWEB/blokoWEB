import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getSecret } from "@/lib/session";

/**
 * Sessão partilhada dos professores (área /admin/professores). Um só utilizador/palavra-passe para todos
 * (PT_USERNAME / PT_PASSWORD_HASH_B64); depois de entrar, cada professor escolhe quem é e o nome vai para o
 * histórico das aulas. Usa o mesmo segredo do admin mas `role: "teacher"`, por isso nunca abre o painel.
 */
export const PT_COOKIE = "bloko_pt_session";
const SESSION_SECONDS = 60 * 60 * 12; // 12 h
const REMEMBER_SECONDS = 60 * 60 * 24 * 30; // 30 dias

export type PtSessionInfo = { teacherId: string | null; name: string | null; remember: boolean };

export async function createPtSessionCookie(info: { teacherId?: string; name?: string; remember: boolean }) {
  const duration = info.remember ? REMEMBER_SECONDS : SESSION_SECONDS;
  const token = await new SignJWT({
    role: "teacher",
    tid: info.teacherId ?? null,
    name: info.name ?? null,
    rem: info.remember,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${duration}s`)
    .sign(getSecret());

  const store = await cookies();
  store.set(PT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: duration,
  });
}

export async function clearPtSessionCookie() {
  const store = await cookies();
  store.delete(PT_COOKIE);
}

/** A sessão de professor atual, ou null se não houver / for inválida. */
export async function getPtSession(): Promise<PtSessionInfo | null> {
  const store = await cookies();
  const token = store.get(PT_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "teacher") return null;
    return {
      teacherId: typeof payload.tid === "string" ? payload.tid : null,
      name: typeof payload.name === "string" ? payload.name : null,
      remember: payload.rem === true,
    };
  } catch {
    return null;
  }
}
