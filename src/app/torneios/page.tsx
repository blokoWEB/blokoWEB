import { ArrowRight, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import TournamentCard from "@/components/TournamentCard";
import { pastTournaments, tournamentFormats, upcomingTournaments } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Torneios",
  description:
    "Torneios Sociais e Nonstops semanais de padel em Bragança, e o sistema de pontos Blokos.",
  path: "/torneios",
});

const regulamento = [
  {
    title: "1 — Estrutura da prova",
    body: "Os Nonstop de cada categoria têm 8 duplas, que disputam 7 jogos de 13 minutos, de forma a que todas as duplas se defrontem. No final há uma classificação em função dos resultados obtidos, sendo a dupla vencedora a que tiver maior número de vitórias ao longo do torneio.",
  },
  {
    title: "2 — Inscrições",
    body: "As inscrições são feitas através do WhatsApp, com os nomes das duplas adicionados após o anúncio de vagas. O pagamento deve ser feito até 15 minutos antes do início — as duplas devem apresentar-se o mais tardar às 21h45. Cancelamentos com menos de 12h de antecedência fazem perder prioridade de inscrição no evento seguinte.",
  },
  {
    title: "3 — Jogos",
    body: "Início com 5 minutos de aquecimento. O serviço de abertura é definido por sorteio. Os jogos são disputados com ponto de ouro; só contam jogos completos, com regras específicas para empates e jogos incompletos.",
  },
  {
    title: "4 — Critérios de desempate",
    body: "1) Confrontos diretos entre duplas empatadas · 2) Diferença de jogos nesses confrontos · 3) Diferença de jogos no torneio · 4) Total de jogos ganhos · 5) Ordem de inscrição · 6) Sorteio.",
  },
  {
    title: "5 — Desistências e repescagens",
    body: "Se uma dupla desistir ou trocar de atleta (lesão ou outro motivo), os jogos dessa dupla são anulados para efeitos de classificação.",
  },
  {
    title: "6 — Horários e conduta desportiva",
    body: "Apresentação 15 min antes do jogo. Atrasos são penalizados com 3 jogos por cada 5 minutos; 10 minutos de atraso resultam em derrota por 6-0. Condutas antidesportivas reincidentes resultam também em derrota por 6-0, podendo levar a exclusão sem reembolso em casos graves.",
  },
];

export default function TorneiosPage() {
  return (
    <div>
      <ParallaxDive
        image="/images/real-tournament.jpg"
        mobilePosition="center bottom"
        mobileSize="auto 170%"
      >
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Competição
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-8xl uppercase text-white">
          Torneios <span className="text-gradient-lime">BLOKO</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Torneios Sociais, várias vezes por ano, e Nonstops toda as semanas. Tudo combinado e
          anunciado nos grupos de WhatsApp do clube.
        </p>
      </ParallaxDive>

      {/* Formatos */}
      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-14">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Formatos
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            Duas formas de competir
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 gap-5">
          <ScrollReveal>
            <div className="glass-card rounded-2xl p-6 h-full">
              <Trophy size={20} className="text-[var(--color-lime)] mb-4" />
              <h3 className="font-display uppercase text-lg mb-1">Torneios Sociais</h3>
              <p className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mb-3">
                3 a 4 por ano
              </p>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Os maiores eventos do clube — dias inteiros de padel, várias categorias, prémios
                especiais e muito convívio. É o caso do Big Padel Masters, da Liga BLOKO ou de
                torneios temáticos como o BLOKO Especial Halloween.
              </p>
            </div>
          </ScrollReveal>
          {tournamentFormats.map((t, i) => (
            <ScrollReveal key={t.slug} delay={(i + 1) * 0.1}>
              <div className="glass-card rounded-2xl p-6 h-full">
                <Trophy size={20} className="text-[var(--color-lime)] mb-4" />
                <h3 className="font-display uppercase text-lg mb-1">{t.name}</h3>
                <p className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mb-3">
                  {t.frequency}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {t.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Próximos torneios */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko">
          <ScrollReveal className="max-w-2xl mb-10">
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
              Agenda
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
              Próximos torneios
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingTournaments.map((t, i) => (
              <ScrollReveal key={t.slug} delay={i * 0.08}>
                <TournamentCard tournament={t} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.15}>
            <p className="text-xs text-[var(--color-text-muted)] mt-8 max-w-xl">
              A agenda de Torneios Sociais é anunciada com antecedência nos grupos de WhatsApp —
              vê abaixo como entrar.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Torneios anteriores */}
      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Histórico
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            Torneios anteriores
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pastTournaments.map((t, i) => (
            <ScrollReveal key={t.slug} delay={i * 0.05}>
              <TournamentCard tournament={t} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Blokos teaser */}
      <section className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko">
          <ScrollReveal className="glass-card rounded-2xl p-10 text-center max-w-2xl mx-auto glow-lime">
            <Image
              src="/images/blokos-logo.png"
              alt="Blokos"
              width={317}
              height={166}
              className="h-12 w-auto mx-auto mb-5"
            />
            <h2 className="font-display font-bold text-2xl md:text-3xl uppercase mb-4">
              O que são os Blokos?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-8">
              Em vez de prémios físicos, cada jogador recebe Blokos — crédito interno para usar no
              clube. Ganha-se em cada torneio, acumula-se e usa-se quando quiseres.
            </p>
            <Link
              href="/blokos"
              className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Saber mais sobre os Blokos <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Regulamento */}
      <section id="regulamento" className="bg-[var(--color-bg-elevated)] py-24">
        <div className="container-bloko">
          <ScrollReveal className="max-w-2xl mb-14">
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              Regulamento
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
              Torneios Semanais Nonstop
            </h2>
          </ScrollReveal>

          <div className="space-y-4 max-w-3xl">
            {regulamento.map((r, i) => (
              <ScrollReveal key={r.title} delay={i * 0.05}>
                <details className="glass-card rounded-2xl p-6 group">
                  <summary className="font-display uppercase text-sm cursor-pointer list-none flex items-center justify-between">
                    {r.title}
                    <span className="text-[var(--color-lime)] group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mt-4">
                    {r.body}
                  </p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
