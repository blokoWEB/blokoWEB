"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site-data";

const levels = ["Iniciação", "Intermédio", "Avançado"];

export default function AcademiaLevelPicker() {
  const [level, setLevel] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = `Olá! Quero inscrever-me na Academia BLOKO.\n\nNome: ${name}\nContacto: ${contact}\nNível: ${level}`;
    window.open(`${site.whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card rounded-2xl p-8 max-w-md mx-auto text-left space-y-5"
    >
      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-2 block">
          Nível
        </label>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={`font-display uppercase text-xs tracking-wide px-4 py-2.5 rounded-full border transition-colors ${
                level === l
                  ? "bg-[var(--color-lime)] text-black border-[var(--color-lime)]"
                  : "border-white/15 text-[var(--color-text-muted)] hover:border-white/30 hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
          Nome
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="O teu nome (ou do teu educando)"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1.5 block">
          Telefone ou email
        </label>
        <input
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="input"
          placeholder="912 345 678"
        />
      </div>
      <button
        type="submit"
        disabled={!level}
        className="w-full inline-flex items-center justify-center gap-2 font-display uppercase tracking-wide py-3.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <MessageCircle size={16} /> Pedir horários no WhatsApp
      </button>
    </form>
  );
}
