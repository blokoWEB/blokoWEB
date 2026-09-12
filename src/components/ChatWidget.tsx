"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import Portal from "@/components/Portal";
import { matchFaq, type FaqEntry } from "@/lib/chatbot-faq";
import { site } from "@/lib/site-data";

type Message = { from: "bot" | "user"; text: string; fallback?: boolean };

const BUBBLE_DELAY_MS = 350;

const GREETING =
  "Olá! Sou o Blokinho, o assistente do BLOKO. Pergunta-me preços, horários, ou o que quiseres saber sobre o clube.";

const SUGGESTIONS = [
  "Preço da hora de padel",
  "Preço do ginásio",
  "Horários",
  "Vamos treinar?",
];

const FALLBACK = `Essa não sei responder aqui — mas fala diretamente connosco no WhatsApp, é rápido.`;

export default function ChatWidget() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: "bot", text: GREETING }]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<FaqEntry | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function addBotBubble(text: string, delay: number, fallback = false) {
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text, fallback }]);
    }, delay);
  }

  function send(question: string) {
    const q = question.trim();
    if (!q) return;
    setMessages((prev) => [...prev, { from: "user", text: q }]);
    setInput("");

    // Se estávamos à espera de resposta a uma pergunta do bot, tenta interpretá-la primeiro.
    const pending = pendingRef.current;
    if (pending?.followUp) {
      pendingRef.current = null;
      const tailored = pending.followUp(q);
      if (tailored) {
        addBotBubble(tailored, BUBBLE_DELAY_MS);
        return;
      }
      // Não percebeu a resposta — cai para o reconhecimento normal de perguntas.
    }

    const match = matchFaq(q);

    if (!match) {
      addBotBubble(FALLBACK, BUBBLE_DELAY_MS, true);
      return;
    }

    addBotBubble(match.answer, BUBBLE_DELAY_MS);
    if (match.prompt) {
      addBotBubble(match.prompt, BUBBLE_DELAY_MS * 2.4);
      pendingRef.current = match.followUp ? match : null;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  if (isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        className="fixed bottom-4 left-4 z-40 w-14 h-14 rounded-full bg-[var(--color-lime)] text-black glow-lime flex items-center justify-center hover:bg-[var(--color-lime-soft)] transition-colors"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <Portal>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-20 left-4 z-40 w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[560px] flex flex-col glass-card rounded-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 shrink-0">
                <div className="w-9 h-9 rounded-full bg-[var(--color-lime)]/10 text-[var(--color-lime)] flex items-center justify-center">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="font-display uppercase text-sm">Blokinho</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Assistente BLOKO</p>
                </div>
              </div>

              <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.from === "bot"
                        ? "bg-white/5 text-[var(--color-text)]"
                        : "bg-[var(--color-lime)] text-black ml-auto"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}

                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-xs uppercase tracking-wide px-3 py-2 rounded-full border border-white/15 text-[var(--color-text-muted)] hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {messages[messages.length - 1]?.fallback && (
                  <a
                    href={site.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-display uppercase text-xs tracking-wide px-4 py-2.5 rounded-full bg-[var(--color-lime)] text-black glow-lime hover:bg-[var(--color-lime-soft)] transition-colors"
                  >
                    Falar no WhatsApp
                  </a>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 p-3 border-t border-white/10 shrink-0"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escreve a tua pergunta..."
                  className="flex-1 rounded-full bg-black/30 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-lime)]"
                />
                <button
                  type="submit"
                  aria-label="Enviar"
                  className="w-10 h-10 shrink-0 rounded-full bg-[var(--color-lime)] text-black flex items-center justify-center hover:bg-[var(--color-lime-soft)] transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
