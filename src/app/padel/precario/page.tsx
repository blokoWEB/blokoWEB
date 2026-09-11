import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import { padelCourtPricing, padelLessonPricing, site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Preçário Padel",
  description: "Preços dos campos e aulas de padel em Bragança — off peak, peak hour e aluguer de raquetes.",
  path: "/padel/precario",
});

function LessonTable({
  title,
  groups,
}: {
  title: string;
  groups: (typeof padelLessonPricing)["peak"];
}) {
  return (
    <div>
      <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-4">{title}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((g) => (
          <div key={g.group} className="glass-card rounded-2xl overflow-hidden">
            <div className="bg-white/5 px-4 py-3">
              <span className="font-display uppercase text-xs tracking-wide">{g.group}</span>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              {g.plans.map((p) => (
                <div key={p.label} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">{p.label}</span>
                  <span className="font-display text-[var(--color-lime)]">{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PadelPrecarioPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-padel-panorama.jpg" mobilePosition="20% center">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Preçário
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl uppercase text-white">
          Preços <span className="text-gradient-lime">Padel</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Campos, aulas e aluguer de raquetes — tudo com IVA incluído à taxa legal em vigor.
        </p>
      </ParallaxDive>

      {/* CAMPOS */}
      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-14">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Campos
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-4">
            Aluguer de campo
          </h2>
          <p className="text-[var(--color-text-muted)] flex items-center gap-2">
            <Clock size={15} className="text-[var(--color-lime)]" /> Off Peak: {padelCourtPricing.offPeakHours}
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <ScrollReveal>
            <div className="glass-card rounded-2xl overflow-hidden h-full">
              <div className="bg-white/5 px-6 py-4">
                <h3 className="font-display uppercase text-sm tracking-wide">Off Peak</h3>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {padelCourtPricing.offPeak.map((p) => (
                  <div key={p.duration} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-muted)]">{p.duration}</span>
                    <span className="font-display text-lg text-[var(--color-lime)]">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="glass-card rounded-2xl overflow-hidden h-full">
              <div className="bg-[var(--color-lime)] text-black px-6 py-4">
                <h3 className="font-display uppercase text-sm tracking-wide">Peak Hour</h3>
              </div>
              <div className="p-6 flex flex-col gap-3">
                {padelCourtPricing.peak.map((p) => (
                  <div key={p.duration} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-muted)]">{p.duration}</span>
                    <span className="font-display text-lg text-[var(--color-lime)]">{p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.15}>
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
            <h3 className="font-display uppercase text-sm text-[var(--color-lime)] flex items-center gap-2 shrink-0">
              <ShoppingBag size={16} /> Aluguer de raquetes
            </h3>
            <div className="flex flex-wrap gap-6">
              {padelCourtPricing.racketRental.map((r) => (
                <div key={r.model} className="flex items-center gap-2 text-sm">
                  <span className="font-display uppercase tracking-wide">{r.model}</span>
                  <span className="text-[var(--color-text-muted)]">{r.price}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* AULAS */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko">
          <ScrollReveal className="max-w-2xl mb-14">
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              Aulas
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-4">
              Aulas de Padel
            </h2>
            <p className="text-[var(--color-text-muted)] flex items-center gap-2">
              <Sparkles size={15} className="text-[var(--color-lime)]" />{" "}
              {padelLessonPricing.founderDiscount}
            </p>
          </ScrollReveal>

          <div className="space-y-12">
            <LessonTable title="Peak Hour" groups={padelLessonPricing.peak} />
            <LessonTable title="Off Peak" groups={padelLessonPricing.offPeak} />
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
          <p className="text-sm text-[var(--color-text-muted)] mb-6">
            Também jogas padel? Combina com o ginásio no Pack Padel + Ginásio.
          </p>
          <Link
            href="/ginasio/precario"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
          >
            Ver preços do Ginásio <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
