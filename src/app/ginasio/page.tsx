import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import VideoShowcase from "@/components/VideoShowcase";
import { classTypes, site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Ginásio",
  description:
    "Ginásio moderno em Bragança com aulas de grupo incluídas na mensalidade: GAP, ABS, Funcional e mais.",
  path: "/ginasio",
});

const gymClasses = classTypes.filter((c) => c.category === "ginasio");

export default function GinasioPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-gym-interior.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Ginásio BLOKO
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-8xl uppercase text-white">
          Treina <span className="text-gradient-lime">sem limites</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Espaço amplo e moderno, aberto a todos — pratiques padel ou não.
        </p>
      </ParallaxDive>

      <section className="container-bloko pt-24">
        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Conhece o espaço
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            O Ginásio BLOKO em vídeo
          </h2>
        </ScrollReveal>
        <VideoShowcase src="/videos/bloko-ginasio.mp4" poster="/images/real-gym-interior.jpg" />
      </section>

      <section className="container-bloko py-24 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Equipamento
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Zona de cardio
          </h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            Passadeiras, bicicletas e remos de última geração, lado a lado com os campos de padel
            — treina sem perderes o jogo de vista.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="relative aspect-[9/16] sm:aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/images/real-ginasio-treadmills.jpg"
              alt="Zona de cardio do Ginásio BLOKO, com vista para os campos de padel"
              fill
              className="object-cover"
            />
          </div>
        </ScrollReveal>
      </section>

      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-16">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Horário
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Aberto todos os dias
          </h2>
          <div className="glass-card rounded-2xl p-6 space-y-3">
            {site.hours.ginasio.map((h) => (
              <div key={h.days} className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-[var(--color-lime)] shrink-0" />
                <span className="font-display uppercase tracking-wide w-32">{h.days}</span>
                <span className="text-[var(--color-text-muted)]">{h.time}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Mapa de Aulas
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            Aulas de grupo — incluídas na mensalidade
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {gymClasses.map((c, i) => (
            <ScrollReveal key={c.slug} delay={i * 0.08}>
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:border-[var(--color-lime)]/40 transition-colors group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display uppercase text-lg mb-1">{c.name}</h3>
                  <p className="text-xs text-[var(--color-lime)] mb-3">{c.full}</p>
                  <p className="text-sm text-[var(--color-text-muted)] flex-1">{c.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <Link
            href="/aulas?categoria=ginasio"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
          >
            Aulas Ginásio <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
