"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, PlayCircle, Radio } from "lucide-react";
import type { YoutubeFeed, YoutubeVideo } from "@/lib/youtube";

const POLL_MS = 60_000;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Lisbon",
  });
}

function VideoCard({
  video,
  live,
  playing,
  onPlay,
}: {
  video: YoutubeVideo;
  live?: boolean;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            onClick={onPlay}
            className="group absolute inset-0 block w-full"
            aria-label={`${live ? "Ver em direto" : "Ver vídeo"}: ${video.title}`}
          >
            <Image
              src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/10" />
            <span className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={44} className="text-white drop-shadow" />
            </span>
            {live && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 font-display text-[11px] uppercase tracking-wide text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Em direto
              </span>
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm leading-snug">{video.title}</p>
        {!live && (
          <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">{formatDate(video.published)}</p>
        )}
      </div>
    </div>
  );
}

export default function YouTubeShowcase({
  initialVideos,
  filter,
  limit = 3,
  channelUrl,
  liveUrl,
  eyebrow = "YouTube",
  title = "Diretos e vídeos",
  sectionClassName,
}: {
  initialVideos: YoutubeVideo[];
  filter?: string;
  limit?: number;
  channelUrl: string;
  liveUrl: string;
  eyebrow?: string;
  title?: string;
  /** Se definido, o componente desenha a sua própria secção (e desaparece por inteiro quando não há nada para mostrar). */
  sectionClassName?: string;
}) {
  const [videos, setVideos] = useState<YoutubeVideo[]>(initialVideos);
  const [live, setLive] = useState<YoutubeVideo[]>([]);
  const [checked, setChecked] = useState(false);
  const [playing, setPlaying] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ limit: String(limit) });
      if (filter) qs.set("filter", filter);
      const res = await fetch(`/api/youtube?${qs}`, { cache: "no-store" });
      if (!res.ok) return;
      const feed: YoutubeFeed = await res.json();
      setLive(feed.live);
      setChecked(true);
      // Se o YouTube falhar por instantes e vier vazio, mantém o que já se mostrava.
      if (feed.videos.length > 0 || feed.live.length > 0) setVideos(feed.videos);
    } catch {
      /* mantém o estado atual */
    }
  }, [filter, limit]);

  useEffect(() => {
    refresh();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    // Ao voltar ao separador, atualiza logo (um direto pode ter começado ou acabado entretanto).
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  if (videos.length === 0 && live.length === 0) return null;

  const content = (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
            {eyebrow}
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
          >
            Diretos no YouTube <ExternalLink size={13} />
          </a>
          <a
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-white hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
          >
            Todos os vídeos <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {live.length === 0 && (
        <div className="mb-10 glass-card rounded-2xl p-5 flex flex-wrap items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-[var(--color-text-muted)]">
            <Radio size={18} />
          </span>
          <div className="flex-1 min-w-[200px]">
            <p className="font-display text-sm uppercase">
              {checked ? "Sem diretos no momento" : "A verificar diretos…"}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Consulta o{" "}
              <a
                href="#competicao"
                className="text-[var(--color-lime)] underline-offset-4 hover:underline"
              >
                calendário
              </a>{" "}
              para ver o horário dos diretos.
            </p>
          </div>
        </div>
      )}

      {live.length > 0 && (
        <div className="mb-10">
          <p className="mb-4 inline-flex items-center gap-2 font-display text-sm uppercase text-red-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            {live.length === 1 ? "A decorrer agora" : `${live.length} jogos a decorrer agora`}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                live
                playing={playing === v.id}
                onPlay={() => setPlaying(v.id)}
              />
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <p className="mb-4 font-display text-sm uppercase text-[var(--color-text-muted)]">
          Últimos vídeos
        </p>
      )}
      {videos.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              playing={playing === v.id}
              onPlay={() => setPlaying(v.id)}
            />
          ))}
        </div>
      )}
    </div>
  );

  return sectionClassName ? (
    <section className={sectionClassName}>
      <div className="container-bloko">{content}</div>
    </section>
  ) : (
    content
  );
}
