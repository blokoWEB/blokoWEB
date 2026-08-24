import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/session";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id em falta." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings: data });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const { session_id, name, email, member_code } = body;

  if (!session_id || typeof name !== "string" || !name.trim() || typeof email !== "string") {
    return NextResponse.json(
      { error: "Nome, email e aula são obrigatórios." },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: session, error: sessionError } = await supabase
    .from("class_sessions")
    .select("id, capacity, starts_at")
    .eq("id", session_id)
    .single();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Aula não encontrada." }, { status: 404 });
  }

  if (new Date(session.starts_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Esta aula já não aceita marcações." }, { status: 400 });
  }

  const { count, error: countError } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("session_id", session_id)
    .eq("cancelled", false);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count ?? 0) >= session.capacity) {
    return NextResponse.json({ error: "Esta aula está lotada." }, { status: 409 });
  }

  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("session_id", session_id)
    .eq("email", email.toLowerCase())
    .eq("cancelled", false)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Já existe uma marcação com este email para esta aula." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      session_id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      member_code: member_code?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data }, { status: 201 });
}
