import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlackFridayVideo from "@/components/BlackFridayVideo";
import ScrollReveal from "@/components/ScrollReveal";
import { BLACK_FRIDAY } from "@/lib/promos";

/** Secção da promoção Black Friday / 2º aniversário na página do ginásio (os valores vêm do cartaz da campanha). */
export default function BlackFridayOffer() {
  const stats = [
    {
      value: `${BLACK_FRIDAY.yearPriceEur}€`,
      label: `1 ano de ginásio, pagamento único (+ ${BLACK_FRIDAY.enrollmentEur}€ de inscrição)`,
    },
    { value: `${BLACK_FRIDAY.monthPriceEur}€/mês`, label: "Acesso livre, de segunda a sexta" },
    { value: `${BLACK_FRIDAY.spots} vagas`, label: "Só para novos clientes" },
  ];

  return (
    <section id="black-friday" className="container-bloko pt-16 md:pt-24 scroll-mt-24">
      <ScrollReveal>
        <div className="glass-card glow-lime rounded-3xl p-6 sm:p-10 lg:p-12 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-14 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
              <span className="font-display text-[11px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full bg-[var(--color-lime)] text-black">
                2º Aniversário
              </span>
              <span className="font-display text-[11px] tracking-[0.2em] uppercase text-[var(--color-blue-soft)]">
                Black Friday · até {BLACK_FRIDAY.untilLabel}
              </span>
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl uppercase leading-[0.95]">
              Ginásio durante <span className="text-gradient-lime">1 ano</span> por {BLACK_FRIDAY.yearPriceEur}€
            </h2>
            <p className="mt-4 max-w-xl text-[var(--color-text-muted)]">
              Pagamento único de {BLACK_FRIDAY.yearPriceEur}€, mais {BLACK_FRIDAY.enrollmentEur}€ de inscrição: fica a{" "}
              {BLACK_FRIDAY.monthPriceEur}€ por mês, com acesso livre de segunda a sexta.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map((s) => (
                <div key={s.value} className="rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4">
                  <p className="font-display font-bold text-base sm:text-2xl text-[var(--color-lime)]">{s.value}</p>
                  <p className="mt-1 text-[11px] sm:text-xs leading-snug text-[var(--color-text-muted)]">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-white/80">
              Os primeiros a chegar treinam o ano todo a {BLACK_FRIDAY.monthPriceEur}€/mês.
            </p>

            <Link
              href="/contactos"
              className="mt-8 inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Agarra a promoção na receção <ArrowRight size={16} />
            </Link>
          </div>

          <BlackFridayVideo
            poster={BLACK_FRIDAY.story}
            src={BLACK_FRIDAY.video}
            label="Ver o vídeo da promoção Black Friday"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
