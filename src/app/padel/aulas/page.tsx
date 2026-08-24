import { Calendar, Check, MessageCircle, Phone, Repeat, Users } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import { site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Aulas de Padel",
  description:
    "O teu PT de padel em Bragança: aulas individuais, com parceiro ou em grupo, ao teu ritmo.",
  path: "/padel/aulas",
});

const features = [
  {
    icon: Calendar,
    title: "Ao teu ritmo",
    body: "Escolhe os dias e horas que melhor se adaptam à tua agenda — sem mensalidade fixa.",
  },
  {
    icon: Users,
    title: "Individual, a par ou em grupo",
    body: "Escolhe o formato que preferires, com treinadores certificados para todos os níveis.",
  },
  {
    icon: Repeat,
    title: "Packs de aulas",
    body: "Vários pacotes de aulas, válidos ao longo de vários meses, para usares ao teu ritmo.",
  },
  {
    icon: Check,
    title: "Cancelamento flexível",
    body: "Cancela até 24h antes sem perderes a aula do teu pack.",
  },
];

export default function PadelAulasPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-court-ca.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          O teu PT de Padel
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl uppercase text-white">
          Aulas de <span className="text-gradient-lime">Padel</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Treino personalizado, do iniciante ao competitivo — tu escolhes o dia, a hora e o
          formato.
        </p>
      </ParallaxDive>

      <section className="container-bloko py-24">
        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.06}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <f.icon size={20} className="text-[var(--color-lime)] mb-4" />
                <h3 className="font-display uppercase text-sm mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)]">{f.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="glass-card rounded-2xl p-8 mb-16">
            <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-5">
              Horário dos campos
            </h3>
            <div className="space-y-3">
              {site.hours.padel.map((h) => (
                <div key={h.days} className="flex items-center gap-3 text-sm">
                  <span className="font-display uppercase tracking-wide w-40">{h.days}</span>
                  <span className="text-[var(--color-text-muted)]">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal className="text-center">
          <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
            Marca a tua aula
          </h2>
          <p className="text-[var(--color-text-muted)] max-w-lg mx-auto mb-8">
            Fala connosco para combinar dia, hora e formato — por Playtomic, WhatsApp ou
            telefone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={site.playtomicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Playtomic
            </a>
            <a
              href={site.whatsappBookingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a
              href={site.phoneHref}
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              <Phone size={16} /> {site.phone}
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
