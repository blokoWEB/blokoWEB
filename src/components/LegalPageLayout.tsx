import type { ReactNode } from "react";
import ScrollReveal from "@/components/ScrollReveal";

export default function LegalPageLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-32 pb-24">
      <div className="container-bloko max-w-3xl">
        <ScrollReveal className="mb-12">
          <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-lime)] mb-4">
            {eyebrow}
          </p>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl uppercase mb-3">{title}</h1>
          <p className="text-xs text-[var(--color-text-muted)]">Última atualização: {updated}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <div
            className="glass-card rounded-2xl p-8 md:p-10 space-y-6 text-sm leading-relaxed text-[var(--color-text-muted)]
            [&_h2]:font-display [&_h2]:uppercase [&_h2]:text-base [&_h2]:text-white [&_h2]:tracking-wide [&_h2]:mb-3 [&_h2]:mt-8 [&_h2:first-child]:mt-0
            [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-3
            [&_a]:text-[var(--color-lime)] [&_a:hover]:underline [&_strong]:text-white"
          >
            {children}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
