import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/session";
import type { ClassSession, ClassSessionWithCount } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseAdmin();

  const { data: sessions, error } = await supabase
    .from("class_sessions")
    .select("*")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ids = (sessions ?? []).map((s: ClassSession) => s.id);
  const counts = new Map<string, number>();

  if (ids.length > 0) {
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("session_id")
      .in("session_id", ids)
      .eq("cancelled", false);

    if (bookingsError) {
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    for (const b of bookings ?? []) {
      counts.set(b.session_id, (counts.get(b.session_id) ?? 0) + 1);
    }
  }

  const result: ClassSessionWithCount[] = (sessions ?? []).map((s: ClassSession) => ({
    ...s,
    booked_count: counts.get(s.id) ?? 0,
  }));

  return NextResponse.json({ sessions: result });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const {
    category,
    title,
    description,
    starts_at,
    duration_minutes,
    capacity,
    location,
    instructor,
    recurrence,
  } = body;

  if (!title || !starts_at) {
    return NextResponse.json(
      { error: "Título e data/hora são obrigatórios." },
      { status: 400 }
    );
  }

  if (category && !["ginasio", "padel", "academia"].includes(category)) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
  }

  const base = {
    category: category || "ginasio",
    title,
    description: description || null,
    duration_minutes: duration_minutes || 45,
    capacity: capacity || 14,
    location: location || "BLOKO - Rua Coronel Teófilo Morais, 40, Bragança",
    instructor: instructor || null,
  };

  const everyDays = Number(recurrence?.every_days);
  const startDate = new Date(starts_at);
  const untilDate = recurrence?.until ? new Date(recurrence.until) : null;
  const isRecurring = everyDays > 0 && !!untilDate && untilDate > startDate;

  const supabase = getSupabaseAdmin();

  if (isRecurring) {
    const seriesId = randomUUID();
    const occurrences =
      Math.floor(
        (untilDate!.getTime() - startDate.getTime()) / (everyDays * 24 * 60 * 60 * 1000)
      ) + 1;
    const rows = Array.from({ length: Math.min(occurrences, 104) }, (_, i) => ({
      ...base,
      series_id: seriesId,
      starts_at: new Date(
        startDate.getTime() + i * everyDays * 24 * 60 * 60 * 1000
      ).toISOString(),
    }));

    const { data, error } = await supabase.from("class_sessions").insert(rows).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ sessions: data }, { status: 201 });
  }

  const { data, error } = await supabase
    .from("class_sessions")
    .insert({ ...base, starts_at })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data }, { status: 201 });
}
