"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CalendarClock, Check, Clock, Loader2, MapPin, Users, X } from "lucide-react";
import Portal from "@/components/Portal";
import ScrollReveal from "@/components/ScrollReveal";
import AcademiaLevelPicker from "@/components/AcademiaLevelPicker";
import { classCategories, classTypes, site, type ClassCategoryKey } from "@/lib/site-data";
import type { ClassSessionWithCount } from "@/lib/types";

const categoryFallbackImage: Record<ClassCategoryKey, string> = {
  ginasio: "/images/real-gym-interior.jpg",
  padel: "/images/real-padel-panorama.jpg",
  academia: "/images/real-academia-sub12.jpg",
};

function imageForSession(session: ClassSessionWithCount) {
  const match = classTypes.find(
    (c) => c.name.toLowerCase() === session.title.toLowerCase()
  );
  return match?.image ?? categoryFallbackImage[session.category];
}

// Aulas de padel avulsas saíram do sistema de marcação por agora (ver /padel/aulas).
const tabCategories = classCategories.filter((c) => c.key !== "padel");

function isClassCategory(value: string | null): value is ClassCategoryKey {
  return classCategories.some((c) => c.key === value);
}

function formatDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-PT", { weekday: "long", day: "2-digit", month: "long" });
}

function formatDayShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-PT", { weekday: "short", day: "2-digit", month: "short" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function AulasPage() {
  return (
    <Suspense fallback={null}>
      <AulasContent />
    </Suspense>
  );
}

function AulasContent() {
  const [sessions, setSessions] = useState<ClassSessionWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ClassSessionWithCount | null>(null);
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");
  const [category, setCategory] = useState<ClassCategoryKey>(
    isClassCategory(categoriaParam) ? categoriaParam : "ginasio"
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/classes")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erro ao carregar aulas.");
        if (!cancelled) setSessions(data.sessions);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ginasioClasses = useMemo(
    () => sessions.filter((s) => s.category === "ginasio"),
    [sessions]
  );

  const isEmpty = category === "ginasio" && ginasioClasses.length === 0;

  function handleBooked(sessionId: string) {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, booked_count: s.booked_count + 1 } : s))
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container-bloko">
        <ScrollReveal className="max-w-2xl mb-14">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
            Mapa de Aulas
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl uppercase mb-4">
            Marca a tua <span className="text-gradient-lime">aula</span>
          </h1>
          <p className="text-[var(--color-text-muted)] mb-3">
            Não precisas de conta — só do teu nome, email e número de sócio ou código de voucher.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Já marcaste e precisas de cancelar?{" "}
            <a
              href={`${site.whatsappUrl}?text=${encodeURIComponent(
                "Olá! Gostava de cancelar a minha presença numa aula. Aula, dia e hora: "
              )}`}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-lime)] hover:underline"
            >
              Cancela pelo WhatsApp
            </a>
          </p>
        </ScrollReveal>

        <ScrollReveal className="flex flex-wrap gap-3 mb-12">
          {tabCategories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`font-display uppercase text-sm tracking-wide px-6 py-3 rounded-full border transition-colors ${
                category === c.key
                  ? "bg-[var(--color-lime)] text-black border-[var(--color-lime)]"
                  : "border-white/15 text-[var(--color-text-muted)] hover:border-white/30 hover:text-white"
              }`}
            >
              {c.label}
            </button>
          ))}
        </ScrollReveal>
        <p className="text-xs text-[var(--color-text-muted)] -mt-8 mb-12">
          {tabCategories.find((c) => c.key === category)?.blurb}
        </p>

        {category === "ginasio" && loading && (
          <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
            <Loader2 className="animate-spin" size={18} /> A carregar aulas…
          </div>
        )}

        {category === "ginasio" && loadError && (
          <div className="glass-card rounded-2xl p-6 text-sm text-red-400">{loadError}</div>
        )}

        {category === "ginasio" && !loading && !loadError && isEmpty && (
          <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
            Sem aulas de ginásio agendadas de momento. Volta em breve.
          </div>
        )}

        {category === "ginasio" && !loading && !loadError && (
          <SessionGroups sessions={ginasioClasses} onSelect={setSelected} />
        )}

        {category === "academia" && <AcademiaLevelPicker />}
      </div>

      {selected && (
        <BookingModal session={selected} onClose={() => setSelected(null)} onBooked={handleBooked} />
      )}
    </div>
  );
}

