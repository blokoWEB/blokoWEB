"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Images, PlayCircle, Sparkles, Trophy, X } from "lucide-react";
import type { TournamentEntry } from "@/lib/site-data";
import GalleryLightbox from "./GalleryLightbox";
import VideoModal from "./VideoModal";

export default function TournamentCard({
  tournament,
  galleryType = "torneios",
}: {
  tournament: TournamentEntry;
  galleryType?: "torneios" | "eventos";
}) {
  const [open, setOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const hasMore = !!(
    tournament.details?.length ||
    tournament.poster ||
    tournament.registerUrl ||
    tournament.gallerySlug
  );

  return (
    <>
      <button
        onClick={() => hasMore && setOpen(true)}
        className="w-full text-left glass-card rounded-2xl overflow-hidden h-full flex flex-col relative hover:border-[var(--color-lime)]/40 transition-colors group"
      >
        {tournament.poster ? (
          <div className="relative aspect-[4/3] overflow-hidden shrink-0">
            <Image
              src={tournament.poster}
              alt={tournament.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-card)] via-black/10 to-transparent" />
            {tournament.example && (
              <span className="absolute top-3 right-3 text-[9px] uppercase tracking-wide px-2 py-1 rounded-full border border-[var(--color-lime)]/40 text-[var(--color-lime)] bg-black/40 backdrop-blur-sm">
                Exemplo
              </span>
            )}
            {tournament.comingSoon && (
              <span className="absolute top-3 right-3 text-[9px] font-display uppercase tracking-wide px-2.5 py-1 rounded-full bg-[var(--color-lime)] text-black glow-lime">
                Brevemente
              </span>
            )}
            {tournament.hasVideo && (
              <span className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] font-display uppercase tracking-wide px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white">
                <PlayCircle size={13} className="text-[var(--color-lime)]" /> Vídeo
              </span>
            )}
          </div>
        ) : (
          <>
            {tournament.example && (
              <span className="absolute top-4 right-4 text-[9px] uppercase tracking-wide px-2 py-1 rounded-full border border-[var(--color-lime)]/40 text-[var(--color-lime)]">
                Exemplo
              </span>
            )}
            {tournament.comingSoon && (
              <span className="absolute top-4 right-4 text-[9px] font-display uppercase tracking-wide px-2.5 py-1 rounded-full bg-[var(--color-lime)] text-black glow-lime">
                Brevemente
              </span>
            )}
          </>
        )}
        <div className="p-6 flex flex-col flex-1">
          {!tournament.poster && <Sparkles size={18} className="text-[var(--color-lime)] mb-4" />}
          <h3 className="font-display uppercase text-base mb-2 pr-16">{tournament.name}</h3>
          {tournament.dates && (
            <p className="text-xs text-[var(--color-blue-soft)] uppercase tracking-wide mb-2">
              {tournament.dates}
            </p>
          )}
          <p className="text-xs text-[var(--color-text-muted)] flex-1">{tournament.summary}</p>
          {hasMore && (
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-wide text-[var(--color-lime)]">
              Ver detalhes <ArrowRight size={13} />
            </span>
          )}
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-card w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-8 relative max-h-[90dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-white z-10"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            {tournament.poster ? (
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6 -mt-2">
                <Image src={tournament.poster} alt={tournament.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] flex items-center justify-center mb-5">
                <Trophy size={22} />
              </div>
            )}

            <p className="text-[10px] uppercase tracking-wide text-[var(--color-blue-soft)] mb-2">
              {tournament.tag}
              {tournament.dates ? ` · ${tournament.dates}` : ""}
            </p>
            <h3 className="font-display uppercase text-2xl mb-4">{tournament.name}</h3>
            {tournament.summary && (
              <p className="text-sm text-[var(--color-text-muted)] mb-4">{tournament.summary}</p>
            )}
            {tournament.details && tournament.details.length > 0 && (
              <ul className="space-y-2 mb-6">
                {tournament.details.map((d) => (
                  <li key={d} className="text-sm text-[var(--color-text-muted)] flex gap-2">
                    <span className="text-[var(--color-lime)]">·</span> {d}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-3">
              {tournament.registerUrl && (
                <a
                  href={tournament.registerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
                >
                  Inscrever <ArrowRight size={15} />
                </a>
              )}
              {tournament.gallerySlug && (
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
                >
                  <Images size={15} /> Ver Galeria
                </button>
              )}
              {tournament.hasVideo && tournament.gallerySlug && (
                <button
                  onClick={() => setVideoOpen(true)}
                  className="inline-flex items-center gap-2 font-display uppercase tracking-wide px-6 py-3.5 rounded-full border border-white/20 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
                >
                  <PlayCircle size={15} /> Ver Vídeo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {tournament.gallerySlug && (
        <GalleryLightbox
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          type={galleryType}
          slug={tournament.gallerySlug}
          title={tournament.name}
        />
      )}

      {tournament.hasVideo && tournament.gallerySlug && (
        <VideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          type={galleryType}
          slug={tournament.gallerySlug}
          title={tournament.name}
        />
      )}
    </>
  );
}
