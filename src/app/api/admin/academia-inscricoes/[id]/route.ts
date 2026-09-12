import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/admin/academia-inscricoes/[id]">
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("academia_inscricoes").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
