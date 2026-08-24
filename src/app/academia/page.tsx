import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CircleCheck,
  Clock,
  CreditCard,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import { site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Academia",
  description:
    "Formação de padel em Bragança para todas as idades e níveis — da iniciação à competição.",
  path: "/academia",
});

const levels = ["Iniciação (Masculino e Feminino)", "Intermédio", "Avançado", "Kids", "Juniores"];

const format = [
  { icon: Users, text: "Máximo 4 alunos por turma, mínimo 3 para a turma avançar" },
  { icon: Calendar, text: "Turmas fixas, uma ou duas vezes por semana, ao longo do ano" },
  { icon: CreditCard, text: "Mensalidade ou packs de aulas válidos por 1 ano" },
  { icon: ShieldCheck, text: "Raquetes de padel disponíveis para empréstimo" },
];

const policies = [
  "1º mês pago na inscrição; restantes até ao dia 6 de cada mês, na receção",
  "Penalização de 4€ por pagamento em atraso",
  "Compromisso mínimo de 1 mês por inscrição",
  "Aulas pessoais e não transmissíveis",
  "Faltas sem aviso não têm reposição; faltas justificadas podem ser repostas consoante disponibilidade",
  "Cancelamento com 24h de antecedência não desconta do pack de aulas",
  "Aulas canceladas pelo clube são creditadas na mensalidade seguinte",
];

export default function AcademiaPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-academia-sub12.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Formação de Padel
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl uppercase text-white">
          Academia <span className="text-gradient-lime">BLOKO</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Turmas fixas para todas as idades e níveis — da iniciação à competição, em grupos
          reduzidos.
        </p>
      </ParallaxDive>

      {/* Níveis */}
      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Níveis
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            Uma turma para cada nível
          </h2>
        </ScrollReveal>
        <div className="flex flex-wrap gap-3 mb-16">
          {levels.map((l) => (
            <span
              key={l}
              className="font-display uppercase text-xs tracking-wide px-4 py-2.5 rounded-full border border-white/15 text-[var(--color-text-muted)]"
            >
              {l}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-16">
          {format.map((f) => (
            <ScrollReveal key={f.text}>
              <div className="glass-card rounded-2xl p-6 flex items-start gap-4">
                <f.icon size={20} className="text-[var(--color-lime)] shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--color-text-muted)]">{f.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="glass-card rounded-2xl p-8">
            <h3 className="font-display uppercase text-sm text-[var(--color-lime)] mb-5 flex items-center gap-2">
              <Clock size={16} /> Condições e política de faltas
            </h3>
            <ul className="space-y-2.5">
              {policies.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-[var(--color-text-muted)]">
                  <CircleCheck size={15} className="text-[var(--color-lime)] shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA turmas */}
      <section className="bg-[var(--color-bg-elevated)] py-24 text-center">
        <div className="container-bloko">
          <ScrollReveal>
            <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
              Vê as turmas disponíveis
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-lg mx-auto mb-8">
              Consulta os horários das turmas da Academia e marca o lugar do teu educando — sem
              precisares de criar conta.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/aulas?categoria=academia"
                className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
              >
                Ver turmas e marcar <ArrowRight size={16} />
              </Link>
              <a
                href={site.phoneHref}
                className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
              >
                <Phone size={16} /> {site.phone}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
