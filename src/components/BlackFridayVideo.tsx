"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Vídeo da campanha que só se descarrega quando a pessoa carrega em play (1,9 MB). Antes disso mostra
 * apenas o cartaz (39 KB), para não gastar dados móveis a quem só está a ver a página.
 */
export default function BlackFridayVideo({ poster, src, label }: { poster: string; src: string; label: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative mx-auto lg:mx-0 w-56 sm:w-64 aspect-[9/16] rounded-2xl overflow-hidden bg-black glow-blue">
      {playing ? (
        <video src={src} controls autoPlay playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={label}
          className="group absolute inset-0 block w-full h-full"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes="(max-width: 640px) 60vw, 256px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 rounded-full bg-[var(--color-lime)] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play size={26} className="ml-1" fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
