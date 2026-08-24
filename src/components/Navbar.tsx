"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/site-data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card border-b border-white/5" : "bg-transparent"
      }`}
    >
      <nav className="container-bloko flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo-bloko.svg"
            alt="BLOKO"
            width={130}
            height={32}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-1 font-display text-sm tracking-wide uppercase">
          {navLinks.map((link) => (
            <li key={link.href} className="relative group">
              <Link
                href={link.href}
                className="flex items-center gap-1 px-4 py-8 text-[var(--color-text-muted)] hover:text-[var(--color-lime)] transition-colors"
              >
                {link.icon ? (
                  <Image src={link.icon} alt={link.label} width={317} height={166} className="h-6 w-auto" />
                ) : (
                  link.label
                )}
                {link.submenu.length > 0 && (
                  <ChevronDown size={13} className="group-hover:rotate-180 transition-transform" />
                )}
              </Link>
              {link.submenu.length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150">
                  <div className="glass-card rounded-2xl p-2 min-w-56 border border-white/10">
                    {link.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-3 rounded-xl text-xs text-[var(--color-text-muted)] hover:text-[var(--color-lime)] hover:bg-white/5 transition-colors normal-case tracking-normal"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={site.navPadelBookingUrl}
            target="_blank"
            rel="noreferrer"
            className="font-display text-sm uppercase tracking-wide px-5 py-2.5 rounded-full border border-[var(--color-lime)]/40 text-[var(--color-lime)] hover:bg-[var(--color-lime)] hover:text-black transition-colors"
          >
            Reservar Padel
          </a>
          <Link
            href="/aulas?categoria=ginasio"
            className="font-display text-sm uppercase tracking-wide px-5 py-2.5 rounded-full bg-[var(--color-lime)] text-black hover:bg-[var(--color-lime-soft)] transition-colors glow-lime"
          >
            Aulas Ginásio
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-[var(--color-text)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden glass-card border-t border-white/5"
          >
            <ul className="container-bloko py-6 flex flex-col gap-1 font-display uppercase tracking-wide">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <div className="flex items-center justify-between">
                    <Link href={link.href} onClick={() => setOpen(false)} className="py-3 text-lg">
                      {link.icon ? (
                        <Image
                          src={link.icon}
                          alt={link.label}
                          width={317}
                          height={166}
                          className="h-7 w-auto"
                        />
                      ) : (
                        link.label
                      )}
                    </Link>
                    {link.submenu.length > 0 && (
                      <button
                        onClick={() =>
                          setOpenMobileSection((v) => (v === link.href ? null : link.href))
                        }
                        aria-label={`Expandir ${link.label}`}
                        className="p-3 text-[var(--color-text-muted)]"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            openMobileSection === link.href ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {link.submenu.length > 0 && openMobileSection === link.href && (
                    <ul className="pl-4 pb-2 flex flex-col gap-1">
                      {link.submenu.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="block py-2.5 text-sm normal-case tracking-normal text-[var(--color-text-muted)]"
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="flex flex-col gap-3 pt-4">
                <a
                  href={site.navPadelBookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-center px-5 py-3 rounded-full border border-[var(--color-lime)]/40 text-[var(--color-lime)]"
                >
                  Reservar Padel
                </a>
                <Link
                  href="/aulas?categoria=ginasio"
                  onClick={() => setOpen(false)}
                  className="text-center px-5 py-3 rounded-full bg-[var(--color-lime)] text-black"
                >
                  Aulas Ginásio
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
