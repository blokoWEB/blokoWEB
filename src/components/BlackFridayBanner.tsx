import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { BLACK_FRIDAY } from "@/lib/promos";

/** Versão compacta da promoção Black Friday para a página de preços do ginásio (a completa, com vídeo, está em /ginasio). */
export default function BlackFridayBanner() {
  return (
    <ScrollReveal className="mb-10">
      <div className="glass-card glow-lime rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
            <span className="font-display text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-[var(--color-lime)] text-black">
              2º Aniversário
            </span>
            <span className="font-display text-[11px] tracking-[0.2em] uppercase text-[var(--color-blue-soft)]">
              Black Friday · até {BLACK_FRIDAY.untilLabel}
            </span>
          </div>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl uppercase leading-tight">
            1 ano de ginásio por <span className="text-gradient-lime">{BLACK_FRIDAY.yearPriceEur}€</span>
            <span className="text-white/70 text-lg sm:text-xl"> + {BLACK_FRIDAY.enrollmentEur}€ de inscrição</span>
          </h3>
          <p className="mt-3 text-sm text-[var(--color-text-muted)] max-w-2xl">
            Pagamento único, acesso livre de segunda a sexta: fica a {BLACK_FRIDAY.monthPriceEur}€ por mês. Só{" "}
            {BLACK_FRIDAY.spots} vagas para novos clientes — os primeiros a chegar treinam o ano todo a{" "}
            {BLACK_FRIDAY.monthPriceEur}€/mês.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <Link
            href="/contactos"
            className="inline-flex items-center justify-center gap-2 font-display uppercase text-sm tracking-wide px-7 py-3.5 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors text-center"
          >
            Agarra a promoção na receção <ArrowRight size={16} className="shrink-0" />
          </Link>
          <Link
            href={BLACK_FRIDAY.href}
            className="inline-flex items-center justify-center gap-2 font-display uppercase text-xs tracking-wide px-7 py-3 rounded-full border border-white/20 text-white/80 hover:border-white/50 hover:text-white transition-colors"
          >
            Ver detalhes e vídeo
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
