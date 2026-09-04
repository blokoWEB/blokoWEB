"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, ImageOff, Loader2, X } from "lucide-react";

type GalleryImage = { name: string; url: string };

const LIMIT = 24;

export default function GalleryLightbox({
  open,
  onClose,
  type,
  slug,
  title,
}: {
  open: boolean;
  onClose: () => void;
  type: "torneios" | "eventos";
  slug: string;
  title: string;
}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(
    async (offset: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/gallery?type=${type}&slug=${slug}&offset=${offset}&limit=${LIMIT}`
        );
        const data = await res.json();
        setImages((prev) => (offset === 0 ? data.images : [...prev, ...data.images]));
        setHasMore(Boolean(data.hasMore));
      } catch {
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadedOnce(true);
      }
    },
    [type, slug]
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setImages([]);
      setHasMore(true);
      setLoadedOnce(false);
      setSelected(null);
      if (!cancelled) await loadMore(0);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, loadMore]);

  useEffect(() => {
    if (!open || selected !== null) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore(images.length);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [open, selected, hasMore, loading, images.length, loadMore]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h3 className="font-display uppercase text-sm text-white truncate pr-4">
          Galeria — {title}
        </h3>
        <button
          onClick={onClose}
          aria-label="Fechar galeria"
          className="text-white/70 hover:text-white shrink-0"
        >
          <X size={22} />
        </button>
      </div>

      {selected === null ? (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loadedOnce && images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[var(--color-text-muted)] py-20">
              <ImageOff size={28} className="mb-4" />
              <p>Galeria em breve — volta mais tarde.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-w-5xl mx-auto">
                {images.map((img, i) => (
                  <button
                    key={img.name}
                    onClick={() => setSelected(i)}
                    className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={`${title} — foto ${i + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
              <div ref={sentinelRef} className="h-10 flex items-center justify-center mt-4">
                {loading && <Loader2 size={20} className="animate-spin text-white/50" />}
              </div>
            </>
          )}
        </div>
      ) : (
        <SinglePhotoView
          images={images}
          index={selected}
          title={title}
          onBack={() => setSelected(null)}
          onNavigate={setSelected}
        />
      )}
    </div>
  );
}

function SinglePhotoView({
  images,
  index,
  title,
  onBack,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number;
  title: string;
  onBack: () => void;
  onNavigate: (i: number) => void;
}) {
  const img = images[index];

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-4 min-h-0">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 font-display uppercase text-xs tracking-wide text-white/70 hover:text-white"
      >
        ← Voltar à galeria
      </button>

      {index > 0 && (
        <button
          onClick={() => onNavigate(index - 1)}
          aria-label="Foto anterior"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
        >
          <ChevronLeft size={28} />
        </button>
      )}
      {index < images.length - 1 && (
        <button
          onClick={() => onNavigate(index + 1)}
          aria-label="Foto seguinte"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={`${title} — foto ${index + 1}`}
        className="max-w-full max-h-[75vh] object-contain rounded-lg"
      />

      <a
        href={img.url}
        download={img.name}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 font-display uppercase text-xs tracking-wide px-6 py-3 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
      >
        <Download size={15} /> Descarregar
      </a>
    </div>
  );
}
