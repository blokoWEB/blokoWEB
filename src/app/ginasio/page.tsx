import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import BlackFridayOffer from "@/components/BlackFridayOffer";
import FaqSection from "@/components/FaqSection";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import VideoShowcase from "@/components/VideoShowcase";
import { isBlackFridayActive } from "@/lib/promos";
import {
  classTypes,
  gymEquipmentCount,
  gymMembership,
  gymPersonalTraining,
  padelGymComboPack,
  site,
} from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

// A página é gerada de hora a hora: passado o fim da promoção (22 de novembro) a secção Black Friday desaparece.
export const revalidate = 3600;

const gymClasses = classTypes.filter((c) => c.category === "ginasio");
const nomesAulas = new Intl.ListFormat("pt-PT").format(gymClasses.map((c) => c.name));

// Os preços vêm do preçário (site-data), para nunca ficarem diferentes entre páginas.
const [acessoLivre, offPeak] = gymMembership.plans;
const [treinoUnico, umaSemana] = gymMembership.trial;
const ptIndividual = gymPersonalTraining[0].plans[0];
const ptTrio = gymPersonalTraining[2].plans[0];

export const metadata = pageMetadata({
  title: "Ginásio em Bragança",
  description: `Ginásio em Bragança sem fidelização, desde ${offPeak.price}/mês. Aulas de grupo incluídas (${nomesAulas}), mais de ${gymEquipmentCount} equipamentos e PT.`,
  path: "/ginasio",
});

const destaques = [
  { nome: acessoLivre.name, preco: acessoLivre.price, periodo: acessoLivre.period, nota: "No horário do ginásio" },
  { nome: offPeak.name, preco: offPeak.price, periodo: offPeak.period, nota: offPeak.note },
  { nome: treinoUnico.name, preco: treinoUnico.price, periodo: "", nota: "Para experimentar o espaço" },
  { nome: "Personal Training", preco: ptIndividual.price, periodo: "/mês", nota: "Individual, 1 treino por semana" },
];

const faqs = [
  {
    question: "Onde fica o Ginásio BLOKO em Bragança?",
    answer: "Na Rua Coronel Teófilo Morais 40, 5300-427 Bragança, no mesmo espaço dos campos de padel BLOKO.",
  },
  {
    question: "Qual é o horário do ginásio?",
    answer: `${site.hours.ginasio.map((h) => `${h.days}: ${h.time}`).join(". ")}.`,
  },
  {
    question: "Quanto custa o ginásio e há fidelização?",
    answer: `O Acesso Livre custa ${acessoLivre.price}/mês e o Off Peak ${offPeak.price}/mês (diariamente das 7h às 17h). A inscrição é de ${gymMembership.inscricao}, com avaliação física, plano de treino e seguro. Não há fidelização.`,
  },
  {
    question: "As aulas de grupo estão incluídas na mensalidade?",
    answer: `Sim. As aulas de ${nomesAulas} estão incluídas na mensalidade do ginásio.`,
  },
  {
    question: "Posso experimentar antes de me inscrever?",
    answer: `Sim: há ${treinoUnico.name} por ${treinoUnico.price} e ${umaSemana.name.replace("1 Semana", "uma semana de")} por ${umaSemana.price}.`,
  },
  {
    question: "Há personal training?",
    answer: `Sim. Individual desde ${ptIndividual.price}/mês, com 1 treino por semana, e em grupo de 3 pessoas desde ${ptTrio.price} por pessoa.`,
  },
  {
    question: "Preciso de jogar padel para treinar no ginásio?",
    answer: `Não, o ginásio é aberto a todos. Quem quiser juntar os dois tem o pack Padel + Ginásio por ${padelGymComboPack.price}/mês.`,
  },
];

