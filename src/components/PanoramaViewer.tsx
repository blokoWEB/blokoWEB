"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Move } from "lucide-react";

export default function PanoramaViewer({
  src,
  alt,
  aspectRatio,
}: {
  src: string;
  alt: string;
  /** Largura da imagem original, dividida pela altura visível do visor. */
  aspectRatio: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const dragState = useRef({ startX: 0, startOffset: 0 });

  function clamp(value: number) {
    const container = containerRef.current;
    if (!container) return value;
    const maxOffset = Math.max(0, container.scrollWidth - container.clientWidth);
    return Math.min(0, Math.max(value, -maxOffset));
  }

  function handlePointerDown(e: React.PointerEvent) {
    setDragging(true);
    setHasInteracted(true);
    dragState.current = { startX: e.clientX, startOffset: offset };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const delta = e.clientX - dragState.current.startX;
    setOffset(clamp(dragState.current.startOffset + delta));
  }

  function handlePointerUp() {
    setDragging(false);
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full aspect-[16/9] rounded-2xl overflow-hidden select-none ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div
        style={{
          width: `${aspectRatio * 100}%`,
          transform: `translateX(${offset}px)`,
          transition: dragging ? "none" : "transform 0.2s ease-out",
        }}
        className="relative h-full"
      >
        <Image src={src} alt={alt} fill draggable={false} className="object-cover pointer-events-none" />
      </div>

      {!hasInteracted && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
          <span className="flex items-center gap-2 text-xs font-display uppercase tracking-wide px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white animate-pulse">
            <Move size={14} /> Arrasta para explorar
          </span>
        </div>
      )}
    </div>
  );
}
