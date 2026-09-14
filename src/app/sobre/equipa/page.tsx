import Image from "next/image";
import { GraduationCap } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import { equipa } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Equipa",
  description: "Conhece a equipa técnica do BLOKO — professores de Padel e monitores de Ginásio em Bragança.",
  path: "/sobre/equipa",
});

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EquipaPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-gym-interior.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Sobre Nós
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-8xl uppercase text-white">
          A <span className="text-gradient-lime">Equipa</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Professores de Padel e monitores de Ginásio — quem te acompanha todos os dias.
        </p>
      </ParallaxDive>

      <section className="container-bloko py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {equipa.map((m, i) => (
            <ScrollReveal key={m.name} delay={i * 0.05}>
              <div className="glass-card rounded-2xl p-6 h-full">
                {m.image ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mb-5">
                    <Image src={m.image} alt={m.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] flex items-center justify-center font-display text-2xl mb-5">
                    {initials(m.name)}
                  </div>
                )}
                <h3 className="font-display uppercase text-base mb-3">{m.name}</h3>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {m.roles.map((r) => (
                    <span
                      key={r}
                      className="text-[10px] uppercase tracking-wide px-2.5 py-1 rounded-full border border-white/15 text-[var(--color-text-muted)]"
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <div className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                  <GraduationCap size={14} className="text-[var(--color-blue-soft)] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {m.qualification.map((q) => (
                      <p key={q}>{q}</p>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
