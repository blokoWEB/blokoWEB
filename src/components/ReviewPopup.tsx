"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X } from "lucide-react";
import { site } from "@/lib/site-data";

const DISMISSED_KEY = "bloko-review-popup-dismissed";
const SHOW_AFTER_MS = 25000;

export default function ReviewPopup() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    const timer = setTimeout(() => setVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  }

  return (
    <AnimatePresence>
      {visible && !isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 right-4 left-24 sm:inset-x-auto sm:left-auto sm:max-w-xs z-40 glass-card rounded-2xl p-5"
        >
          <button
            onClick={dismiss}
            aria-label="Fechar"
            className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-white"
          >
            <X size={16} />
          </button>
          <div className="flex gap-0.5 text-[var(--color-lime)] mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" />
            ))}
          </div>
          <p className="text-sm text-[var(--color-text)] mb-1 pr-4">O que achas do BLOKO?</p>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            Deixa-nos uma review no Google — ajuda-nos imenso.
          </p>
          <div className="flex gap-2">
            <a
              href={site.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
              onClick={dismiss}
              className="flex-1 text-center font-display uppercase text-xs tracking-wide px-4 py-2.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors"
            >
              Deixar review
            </a>
            <button
              onClick={dismiss}
              className="font-display uppercase text-xs tracking-wide px-4 py-2.5 rounded-full border border-white/15 text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              Agora não
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
