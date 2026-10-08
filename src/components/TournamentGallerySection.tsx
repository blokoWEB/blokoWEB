"use client";

import { useEffect, useState } from "react";
import { ImageOff, Images } from "lucide-react";
import type { TournamentDay } from "@/lib/site-data";
import GalleryLightbox from "./GalleryLightbox";

type PreviewImage = { name: string; thumb: string; full: string };

const PREVIEW_LIMIT = 6;

export default function TournamentGallerySection({
  slug,
  title,
  days,
}: {
  slug: string;
  title: string;
  days: TournamentDay[];
}) {
  const [activeDay, setActiveDay] = useState(days[0]?.gallerySlug ?? "");
  const [previews, setPreviews] = useState<Record<string, PreviewImage[]>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!activeDay || previews[activeDay]) return;
    let cancelled = false;
    fetch(`/api/gallery?type=torneios&slug=${slug}&day=${activeDay}&limit=${PREVIEW_LIMIT}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setPreviews((prev) => ({ ...prev, [activeDay]: data.images ?? [] }));
      })
      .catch(() => {
        if (!cancelled) setPreviews((prev) => ({ ...prev, [activeDay]: [] }));
      });
    return () => {
      cancelled = true;
    };
  }, [activeDay, slug, previews]);

  const activeDayEntry = days.find((d) => d.gallerySlug === activeDay);
  const activeImages = previews[activeDay] ?? [];
  const loading = activeImages.length === 0 && previews[activeDay] === undefined;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {days.map((d) => (
          <button
            key={d.gallerySlug}
            onClick={() => setActiveDay(d.gallerySlug)}
            className={`font-display uppercase text-xs tracking-wide px-5 py-2.5 rounded-full border transition-colors ${
              activeDay === d.gallerySlug
                ? "bg-[var(--color-lime)] text-black border-[var(--color-lime)]"
                : "border-white/15 text-[var(--color-text-muted)] hover:border-white/30 hover:text-white"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: PREVIEW_LIMIT }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : activeImages.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-[var(--color-text-muted)]">
          <ImageOff size={24} className="mx-auto mb-3" />
          Galeria em breve. Volta mais tarde.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-5">
            {activeImages.map((img) => (
              <button
                key={img.name}
                onClick={() => setLightboxOpen(true)}
                className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumb}
                  alt={`${title}, ${activeDayEntry?.label ?? ""}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
          <button
            onClick={() => setLightboxOpen(true)}
            className="inline-flex items-center gap-2 font-display uppercase text-xs tracking-wide text-[var(--color-lime)] hover:underline"
          >
            <Images size={14} /> Ver galeria completa
          </button>
        </>
      )}

      <GalleryLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        type="torneios"
        slug={slug}
        title={title}
        day={activeDay}
        dayLabel={activeDayEntry?.label}
      />
    </div>
  );
}
