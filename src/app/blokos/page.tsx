import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, ExternalLink, TrendingUp, Trophy, Wallet } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blokos",
  description: "O sistema de pontos e crédito interno do clube BLOKO. Ganha, acumula e usa Blokos.",
  path: "/blokos",
});

const blokosTable = [
  { place: "1.º lugar", blokos: "600", note: "300 por jogador" },
  { place: "2.º lugar", blokos: "400", note: "" },
  { place: "3.º lugar", blokos: "250", note: "" },
  { place: "4.º lugar", blokos: "150", note: "" },
  { place: "5.º ao 8.º lugar", blokos: "50 (por dupla)", note: "Blokos garantidos" },
];

const steps = [
  {
    icon: Trophy,
    title: "Joga e participa",
    body: "Em cada torneio, todos os participantes recebem Blokos consoante a classificação final — independentemente da posição.",
  },
  {
    icon: TrendingUp,
    title: "Acumula",
    body: "Os Blokos ganhos ao longo do mês somam-se no Ranking Mensal BLOKO. Podes acumular durante o tempo que quiseres.",
  },
  {
    icon: Wallet,
    title: "Usa quando quiseres",
    body: "Troca os teus Blokos por horas de padel, artigos da loja BLOKO, overgrips e outros consumíveis do clube.",
  },
];

export default function BlokosPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-bloko">
        <ScrollReveal className="max-w-2xl mb-16">
          <Image
            src="/images/blokos-logo.png"
            alt="Blokos"
            width={317}
            height={166}
            className="h-16 w-auto mb-6"
          />
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
            Sistema de pontos
          </p>
          <h1 className="font-display font-extrabold text-4xl md:text-6xl uppercase mb-6">
            O que são os <span className="text-gradient-lime">Blokos</span>?
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg">
            Em vez de prémios físicos, cada jogador recebe Blokos — o crédito interno do clube.
            Jogas, acumulas e usas quando quiseres.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {steps.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.08}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <s.icon size={22} className="text-[var(--color-lime)] mb-4" />
                <h3 className="font-display uppercase text-sm mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{s.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mb-16">
          <div className="glass-card rounded-2xl p-8">
            <h2 className="font-display uppercase text-sm text-[var(--color-lime)] mb-2 flex items-center gap-2">
              <Award size={16} /> Exemplo de distribuição por Nonstop (8 duplas)
            </h2>
            <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)] mb-6">
              Exemplo — a distribuição pode variar de torneio para torneio
            </p>
            <table className="w-full text-sm">
              <tbody>
                {blokosTable.map((row) => (
                  <tr key={row.place} className="border-b border-white/5 last:border-0">
                    <td className="py-3 text-[var(--color-text-muted)]">{row.place}</td>
                    <td className="py-3 font-display text-[var(--color-lime)]">{row.blokos}</td>
                    <td className="py-3 text-xs text-[var(--color-text-muted)] text-right">
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-[var(--color-text-muted)] mt-4">
              Total distribuído neste exemplo: 1600 Blokos.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="glass-card rounded-2xl p-10 text-center glow-lime max-w-2xl mx-auto">
            <h2 className="font-display uppercase text-xl mb-3">Consulta o teu saldo</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-8">
              Vê os teus Blokos, o histórico de torneios e o Ranking Mensal na aplicação BLOKOS.
            </p>
            <a
              href={site.blokosAppUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Abrir Blokos <ExternalLink size={16} />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal className="text-center mt-10">
          <Link
            href="/torneios"
            className="inline-flex items-center gap-2 font-display uppercase text-sm tracking-wide text-[var(--color-text-muted)] hover:text-[var(--color-lime)] transition-colors"
          >
            <ArrowRight size={14} className="rotate-180" /> Voltar a Torneios BLOKO
          </Link>
        </ScrollReveal>
      </div>
    </div>
  );
}
