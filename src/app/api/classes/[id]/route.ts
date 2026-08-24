import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  ctx: RouteContext<"/api/classes/[id]">
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await request.json().catch(() => ({}));
  const {
    category,
    title,
    description,
    starts_at,
    duration_minutes,
    capacity,
    location,
    instructor,
    scope,
  } = body;

  const supabase = getSupabaseAdmin();

  if (scope === "series") {
    const { data: current, error: currentError } = await supabase
      .from("class_sessions")
      .select("series_id")
      .eq("id", id)
      .single();

    if (currentError) {
      return NextResponse.json({ error: currentError.message }, { status: 500 });
    }

    if (!current?.series_id) {
      return NextResponse.json(
        { error: "Esta aula não faz parte de uma série recorrente." },
        { status: 400 }
      );
    }

    // starts_at é intencionalmente ignorado aqui: cada ocorrência mantém a sua própria data.
    const { data, error } = await supabase
      .from("class_sessions")
      .update({
        ...(category !== undefined && { category }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(duration_minutes !== undefined && { duration_minutes }),
        ...(capacity !== undefined && { capacity }),
        ...(location !== undefined && { location }),
        ...(instructor !== undefined && { instructor }),
      })
      .eq("series_id", current.series_id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ sessions: data });
  }

  const { data, error } = await supabase
    .from("class_sessions")
    .update({
      ...(category !== undefined && { category }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(starts_at !== undefined && { starts_at }),
      ...(duration_minutes !== undefined && { duration_minutes }),
      ...(capacity !== undefined && { capacity }),
      ...(location !== undefined && { location }),
      ...(instructor !== undefined && { instructor }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/classes/[id]">
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("class_sessions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
