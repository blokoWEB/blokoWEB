import ScrollReveal from "@/components/ScrollReveal";

type Faq = { question: string; answer: string };

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section className="container-bloko py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollReveal className="max-w-2xl mb-14">
        <p className="font-display text-xs tracking-[0.3em] uppercase text-[var(--color-blue-soft)] mb-4">
          Perguntas Frequentes
        </p>
        <h2 className="font-display font-bold text-3xl md:text-4xl uppercase">Ainda tens dúvidas?</h2>
      </ScrollReveal>

      <div className="space-y-4 max-w-3xl">
        {faqs.map((f, i) => (
          <ScrollReveal key={f.question} delay={i * 0.05}>
            <details className="glass-card rounded-2xl p-6 group">
              <summary className="font-display uppercase text-sm cursor-pointer list-none flex items-center justify-between gap-4">
                {f.question}
                <span className="text-[var(--color-lime)] group-open:rotate-45 transition-transform shrink-0">
                  +
                </span>
              </summary>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mt-4">{f.answer}</p>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
