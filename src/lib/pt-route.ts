import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isAdminAuthenticated } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getPtSession } from "@/lib/pt-session";
import { PT_ACTOR, PtError } from "@/lib/pt-service";
import type { PtScope } from "@/lib/pt-types";

/** Corpo JSON de um pedido (objeto vazio se vier inválido). */
export async function readJson(req: Request): Promise<Record<string, unknown>> {
  const body = await req.json().catch(() => null);
  return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
}

export function scopeOf(value: unknown): PtScope {
  return value === "following" ? "following" : "this";
}

type Action = (sb: SupabaseClient, actor: string) => Promise<unknown>;

async function run(action: Action, actor: string, status: number): Promise<NextResponse> {
  try {
    return NextResponse.json(await action(getSupabaseAdmin(), actor), { status });
  } catch (e) {
    if (e instanceof PtError) return NextResponse.json({ error: e.message }, { status: e.status });
    console.error("[pt]", e);
    return NextResponse.json({ error: "Erro inesperado." }, { status: 500 });
  }
}

/**
 * Administração ou professor (login partilhado): valida o login, corre a ação e transforma erros em respostas
 * JSON. `actor` é quem fica no histórico: "Administração" ou o nome que o professor escolheu ao entrar.
 */
export async function withPtUser(action: Action, status = 200): Promise<NextResponse> {
  if (await isAdminAuthenticated()) return run(action, PT_ACTOR, status);
  const teacher = await getPtSession();
  if (teacher) return run(action, teacher.name ?? "Professor", status);
  return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
}

/** Só a administração (ex.: gerir professores). */
export async function withPtAdmin(action: Action, status = 200): Promise<NextResponse> {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  return run(action, PT_ACTOR, status);
}