function SessionGroups({
  sessions,
  onSelect,
}: {
  sessions: ClassSessionWithCount[];
  onSelect: (session: ClassSessionWithCount) => void;
}) {
  const [dayFilter, setDayFilter] = useState<number | null>(null);

  const availableDays = useMemo(() => {
    const days = new Set(sessions.map((s) => new Date(s.starts_at).getDay()));
    return Array.from(days).sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b));
  }, [sessions]);

  const filtered = useMemo(
    () =>
      dayFilter === null
        ? sessions
        : sessions.filter((s) => new Date(s.starts_at).getDay() === dayFilter),
    [sessions, dayFilter]
  );

  return (
    <div>
      {availableDays.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setDayFilter(null)}
            className={`text-xs uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
              dayFilter === null
                ? "bg-[var(--color-lime)] text-black border-[var(--color-lime)]"
                : "border-white/15 text-[var(--color-text-muted)] hover:border-white/30 hover:text-white"
            }`}
          >
            Todos os dias
          </button>
          {availableDays.map((d) => (
            <button
              key={d}
              onClick={() => setDayFilter(d)}
              className={`text-xs uppercase tracking-wide px-4 py-2 rounded-full border transition-colors ${
                dayFilter === d
                  ? "bg-[var(--color-lime)] text-black border-[var(--color-lime)]"
                  : "border-white/15 text-[var(--color-text-muted)] hover:border-white/30 hover:text-white"
              }`}
            >
              {weekdayLabels[d]}
            </button>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => {
          const spotsLeft = s.capacity - s.booked_count;
          const full = spotsLeft <= 0;
          return (
            <div
              key={s.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col hover:border-[var(--color-lime)]/40 transition-colors group"
            >
              <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                <Image
                  src={imageForSession(s)}
                  alt={s.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
                <span className="absolute top-3 left-3 flex items-center gap-1.5 text-xs font-display bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full capitalize">
                  {formatDayShort(s.starts_at)}
                </span>
                <span className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-display bg-black/60 backdrop-blur-sm text-[var(--color-lime)] px-3 py-1.5 rounded-full">
                  <Clock size={12} /> {formatTime(s.starts_at)}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <span className="font-display uppercase text-lg mb-2">{s.title}</span>
                {s.description && (
                  <p className="text-sm text-[var(--color-text-muted)] mb-3 flex-1">
                    {s.description}
                  </p>
                )}
                {s.instructor && (
                  <p className="text-xs text-[var(--color-lime)] mb-3">Prof. {s.instructor}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-1">
                  <MapPin size={13} /> {s.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] mb-5">
                  <Users size={13} />
                  {full ? "Lotado" : `${spotsLeft} lugares disponíveis`}
                </div>
                <button
                  disabled={full}
                  onClick={() => onSelect(s)}
                  className="mt-auto font-display uppercase text-sm tracking-wide py-3 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {full ? "Sem vagas" : "Marcar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingModal({
  session,
  onClose,
  onBooked,
}: {
  session: ClassSessionWithCount;
  onClose: () => void;
  onBooked: (sessionId: string) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.id,
          name,
          email,
          member_code: memberCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não foi possível marcar a aula.");
      setDone(true);
      onBooked(session.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Portal>
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
      <div className="glass-card w-full sm:max-w-md rounded-3xl p-8 relative">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-white"
        >
          <X size={20} />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] flex items-center justify-center mx-auto mb-5">
              <Check size={26} />
            </div>
            <h3 className="font-display uppercase text-xl mb-2">Marcação confirmada</h3>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              {session.title} — {formatDay(session.starts_at)} às {formatTime(session.starts_at)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="font-display uppercase text-sm tracking-wide px-6 py-3 rounded-full bg-[var(--color-lime)] text-black"
              >
                Fechar
              </button>
              <a
                href={`${site.whatsappUrl}?text=${encodeURIComponent(
                  `Olá! Gostava de cancelar a minha presença na aula de ${session.title} (${formatDay(session.starts_at)} às ${formatTime(session.starts_at)}), em nome de ${name}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="font-display uppercase text-sm tracking-wide px-6 py-3 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
              >
                Cancelar presença
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-[var(--color-lime)] mb-2">
              <CalendarClock size={16} />
              <span className="font-display uppercase text-xs tracking-wide">
                {formatDay(session.starts_at)} · {formatTime(session.starts_at)}
              </span>
            </div>
            <h3 className="font-display uppercase text-2xl mb-6">{session.title}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
                  Nome
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-base focus:outline-none focus:border-[var(--color-lime)]"
                  placeholder="O teu nome"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-base focus:outline-none focus:border-[var(--color-lime)]"
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
                  Nº de sócio ou código de voucher (opcional)
                </label>
                <input
                  value={memberCode}
                  onChange={(e) => setMemberCode(e.target.value)}
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-base focus:outline-none focus:border-[var(--color-lime)]"
                  placeholder="Ex: 1234 ou VOUCHER-XYZ"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full font-display uppercase tracking-wide py-3.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="animate-spin" size={16} />}
                Confirmar marcação
              </button>
            </form>
          </>
        )}
      </div>
    </div>
    </Portal>
  );
}
