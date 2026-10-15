"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, ListVideo, PlayCircle } from "lucide-react";
import { VideoCard } from "@/components/YouTubeShowcase";
import type { YoutubeVideo } from "@/lib/youtube";

/**
 * Vídeos de um torneio já terminado: as finais em destaque (a reproduzir na própria página) e, num
 * botão, a lista de todos os jogos (as transmissões de cada campo, por dia), com ligação ao YouTube.
 */
export default function TournamentReplays({
  finals,
  all,
  channelUrl,
  searchUrl,
}: {
  finals: YoutubeVideo[];
  all: YoutubeVideo[];
  channelUrl: string;
  searchUrl: string;
}) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <div className="max-w-2xl">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            Vídeos
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">
            {finals.length > 0 ? "As finais" : "Os jogos"}
          </h2>
        </div>
        <a
          href={searchUrl}
          target="_blank"
          rel="noreferrer"
          className="touch-manipulation inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-4 text-sm text-white transition-colors hover:border-[var(--color-lime)] hover:text-[var(--color-lime)]"
        >
          Ver no YouTube <ExternalLink size={13} />
        </a>
      </div>

      {finals.length > 0 && (
        <>
          <p className="mb-3 text-xs text-[var(--color-text-muted)] sm:hidden">
            Desliza para ver todas as finais.
          </p>
          <div
            className={`no-scrollbar -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 ${
              finals.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {finals.map((v) => (
              <div key={v.id} className="w-[82vw] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none">
                <VideoCard video={v} playing={playing === v.id} onPlay={() => setPlaying(v.id)} />
              </div>
            ))}
          </div>
        </>
      )}

      {all.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="touch-manipulation inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--color-lime)] px-6 font-display text-sm uppercase tracking-wide text-black transition-colors hover:bg-[var(--color-lime-soft)]"
          >
            <ListVideo size={16} />
            {showAll ? "Esconder os jogos" : `Ver todos os jogos (${all.length})`}
            <ChevronDown size={15} className={`transition-transform ${showAll ? "rotate-180" : ""}`} />
          </button>

          {showAll && (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {all.map((v) => (
                <li key={v.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-card flex min-h-14 items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors hover:border-[var(--color-lime)]/40"
                  >
                    <PlayCircle size={20} className="shrink-0 text-[var(--color-lime)]" />
                    <span className="leading-snug">{v.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-[var(--color-text-muted)]">
            Todas as transmissões do torneio, por campo e por dia, estão no{" "}
            <a
              href={channelUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-lime)] underline underline-offset-4"
            >
              canal do BLOKO no YouTube
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}
