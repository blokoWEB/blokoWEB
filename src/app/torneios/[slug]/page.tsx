import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  PlayCircle,
  Trophy,
  Users,
} from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import TournamentGallerySection from "@/components/TournamentGallerySection";
import TournamentSchedule from "@/components/TournamentSchedule";
import { pageMetadata } from "@/lib/seo";
import { fetchPadelteamsStats } from "@/lib/padelteams";
import { allTournaments, getTournamentSchedule } from "@/lib/tournament-schedule";

function findTournament(slug: string) {
  return allTournaments.find((t) => t.slug === slug && t.hasDetailPage);
}

export async function generateStaticParams() {
  return allTournaments.filter((t) => t.hasDetailPage).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/torneios/[slug]">) {
  const { slug } = await params;
  const tournament = findTournament(slug);
  if (!tournament) return {};
  return pageMetadata({
    title: tournament.name,
    description: tournament.summary,
    path: `/torneios/${slug}`,
    image: tournament.poster ?? undefined,
  });
}

export default async function TournamentDetailPage({ params }: PageProps<"/torneios/[slug]">) {
  const { slug } = await params;
  const tournament = findTournament(slug);
  if (!tournament) notFound();

  const stats = tournament.padelteamsStatsUrl
    ? await fetchPadelteamsStats(tournament.padelteamsStatsUrl)
    : null;

  const schedule = await getTournamentSchedule(tournament);

  return (
    <div>
      <ParallaxDive image="/images/real-tournament.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          {tournament.tag}
        </p>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-7xl uppercase text-white">
          {tournament.name}
        </h1>
        <p className="mt-6 max-w-xl text-white/70">{tournament.dates}</p>
      </ParallaxDive>

      <section className="container-bloko py-24">
        <ScrollReveal className="mb-14">
          <Link
            href="/torneios"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--color-text-muted)] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Todos os torneios
          </Link>

          <div
            className={
              tournament.poster
                ? "grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-start"
                : "max-w-3xl"
            }
          >
            {tournament.poster && (
              <div className="relative w-full max-w-sm mx-auto lg:max-w-none lg:mx-0 aspect-[4/5] rounded-2xl overflow-hidden glow-lime">
                <Image src={tournament.poster} alt={tournament.name} fill className="object-cover" />
              </div>
            )}

            <div>
              <p className="text-[var(--color-text-muted)] mb-6">{tournament.summary}</p>

              {tournament.details && tournament.details.length > 0 && (
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mb-8">
                  {tournament.details.map((d) => (
                    <li
                      key={d}
                      className="text-sm text-[var(--color-text-muted)] flex items-start gap-2"
                    >
                      <CheckCircle2 size={15} className="text-[var(--color-lime)] shrink-0 mt-0.5" />
                      {d}
                    </li>
                  ))}
                </ul>
              )}

              {stats && (
                <div className="glass-card rounded-2xl p-6 mb-8">
                  <p className="flex items-center gap-2 font-display uppercase text-xs text-[var(--color-lime)] mb-4">
                    <BarChart3 size={15} /> Inscrições em tempo real
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    {stats.categorias !== undefined && (
                      <div>
                        <p className="font-display text-2xl">{stats.categorias}</p>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                          Categorias
                        </p>
                      </div>
                    )}
                    {stats.participantes !== undefined && (
                      <div>
                        <p className="font-display text-2xl">{stats.participantes}</p>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                          Duplas inscritas
                        </p>
                      </div>
                    )}
                    {stats.jogadores !== undefined && (
                      <div>
                        <p className="font-display text-2xl">{stats.jogadores}</p>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                          Jogadores
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {tournament.registerUrl && (
                  <a
                    href={tournament.registerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
                  >
                    Inscrever <ArrowRight size={15} />
                  </a>
                )}
                {tournament.resultsUrl && (
                  <a
                    href={tournament.resultsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
                  >
                    <Trophy size={15} /> Ver Resultados
                  </a>
                )}
                {tournament.partnerUrl && (
                  <a
                    href={tournament.partnerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
                  >
                    <Users size={15} /> Encontrar Parceiro
                  </a>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {tournament.padelteamsCid && (
        <section className="container-bloko py-24">
          <ScrollReveal className="max-w-2xl mb-10">
            <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
              Cronograma
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
              Campos, horários e resultados
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <TournamentSchedule
              slug={tournament.slug}
              initialDays={schedule?.days ?? []}
              initialUpdatedAt={schedule?.updatedAt ?? new Date().toISOString()}
              defaultDayIndex={schedule?.defaultDayIndex ?? 0}
            />
            {tournament.padelteamsStatsUrl && (
              <p className="mt-8 text-sm text-[var(--color-text-muted)]">
                Consulte os dados completos em:{" "}
                <a
                  href={tournament.padelteamsStatsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--color-lime)] hover:underline"
                >
                  PadelTeams <ExternalLink size={13} />
                </a>
              </p>
            )}
          </ScrollReveal>
        </section>
      )}

      {tournament.days && tournament.days.length > 0 && (
        <section className="bg-[var(--color-bg-elevated)] py-24">
          <div className="container-bloko">
            <ScrollReveal className="max-w-2xl mb-10">
              <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
                Galeria
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
                Fotos por dia
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <TournamentGallerySection
                slug={tournament.slug}
                title={tournament.name}
                days={tournament.days}
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      <section className="container-bloko py-24">
        <ScrollReveal className="max-w-2xl mb-10">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Pódio
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">Vencedores</h2>
        </ScrollReveal>

        {tournament.winners && tournament.winners.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tournament.winners.map((w) => (
              <ScrollReveal key={w.category}>
                <div className="glass-card rounded-2xl overflow-hidden h-full">
                  {w.photo ? (
                    <div className="relative aspect-[4/3]">
                      <Image src={w.photo} alt={`Vencedores ${w.category}`} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center bg-white/5">
                      <Trophy size={28} className="text-[var(--color-lime)]" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="font-display uppercase text-sm text-[var(--color-lime)] mb-1">
                      {w.category}
                    </p>
                    <p className="text-sm text-white mb-1">{w.players}</p>
                    {w.sponsor && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Prémio: {w.sponsor}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
            Vencedores em breve — volta depois do torneio.
          </div>
        )}
      </section>

      {tournament.youtube && tournament.youtube.length > 0 && (
        <section className="bg-[var(--color-bg-elevated)] py-24">
          <div className="container-bloko">
            <ScrollReveal className="max-w-2xl mb-10">
              <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
                Streams
              </p>
              <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
                Vídeos no YouTube
              </h2>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tournament.youtube.map((v) => (
                <ScrollReveal key={v.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block glass-card rounded-2xl overflow-hidden group"
                  >
                    <div className="relative aspect-video">
                      <Image
                        src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                        alt={v.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                        <PlayCircle size={40} className="text-white" />
                      </div>
                    </div>
                    <p className="p-4 text-sm">{v.title}</p>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
