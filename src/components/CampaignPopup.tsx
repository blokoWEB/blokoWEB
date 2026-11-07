"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import Portal from "@/components/Portal";
import { BLACK_FRIDAY } from "@/lib/promos";

type Campaign = {
  /** Identifica a campanha: quem a fecha não a volta a ver (guardado no telemóvel/computador). */
  key: string;
  href: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Depois desta data (ms) a campanha deixa de aparecer e passa a seguinte. */
  endsAt?: number;
};

// Aparece a primeira campanha da lista que ainda esteja ativa. Se a pessoa a fechar, não mostramos a seguinte
// logo a seguir (seria insistir): a seguinte só aparece quando a primeira terminar.
const CAMPAIGNS: Campaign[] = [
  {
    key: "black-friday-2026",
    href: BLACK_FRIDAY.href,
    src: BLACK_FRIDAY.poster,
    alt: "Black Friday BLOKO, 2º aniversário: ginásio durante 1 ano por 120€ (10€ por mês), só 30 vagas para novos clientes, até 22 de novembro",
    width: 800,
    height: 1000,
    endsAt: BLACK_FRIDAY.endsAt,
  },
  {
    key: "aula-experimental-padel",
    href: "/padel/aula-experimental",
    src: "/images/campaigns/aula-experimental-padel.jpg",
    alt: "Aula experimental de padel gratuita — marcação obrigatória",
    width: 1080,
    height: 1350,
  },
];

const SHOW_AFTER_MS = 4000;
const dismissedKey = (key: string) => `bloko-campaign-${key}-dismissed`;

function wasDismissed(key: string): boolean {
  try {
    return Boolean(localStorage.getItem(dismissedKey(key)));
  } catch {
    return false;
  }
}

export default function CampaignPopup() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const timer = setTimeout(() => {
      const active = CAMPAIGNS.find((c) => !c.endsAt || Date.now() < c.endsAt);
      if (!active || wasDismissed(active.key)) return;
      setCampaign(active);
      setVisible(true);
    }, SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  function dismiss() {
    setVisible(false);
    if (!campaign) return;
    try {
      localStorage.setItem(dismissedKey(campaign.key), "1");
    } catch {
      // Sem armazenamento (modo privado): o popup volta na próxima visita, nada de grave.
    }
  }

  if (isAdmin) return null;

  return (
    <Portal>
      <AnimatePresence>
        {visible && campaign && (
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
              className="relative w-full max-w-sm"
            >
              {/* O botão fica no canto, por fora do cartaz, para não tapar o que está escrito no topo dele. */}
              <button
                onClick={dismiss}
                aria-label="Fechar"
                className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-white text-black shadow-lg flex items-center justify-center hover:bg-[var(--color-lime)] transition-colors"
              >
                <X size={18} />
              </button>
              <div className="max-h-[90vh] rounded-2xl overflow-hidden glow-lime">
                <Link href={campaign.href} onClick={dismiss} className="block">
                  <Image
                    src={campaign.src}
                    alt={campaign.alt}
                    width={campaign.width}
                    height={campaign.height}
                    sizes="(max-width: 640px) 92vw, 384px"
                    className="w-full h-auto max-h-[90vh] object-contain"
                    priority
                  />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
