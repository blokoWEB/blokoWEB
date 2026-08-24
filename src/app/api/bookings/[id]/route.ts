import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/bookings/[id]">
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const { attended, cancelled } = body;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .update({
      ...(attended !== undefined && { attended }),
      ...(cancelled !== undefined && { cancelled }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
