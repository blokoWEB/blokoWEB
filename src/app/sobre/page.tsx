import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, PartyPopper, Trophy, Users } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import PanoramaViewer from "@/components/PanoramaViewer";
import { courtSponsors, events, pastTournaments } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sobre Nós",
  description:
    "A história do BLOKO em Bragança — desde 21 de novembro de 2024, a crescer as comunidades de padel e ginásio, todos os dias.",
  path: "/sobre",
});

const facts = [
  { icon: Calendar, value: "Nov. 2024", label: "Abertura" },
  { icon: Users, value: String(courtSponsors.length), label: "Campos de padel" },
  { icon: Trophy, value: String(pastTournaments.length), label: "Torneios realizados" },
  { icon: PartyPopper, value: String(events.length), label: "Edições de eventos" },
];

const espaco = [
  { image: "/images/real-gym-musculacao.jpg", alt: "Ginásio BLOKO, com vista para os campos de padel" },
  { image: "/images/real-gym-pesos-livres.jpg", alt: "Zona de treino do Ginásio BLOKO" },
  { image: "/images/real-gym-funcional-equip.jpg", alt: "Equipamento de treino funcional do BLOKO" },
];

export default function SobrePage() {
  return (
    <div>
      <ParallaxDive image="/images/real-lounge.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Sobre Nós
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-8xl uppercase text-white">
          Desporto e <span className="text-gradient-lime">convívio</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          O BLOKO nasceu para dar a Bragança um espaço à altura de outras cidades onde o padel é
          sucesso — desde o primeiro dia.
        </p>
      </ParallaxDive>

      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
            Abrimos portas a <span className="text-white">21 de novembro de 2024</span>, com uma
            ideia simples: juntar padel, ginásio e convívio num único espaço, pensado ao
            pormenor. Desde então não paramos — mês após mês trazemos melhorias pensadas para
            quem nos visita todos os dias, e para fazer crescer as comunidades de padel e de
            ginásio em Bragança.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {facts.map((f) => (
              <div key={f.label} className="glass-card rounded-2xl p-5 text-center">
                <f.icon size={20} className="text-[var(--color-lime)] mx-auto mb-3" />
                <p className="font-display text-2xl md:text-3xl mb-1">{f.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* O Espaço */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko">
          <ScrollReveal className="max-w-2xl mb-14">
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              O Espaço
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-4">
              Feito para o dia inteiro
            </h2>
            <p className="text-[var(--color-text-muted)]">
              Padel, ginásio e lounge no mesmo espaço amplo — treina, joga e fica para o convívio,
              sem teres de sair.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-3 gap-5 mb-12">
            {espaco.map((e) => (
              <ScrollReveal key={e.image} delay={0.05}>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                  <Image src={e.image} alt={e.alt} fill className="object-cover" />
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="flex flex-wrap justify-center gap-4">
            <Link
              href="/padel"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Conhecer o Padel <ArrowRight size={16} />
            </Link>
            <Link
              href="/ginasio"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              Conhecer o Ginásio <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Panorama interativo */}
      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Vê por dentro
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            Os campos, ao pormenor
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <PanoramaViewer
            src="/images/real-padel-panorama.jpg"
            alt="Panorâmica dos campos de padel do BLOKO"
            aspectRatio={1.424}
          />
        </ScrollReveal>
      </section>

      {/* Torneios */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              Competição
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
              Torneios <span className="text-gradient-lime">BLOKO</span>
            </h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">
              Já realizámos {pastTournaments.length} torneios sociais, além dos Nonstops semanais
              que juntam a comunidade toda a semana.
            </p>
            <Link
              href="/torneios"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Ver Torneios BLOKO <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/real-tournament.jpg"
                alt="Torneio BLOKO"
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Eventos */}
      <section className="container-bloko py-24">
        <ScrollReveal>
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto glow-lime">
            <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
              E não é só <span className="text-gradient-lime">padel</span>
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Já lá vão {events.length} edições de eventos temáticos só para a comunidade BLOKO —
              do BLOKO em Festa à nossa edição especial de Halloween em luz negra.
            </p>
            <Link
              href="/sobre/eventos"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Ver Eventos BLOKO <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
