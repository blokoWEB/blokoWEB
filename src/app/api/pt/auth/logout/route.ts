import { NextResponse } from "next/server";
import { clearPtSessionCookie } from "@/lib/pt-session";

export const dynamic = "force-dynamic";

/** Sair da área dos professores (só apaga o cookie `bloko_pt_session`). */
export async function POST() {
  await clearPtSessionCookie();
  return NextResponse.json({ ok: true });
}
