import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import TournamentCard from "@/components/TournamentCard";
import { events } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Eventos",
  description:
    "Eventos temáticos e sociais do BLOKO em Bragança — BLOKO em Festa, aniversários, edições especiais de Halloween e mais.",
  path: "/sobre/eventos",
});

export default function EventosPage() {
  return (
    <div>
      <ParallaxDive image="https://jucvqopkwuwgkvguupqy.supabase.co/storage/v1/object/public/gallery/eventos/bloko-em-festa-edicao-2/full/IMG_4403.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Comunidade
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-8xl uppercase text-white">
          Eventos <span className="text-gradient-lime">BLOKO</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Festas, aniversários e edições especiais — os momentos em que o clube se junta para
          celebrar, para além da competição.
        </p>
      </ParallaxDive>

      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Histórico
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            Edições anteriores
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((e, i) => (
            <ScrollReveal key={e.slug} delay={i * 0.08}>
              <TournamentCard tournament={e} galleryType="eventos" />
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko text-center">
          <ScrollReveal>
            <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
              À procura de <span className="text-gradient-lime">competição</span>?
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-lg mx-auto mb-8">
              Os Torneios Sociais e os Nonstops semanais têm a sua própria página, com formatos,
              regulamento e agenda.
            </p>
            <Link
              href="/torneios"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Ver Torneios BLOKO <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
