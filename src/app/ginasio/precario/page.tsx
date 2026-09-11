import Link from "next/link";
import { ArrowRight, MessageCircle, Sparkles, Users } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import {
  gymFamilyPack,
  gymMembership,
  gymPersonalTraining,
  gymWeekendPack,
  groupClassPricing,
  padelGymComboPack,
  site,
} from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Preçário Ginásio",
  description:
    "Preços do Ginásio BLOKO em Bragança — mensalidades, pack família, treino personalizado e aulas de grupo.",
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
          Preços <span className="text-gradient-lime">Ginásio</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Mensalidades, packs e treino personalizado — tudo com IVA incluído à taxa legal em
          vigor.
        </p>
      </ParallaxDive>

      {/* MENSALIDADE */}
      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-14">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Mensalidade
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-4">
            Acesso ao Ginásio
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Inscrição: {gymMembership.inscricao} — inclui avaliação física, plano de treino e
            seguro nos termos do DL 10/2009.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {gymMembership.plans.map((p, i) => (
            <ScrollReveal key={p.name} delay={i * 0.1}>
              <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
                <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-2">
                  {p.name}
                </h3>
                <p className="font-display text-3xl mb-1">
                  {p.price}
                  <span className="text-sm text-[var(--color-text-muted)]">{p.period}</span>
                </p>
                {p.note && <p className="text-xs text-[var(--color-text-muted)] mt-2">{p.note}</p>}
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-4">
              Experimenta primeiro
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {gymMembership.trial.map((t) => (
                <div key={t.name} className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                  <span className="text-sm text-[var(--color-text-muted)]">{t.name}</span>
                  <span className="font-display text-lg">{t.price}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PACKS */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko">
          <ScrollReveal className="max-w-2xl mb-14">
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              Packs
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
              Poupa em grupo
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            <ScrollReveal>
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="bg-[var(--color-lime)] text-black px-6 py-4 flex items-center gap-2">
                  <Users size={16} />
                  <h3 className="font-display uppercase text-sm tracking-wide">Pack Família</h3>
                </div>
                <div className="p-6 flex flex-col gap-4 flex-1">
                  {gymFamilyPack.map((f) => (
                    <div
                      key={f.members}
                      className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-[var(--color-text-muted)]">{f.members}</span>
                      <span className="font-display text-lg text-[var(--color-lime)] text-right">
                        {f.price}
                        <span className="block text-[10px] text-[var(--color-text-muted)] normal-case">
                          {f.period}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col">
                <div className="bg-white/5 px-6 py-4">
                  <h3 className="font-display uppercase text-sm tracking-wide">
                    Pack Fim-de-Semana
                  </h3>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-center">
                  <p className="font-display text-3xl mb-2 text-[var(--color-lime)]">
                    {gymWeekendPack.price}
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {gymWeekendPack.period}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">{gymWeekendPack.note}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col glow-lime">
                <div className="bg-white/5 px-6 py-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--color-lime)]" />
                  <h3 className="font-display uppercase text-sm tracking-wide">
                    Pack Padel + Ginásio
                  </h3>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-center">
                  <p className="font-display text-3xl mb-2 text-[var(--color-lime)]">
                    {padelGymComboPack.price}
                    <span className="text-sm text-[var(--color-text-muted)]">
                      {padelGymComboPack.period}
                    </span>
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {padelGymComboPack.note} · Inscrição: {padelGymComboPack.inscricao}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* PERSONAL TRAINING */}
      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-14">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Ginásio
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-4">
            Personal Training
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Preços mensais por número de treinos por semana.
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
      </section>

      {/* AULAS DE GRUPO */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko">
          <ScrollReveal className="max-w-2xl mb-14">
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              Sem mensalidade de ginásio
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-4">
              Aulas de Grupo
            </h2>
            <p className="text-[var(--color-text-muted)] flex items-center gap-2">
              <Sparkles size={15} className="text-[var(--color-lime)]" /> {groupClassPricing.note}
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-6">
            {groupClassPricing.tiers.map((tier, i) => (
              <ScrollReveal key={tier.label} delay={i * 0.1}>
                <div className="glass-card rounded-2xl overflow-hidden h-full">
                  <div className="bg-white/5 px-6 py-4">
                    <h3 className="font-display uppercase text-sm tracking-wide">{tier.label}</h3>
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    {tier.plans.map((p) => (
                      <div key={p.freq} className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-muted)]">{p.freq}</span>
                        <span className="font-display text-[var(--color-lime)]">{p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.2} className="mt-14 text-center">
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </ScrollReveal>
        </div>
      </section>

      <section className="container-bloko py-20 text-center">
        <ScrollReveal>
          <Link
            href="/padel/precario"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
          >
            Ver preços do Padel <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
