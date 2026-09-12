"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";

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
  /** Ângulo horizontal (em graus) coberto pela foto — modo "180° Panorama" do DJI. */
  haov = 180,
  /** Ângulo vertical (em graus) coberto pela foto. */
  vaov = 71,
  /** Direção inicial (em graus) — 0 é o centro da foto. */
  yaw = 0,
}: {
  src: string;
  haov?: number;
  vaov?: number;
  yaw?: number;
}) {
  const rawId = useId();
  const id = `pnlm-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const viewerRef = useRef<PannellumViewerInstance | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

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
      hfov: 100,
      minHfov: 30,
      maxHfov: 120,
      minYaw: -haov / 2,
      maxYaw: haov / 2,
      pitch: 0,
      yaw,
      autoRotate: -2,
      autoRotateInactivityDelay: 2000,
    });

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady, src, haov, vaov, yaw, id]);

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
        className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black"
      />
    </div>
  );
}
