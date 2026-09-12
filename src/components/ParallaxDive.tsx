"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Full-viewport section that "dives" as the user scrolls past it:
 * background scales/blurs and content fades, creating a depth transition
 * into the next section instead of a flat cut.
 */
export default function ParallaxDive({
  image,
  children,
  overlay = true,
  mobilePosition = "center",
  mobileSize = "cover",
}: {
  image: string;
  children: ReactNode;
  overlay?: boolean;
  /** background-position used only below the sm breakpoint — handy for very wide
   * panoramas that get over-cropped on narrow/tall mobile viewports. */
  mobilePosition?: string;
  /** background-size used only below the sm breakpoint. For a tall/portrait
   * source image, "cover" often leaves no vertical slack to crop with
   * `mobilePosition` (the image height already matches the viewport height).
   * Pass something like "auto 160%" to zoom in first, so positioning can
   * actually hide an unwanted part of the photo (e.g. a glass-wall reflection). */
  mobileSize?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.5, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden bg-[var(--color-bg)]">
      <motion.div
        style={{
          scale,
          opacity,
          filter,
          backgroundImage: `url(${image})`,
          backgroundPosition: mobilePosition,
          backgroundSize: mobileSize,
        }}
        className="absolute inset-0 sm:hidden"
      />
      <motion.div
        style={{ scale, opacity, filter, backgroundImage: `url(${image})` }}
        className="absolute inset-0 bg-cover bg-center hidden sm:block"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-[var(--color-bg)]" />
      )}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        {children}
      </motion.div>
    </section>
  );
}
