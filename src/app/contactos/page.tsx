import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ParallaxDive from "@/components/ParallaxDive";
import ScrollReveal from "@/components/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contactos",
  description: "Contactos, morada e horários do BLOKO em Bragança. Telefone, WhatsApp e formulário.",
  path: "/contactos",
});

export default function ContactosPage() {
  const mapQuery = encodeURIComponent(site.address);

  return (
    <div>
      <ParallaxDive image="/images/real-exterior.jpg">
        <p className="font-display text-xs tracking-[0.4em] uppercase text-[var(--color-lime)] mb-4">
          Contactos
        </p>
        <h1 className="font-display font-extrabold text-5xl md:text-8xl uppercase text-white">
          Precisas de <span className="text-gradient-lime">ajuda?</span>
        </h1>
      </ParallaxDive>

      <div className="py-24">
        <div className="container-bloko">
          <div className="grid lg:grid-cols-2 gap-10 mb-10">
            <ScrollReveal>
              <div className="glass-card rounded-2xl p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-[var(--color-lime)] shrink-0 mt-1" />
                  <div>
                    <p className="font-display uppercase text-xs tracking-wide text-[var(--color-text-muted)] mb-1">
                      Morada
                    </p>
                    <p>{site.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={20} className="text-[var(--color-lime)] shrink-0 mt-1" />
                  <div>
                    <p className="font-display uppercase text-xs tracking-wide text-[var(--color-text-muted)] mb-1">
                      Telefone / WhatsApp
                    </p>
                    <a href={site.phoneHref} className="hover:text-[var(--color-lime)] transition-colors">
                      {site.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MessageCircle size={20} className="text-[var(--color-lime)] shrink-0 mt-1" />
                  <div>
                    <p className="font-display uppercase text-xs tracking-wide text-[var(--color-text-muted)] mb-1">
                      Comunidade WhatsApp
                    </p>
                    <a
                      href={site.whatsappCommunityUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[var(--color-lime)] transition-colors"
                    >
                      Entrar nos grupos do clube
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail size={20} className="text-[var(--color-lime)] shrink-0 mt-1" />
                  <div>
                    <p className="font-display uppercase text-xs tracking-wide text-[var(--color-text-muted)] mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${site.email}`}
                      className="hover:text-[var(--color-lime)] transition-colors"
                    >
                      {site.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 pt-2 border-t border-white/5">
                  <Clock size={20} className="text-[var(--color-blue-soft)] shrink-0 mt-1" />
                  <div className="text-sm space-y-3">
                    <div>
                      <p className="font-display uppercase text-xs tracking-wide text-[var(--color-text-muted)] mb-1.5">
                        Horário — Ginásio
                      </p>
                      {site.hours.ginasio.map((h) => (
                        <p key={h.days} className="text-[var(--color-text-muted)]">
                          <span className="text-white">{h.days}</span> — {h.time}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p className="font-display uppercase text-xs tracking-wide text-[var(--color-text-muted)] mb-1.5">
                        Horário — Padel
                      </p>
                      {site.hours.padel.map((h) => (
                        <p key={h.days} className="text-[var(--color-text-muted)]">
                          <span className="text-white">{h.days}</span> — {h.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <ContactForm />
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.15}>
            <div className="rounded-2xl overflow-hidden glow-blue h-full min-h-[380px]">
              <iframe
                title="Localização BLOKO"
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
