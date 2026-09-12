import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { navLinks, site, whatsappGroups } from "@/lib/site-data";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[var(--color-bg-elevated)]">
      <div className="container-bloko py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/logo-bloko.svg"
            alt="BLOKO"
            width={140}
            height={35}
            className="h-8 w-auto mb-4"
          />
          <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-xs">
            Um espaço único e versátil em Bragança. Impressionamos pelo tamanho e espaço —
            promovemos o desporto e o convívio.
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href={site.facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              <FacebookIcon />
            </a>
            <a
              href={site.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] transition-colors"
            >
              <YoutubeIcon />
            </a>
          </div>
        </div>

        <div className="hidden sm:block">
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[var(--color-lime)] mb-4">
            Navegação
          </h3>
          <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-[var(--color-text)] transition-colors">
                  {link.label}
                </Link>
                {link.submenu.length > 0 && (
                  <ul className="pl-4 mt-1.5 space-y-1.5">
                    {link.submenu.map((sub) => (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          className="text-xs hover:text-[var(--color-text)] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[var(--color-lime)] mb-4 flex items-center gap-2">
            <MessageCircle size={14} /> Grupos de WhatsApp
          </h3>
          <ul className="space-y-3 text-sm text-[var(--color-text-muted)] mb-4">
            {whatsappGroups.map((g) => (
              <li key={g.name}>
                <span className="text-[var(--color-text)]">{g.name}</span>
                <p className="text-xs mt-0.5">{g.description}</p>
              </li>
            ))}
          </ul>
          <a
            href={site.whatsappCommunityUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wide text-[var(--color-lime)] hover:gap-3 transition-all"
          >
            Entrar nos grupos →
          </a>
        </div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-[var(--color-lime)] mb-4">
            Onde estamos
          </h3>
          <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="shrink-0 mt-0.5 text-[var(--color-blue-soft)]" />
              {site.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-[var(--color-blue-soft)]" />
              <a href={site.phoneHref} className="hover:text-[var(--color-text)] transition-colors">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-[var(--color-blue-soft)]" />
              <a href={`mailto:${site.email}`} className="hover:text-[var(--color-text)] transition-colors">
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-bloko py-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[var(--color-text-muted)]">
          <Link href="/politica-privacidade" className="hover:text-[var(--color-text)] transition-colors">
            Política de Privacidade
          </Link>
          <Link href="/politica-cookies" className="hover:text-[var(--color-text)] transition-colors">
            Política de Cookies
          </Link>
          <Link href="/termos-condicoes" className="hover:text-[var(--color-text)] transition-colors">
            Termos e Condições
          </Link>
          <a
            href="https://www.livroreclamacoes.pt/inicio/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[var(--color-text)] transition-colors"
          >
            Livro de Reclamações Online
          </a>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-bloko py-6 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
          <p>© {new Date().getFullYear()} BLOKO. Todos os direitos reservados.</p>
          <p>Padel · Ginásio · Lounge — Bragança</p>
          <p>
            Design with <span className="text-red-400">❤</span> by{" "}
            <a
              href="https://beup.pt"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--color-text)] transition-colors"
            >
              beup
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
