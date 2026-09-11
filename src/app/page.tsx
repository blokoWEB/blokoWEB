import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Star, Trophy, Users, Zap } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import {
  classTypes,
  padelFeatures,
  site,
  tournamentFormats,
  whatsappGroups,
} from "@/lib/site-data";

const gymClasses = classTypes.filter((c) => c.category === "ginasio");

export default function Home() {
  return (
    <div>
      <ParallaxDive image="/images/real-hero-venue.jpg" mobilePosition="55% 30%">
        <p className="font-display text-xs md:text-sm tracking-[0.4em] uppercase text-[var(--color-lime)] mb-6">
          Bragança
        </p>
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-8xl leading-[0.95] tracking-tight uppercase">
          <span className="block text-white">Padel.</span>
          <span className="block text-gradient-lime">Ginásio.</span>
          <span className="block text-white">Lounge.</span>
        </h1>
        <p className="mt-8 max-w-xl text-[var(--color-text-muted)] text-base md:text-lg">
          Um espaço único e versátil em Bragança. 4 campos de padel panorâmicos, ginásio moderno
          e aulas de grupo — desporto e convívio, sem limites.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
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
            className="font-display uppercase text-xs tracking-wide px-5 py-3.5 rounded-full border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors"
          >
            Ou via Playtomic
          </a>
          <Link
            href="/aulas?categoria=ginasio"
            className="font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
          >
            Aulas Ginásio
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/50 animate-bounce">
          scroll
        </div>
      </ParallaxDive>

      {/* SOBRE */}
      <section className="relative bg-[var(--color-bg)] bg-grid">
        <div className="container-bloko py-28 grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              O BLOKO
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase leading-tight mb-6">
              Desporto e convívio, <br /> sem limites.
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-6">
              Bragança está à altura de outras cidades onde o padel é sucesso e está em
              crescimento contínuo. Apostámos na modalidade como desporto de lazer,
              complementado por um amplo e moderno ginásio para todos os que querem manter-se
              ativos — e um espaço de bar e lounge para o salutar convívio entre praticantes.
            </p>
            <Link
              href="/padel"
              className="inline-flex items-center gap-2 font-display uppercase text-sm tracking-wide text-[var(--color-lime)] hover:gap-3 transition-all"
            >
              Conhecer o espaço <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glow-blue">
              <Image
                src="/images/real-lounge.jpg"
                alt="Lounge BLOKO"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* PADEL DIVE */}
      <ParallaxDive image="/images/real-padel-panorama.jpg" mobilePosition="20% center">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          4 Campos Panorâmicos
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-7xl uppercase text-white mb-6">
          Padel de outro <span className="text-gradient-lime">nível</span>
        </h2>
        <ul className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
          {padelFeatures.map((f) => (
            <li
              key={f}
              className="glass-card px-4 py-2 rounded-full text-xs md:text-sm text-white/90"
            >
              {f}
            </li>
          ))}
        </ul>
        <Link
          href="/padel"
          className="mt-10 inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
        >
          Ver os campos <ArrowRight size={16} />
        </Link>
      </ParallaxDive>

      {/* GINÁSIO / AULAS */}
      <section className="relative bg-[var(--color-bg)] bg-grid">
        <div className="container-bloko py-28">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <p className="font-display text-2xl md:text-3xl tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              Ginásio
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl uppercase">
              Aulas de grupo
            </h2>
            <p className="text-[var(--color-text-muted)] mt-4">
              Incluídas na mensalidade. Marca o teu lugar em segundos — sem precisares de conta.
            </p>
            <Link
              href="/ginasio"
              className="mt-4 inline-flex items-center gap-2 font-display uppercase text-sm tracking-wide text-[var(--color-lime)] hover:gap-3 transition-all"
            >
              Conhecer o Ginásio <ArrowRight size={16} />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {gymClasses.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 0.08}>
                <div className="glass-card rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col hover:border-[var(--color-lime)]/40 transition-colors group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
                  </div>
                  <div className="p-2.5 sm:p-6 flex flex-col flex-1">
                    <h3 className="font-display uppercase text-xs sm:text-lg mb-0.5 sm:mb-1">
                      {c.name}
                    </h3>
                    <p className="hidden sm:block text-xs text-[var(--color-lime)] mb-3">{c.full}</p>
                    <p className="hidden sm:block text-sm text-[var(--color-text-muted)] flex-1">
                      {c.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center mt-14">
            <Link
              href="/aulas?categoria=ginasio"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Aulas Ginásio <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* TORNEIOS DIVE */}
      <ParallaxDive image="/images/real-tournament.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Competição
        </p>
        <h2 className="font-display font-extrabold text-4xl md:text-7xl uppercase text-white mb-6">
          Torneios <span className="text-gradient-lime">BLOKO</span>
        </h2>
        <p className="max-w-xl mx-auto text-white/70 mb-10">
          Nonstops todas as semanas, Torneios Sociais várias vezes por ano e Maratona anual de
          Padel — competição social em grande.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {tournamentFormats.map((t) => (
            <div key={t.slug} className="glass-card rounded-2xl p-5 text-left">
              <Trophy size={18} className="text-[var(--color-lime)] mb-3" />
              <h3 className="font-display uppercase text-sm mb-1">{t.name}</h3>
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mb-2">
                {t.frequency}
              </p>
              <p className="text-xs text-white/70 leading-relaxed">{t.description}</p>
            </div>
          ))}
          <div className="glass-card rounded-2xl p-5 text-left">
            <Trophy size={18} className="text-[var(--color-lime)] mb-3" />
            <h3 className="font-display uppercase text-sm mb-1">Torneios Sociais</h3>
            <p className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mb-2">
              3 a 4 por ano
            </p>
            <p className="text-xs text-white/70 leading-relaxed">
              Os maiores eventos do clube — dias inteiros de padel, prémios e convívio.
            </p>
          </div>
        </div>
        <Link
          href="/torneios"
          className="mt-10 inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
        >
          Ver Torneios BLOKO <ArrowRight size={16} />
        </Link>
      </ParallaxDive>

      {/* REVIEW CTA */}
      <section className="relative bg-[var(--color-bg)]">
        <div className="container-bloko py-20">
          <ScrollReveal className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto glow-lime">
            <div className="flex justify-center gap-1 mb-5 text-[var(--color-lime)]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} fill="currentColor" />
              ))}
            </div>
            <h2 className="font-display font-bold text-2xl md:text-4xl uppercase mb-4">
              O que achas do <span className="text-gradient-lime">BLOKO</span>?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              A tua opinião ajuda-nos a crescer e ajuda outros a conhecer o clube. Deixa-nos uma
              review no Google — demora só um minuto.
            </p>
            <a
              href={site.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Deixar review no Google <ArrowRight size={16} />
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative bg-[var(--color-bg)] bg-grid">
        <div className="container-bloko py-28 text-center">
          <ScrollReveal>
            <div className="flex justify-center gap-6 mb-8 text-[var(--color-lime)]">
              <Zap size={22} />
              <Users size={22} />
              <Trophy size={22} />
            </div>
            <h2 className="font-display font-bold text-3xl md:text-5xl uppercase mb-6">
              Junta-te ao <span className="text-gradient-lime">clube</span>
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-lg mx-auto mb-10">
              {site.address} · {site.phone}
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
              {whatsappGroups.map((g) => (
                <div key={g.name} className="glass-card rounded-2xl p-5 text-left">
                  <MessageCircle size={18} className="text-[var(--color-lime)] mb-3" />
                  <h3 className="font-display uppercase text-xs mb-1.5">{g.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                    {g.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={site.whatsappCommunityUrl}
                target="_blank"
                rel="noreferrer"
                className="font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
              >
                Comunidade WhatsApp
              </a>
              <Link
                href="/contactos"
                className="font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
              >
                Contactos
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
