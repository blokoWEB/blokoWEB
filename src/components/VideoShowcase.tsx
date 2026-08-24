"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export default function VideoShowcase({ src, poster }: { src: string; poster?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.6 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      video.muted = false;
      video.play().catch(() => {
        // Browser blocked unmuted autoplay — fall back to muted so it still plays;
        // the user can unmute via the native controls.
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.pause();
    }
  }, [isInView]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 1, 1, 0.2]);

  return (
    <motion.div
      ref={containerRef}
      style={{ scale, opacity }}
      className="max-w-sm mx-auto aspect-[9/16] rounded-3xl overflow-hidden glow-blue"
    >
      <video
        ref={videoRef}
        loop
        playsInline
        controls
        preload="metadata"
        poster={poster}
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
    </motion.div>
  );
}
