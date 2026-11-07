import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getSecret } from "@/lib/session";
import { PT_IDENTITY_IDLE_SECONDS, PT_SESSION_IDLE_SECONDS, PT_SESSION_MAX_SECONDS } from "@/lib/pt-idle";

/**
 * Sessão partilhada dos professores (área /admin/professores). Um só login para todos; depois de entrar, cada
 * pessoa escolhe quem é e o nome vai para o histórico das aulas. Usa o mesmo segredo do admin mas
 * `role: "teacher"`, por isso nunca abre o painel.
 *
 * Como o login é partilhado, a sessão "expira por inatividade" (tempos em pt-idle.ts): cada pedido ao servidor
 * renova `la` (última atividade); sem uso volta a perguntar quem é e, mais tarde, pede o login outra vez.
 */
export const PT_COOKIE = "bloko_pt_session";

export type PtSessionInfo = {
  teacherId: string | null;
  /** Null enquanto a pessoa não escolheu quem é, ou se esteve parada tempo demais. */
  name: string | null;
  startedAt: number;
};

const nowSeconds = () => Math.floor(Date.now() / 1000);

async function writeCookie(claims: { tid: string | null; name: string | null; st: number; la: number }) {
  const token = await new SignJWT({ role: "teacher", ...claims })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(claims.la + PT_SESSION_IDLE_SECONDS)
    .sign(getSecret());

  const store = await cookies();
  store.set(PT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PT_SESSION_IDLE_SECONDS,
  });
}

/** Abre a sessão (sem nome) ou, ao escolher quem é, atualiza-a mantendo a hora de início. */
export async function createPtSessionCookie(info: { teacherId?: string; name?: string; startedAt?: number } = {}) {
  const now = nowSeconds();
  await writeCookie({ tid: info.teacherId ?? null, name: info.name ?? null, st: info.startedAt ?? now, la: now });
}

export async function clearPtSessionCookie() {
  const store = await cookies();
  store.delete(PT_COOKIE);
}

/** A sessão de professor atual, ou null se não houver / for inválida / tiver expirado por inatividade. */
export async function getPtSession(): Promise<PtSessionInfo | null> {
  const store = await cookies();
  const token = store.get(PT_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "teacher") return null;
    const now = nowSeconds();
    const started = typeof payload.st === "number" ? payload.st : 0;
    const last = typeof payload.la === "number" ? payload.la : 0;
    if (now - started > PT_SESSION_MAX_SECONDS || now - last > PT_SESSION_IDLE_SECONDS) return null;
    const identityValid = now - last <= PT_IDENTITY_IDLE_SECONDS;
    return {
      teacherId: identityValid && typeof payload.tid === "string" ? payload.tid : null,
      name: identityValid && typeof payload.name === "string" ? payload.name : null,
      startedAt: started,
    };
  } catch {
    return null;
  }
}

/** Renova a "última atividade" (só se a pessoa já escolheu quem é e não está parada tempo demais). */
export async function touchPtSession(session: PtSessionInfo) {
  if (!session.name) return;
  await writeCookie({ tid: session.teacherId, name: session.name, st: session.startedAt, la: nowSeconds() });
}
