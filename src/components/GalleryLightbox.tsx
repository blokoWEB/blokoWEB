"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, ImageOff, Loader2, X } from "lucide-react";
import Portal from "./Portal";

type GalleryImage = { name: string; thumb: string; full: string };

const LIMIT = 24;

export default function GalleryLightbox({
  open,
  onClose,
  type,
  slug,
  title,
  day,
  dayLabel,
}: {
  open: boolean;
  onClose: () => void;
  type: "torneios" | "eventos";
  slug: string;
  title: string;
  /** Subpasta opcional (ex: "dia-1") para mostrar só as fotos desse dia. */
  day?: string;
  /** Rótulo do dia a mostrar no título do modal (ex: "Dia 1"). */
  dayLabel?: string;
}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Última foto vista, para a grelha voltar a esse ponto quando se volta da vista de uma foto.
  const lastViewed = useRef<number | null>(null);

  function selectPhoto(i: number | null) {
    if (i !== null) lastViewed.current = i;
    setSelected(i);
  }

  const loadMore = useCallback(
    async (offset: number) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/gallery?type=${type}&slug=${slug}&offset=${offset}&limit=${LIMIT}${
            day ? `&day=${day}` : ""
          }`
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
    [type, slug, day]
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    lastViewed.current = null;
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

  // Ao voltar da vista de uma foto, a grelha (que fica montada, só escondida) centra a última foto vista.
  useLayoutEffect(() => {
    if (!open || selected !== null || lastViewed.current === null) return;
    gridRef.current
      ?.querySelector<HTMLElement>(`[data-index="${lastViewed.current}"]`)
      ?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [open, selected]);

  // Com a galeria aberta a página de trás não deve mexer (em iOS o overflow:hidden não chega,
  // por isso fixa-se o body no sítio atual e repõe-se o scroll ao fechar).
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
    <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex flex-col overscroll-contain">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h3 className="font-display uppercase text-sm text-white truncate pr-4">
          Galeria — {title}
          {dayLabel ? ` — ${dayLabel}` : ""}
        </h3>
        <button
          onClick={onClose}
          aria-label="Fechar galeria"
          className="text-white/70 hover:text-white shrink-0"
        >
          <X size={22} />
        </button>
      </div>

      {/* A grelha fica sempre montada (escondida na vista de uma foto) para não perder o scroll. */}
      <div
        ref={gridRef}
        className={`flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 ${selected === null ? "" : "hidden"}`}
      >
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
                    data-index={i}
                    onClick={() => selectPhoto(i)}
                    className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.thumb}
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

      {selected !== null && (
        <SinglePhotoView
          images={images}
          index={selected}
          title={title}
          hasMore={hasMore}
          loading={loading}
          onNeedMore={() => loadMore(images.length)}
          onBack={() => selectPhoto(null)}
          onNavigate={selectPhoto}
        />
      )}
    </div>
    </Portal>
  );
}

const SWIPE_THRESHOLD = 60;

function SinglePhotoView({
  images,
  index,
  title,
  hasMore,
  loading,
  onNeedMore,
  onBack,
  onNavigate,
}: {
  images: GalleryImage[];
  index: number;
  title: string;
  hasMore: boolean;
  loading: boolean;
  onNeedMore: () => void;
  onBack: () => void;
  onNavigate: (i: number) => void;
}) {
  const img = images[index];
  const touch = useRef<{ x: number; y: number; horizontal: boolean; dx: number } | null>(null);
  const [dx, setDx] = useState(0);

  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  // Perto do fim das fotos já carregadas, vai buscar as seguintes (a galeria vem de 24 em 24).
  useEffect(() => {
    if (hasMore && !loading && index >= images.length - 3) onNeedMore();
  }, [hasMore, loading, index, images.length, onNeedMore]);

  // Pré-carrega a foto seguinte para o gesto de deslizar ser instantâneo.
  useEffect(() => {
    const next = images[index + 1];
    if (next) new Image().src = next.full;
  }, [images, index]);

  // Setas do teclado no computador.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(index - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, hasPrev, hasNext, onNavigate]);

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length !== 1) {
      touch.current = null;
      return;
    }
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY, horizontal: false, dx: 0 };
  }

  function onTouchMove(e: React.TouchEvent) {
    const start = touch.current;
    if (!start || e.touches.length !== 1) return;
    const t = e.touches[0];
    const mx = t.clientX - start.x;
    const my = t.clientY - start.y;
    if (!start.horizontal && Math.abs(mx) > 10 && Math.abs(mx) > Math.abs(my)) start.horizontal = true;
    if (!start.horizontal) return;
    // Na primeira/última foto o dedo "puxa" com resistência em vez de ir até ao fim.
    const blocked = (mx > 0 && !hasPrev) || (mx < 0 && !hasNext);
    start.dx = mx;
    setDx(blocked ? mx / 4 : mx);
  }

  function onTouchEnd() {
    const start = touch.current;
    touch.current = null;
    setDx(0);
    if (!start?.horizontal) return;
    if (start.dx <= -SWIPE_THRESHOLD && hasNext) onNavigate(index + 1);
    else if (start.dx >= SWIPE_THRESHOLD && hasPrev) onNavigate(index - 1);
  }

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative px-4 py-4 min-h-0"
      style={{ touchAction: "pinch-zoom" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 font-display uppercase text-xs tracking-wide text-white/70 hover:text-white"
      >
        ← Voltar à galeria
      </button>

      {hasPrev && (
        <button
          onClick={() => onNavigate(index - 1)}
          aria-label="Foto anterior"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
        >
          <ChevronLeft size={28} />
        </button>
      )}
      {hasNext && (
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
        src={img.full}
        alt={`${title} — foto ${index + 1}`}
        draggable={false}
        style={{
          transform: `translateX(${dx}px)`,
          transition: dx === 0 ? "transform 0.2s ease-out" : "none",
        }}
        className="max-w-full max-h-[75vh] object-contain rounded-lg select-none"
      />

      <a
        href={img.full}
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
