import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import FaqSection from "@/components/FaqSection";
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

const faqs = [
  {
    question: "Quanto custa a mensalidade do Ginásio BLOKO?",
    answer:
      "A mensalidade de Acesso Livre custa 34,60€/mês. Há também o plano Off Peak, por 25,95€/mês, com acesso diário das 7h às 17h. A inscrição é de 15€ e inclui avaliação física, plano de treino e seguro.",
  },
  {
    question: "Há fidelização nas mensalidades do Ginásio?",
    answer:
      "Não. Todas as mensalidades e packs do Ginásio BLOKO são sem fidelização — cancelas quando quiseres, sem multas nem tempo mínimo.",
  },
  {
    question: "Há desconto para quem treina em família?",
    answer:
      "Sim, o Pack Família custa 29,95€/mês por pessoa para 2 elementos, ou 25,95€/mês por pessoa a partir de 3 elementos.",
  },
  {
    question: "Quanto custa o Personal Training no BLOKO?",
    answer:
      "Personal Training individual custa a partir de 71€/mês (1 treino/semana), com preços mais baixos por pessoa em grupos de 2 ou 3.",
  },
  {
    question: "Posso experimentar o Ginásio antes de assinar mensalidade?",
    answer:
      "Sim: Treino Único por 4,99€, 1 Semana de Acesso Livre por 9,99€, ou 2 Semanas de Acesso Livre por 19,98€.",
  },
];

export const metadata = pageMetadata({
  title: "Preços do Ginásio em Bragança",
  description:
    "Preços do Ginásio BLOKO em Bragança — mensalidades, pack família, treino personalizado e aulas de grupo.",
  path: "/ginasio/precario",
});

export default function GinasioPrecarioPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-gym-only-hero.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Preçário
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl uppercase text-white">
          Preços <span className="text-gradient-lime">Ginásio</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Mensalidades, packs, treino personalizado e campanhas em vigor. Vamos a isso?
        </p>
        <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-lime)]/50 bg-[var(--color-lime)]/10 text-[var(--color-lime)] font-display uppercase text-xs tracking-wide text-center">
          <ShieldCheck size={15} className="shrink-0" /> Sem fidelização,<br className="sm:hidden" /> cancela
          quando quiseres
        </div>
      </ParallaxDive>

      {/* CAMPANHA */}
      <section className="container-bloko pt-14">
        <ScrollReveal>
          <div className="glass-card rounded-2xl overflow-hidden glow-lime flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-8">
            <div className="relative w-full sm:w-40 aspect-[750/890] sm:aspect-auto sm:self-stretch shrink-0">
              <Image
                src="/images/campaigns/setembro-2026.jpg"
                alt="Campanha de Setembro — 50% de desconto na 1ª mensalidade"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-5 p-6 sm:py-6 sm:pr-8 sm:pl-0">
              <div className="flex-1">
                <p className="font-display uppercase text-xs tracking-wide text-[var(--color-lime)] mb-1">
                  Campanha de Setembro
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  50% de desconto na 1ª mensalidade se pagares as 4 mensalidades seguintes
                  adiantado até ao fim do ano — e ainda levas 1 hora de PT + toalha BLOKO.
                </p>
              </div>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center justify-center gap-2 font-display uppercase text-xs tracking-wide px-6 py-3 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
              >
                Aproveitar
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

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
                <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--color-lime)]">
                  <ShieldCheck size={11} /> Sem fidelização
                </p>
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
                  <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--color-lime)]">
                    <ShieldCheck size={11} /> Sem fidelização
                  </p>
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
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">{gymWeekendPack.note}</p>
                  <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--color-lime)]">
                    <ShieldCheck size={11} /> Sem fidelização
                  </p>
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
                  <p className="text-xs text-[var(--color-text-muted)] mb-3">
                    {padelGymComboPack.note} · Inscrição: {padelGymComboPack.inscricao}
                  </p>
                  <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--color-lime)]">
                    <ShieldCheck size={11} /> Sem fidelização
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
                  <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--color-lime)]">
                    <ShieldCheck size={11} /> Sem fidelização
                  </p>
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
                    <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--color-lime)]">
                      <ShieldCheck size={11} /> Sem fidelização
                    </p>
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

      <FaqSection faqs={faqs} />

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
