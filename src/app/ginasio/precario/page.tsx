import Link from "next/link";
import { ArrowRight, MessageCircle, Users } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import { gymPersonalTraining, site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Preçário Ginásio",
  description: "Preços do treino personalizado no Ginásio BLOKO em Bragança — individual ou em grupo.",
  path: "/ginasio/precario",
});

export default function GinasioPrecarioPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-gym-interior.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Preçário
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl uppercase text-white">
          Treino <span className="text-gradient-lime">personalizado</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Acompanhamento individual ou em grupo, com o valor a diminuir por pessoa quanto maior
          for o grupo.
        </p>
      </ParallaxDive>

      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-14">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Ginásio
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-4">
            Personal Training
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Preços mensais por número de treinos por semana. IVA incluído à taxa legal em vigor.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {gymPersonalTraining.map((tier, i) => (
            <ScrollReveal key={tier.label} delay={i * 0.1}>
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="bg-[var(--color-lime)] text-black px-6 py-4 flex items-center gap-2">
                  <Users size={16} />
                  <h3 className="font-display uppercase text-sm tracking-wide">{tier.label}</h3>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  {tier.plans.map((p) => (
                    <div
                      key={p.freq}
                      className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-[var(--color-text-muted)]">{p.freq}</span>
                      <span className="font-display text-lg text-[var(--color-lime)]">
                        {p.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2} className="mt-14 text-center">
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Mensalidade base, pacotes família e combos com padel — brevemente aqui.
          </p>
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
          >
            <MessageCircle size={16} /> Falar no WhatsApp
          </a>
        </ScrollReveal>
      </section>

      <section className="bg-[var(--color-bg-elevated)] py-20 text-center">
        <div className="container-bloko">
          <ScrollReveal>
            <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
              Aulas de <span className="text-gradient-lime">grupo</span>
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-lg mx-auto mb-8">
              GAP, ABS, Funcional e mais — incluídas na mensalidade do ginásio.
            </p>
            <Link
              href="/ginasio"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              Ver aulas de grupo <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
