"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import Portal from "@/components/Portal";

// Muda esta key sempre que trocares de campanha — garante que quem já viu
// (e fechou) a campanha anterior volta a ver a nova.
const DISMISSED_KEY = "bloko-campaign-setembro-2026-dismissed";
const SHOW_AFTER_MS = 4000;

export default function CampaignPopup() {
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

  if (isAdmin) return null;

  return (
    <Portal>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={dismiss}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl overflow-hidden glow-lime"
            >
              <button
                onClick={dismiss}
                aria-label="Fechar"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X size={16} />
              </button>
              <Image
                src="/images/campaigns/setembro-2026.jpg"
                alt="Setembro já começou — 50% de desconto na 1ª mensalidade"
                width={750}
                height={890}
                className="w-full h-auto"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
