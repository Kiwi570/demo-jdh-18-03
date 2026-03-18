"use client";

/**
 * CarteSaisonsSection — v01.1  (JDH v1.1)
 * - Type Saison propre (plus de cast hacky pour dishImage)
 * - Auto-rotation des saisons toutes les 12s (pause au hover / pendant animation)
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

// ── Type propre pour une saison ──────────────────────────────────────────────
interface Saison {
  id:         string;
  label:      string;
  mois:       string;
  num:        string;
  months:     number[];
  bgFrom:     string;
  bgTo:       string;
  accent:     string;
  accentText: string;
  bgImage:    string;
  dishImage:  string;
  ingredients: { nom: string; origine: string }[];
  citation:   string;
  icon:       React.ReactNode;
}

// ── Données des 4 saisons ─────────────────────────────────────────────────────
const SAISONS: Saison[] = [
  {
    id:         "printemps",
    label:      "Printemps",
    mois:       "Avr · Mai · Juin",
    num:        "01",
    months:     [3, 4, 5],   // 0-indexed
    bgFrom:     "#2D4A3E",
    bgTo:       "#1a2e27",
    accent:     "#7BAF84",
    accentText: "#A8D4B0",
    bgImage:    "/images/espaces/terrasse.jpg",
    dishImage:  "/images/receptions/mariage-3.jpg",
    ingredients: [
      { nom: "Asperges blanches",   origine: "Alsace"        },
      { nom: "Morilles fraîches",   origine: "Vosges"        },
      { nom: "Agneau de lait",      origine: "Lorraine"      },
      { nom: "Fraises Gariguette",  origine: "Sud-Ouest"     },
      { nom: "Radis multicolores",  origine: "Maraîchers locaux" },
    ],
    citation: "Au printemps, je cuisine comme on ouvre une fenêtre — l'air frais entre d'un coup.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.9"/>
        <line x1="16" y1="3" x2="16" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="16" y1="24" x2="16" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="16" x2="8" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="24" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="6.9" y1="6.9" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="21.5" y1="21.5" x2="25.1" y2="25.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="25.1" y1="6.9" x2="21.5" y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="10.5" y1="21.5" x2="6.9" y2="25.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id:         "ete",
    label:      "Été",
    mois:       "Jul · Août · Sep",
    num:        "02",
    months:     [6, 7, 8],
    bgFrom:     "#4A2010",
    bgTo:       "#321608",
    accent:     "#E8A040",
    accentText: "#F0C070",
    bgImage:    "/images/espaces/pool-party.jpg",
    dishImage:  "/images/espaces/restaurant.jpg",
    ingredients: [
      { nom: "Tomates cœur de bœuf", origine: "Jardin local"    },
      { nom: "Courgettes fleurs",     origine: "Maraîchers 54"   },
      { nom: "Bar de ligne",          origine: "Atlantique"       },
      { nom: "Abricots Bergeron",     origine: "Drôme"            },
      { nom: "Basilic Grand Vert",    origine: "Lorraine"          },
    ],
    citation: "L'été, les produits sont si beaux qu'ils n'ont besoin que d'être respectés.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" aria-hidden="true">
        <circle cx="16" cy="16" r="7" fill="currentColor" opacity="0.9"/>
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2"/>
      </svg>
    ),
  },
  {
    id:         "automne",
    label:      "Automne",
    mois:       "Oct · Nov · Déc",
    num:        "03",
    months:     [9, 10, 11],
    bgFrom:     "#3D1A08",
    bgTo:       "#2A1005",
    accent:     "#C0702A",
    accentText: "#E09050",
    bgImage:    "/images/espaces/restaurant.jpg",
    dishImage:  "/images/receptions/mariage-2.jpg",
    ingredients: [
      { nom: "Cèpes de Bordeaux",    origine: "Forêts lorraines" },
      { nom: "Magret de canard",     origine: "Sud-Ouest"         },
      { nom: "Courge Butternut",     origine: "Lorraine"           },
      { nom: "Truffes d'automne",    origine: "Périgord"           },
      { nom: "Noix fraîches",        origine: "Grenoble"           },
    ],
    citation: "L'automne est ma saison préférée — les champignons dictent le menu chaque matin.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" aria-hidden="true">
        <path d="M16 4 C8 4 4 10 4 16 C4 22 8 28 16 28 C20 28 23 25 25 22 C22 22 20 20 20 17 C20 14 22 12 25 12 C26 8 22 4 16 4Z" fill="currentColor" opacity="0.85"/>
        <path d="M20 4 C24 6 28 10 28 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      </svg>
    ),
  },
  {
    id:         "hiver",
    label:      "Hiver",
    mois:       "Jan · Fév · Mar",
    num:        "04",
    months:     [0, 1, 2],
    bgFrom:     "#1E1008",
    bgTo:       "#150C06",
    accent:     "#8BA8C0",
    accentText: "#B0C8E0",
    bgImage:    "/images/espaces/piscine.jpg",
    dishImage:  "/images/receptions/mariage-5.jpg",
    ingredients: [
      { nom: "Truffe noire Périgord", origine: "Dordogne"       },
      { nom: "Foie gras de canard",   origine: "Sud-Ouest"      },
      { nom: "Saint-Jacques",         origine: "Normandie"       },
      { nom: "Bœuf Charolais",        origine: "Bourgogne"      },
      { nom: "Agrumes de Menton",     origine: "Côte d'Azur"    },
    ],
    citation: "En hiver, la cuisine se fait réconfort. Je cherche la profondeur plutôt que la légèreté.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-full h-full" aria-hidden="true">
        <line x1="16" y1="3" x2="16" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="7.5" y1="7.5" x2="24.5" y2="24.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24.5" y1="7.5" x2="7.5" y2="24.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.9"/>
        <circle cx="16" cy="7"  r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="16" cy="25" r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="7"  cy="16" r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="25" cy="16" r="1.5" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
  },
];

// Détermine la saison active selon le mois courant
function getCurrentSaisonId(): string {
  const month = new Date().getMonth(); // 0-11
  return SAISONS.find(s => s.months.includes(month))?.id ?? "ete";
}

export function CarteSaisonsSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLDivElement>(null);
  const citationRef   = useRef<HTMLParagraphElement>(null);

  const [activeSaison, setActiveSaison] = useState(getCurrentSaisonId);
  const [isAnimating,  setIsAnimating]  = useState(false);
  const [isHovered,    setIsHovered]    = useState(false);

  const current = SAISONS.find(s => s.id === activeSaison) ?? SAISONS[1];

  // Animation entrée de section
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".saisons-header > *",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".saisons-tabs > *",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".saisons-content",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none none" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Animation de changement de saison — déclaré AVANT l'useEffect d'auto-rotation
  const changeSaison = useCallback((id: string) => {
    if (id === activeSaison || isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    // 1. Fade out contenu actuel
    tl.to(contentRef.current, { opacity: 0, y: -12, duration: 0.25, ease: "power2.in" });
    tl.to(ingredientsRef.current?.children ?? [], {
      opacity: 0, x: -10, stagger: 0.03, duration: 0.2, ease: "power2.in",
    }, "<");
    tl.to(citationRef.current, { opacity: 0, duration: 0.2 }, "<");

    // 2. Change l'état (nouveau fond via React)
    tl.call(() => setActiveSaison(id));

    // 3. Fade in nouveau contenu
    tl.fromTo(contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
    tl.fromTo(ingredientsRef.current?.children ?? [],
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, stagger: 0.07, duration: 0.5, ease: "power3.out" },
      "<0.1"
    );
    tl.fromTo(citationRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      "<0.15"
    );
  }, [activeSaison, isAnimating]);

  // Auto-rotation toutes les 12s — pause au hover ou pendant animation
  useEffect(() => {
    if (isHovered || isAnimating) return;
    const id = window.setInterval(() => {
      const currentIdx = SAISONS.findIndex(s => s.id === activeSaison);
      const nextIdx    = (currentIdx + 1) % SAISONS.length;
      changeSaison(SAISONS[nextIdx].id);
    }, 12000);
    return () => window.clearInterval(id);
  }, [isHovered, isAnimating, activeSaison, changeSaison]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background:  `linear-gradient(135deg, ${current.bgFrom} 0%, ${current.bgTo} 100%)`,
        transition:  "background 0.7s cubic-bezier(0.16,1,0.3,1)",
        paddingTop:  "clamp(4rem, 8vw, 7rem)",
        paddingBottom: "clamp(4rem, 8vw, 7rem)",
      }}
    >
      {/* ── FOND PHOTO SUBTIL — texture par saison (5% opacité) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={current.bgImage}
          alt=""
          fill
          quality={40}
          sizes="100vw"
          className="object-cover object-center"
          style={{
            opacity: 0.07,
            filter: "saturate(0.3) brightness(0.5)",
            transition: "opacity 0.7s ease",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Décor fond — grandes lettres saison ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display font-extrabold uppercase"
          style={{
            fontSize:    "clamp(8rem, 22vw, 20rem)",
            lineHeight:  1,
            letterSpacing: "-0.04em",
            color:       `${current.accent}`,
            opacity:     0.05,
            transition:  "color 0.7s ease",
            whiteSpace:  "nowrap",
          }}
        >
          {current.label}
        </span>
      </div>

      {/* ── Ligne dorée haut ── */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${current.accent}50, transparent)` }}
      />

      <div className="relative z-10 container-main">

        {/* ── Header ── */}
        <div className="saisons-header text-center mb-12">
          <span className="eyebrow mb-4 block" style={{ color: `${current.accent}CC` }}>
            La cuisine au fil des saisons
          </span>
          <h2
            className="font-display font-bold text-cream tracking-tight leading-none"
            style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)", letterSpacing: "-0.01em" }}
          >
            Une carte vivante,<br />
            <em className="italic" style={{ color: current.accentText }}>dictée par la nature</em>
          </h2>
          <div className="w-12 h-px mx-auto mt-6"
            style={{ background: `linear-gradient(to right, transparent, ${current.accent}, transparent)` }}
          />
        </div>

        {/* ── Onglets saisons ── */}
        <div className="saisons-tabs flex items-center justify-center gap-2 sm:gap-4 mb-12 flex-wrap">
          {SAISONS.map(saison => {
            const isActive = saison.id === activeSaison;
            return (
              <button
                key={saison.id}
                onClick={() => changeSaison(saison.id)}
                data-cursor-hover
                className="group relative flex flex-col items-center gap-2 px-5 sm:px-7 py-4 transition-all duration-400"
                style={{
                  background:  isActive ? `${saison.accent}20` : "rgba(255,255,255,0.04)",
                  border:      isActive
                    ? `1.5px solid ${saison.accent}70`
                    : "1.5px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  transform:   isActive ? "translateY(-3px)" : "translateY(0)",
                  boxShadow:   isActive ? `0 8px 32px ${saison.accent}20` : "none",
                }}
                aria-pressed={isActive}
                aria-label={`Saison : ${saison.label}`}
              >
                {/* Icône saison */}
                <div
                  className="w-7 h-7 transition-all duration-300"
                  style={{
                    color:   isActive ? saison.accentText : "rgba(245,240,232,0.3)",
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  {saison.icon}
                </div>

                {/* Label */}
                <span
                  className="font-heading font-semibold text-sm tracking-wide transition-colors duration-300"
                  style={{ color: isActive ? "rgba(245,240,232,0.95)" : "rgba(245,240,232,0.35)" }}
                >
                  {saison.label}
                </span>

                {/* Mois */}
                <span
                  className="font-sans text-xs tracking-[0.14em] transition-colors duration-300"
                  style={{ color: isActive ? `${saison.accentText}BB` : "rgba(245,240,232,0.2)" }}
                >
                  {saison.mois}
                </span>

                {/* Indicateur actif bas */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ background: saison.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Contenu saison ── */}
        <div className="saisons-content" ref={contentRef}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-4xl mx-auto">

            {/* Colonne gauche — ingrédients */}
            <div>
              <p
                className="font-sans text-xs tracking-[0.25em] uppercase mb-5"
                style={{ color: `${current.accent}90` }}
              >
                Ingrédients phares
              </p>

              <div ref={ingredientsRef} className="flex flex-col gap-3">
                {current.ingredients.map((ing, i) => (
                  <div
                    key={ing.nom}
                    className="flex items-center justify-between gap-4 group"
                    style={{
                      paddingBottom: "12px",
                      borderBottom: i < current.ingredients.length - 1
                        ? `1px solid ${current.accent}20`
                        : "none",
                    }}
                  >
                    {/* Numéro + nom */}
                    <div className="flex items-center gap-4">
                      <span
                        className="font-display font-bold shrink-0"
                        style={{ color: `${current.accent}45`, fontSize: "0.7rem", letterSpacing: "0.15em" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="font-heading font-medium text-base"
                        style={{ color: "rgba(245,240,232,0.85)" }}
                      >
                        {ing.nom}
                      </span>
                    </div>

                    {/* Origine */}
                    <span
                      className="font-sans text-xs tracking-wide shrink-0"
                      style={{
                        color:        `${current.accent}70`,
                        borderLeft:   `1px solid ${current.accent}25`,
                        paddingLeft:  "12px",
                      }}
                    >
                      {ing.origine}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tag "Carte actuelle" si c'est la saison en cours */}
              {current.months.includes(new Date().getMonth()) && (
                <div
                  className="inline-flex items-center gap-2 mt-6 px-4 py-2"
                  style={{
                    background:   `${current.accent}15`,
                    border:       `1px solid ${current.accent}40`,
                    borderRadius: "40px",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: current.accent }}
                  />
                  <span
                    className="font-sans text-xs tracking-[0.2em] uppercase"
                    style={{ color: current.accentText }}
                  >
                    Carte en cours
                  </span>
                </div>
              )}

              {/* Photo plat signature de la saison */}
              {current.dishImage && (
                <div
                  className="relative mt-6 overflow-hidden"
                  style={{
                    aspectRatio: "16/9",
                    borderRadius: "10px",
                    border: `1px solid ${current.accent}25`,
                    boxShadow: `0 12px 40px rgba(0,0,0,0.35)`,
                  }}
                >
                  <Image
                    src={current.dishImage}
                    alt={`Plat signature — ${current.label}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    quality={80}
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)` }}
                  />
                  <span
                    className="absolute bottom-3 left-4 font-sans text-xs tracking-[0.18em] uppercase"
                    style={{ color: `${current.accentText}CC` }}
                  >
                    Plat de saison
                  </span>
                </div>
              )}
            </div>

            {/* Colonne droite — numéro géant + citation */}
            <div className="flex flex-col justify-between gap-8">

              {/* Numéro saison display */}
              <div
                className="font-display font-extrabold leading-none select-none"
                style={{
                  fontSize:    "clamp(6rem, 14vw, 10rem)",
                  letterSpacing: "-0.04em",
                  color:       `${current.accent}`,
                  opacity:     0.20,
                  lineHeight:  0.9,
                }}
                aria-hidden="true"
              >
                {current.num}
              </div>

              {/* Citation Chef */}
              <div>
                <div
                  className="w-8 h-px mb-5"
                  style={{ background: current.accent }}
                />
                <blockquote>
                  <p
                    ref={citationRef}
                    className="font-display font-medium italic leading-relaxed"
                    style={{
                      fontSize:  "clamp(1.05rem, 1.5vw, 1.25rem)",
                      color:     "rgba(245,240,232,0.75)",
                      lineHeight: 1.65,
                    }}
                  >
                    &ldquo;{current.citation}&rdquo;
                  </p>
                  <footer className="mt-4 flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: `${current.accent}25`, border: `1px solid ${current.accent}50` }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: current.accentText }}>
                        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/>
                        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/><path d="M18 15v7"/>
                      </svg>
                    </div>
                    <cite
                      className="font-sans text-xs tracking-[0.2em] uppercase not-italic"
                      style={{ color: `${current.accent}80` }}
                    >
                      Chef Régis Clauss
                    </cite>
                  </footer>
                </blockquote>

                {/* CTA vers la carte */}
                <a
                  href="/la-table"
                  data-cursor-hover
                  className="inline-flex items-center gap-3 mt-8 group"
                >
                  <span
                    className="font-sans text-xs tracking-[0.22em] uppercase transition-colors duration-300"
                    style={{ color: `${current.accent}80` }}
                  >
                    Voir la carte de la semaine
                  </span>
                  <svg
                    width="14" height="7" viewBox="0 0 16 8" fill="none"
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                    style={{ color: current.accent }}
                  >
                    <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Ligne dorée bas ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${current.accent}35, transparent)` }}
      />
    </section>
  );
}
