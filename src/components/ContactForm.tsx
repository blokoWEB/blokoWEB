"use client";

import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Não foi possível enviar a mensagem.");
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} Tenta antes pelo WhatsApp ou telefone.`
          : "Erro inesperado. Tenta antes pelo WhatsApp ou telefone."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] flex items-center justify-center mx-auto mb-5">
          <Check size={26} />
        </div>
        <h3 className="font-display uppercase text-xl mb-2">Mensagem enviada</h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Obrigado, {name}! Vamos responder-te em breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-4">
      <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-2">
        Deixa-nos uma mensagem
      </h3>
      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
          Nome
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="O teu nome"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
          Telefone
        </label>
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
          placeholder="912 345 678"
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
          className="input"
          placeholder="email@exemplo.com"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
          Mensagem
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input"
          placeholder="Como podemos ajudar?"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 font-display uppercase tracking-wide py-3.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors disabled:opacity-50"
      >
        {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
        Enviar mensagem
      </button>
    </form>
  );
}
