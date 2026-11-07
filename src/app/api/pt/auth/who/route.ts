import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createPtSessionCookie, getPtSession } from "@/lib/pt-session";
import { listTeachers } from "@/lib/pt-service";

export const dynamic = "force-dynamic";

/** Depois de entrar, o professor diz quem é (só para o histórico: o nome fica registado em cada alteração). */
export async function POST(request: Request) {
  const session = await getPtSession();
  if (!session) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { teacher_id } = await request.json().catch(() => ({}));
  if (typeof teacher_id !== "string") {
    return NextResponse.json({ error: "Escolhe o teu nome." }, { status: 400 });
  }

  try {
    const teacher = (await listTeachers(getSupabaseAdmin())).find((t) => t.id === teacher_id && t.active);
    if (!teacher) return NextResponse.json({ error: "Professor não encontrado." }, { status: 404 });
    await createPtSessionCookie({ teacherId: teacher.id, name: teacher.name, remember: session.remember });
    return NextResponse.json({ ok: true, name: teacher.name });
  } catch (e) {
    console.error("[pt/who]", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro inesperado." }, { status: 500 });
  }
}
