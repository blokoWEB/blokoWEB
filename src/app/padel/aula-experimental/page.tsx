import Image from "next/image";
import { CalendarClock, CheckCircle2, Clock, ShoppingBag, Sparkles, Users } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import ExperimentalAulaForm from "@/components/ExperimentalAulaForm";
import { experimentalAulaInfo, experimentalAulaTopics } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Aula Experimental Gratuita de Padel",
  description:
    "Nunca jogaste padel? Experimenta uma aula gratuita no BLOKO em Bragança — raquetes e bolas incluídas. Marcação obrigatória.",
  path: "/padel/aula-experimental",
});

const infoCards = [
  { icon: Clock, label: "Duração", value: experimentalAulaInfo.duration },
  { icon: CalendarClock, label: "Dia", value: experimentalAulaInfo.day },
  { icon: ShoppingBag, label: "Equipamento", value: experimentalAulaInfo.equipment },
  { icon: Users, label: "Para quem", value: experimentalAulaInfo.audience },
];

const espaco = [
  { image: "/images/real-court-chamauto.jpg", alt: "Campo de padel do BLOKO" },
  { image: "/images/real-court-meususuper.jpg", alt: "Campo de padel do BLOKO em Bragança" },
];

export default function AulaExperimentalPage() {
  return (
    <div>
      <ParallaxDive image="/images/academia-treino-2.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Nunca jogaste padel?
        </p>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl uppercase text-white">
          Aula <span className="block sm:inline">Experimental</span>{" "}
          <span className="text-gradient-lime">Gratuita</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Experimenta o padel do zero, sem custo e sem equipamento — só precisas de te
          inscreveres. {experimentalAulaInfo.booking}.
        </p>
      </ParallaxDive>

      {/* INFO */}
      <section className="container-bloko py-24">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-16">
          {infoCards.map((c) => (
            <ScrollReveal key={c.label}>
              <div className="glass-card rounded-2xl p-5 text-center h-full">
                <c.icon size={20} className="text-[var(--color-lime)] mx-auto mb-3" />
                <p className="font-display text-sm mb-1">{c.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                  {c.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            O que vais aprender
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            A tua primeira aula de padel
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-5 mb-20">
          {experimentalAulaTopics.map((t, i) => (
            <ScrollReveal key={t.title} delay={i * 0.06}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <CheckCircle2 size={20} className="text-[var(--color-lime)] mb-4" />
                <h3 className="font-display uppercase text-sm mb-2">{t.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{t.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="max-w-2xl mx-auto text-center mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Inscrição
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
            Marca a tua aula experimental
          </h2>
          <p className="text-[var(--color-text-muted)]">
            Deixa os teus dados e entramos em contacto contigo com o horário da próxima aula
            disponível.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mb-20">
          <ExperimentalAulaForm />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-5">
          {espaco.map((e) => (
            <ScrollReveal key={e.image} delay={0.05}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <Image src={e.image} alt={e.alt} fill className="object-cover" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
