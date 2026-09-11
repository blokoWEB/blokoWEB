import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sobre Nós",
  description:
    "A história do BLOKO em Bragança — desde 21 de novembro de 2024, a crescer as comunidades de padel e ginásio, todos os dias.",
  path: "/sobre",
});

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
        <ScrollReveal className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
            Abrimos portas a <span className="text-white">21 de novembro de 2024</span>, com uma
            ideia simples: juntar padel, ginásio e convívio num único espaço, pensado ao
            pormenor. Desde então não paramos — mês após mês trazemos melhorias pensadas para
            quem nos visita todos os dias, e para fazer crescer as comunidades de padel e de
            ginásio em Bragança.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="glass-card rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto glow-lime">
            <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
              E não é só <span className="text-gradient-lime">padel</span>
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Ao longo do ano celebramos com eventos temáticos só para a comunidade BLOKO — do
              BLOKO em Festa à nossa edição especial de Halloween em luz negra.
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
