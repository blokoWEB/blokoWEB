"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";
import { Move } from "lucide-react";

type PannellumViewerInstance = { destroy: () => void };

declare global {
  interface Window {
    pannellum?: {
      viewer: (container: string, config: Record<string, unknown>) => PannellumViewerInstance;
    };
  }
}

export default function PanoramaViewer({
  src,
  /** Ângulo horizontal (em graus) coberto pela foto — a panorâmica não é uma esfera completa. */
  haov = 140,
  /** Ângulo vertical (em graus) coberto pela foto. */
  vaov = 55,
}: {
  src: string;
  haov?: number;
  vaov?: number;
}) {
  const rawId = useId();
  const id = `pnlm-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const viewerRef = useRef<PannellumViewerInstance | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!scriptReady || !window.pannellum) return;

    viewerRef.current = window.pannellum.viewer(id, {
      type: "equirectangular",
      panorama: src,
      haov,
      vaov,
      autoLoad: true,
      showZoomCtrl: true,
      showFullscreenCtrl: true,
      compass: false,
      draggable: true,
      mouseZoom: true,
      hfov: Math.min(100, haov),
      minHfov: 40,
      maxHfov: haov,
      pitch: 0,
      yaw: 0,
    });

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, src, haov, vaov, id]);

  return (
    <div className="relative">
      <link rel="stylesheet" href="/vendor/pannellum/pannellum.css" />
      <Script
        src="/vendor/pannellum/pannellum.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div
        id={id}
        onPointerDown={() => setHasInteracted(true)}
        className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black"
      />
      {!hasInteracted && (
        <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none z-10">
          <span className="flex items-center gap-2 text-xs font-display uppercase tracking-wide px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white animate-pulse">
            <Move size={14} /> Arrasta para explorar
          </span>
        </div>
      )}
    </div>
  );
}
