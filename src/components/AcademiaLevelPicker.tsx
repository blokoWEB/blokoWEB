"use client";

import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site-data";

const levels = ["Iniciação", "Intermédio", "Avançado"];

export default function AcademiaLevelPicker() {
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm text-[var(--color-text-muted)]">
        Escolhe o teu nível — respondemos no WhatsApp com os horários e turmas disponíveis.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {levels.map((level) => {
          const message = encodeURIComponent(
            `Olá! Quero saber os horários e turmas disponíveis da Academia BLOKO, nível ${level}.`
          );
          return (
            <a
              key={level}
              href={`${site.whatsappUrl}?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              <MessageCircle size={16} /> {level}
            </a>
          );
        })}
      </div>
    </div>
  );
}
