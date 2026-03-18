"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { HORAIRES, DAY_MAP } from "@/lib/data/horaires";

const NAV_LINKS = [
  { label: "La Table",    href: "/la-table" },
  { label: "Les Espaces", href: "/les-espaces" },
  { label: "Réceptions",  href: "/receptions" },
  { label: "Événements",  href: "/evenements" },
];

function useOpenStatus() {
  const now         = new Date();
  const day         = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayEntry = HORAIRES.find(h => DAY_MAP[h.jour] === day);
  if (!todayEntry || todayEntry.ferme) return { open: false, label: "Fermé aujourd'hui" };

  function parseRange(s: string | null): [number, number] | null {
    if (!s) return null;
    const parts = s.split("–").map(p =>
      p.trim().replace("h", ":").replace(/(\d+):(\d*)/, (_, h, m) => {
        const hh = parseInt(h);
        const mm = m ? parseInt(m.padEnd(2, "0")) : 0;
        return String(hh * 60 + mm);
      })
    );
    if (parts.length !== 2) return null;
    return [parseInt(parts[0]), parseInt(parts[1])];
  }

  const ranges = [todayEntry.midi, todayEntry.soir]
    .map(parseRange)
    .filter(Boolean) as [number, number][];

  for (const [start, end] of ranges) {
    if (currentTime >= start && currentTime <= end) {
      return { open: true, label: "Ouvert maintenant" };
    }
  }

  const nextRange = ranges.find(([start]) => currentTime < start);
  if (nextRange) {
    const h = Math.floor(nextRange[0] / 60);
    const m = nextRange[0] % 60;
    return { open: false, label: `Ouvre à ${h}h${m > 0 ? m : "00"}` };
  }

  return { open: false, label: "Fermé ce soir" };
}

export function Navbar() {
  const pathname  = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const status   = useOpenStatus();
  const menuRef  = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu mobile à chaque changement de page
  useEffect(() => { setOpen(false); }, [pathname]);

  // Bloque le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Anime le menu mobile avec GSAP (remplace Framer Motion AnimatePresence)
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    if (open) {
      gsap.set(menu, { display: "block" });
      gsap.fromTo(menu,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
      // Stagger des items de navigation
      gsap.fromTo(itemsRef.current,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.2, ease: "power2.out", delay: 0.05 }
      );
    } else {
      gsap.to(menu, {
        opacity: 0,
        y: -8,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => { gsap.set(menu, { display: "none" }); },
      });
    }
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-terracotta/95 backdrop-blur-md border-b border-gold/15 shadow-nav"
            : "bg-terracotta/95 backdrop-blur-md border-b border-gold/10"
        }`}
      >
        <nav className="container-main flex items-center justify-between h-20" aria-label="Navigation principale">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group outline-none"
            aria-label="Les Jardins de l'Hacienda — Accueil"
          >
            {/* Losange SVG */}
            <div className="shrink-0 transition-opacity duration-300 group-hover:opacity-80">
              <svg width="36" height="36" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                <path d="M36 4 L68 36 L36 68 L4 36 Z" stroke="#C9A96E" strokeWidth="1.5" fill="none" opacity="0.8"/>
                <path d="M36 16 L56 36 L36 56 L16 36 Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.4"/>
                <text x="36" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fontStyle="italic" fontWeight="600" fill="#C9A96E" opacity="0.95">JH</text>
              </svg>
            </div>
            {/* Texte */}
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold italic text-cream text-xl tracking-tight group-hover:text-gold transition-colors duration-300">
                Les Jardins
              </span>
              <span className="font-heading text-[10px] tracking-[0.38em] uppercase text-gold/70 group-hover:text-gold transition-colors duration-300 mt-0.5">
                de l&apos;Hacienda
              </span>
            </div>
          </Link>

          {/* Liens desktop */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <li key={href} className="relative">
                  <Link
                    href={href}
                    data-cursor-hover
                    className={`relative px-3 py-2 font-heading font-medium text-xs tracking-[0.12em] uppercase transition-colors duration-300 ${
                      active ? "text-rouge-light" : "text-cream/60 hover:text-cream"
                    }`}
                  >
                    {label}
                    <span
                      className="absolute bottom-0 left-3 right-3 h-px bg-rouge transition-all duration-400"
                      style={{
                        opacity:         active ? 1 : 0,
                        clipPath:        active ? "inset(0 0% 0 0%)" : "inset(0 50% 0 50%)",
                        transition:      "clip-path 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
                      }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA + badge statut + Hamburger */}
          <div className="flex items-center gap-3">

            {/* Badge ouvert/fermé — desktop uniquement */}
            <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 border text-xs tracking-[0.15em] uppercase font-sans transition-colors duration-300 ${
              status.open
                ? "border-green-500/30 text-green-400/80 bg-green-500/5"
                : "border-cream/10 text-cream/30"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.open ? "bg-green-400 animate-pulse" : "bg-cream/25"}`} />
              {status.label}
            </div>

            <Link
              href="/contact"
              data-magnetic
              data-cursor-text="RÉSERVER"
              className="hidden lg:inline-flex btn-primary text-xs px-5 py-2"
            >
              Réserver
            </Link>

            {/* Hamburger mobile */}
            <button
              onClick={() => setOpen(o => !o)}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              className="lg:hidden flex flex-col justify-center gap-1.5 w-8 h-8"
            >
              <span className={`block h-px bg-cream transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[5px] w-full" : "w-full"}`} />
              <span className={`block h-px bg-cream transition-all duration-300 ${open ? "opacity-0 w-0" : "w-4"}`} />
              <span className={`block h-px bg-cream transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[5px] w-full" : "w-6"}`} />
            </button>
          </div>

        </nav>
      </header>

      {/* Menu mobile — géré par GSAP (plus de Framer Motion) */}
      <div
        ref={menuRef}
        className="fixed inset-x-0 top-20 z-40 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        style={{
          display: "none",
          background: "rgba(30,16,8,0.98)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(201,169,110,0.15)",
        }}
      >
        <nav aria-label="Navigation mobile">
          <ul className="container-main py-6 flex flex-col gap-0 divide-y divide-gold/8" role="list">
            {/* Badge statut mobile */}
            <li className="py-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs tracking-[0.15em] uppercase font-sans ${
                status.open
                  ? "border-green-500/30 text-green-400/80 bg-green-500/5"
                  : "border-cream/10 text-cream/30"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.open ? "bg-green-400 animate-pulse" : "bg-cream/25"}`} />
                {status.label}
              </div>
            </li>

            {NAV_LINKS.map(({ label, href }, i) => (
              <li
                key={href}
                ref={el => { itemsRef.current[i] = el!; }}
              >
                <Link
                  href={href}
                  className={`flex items-center justify-between py-4 font-heading font-medium text-base tracking-[0.15em] uppercase transition-colors duration-300 ${
                    isActive(href) ? "text-rouge-light" : "text-cream/60"
                  }`}
                >
                  {label}
                  {isActive(href) && (
                    <span className="w-4 h-px bg-rouge" />
                  )}
                </Link>
              </li>
            ))}

            <li className="pt-4">
              <Link href="/contact" data-cursor-text="RÉSERVER" className="btn-primary w-full justify-center py-3 text-sm">
                Réserver une table
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
