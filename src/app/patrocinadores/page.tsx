import Image from "next/image";
import Link from "next/link";
import { Handshake, Mail } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { courtSponsors, sponsors } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Patrocinadores",
  description: "Marcas que apoiam o desporto e o convívio no BLOKO em Bragança.",
  path: "/patrocinadores",
});

export default function PatrocinadoresPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-bloko">
        <ScrollReveal className="max-w-2xl mb-16">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
            Patrocinadores
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl uppercase mb-6">
            Marcas que <span className="text-gradient-lime">jogam connosco</span>
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Empresas que apoiam o desporto, os torneios e a comunidade BLOKO.
          </p>
        </ScrollReveal>

        {/* Patrocinadores dos campos */}
        <ScrollReveal className="mb-16">
          <h2 className="font-display uppercase text-sm tracking-[0.2em] text-[var(--color-blue-soft)] mb-5">
            Patrocinadores dos Campos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {courtSponsors.map((c) => (
              <div
                key={c.court}
                className="rounded-2xl h-32 flex flex-col items-center justify-center gap-2 px-4 py-3 bg-white border border-black/5 shadow-lg shadow-black/20"
              >
                <span className="font-display uppercase text-[10px] tracking-wide text-black/50">
                  Campo {c.court}
                </span>
                {c.logo ? (
                  <div className="relative w-full flex-1">
                    <Image src={c.logo} alt={c.sponsor ?? ""} fill className="object-contain" sizes="150px" />
                  </div>
                ) : (
                  <span className="font-display uppercase text-sm text-black text-center">
                    {c.sponsor ?? "Espaço disponível"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Outros patrocinadores */}
        <ScrollReveal>
          <h2 className="font-display uppercase text-sm tracking-[0.2em] text-[var(--color-blue-soft)] mb-5">
            Patrocinadores
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {sponsors.map((s) =>
              s.logo ? (
                <div
                  key={s.name}
                  className="rounded-2xl h-28 flex items-center justify-center p-5 bg-white border border-black/5 shadow-lg shadow-black/20"
                >
                  <div className="relative w-full h-full">
                    <Image src={s.logo} alt={s.name} fill className="object-contain" sizes="200px" />
                  </div>
                </div>
              ) : (
                <div
                  key={s.name}
                  className="rounded-2xl h-28 flex items-center justify-center px-6 bg-white border border-black/5 shadow-lg shadow-black/20"
                >
                  <span className="font-display uppercase text-sm text-center text-black">{s.name}</span>
                </div>
              )
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-20 glass-card rounded-2xl p-10 text-center glow-lime">
            <Handshake size={28} className="mx-auto mb-4 text-[var(--color-lime)]" />
            <h3 className="font-display uppercase text-2xl mb-3">Quer ser patrocinador?</h3>
            <p className="text-[var(--color-text-muted)] max-w-md mx-auto mb-6">
              Associa a tua marca a um dos espaços de desporto e convívio com mais visibilidade em
              Bragança.
            </p>
            <Link
              href="/contactos"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              <Mail size={16} /> Fala connosco
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
