"use client";

/**
 * TemoignagesSection — sans Framer Motion
 * Défilement infini via CSS @keyframes, hover via CSS :hover
 * Header via GSAP ScrollTrigger (cohérent avec le reste du projet)
 */

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TEMOIGNAGES, TEMOIGNAGES_MARIAGES, GOOGLE_RATING } from "@/lib/data";

const ALL_TEMOIGNAGES = [
  ...TEMOIGNAGES.map(t => ({
    name:     t.name,
    comment:  t.comment,
    date:     t.date,
    occasion: t.occasion,
    initials: t.name.slice(0, 2).toUpperCase(),
  })),
  ...TEMOIGNAGES_MARIAGES.map(t => ({
    name:     t.couple,
    comment:  t.comment,
    date:     t.date,
    occasion: "Mariage",
    initials: t.initials,
  })),
];

const AVATAR_COLORS = [
  "#C0392B", "#2D4A3E", "#C9A96E", "#321608",
  "#C0392B", "#2D4A3E", "#C9A96E", "#321608",
];

const col1 = ALL_TEMOIGNAGES.slice(0, 3);
const col2 = ALL_TEMOIGNAGES.slice(3, 6);
const col3 = ALL_TEMOIGNAGES.slice(6, 9).length >= 2
  ? ALL_TEMOIGNAGES.slice(6, 9)
  : [
      ...ALL_TEMOIGNAGES.slice(6),
      ...ALL_TEMOIGNAGES.slice(4, 4 + (3 - ALL_TEMOIGNAGES.slice(6).length)),
    ];

// ── Colonne scrollante — CSS @keyframes (remplace Framer Motion motion.ul) ──
// Hook pour détecter prefers-reduced-motion
function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function TestimonialsColumn({
  items,
  duration = 18,
  className = "",
  colorOffset = 0,
  direction = "up",
}: {
  items: typeof ALL_TEMOIGNAGES;
  duration?: number;
  className?: string;
  colorOffset?: number;
  direction?: "up" | "down";
}) {
  const reducedMotion = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`} style={{ maxHeight: "620px" }}>
      <ul
        className="flex flex-col gap-4 pb-4 list-none m-0 p-0"
        style={{
          animation: reducedMotion ? "none" : `testimonial-scroll-${direction} ${duration}s linear infinite`,
          willChange: reducedMotion ? "auto" : "transform",
        }}
      >
        {/* Double la liste pour le défilement infini sans saut */}
        {[0, 1].map(rep =>
          items.map((t, i) => (
            <li
              key={`${rep}-${i}`}
              aria-hidden={rep === 1 ? "true" : "false"}
              className="testimonial-card p-6 rounded-2xl cursor-default select-none group transition-all duration-300"
              style={{
                background: "#F5F0E8",
                width: "min(400px, calc(100vw - 48px))",
                border: "1px solid rgba(30,16,8,0.12)",
                boxShadow: "0 6px 28px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.15)",
              }}
            >
              {/* Guillemet */}
              <div className="text-gold/60 group-hover:text-gold/90 transition-colors duration-300 mb-3">
                <svg width="20" height="15" viewBox="0 0 32 24" fill="currentColor">
                  <path d="M0 24V14.4C0 6.4 4.267 1.6 12.8 0l1.6 2.4C10.133 3.6 7.867 6 7.2 9.6H12.8V24H0zm19.2 0V14.4C19.2 6.4 23.467 1.6 32 0l1.6 2.4c-4.267 1.2-6.533 3.6-7.2 7.2h5.6V24H19.2z"/>
                </svg>
              </div>

              {/* Citation */}
              <p
                className="font-display font-light italic text-terracotta/80 group-hover:text-terracotta transition-colors duration-300 leading-relaxed mb-4"
                style={{ fontSize: "1.08rem", lineHeight: "1.7" }}
              >
                &ldquo;{t.comment}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-terracotta/10">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-heading font-bold text-xs"
                    style={{ background: AVATAR_COLORS[(i + colorOffset) % AVATAR_COLORS.length] }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-terracotta text-sm leading-none mb-0.5">{t.name}</p>
                    <p className="font-sans text-xs text-terracotta/45 mt-0.5">{t.date}</p>
                  </div>
                </div>
                <span className="font-sans text-xs text-terracotta/55 tracking-wide border border-terracotta/15 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {t.occasion}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// ── Section principale ───────────────────────────────────────────────────────
export function TemoignagesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);

  // Header animé avec GSAP ScrollTrigger (cohérent avec le reste du projet)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current?.children ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 overflow-hidden" style={{ background: "#1E1008" }}>

      {/* Header */}
      <div ref={headerRef} className="text-center mb-12 px-6">
        <span className="eyebrow text-gold/60 mb-3 block">Ils nous ont choisis</span>

        <h2
          className="font-display font-bold text-cream mb-5 tracking-tight"
          style={{ fontSize: "clamp(2.2rem, 3.5vw, 3.5rem)" }}
        >
          Ce qu&apos;ils en disent
        </h2>

        {/* Note Google */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const full = i < Math.floor(GOOGLE_RATING.noteNum);
              const half = !full && i < GOOGLE_RATING.noteNum;
              return (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" stroke="none">
                  {half ? (
                    <>
                      <defs>
                        <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                          <stop offset="50%" stopColor="#C9A96E"/>
                          <stop offset="50%" stopColor="rgba(201,169,110,0.2)"/>
                        </linearGradient>
                      </defs>
                      <polygon fill={`url(#half-${i})`} points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </>
                  ) : (
                    <polygon
                      fill={full ? "#C9A96E" : "rgba(201,169,110,0.2)"}
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    />
                  )}
                </svg>
              );
            })}
          </div>
          <span className="font-display font-bold text-gold/85 text-xl leading-none">{GOOGLE_RATING.note}</span>
          <span className="w-1 h-1 rounded-full bg-gold/30" />
          <a
            href="https://www.google.com/maps/place/Les+Jardins+de+l'Hacienda/@49.2125,5.9789,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-cream/40 tracking-[0.15em] uppercase hover:text-cream/70 transition-colors duration-300 underline underline-offset-4 decoration-cream/20 hover:decoration-cream/50"
          >
            +{GOOGLE_RATING.avis} {GOOGLE_RATING.label}
          </a>
          <span className="w-1 h-1 rounded-full bg-gold/30" />
          <a
            href="https://www.google.com/maps/place/Les+Jardins+de+l'Hacienda/@49.2125,5.9789,17z"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-text="VOIR"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity duration-300"
            aria-label="Voir sur Google Maps"
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-sans text-xs text-cream/35 tracking-wide">Voir sur Google</span>
          </a>
        </div>
      </div>


      <div
        className="flex justify-center gap-3 px-4"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          overflow: "hidden",
        }}
      >
        <TestimonialsColumn items={col1} duration={16} colorOffset={0} direction="up" />
        <TestimonialsColumn items={col2} duration={21} colorOffset={2} direction="up" className="hidden md:block" />
        <TestimonialsColumn items={col3} duration={18} colorOffset={4} direction="up" className="hidden lg:block" />
      </div>

      {/* CTA laisser un avis — après la lecture, avant de quitter */}
      <div className="text-center mt-10">
        <a
          href="https://www.google.com/maps/place/Les+Jardins+de+l'Hacienda/@49.2125,5.9789,17z"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.18em] uppercase text-gold/55 hover:text-gold transition-colors duration-300 border border-gold/20 hover:border-gold/45 px-5 py-2.5"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Laisser un avis Google
        </a>
      </div>

    </section>
  );
}
