"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha no login.");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80dvh] flex items-center justify-center pt-24 pb-16 px-6">
      <div className="glass-card rounded-3xl p-10 w-full max-w-sm">
        <div className="w-12 h-12 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] flex items-center justify-center mb-6">
          <Lock size={20} />
        </div>
        <h1 className="font-display uppercase text-2xl mb-1">Admin BLOKO</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          Zona reservada à administração interna do BLOKO.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
              Utilizador
            </label>
            <input
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-base focus:outline-none focus:border-[var(--color-lime)]"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
              Palavra-passe
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-base focus:outline-none focus:border-[var(--color-lime)]"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-[var(--color-text-muted)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-[var(--color-lime)]"
            />
            Lembrar-me
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-display uppercase tracking-wide py-3.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
