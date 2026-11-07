"use client";

/**
 * Área dos professores (/admin/professores): entrar com o login partilhado, dizer quem é e ver/alterar o
 * calendário de aulas e PTs. O nome escolhido fica no histórico de cada alteração.
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, LogOut, UserRound } from "lucide-react";
import { PT_IDENTITY_IDLE_SECONDS } from "@/lib/pt-idle";
import PtCalendar from "./PtCalendar";

// Enquanto a pessoa usa o ecrã avisamos o servidor de tempos a tempos (para ele não a dar como parada).
// Sem mexer durante o tempo de inatividade, recarregamos: o servidor já terá expirado e mostra "Quem és tu?".
const HEARTBEAT_MS = Math.min(30, Math.floor(PT_IDENTITY_IDLE_SECONDS / 4)) * 1000;
const IDLE_MS = PT_IDENTITY_IDLE_SECONDS * 1000 + HEARTBEAT_MS + 5000;
const TICK_MS = Math.max(1000, Math.min(15000, HEARTBEAT_MS / 2));
const ACTIVITY_EVENTS = ["pointerdown", "pointermove", "keydown", "scroll", "wheel", "touchstart"] as const;

export type PortalTeacher = { id: string; name: string; color: string; kind: "ginasio" | "padel" };

type Props =
  | { step: "login" }
  | { step: "who"; teachers: PortalTeacher[]; error: string | null }
  | { step: "calendar"; name: string };

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Algo correu mal.");
  return data;
}

export default function TeacherPortal(props: Props) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inCalendar = props.step === "calendar";

  useEffect(() => {
    if (!inCalendar) return;
    let last = Date.now(); // última vez que a pessoa mexeu
    let lastBeat = Date.now(); // última vez que avisámos o servidor
    const bump = () => {
      last = Date.now();
    };
    const tick = () => {
      const now = Date.now();
      if (now - last >= IDLE_MS) {
        router.refresh();
        return;
      }
      if (last > lastBeat && now - lastBeat >= HEARTBEAT_MS) {
        lastBeat = now;
        fetch("/api/pt/teachers", { cache: "no-store" })
          .then((res) => res.status === 401 && router.refresh())
          .catch(() => {});
      }
    };
    const onVisible = () => !document.hidden && tick();
    for (const ev of ACTIVITY_EVENTS) window.addEventListener(ev, bump, { passive: true, capture: true });
    document.addEventListener("visibilitychange", onVisible);
    const id = setInterval(tick, TICK_MS);
    return () => {
      for (const ev of ACTIVITY_EVENTS) window.removeEventListener(ev, bump, { capture: true });
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(id);
    };
  }, [inCalendar, router]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy("login");
    setError(null);
    try {
      await post("/api/pt/auth/login", { username, password });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setBusy(null);
    }
  }

  async function choose(id: string) {
    setBusy(id);
    setError(null);
    try {
      await post("/api/pt/auth/who", { teacher_id: id });
      router.replace("/admin/professores");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    await post("/api/pt/auth/logout");
    router.replace("/admin/professores");
    router.refresh();
  }

  const shell = "min-h-[80dvh] flex items-center justify-center pt-24 pb-16 px-6";
  const fieldClass =
    "w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-base focus:outline-none focus:border-[var(--color-lime)]";
  const labelClass = "text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block";

  if (props.step === "login") {
    return (
      <div className={shell}>
        <div className="glass-card rounded-3xl p-8 sm:p-10 w-full max-w-sm">
          <div className="w-12 h-12 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] flex items-center justify-center mb-6">
            <Lock size={20} />
          </div>
          <h1 className="font-display uppercase text-2xl mb-1">Professores BLOKO</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">
            Calendário de aulas e PTs. Entra com o utilizador e a palavra-passe que a administração te deu.
          </p>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className={labelClass}>Utilizador</label>
              <input
                required
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Palavra-passe</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
              />
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Por segurança, a sessão fecha sozinha se ficar parada.
            </p>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy === "login"}
              className="w-full font-display uppercase tracking-wide py-3.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy === "login" && <Loader2 className="animate-spin" size={16} />}
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (props.step === "who") {
    return (
      <div className={shell}>
        <div className="glass-card rounded-3xl p-8 sm:p-10 w-full max-w-sm">
          <div className="w-12 h-12 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] flex items-center justify-center mb-6">
            <UserRound size={20} />
          </div>
          <h1 className="font-display uppercase text-2xl mb-1">Quem és tu?</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            O teu nome fica registado no histórico de cada alteração que fizeres. Depois de uns minutos sem mexer,
            voltamos a perguntar quem és.
          </p>
          <div className="space-y-2">
            {props.teachers.map((t) => (
              <button
                key={t.id}
                disabled={busy !== null}
                onClick={() => choose(t.id)}
                className="w-full flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3.5 text-left hover:border-[var(--color-lime)]/60 transition-colors disabled:opacity-60"
              >
                <span className="h-3 w-3 rounded-full shrink-0" style={{ background: t.color }} />
                <span className="flex-1">{t.name}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{t.kind === "padel" ? "padel" : "ginásio"}</span>
                {busy === t.id && <Loader2 className="animate-spin" size={14} />}
              </button>
            ))}
            <button
              disabled={busy !== null}
              onClick={() => choose("admin")}
              className="w-full flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3.5 text-left hover:border-[var(--color-lime)]/60 transition-colors disabled:opacity-60"
            >
              <span className="h-3 w-3 rounded-full shrink-0 bg-white/70" />
              <span className="flex-1">Administração</span>
              <span className="text-xs text-[var(--color-text-muted)]">equipa</span>
              {busy === "admin" && <Loader2 className="animate-spin" size={14} />}
            </button>
          </div>
          {(error || props.error) && <p className="text-sm text-red-400 mt-4">{error || props.error}</p>}
          <button onClick={logout} className="mt-6 text-sm text-[var(--color-text-muted)] hover:text-white">
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-[100dvh]">
      <div className="container-bloko">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-lime)] mb-2">
              Área dos professores
            </p>
            <h1 className="font-display uppercase text-3xl md:text-4xl">Aulas &amp; PTs</h1>
          </div>
          <div className="flex flex-col items-end gap-1 text-sm shrink-0">
            <span className="text-white">{props.name}</span>
            <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
              <button onClick={() => router.push("/admin/professores?quem=1")} className="hover:text-white">
                Não sou eu
              </button>
              <button onClick={logout} className="flex items-center gap-1.5 hover:text-white">
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>
        </div>
        <PtCalendar canManageTeachers={false} />
      </div>
    </div>
  );
}
