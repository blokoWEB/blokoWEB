"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, VideoOff, X } from "lucide-react";

type VideoItem = { name: string; url: string };

export default function VideoModal({
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
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setIndex(0);
      try {
        const res = await fetch(`/api/gallery/video?type=${type}&slug=${slug}`);
        const data = await res.json();
        if (!cancelled) setVideos(data.videos ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, type, slug]);

  if (!open) return null;

  const current = videos[index];

  return (
    <div className="fixed inset-0 z-[85] bg-black/95 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h3 className="font-display uppercase text-sm text-white truncate pr-4">Vídeo — {title}</h3>
        <button
          onClick={onClose}
          aria-label="Fechar vídeo"
          className="text-white/70 hover:text-white shrink-0"
        >
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative px-4 py-4 min-h-0">
        {loading ? (
          <Loader2 size={28} className="animate-spin text-white/50" />
        ) : !current ? (
          <div className="flex flex-col items-center text-center text-[var(--color-text-muted)]">
            <VideoOff size={28} className="mb-4" />
            <p>Vídeo em breve — volta mais tarde.</p>
          </div>
        ) : (
          <>
            {videos.length > 1 && index > 0 && (
              <button
                onClick={() => setIndex((i) => i - 1)}
                aria-label="Vídeo anterior"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
              >
                <ChevronLeft size={28} />
              </button>
            )}
            {videos.length > 1 && index < videos.length - 1 && (
              <button
                onClick={() => setIndex((i) => i + 1)}
                aria-label="Vídeo seguinte"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
              >
                <ChevronRight size={28} />
              </button>
            )}
            <video
              key={current.url}
              src={current.url}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[80vh] rounded-lg"
            />
            {videos.length > 1 && (
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                {index + 1} / {videos.length}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
