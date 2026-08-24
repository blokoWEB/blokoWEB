"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { classCategories, type ClassCategoryKey } from "@/lib/site-data";
import type { Booking, ClassSessionWithCount } from "@/lib/types";

const categoryStyle: Record<ClassCategoryKey, string> = {
  ginasio: "border-[var(--color-lime)]/40 text-[var(--color-lime)]",
  padel: "border-[var(--color-blue-soft)]/40 text-[var(--color-blue-soft)]",
  academia: "border-white/25 text-white/70",
};

const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function toDateInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ClassSessionWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<ClassCategoryKey>("ginasio");
  const [dayFilter, setDayFilter] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<ClassSessionWithCount | null>(null);
  const [activeSession, setActiveSession] = useState<ClassSessionWithCount | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSessions(data.sessions ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const byCategory = useMemo(
    () => sessions.filter((s) => s.category === category),
    [sessions, category]
  );

  const availableDays = useMemo(() => {
    const days = new Set(byCategory.map((s) => new Date(s.starts_at).getDay()));
    return Array.from(days).sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
  }, [byCategory]);

  const filtered = useMemo(
    () =>
      dayFilter === null
        ? byCategory
        : byCategory.filter((s) => new Date(s.starts_at).getDay() === dayFilter),
    [byCategory, dayFilter]
  );

  function selectCategory(key: ClassCategoryKey) {
    setCategory(key);
    setDayFilter(null);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Eliminar esta aula? As marcações associadas também serão removidas.")) return;
    await fetch(`/api/classes/${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="pt-28 pb-24 min-h-[100dvh]">
      <div className="container-bloko">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-lime)] mb-2">
              Painel Admin
            </p>
            <h1 className="font-display uppercase text-3xl md:text-4xl">Gestão de aulas</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex flex-wrap gap-2">
            {classCategories.map((c) => (
              <button
                key={c.key}
                onClick={() => selectCategory(c.key)}
                className={`font-display uppercase text-xs tracking-wide px-5 py-2.5 rounded-full border transition-colors ${
                  category === c.key
                    ? "bg-[var(--color-lime)] text-black border-[var(--color-lime)]"
                    : "border-white/15 text-[var(--color-text-muted)] hover:border-white/30 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
          >
            <Plus size={16} /> Nova aula
          </button>
        </div>

        {availableDays.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setDayFilter(null)}
              className={`text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full border transition-colors ${
                dayFilter === null
                  ? "border-[var(--color-blue-soft)] text-[var(--color-blue-soft)]"
                  : "border-white/10 text-[var(--color-text-muted)] hover:border-white/25"
              }`}
            >
              Todos os dias
            </button>
            {availableDays.map((d) => (
              <button
                key={d}
                onClick={() => setDayFilter(d)}
                className={`text-xs uppercase tracking-wide px-3.5 py-1.5 rounded-full border transition-colors ${
                  dayFilter === d
                    ? "border-[var(--color-blue-soft)] text-[var(--color-blue-soft)]"
                    : "border-white/10 text-[var(--color-text-muted)] hover:border-white/25"
                }`}
              >
                {weekdayLabels[d]}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
            <Loader2 className="animate-spin" size={18} /> A carregar…
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
            Sem aulas de {classCategories.find((c) => c.key === category)?.label.toLowerCase()}{" "}
            agendadas. Cria a primeira acima.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => {
              const spotsLeft = s.capacity - s.booked_count;
              const full = spotsLeft <= 0;
              return (
                <div key={s.id} className="glass-card rounded-2xl p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full border ${categoryStyle[s.category]}`}
                    >
                      {classCategories.find((c) => c.key === s.category)?.label}
                    </span>
                    {s.series_id && (
                      <span className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                        Recorrente
                      </span>
                    )}
                  </div>

                  <p className="font-display uppercase text-lg mb-1">{s.title}</p>
                  <p className="text-sm text-[var(--color-lime)] mb-1 capitalize">
                    {new Date(s.starts_at).toLocaleString("pt-PT", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {s.instructor && (
                    <p className="text-xs text-[var(--color-text-muted)] mb-3">
                      Prof. {s.instructor}
                    </p>
                  )}

                  <p className="text-xs text-[var(--color-text-muted)] mt-auto mb-4">
                    {full ? "Lotado" : `${spotsLeft} de ${s.capacity} lugares livres`}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => setActiveSession(s)}
                      className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-[var(--color-blue-soft)] hover:text-white transition-colors"
                    >
                      <Users size={14} /> {s.booked_count} inscritos
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingSession(s)}
                        className="text-[var(--color-text-muted)] hover:text-white transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <SessionFormModal
          defaultCategory={category}
          onClose={() => setShowForm(false)}
          onSaved={(newSessions) => {
            setSessions((prev) =>
              [...prev, ...newSessions.map((s) => ({ ...s, booked_count: 0 }))].sort(
                (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
              )
            );
            setShowForm(false);
          }}
        />
      )}

      {editingSession && (
        <SessionFormModal
          session={editingSession}
          defaultCategory={editingSession.category}
          onClose={() => setEditingSession(null)}
          onSaved={(updated) => {
            setSessions((prev) =>
              prev.map((s) => {
                const match = updated.find((u) => u.id === s.id);
                return match ? { ...s, ...match } : s;
              })
            );
            setEditingSession(null);
          }}
        />
      )}

      {activeSession && (
        <BookingsModal session={activeSession} onClose={() => setActiveSession(null)} />
      )}
    </div>
  );
}

type SavedSession = {
  id: string;
  category: ClassCategoryKey;
  title: string;
  description: string | null;
  starts_at: string;
  duration_minutes: number;
  capacity: number;
  location: string;
  series_id: string | null;
  instructor: string | null;
  created_at: string;
};

function SessionFormModal({
  session,
  defaultCategory,
  onClose,
  onSaved,
}: {
  session?: ClassSessionWithCount;
  defaultCategory: ClassCategoryKey;
  onClose: () => void;
  onSaved: (sessions: SavedSession[]) => void;
}) {
  const isEditing = !!session;
  const [category, setCategory] = useState<ClassCategoryKey>(session?.category ?? defaultCategory);
  const [title, setTitle] = useState(session?.title ?? "");
  const [description, setDescription] = useState(session?.description ?? "");
  const [instructor, setInstructor] = useState(session?.instructor ?? "");
  const [startsAt, setStartsAt] = useState(session ? toDatetimeLocal(session.starts_at) : "");
  const [duration, setDuration] = useState(session?.duration_minutes ?? 45);
  const [capacity, setCapacity] = useState(session?.capacity ?? 14);
  const [location, setLocation] = useState(
    session?.location ?? "BLOKO - Rua Coronel Teófilo Morais, 40, Bragança"
  );
  const [recurring, setRecurring] = useState(false);
  const [everyDays, setEveryDays] = useState(7);
  const [until, setUntil] = useState("");
  const [scopeChoice, setScopeChoice] = useState<"this" | "series" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsScopeChoice = isEditing && !!session?.series_id && scopeChoice === null;

  async function submit(scope: "this" | "series" | null) {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        category,
        title,
        description,
        instructor,
        duration_minutes: Number(duration),
        capacity: Number(capacity),
        location,
        ...(isEditing
          ? { ...(scope === "series" ? {} : { starts_at: new Date(startsAt).toISOString() }), scope }
          : {
              starts_at: new Date(startsAt).toISOString(),
              ...(recurring &&
                until && {
                  recurrence: { every_days: Number(everyDays), until: new Date(until).toISOString() },
                }),
            }),
      };

      const res = await fetch(
        isEditing ? `/api/classes/${session!.id}` : "/api/classes",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao guardar aula.");

      const result: SavedSession[] = data.sessions
        ? data.sessions
        : data.session
          ? [data.session]
          : [];
      onSaved(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setSubmitting(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (needsScopeChoice) return;
    submit(isEditing ? "this" : null);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm">
      <div className="glass-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-8 relative max-h-[90dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-white"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
        <h3 className="font-display uppercase text-2xl mb-6">
          {isEditing ? "Editar aula" : "Nova aula"}
        </h3>

        {needsScopeChoice ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              Esta aula faz parte de uma série recorrente. Aplicar as alterações a:
            </p>
            <button
              onClick={() => {
                setScopeChoice("this");
                submit("this");
              }}
              className="w-full text-left glass-card rounded-xl p-4 border border-white/10 hover:border-[var(--color-lime)]/40 transition-colors"
            >
              <p className="font-display uppercase text-sm">Só esta aula</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Altera apenas esta ocorrência, incluindo a data/hora.
              </p>
            </button>
            <button
              onClick={() => {
                setScopeChoice("series");
                submit("series");
              }}
              className="w-full text-left glass-card rounded-xl p-4 border border-white/10 hover:border-[var(--color-lime)]/40 transition-colors"
            >
              <p className="font-display uppercase text-sm">Todas as aulas desta série</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Altera título, descrição, professor, duração, capacidade e local em todas as
                ocorrências (a data/hora de cada uma mantém-se).
              </p>
            </button>
            {submitting && (
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Loader2 className="animate-spin" size={14} /> A guardar…
              </div>
            )}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Categoria">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClassCategoryKey)}
                className="input"
              >
                {classCategories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Título">
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: BLOKO BURN"
                className="input"
              />
            </Field>
            <Field label="Descrição (opcional)">
              <textarea
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="input"
              />
            </Field>
            <Field label="Nome do professor (opcional)">
              <input
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Ex: João Pires"
                className="input"
              />
            </Field>
            <Field
              label={
                isEditing && session?.series_id ? "Data e hora (só esta ocorrência)" : "Data e hora"
              }
            >
              <input
                required
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="input"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Duração (min)">
                <input
                  type="number"
                  min={15}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="input"
                />
              </Field>
              <Field label="Capacidade">
                <input
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="input"
                />
              </Field>
            </div>
            <Field label="Local">
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
            </Field>

            {!isEditing && (
              <div className="rounded-xl border border-white/10 p-4">
                <label className="flex items-center gap-2.5 text-sm mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                    className="accent-[var(--color-lime)]"
                  />
                  Tornar recorrente
                </label>
                {recurring && (
                  <>
                    <p className="text-xs text-[var(--color-text-muted)] mb-3">
                      Ex: esta aula repete-se todas as semanas, na mesma hora, até à data que
                      escolheres.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Repetir a cada (dias)">
                        <input
                          type="number"
                          min={1}
                          value={everyDays}
                          onChange={(e) => setEveryDays(Number(e.target.value))}
                          className="input"
                        />
                      </Field>
                      <Field label="Até (data de fim)">
                        <input
                          required={recurring}
                          type="date"
                          min={startsAt ? toDateInput(new Date(startsAt)) : undefined}
                          value={until}
                          onChange={(e) => setUntil(e.target.value)}
                          className="input"
                        />
                      </Field>
                    </div>
                  </>
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full font-display uppercase tracking-wide py-3.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="animate-spin" size={16} />}
              {isEditing ? "Guardar alterações" : "Criar aula"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
        {label}
      </span>
      {children}
    </label>
  );
}

function BookingsModal({
  session,
  onClose,
}: {
  session: ClassSessionWithCount;
  onClose: () => void;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings?session_id=${session.id}`)
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings ?? []))
      .finally(() => setLoading(false));
  }, [session.id]);

  async function cancelBooking(b: Booking) {
    if (!confirm(`Cancelar a marcação de ${b.name}?`)) return;
    const res = await fetch(`/api/bookings/${b.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cancelled: true }),
    });
    if (res.ok) {
      setBookings((prev) => prev.map((x) => (x.id === b.id ? { ...x, cancelled: true } : x)));
    }
  }

  const active = bookings.filter((b) => !b.cancelled);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-sm">
      <div className="glass-card w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl p-8 relative max-h-[90dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-white"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
        <h3 className="font-display uppercase text-2xl mb-1">{session.title}</h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          {new Date(session.starts_at).toLocaleString("pt-PT", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          · {active.length}/{session.capacity} inscritos
        </p>

        {loading ? (
          <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
            <Loader2 className="animate-spin" size={16} /> A carregar…
          </div>
        ) : active.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">Sem marcações para esta aula.</p>
        ) : (
          <div className="space-y-2">
            {active.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm truncate">{b.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {b.email}
                    {b.member_code ? ` · ${b.member_code}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => cancelBooking(b)}
                  className="text-[var(--color-text-muted)] hover:text-red-400 transition-colors shrink-0"
                  aria-label="Cancelar marcação"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
