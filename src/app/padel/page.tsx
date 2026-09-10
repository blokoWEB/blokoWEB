import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, GraduationCap, MessageCircle } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import { courtSponsors, padelFeatures, site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Padel",
  description:
    "4 campos de padel panorâmicos em Bragança, piso Mondo Supercourt. Reserva via Playtomic ou WhatsApp.",
  path: "/padel",
});

export default function PadelPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-padel-panorama.jpg" mobilePosition="20% center">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          4 Campos Panorâmicos
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-8xl uppercase text-white">
          O teu <span className="text-gradient-lime">padel</span>
        </h1>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <a
            href={site.whatsappBookingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
          >
            <MessageCircle size={17} /> Reservar via WhatsApp
          </a>
          <a
            href={site.playtomicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex font-display uppercase text-xs tracking-wide px-6 py-3.5 rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors"
          >
            Ou via Playtomic
          </a>
        </div>
      </ParallaxDive>

      <section className="container-bloko py-24 grid lg:grid-cols-2 gap-16">
        <ScrollReveal>
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Estrutura
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Piso Mondo Supercourt
          </h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
            Campos ultra panorâmicos com relvado Mondo Supercourt, iluminação de competição e
            estrutura envidraçada — pensados para elevar o teu jogo, seja qual for o teu nível.
          </p>
          <ul className="space-y-3">
            {padelFeatures.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm">
                <Check size={16} className="text-[var(--color-lime)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
            <Image
              src="/images/mondo-supercourt.jpg"
              alt="Mondo Premier Supercourt X3 — Official Turf"
              fill
              className="object-contain"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* Os 4 campos */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko">
          <ScrollReveal className="max-w-2xl mb-10">
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              O espaço
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">Os 4 campos</h2>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="glass-card rounded-2xl p-6 mb-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
              <h3 className="font-display uppercase text-sm text-[var(--color-lime)] flex items-center gap-2 shrink-0">
                <Clock size={16} /> Horário dos campos
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-10">
                {site.hours.padel.map((h) => (
                  <div key={h.days} className="flex items-center gap-3 text-sm">
                    <span className="font-display uppercase tracking-wide">{h.days}</span>
                    <span className="text-[var(--color-text-muted)]">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-5">
            {courtSponsors.map((c, i) => (
              <ScrollReveal key={c.court} delay={i * 0.08}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                  <Image
                    src={c.image}
                    alt={`Campo ${c.court}${c.sponsor ? ` — ${c.sponsor}` : ""}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute top-4 left-4 font-display uppercase text-xs tracking-wide bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    Campo {c.court}
                  </span>
                  {c.logo ? (
                    <div
                      className={`absolute bottom-4 left-4 h-12 px-3 flex items-center rounded-xl overflow-hidden ${
                        c.court === 1 ? "" : "bg-white"
                      }`}
                    >
                      <Image
                        src={c.logo}
                        alt={c.sponsor ?? ""}
                        width={140}
                        height={48}
                        className="h-full w-auto object-contain"
                      />
                    </div>
                  ) : (
                    c.sponsor && (
                      <span className="absolute bottom-4 left-4 font-display uppercase text-sm bg-white text-black px-3 py-1.5 rounded-lg">
                        {c.sponsor}
                      </span>
                    )
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Academia & Aulas de padel */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko grid sm:grid-cols-2 gap-5">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-8 h-full flex flex-col">
              <GraduationCap size={22} className="text-[var(--color-lime)] mb-4" />
              <h3 className="font-display uppercase text-xl mb-2">Academia BLOKO</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">
                Formação de padel para todas as idades, em turmas fixas por nível e horário
                específico.
              </p>
              <Link
                href="/academia"
                className="inline-flex items-center gap-2 font-display uppercase text-sm tracking-wide text-[var(--color-lime)] hover:gap-3 transition-all"
              >
                Conhecer a Academia <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="glass-card rounded-2xl p-8 h-full flex flex-col">
              <Check size={22} className="text-[var(--color-lime)] mb-4" />
              <h3 className="font-display uppercase text-xl mb-2">Aulas de Padel</h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-6 flex-1">
                Aulas individuais, a par ou em grupo, para todos os níveis — ao teu ritmo.
              </p>
              <Link
                href="/padel/aulas"
                className="inline-flex items-center gap-2 font-display uppercase text-sm tracking-wide text-[var(--color-lime)] hover:gap-3 transition-all"
              >
                Marcar aula de padel <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WhatsApp callout */}
      <section className="container-bloko py-24 text-center">
        <ScrollReveal>
          <MessageCircle size={24} className="mx-auto text-[var(--color-lime)] mb-5" />
          <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
            Torneios Nonstop e jogos abertos — tudo no WhatsApp
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-lg mx-auto mb-8">
            É nos grupos de WhatsApp que se anunciam os Nonstops semanais, se combinam jogos
            abertos e se avisa de novidades do clube.
          </p>
          <Link
            href="/torneios"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
          >
            Ver Torneios BLOKO <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
