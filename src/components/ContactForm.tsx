"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/lib/site-data";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = `Contacto pelo site — ${name}`;
    const body = `${message}\n\n— ${name} (${email})`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
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
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 font-display uppercase tracking-wide py-3.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
      >
        <Send size={16} /> Enviar mensagem
      </button>
    </form>
  );
}