export default function GinasioPage() {
  return (
    <div>
      <ParallaxDive image="/images/real-gym-interior.jpg">
        <h1 className="font-display font-extrabold text-5xl md:text-8xl uppercase text-white">
          <span className="block font-normal text-xs tracking-[0.4em] text-[var(--color-lime)] mb-4">
            Ginásio em Bragança
          </span>
          Treina <span className="text-gradient-lime">sem limites</span>
        </h1>
        <p className="mt-6 max-w-xl text-white/70">
          Espaço amplo e moderno, sem fidelização e aberto a todos — pratiques padel ou não.
        </p>
        <Link
          href="/ginasio/precario"
          className="mt-8 inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
        >
          Ver Preços <ArrowRight size={16} />
        </Link>
      </ParallaxDive>

      {isBlackFridayActive() && <BlackFridayOffer />}

      <section className="container-bloko pt-24">
        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Em resumo
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Preços sem fidelização
          </h2>
          <p className="text-[var(--color-text-muted)] leading-relaxed">
            O Ginásio BLOKO fica na Rua Coronel Teófilo Morais 40, em Bragança. Tem mais de {gymEquipmentCount}{" "}
            equipamentos, com zonas de cardio, treino funcional e pesos livres. As aulas de {nomesAulas} estão
            incluídas na mensalidade.
          </p>
        </ScrollReveal>
        <ScrollReveal>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {destaques.map((d) => (
              <li key={d.nome} className="glass-card rounded-2xl p-4 sm:p-6">
                <h3 className="font-display uppercase text-xs text-[var(--color-lime)] mb-3">{d.nome}</h3>
                <p className="font-display text-2xl md:text-3xl">
                  {d.preco}
                  {d.periodo && (
                    <span className="block sm:inline text-xs sm:text-sm text-[var(--color-text-muted)]">
                      {d.periodo}
                    </span>
                  )}
                </p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">{d.nota}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--color-lime)]" />
            Cancelas quando quiseres. Inscrição de {gymMembership.inscricao}, com avaliação física, plano de treino
            e seguro.
          </p>
          <Link
            href="/ginasio/precario"
            className="mt-6 inline-flex min-h-11 items-center gap-2 font-display uppercase text-sm tracking-wide text-[var(--color-lime)] hover:text-[var(--color-lime-soft)] transition-colors"
          >
            Preçário completo <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </section>

      <section className="container-bloko pt-24">
        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Conhece o espaço
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            O Ginásio BLOKO em vídeo
          </h2>
        </ScrollReveal>
        <VideoShowcase src="/videos/bloko-ginasio.mp4" poster="/images/real-gym-interior.jpg" />
      </section>

      <section className="container-bloko py-24 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Equipamento
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Zona de cardio
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="relative aspect-[9/16] sm:aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/images/real-gym-cardio.jpg"
              alt="Zona de cardio do Ginásio BLOKO, com vista para os campos de padel"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </ScrollReveal>
      </section>

      <section className="container-bloko py-24 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Equipamento
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Treino funcional
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="relative aspect-[9/16] sm:aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/images/real-gym-only-hero.jpg"
              alt="Zona de treino funcional do Ginásio BLOKO"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </ScrollReveal>
      </section>

      <section className="container-bloko py-24 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal delay={0.15} className="order-2 lg:order-1">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
            <Image
              src="/images/real-gym-pt.jpg"
              alt="Máquinas de musculação do Ginásio BLOKO"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </ScrollReveal>
        <ScrollReveal className="order-1 lg:order-2">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Equipamento
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Equipamentos de treino superior
          </h2>
        </ScrollReveal>
      </section>

      <section className="container-bloko py-24 grid lg:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Equipamento
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Zona livre de pesos
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="relative aspect-[9/16] sm:aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="/images/real-gym-pesos-livres-2.jpg"
              alt="Zona livre de pesos do Ginásio BLOKO"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </ScrollReveal>
      </section>

      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-16">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Horário
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase mb-6">
            Aberto todos os dias
          </h2>
          <div className="glass-card rounded-2xl p-6 space-y-3">
            {site.hours.ginasio.map((h) => (
              <div key={h.days} className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-[var(--color-lime)] shrink-0" />
                <span className="font-display uppercase tracking-wide w-32">{h.days}</span>
                <span className="text-[var(--color-text-muted)]">{h.time}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Mapa de Aulas
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            Aulas de grupo — incluídas na mensalidade
          </h2>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {gymClasses.map((c, i) => (
            <ScrollReveal key={c.slug} delay={i * 0.08}>
              <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:border-[var(--color-lime)]/40 transition-colors group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-transparent to-transparent" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display uppercase text-lg mb-1">{c.name}</h3>
                  <p className="text-xs text-[var(--color-lime)] mb-3">{c.full}</p>
                  <p className="text-sm text-[var(--color-text-muted)] flex-1">{c.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <Link
            href="/aulas?categoria=ginasio"
            className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-8 py-4 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
          >
            Aulas Ginásio <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </section>

      <FaqSection faqs={faqs} />
    </div>
  );
}
