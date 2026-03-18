"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { CHIFFRES_CLES } from "@/lib/data";

// Icônes SVG par stat — une par type
const STAT_ICONS: Record<number, React.ReactNode> = {
  0: ( // Événements
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
    </svg>
  ),
  1: ( // Avec le Chef
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
      <path d="M18 15v7"/>
    </svg>
  ),
  2: ( // Menus par an
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="2"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  3: ( // Convives max
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
};

export function AccrocheSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Texte accroche
      gsap.fromTo(
        textRef.current?.querySelectorAll(".text-line") ?? [],
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          stagger: 0.14,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: textRef.current, start: "top 80%" },
        }
      );

      // Ligne décorative qui s'étire
      gsap.fromTo(".accroche-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          transformOrigin: "left",
          scrollTrigger: { trigger: textRef.current, start: "top 75%" },
        }
      );

      // Chiffres — CountUp au scroll
      const counters = statsRef.current?.querySelectorAll<HTMLElement>(".counter-value");
      counters?.forEach((el) => {
        const target = Number(el.dataset.target ?? 0);
        const obj = { val: 0 };
        gsap.fromTo(
          obj,
          { val: 0 },
          {
            val: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(obj.val).toString();
            },
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Animation d'entrée des cards stats
      gsap.fromTo(".stat-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 82%" },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="accroche"
      ref={sectionRef}
      className="bg-cream overflow-hidden"
    >

      {/* ── ACCROCHE TEXTE ── */}
      <div className="container-main py-section pb-24">
        <div ref={textRef} className="max-w-4xl">

          <span className="text-line eyebrow text-gold/70 mb-6 block opacity-0">
            Notre philosophie
          </span>

          <h2
            className="text-line font-display font-extrabold text-terracotta leading-none mb-8 opacity-0 tracking-tight"
            style={{ fontSize: "clamp(2.4rem, 4.2vw, 4.2rem)", letterSpacing: "-0.01em", lineHeight: "1.08" }}
          >
            Un lieu où chaque repas<br />
            <em className="italic text-rouge">devient un souvenir.</em>
          </h2>

          <div className="accroche-line w-24 h-[1.5px] bg-rouge mb-8" style={{ transformOrigin: "left" }} />

          <p className="text-line font-heading font-light text-terracotta/65 text-xl leading-relaxed max-w-2xl opacity-0">
            Entre Metz et Nancy, les Jardins de l&apos;Hacienda sont un endroit où le temps
            ralentit — cuisine de saison du Chef Régis Clauss, terrasse ombragée par des arbres
            centenaires et piscine sous le ciel lorrain. Ici, chaque repas a le goût d&apos;un souvenir.
          </p>

        </div>
      </div>

      {/* ── BANDE CHIFFRES CLÉS ── fond sombre pour contraste maximal ── */}
      <div
        ref={statsRef}
        className=""
        style={{
          background: "linear-gradient(135deg, #1E1008 0%, #2A1208 50%, #1E1008 100%)",
        }}
      >
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gold/10 divide-y lg:divide-y-0">
            {CHIFFRES_CLES.map(({ valeur, suffixe, label, desc }, index) => (
              <div
                key={label}
                className="stat-card group px-8 py-10 text-center hover:bg-white/3 transition-colors duration-500 opacity-0 relative overflow-hidden"
              >
                {/* Trait doré haut — hover reveal */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gold/0 group-hover:bg-gold/40 transition-all duration-500 w-12" />

                {/* Icône micro */}
                <div className="flex items-center justify-center mb-3 text-gold/40 group-hover:text-gold/70 transition-colors duration-300">
                  {STAT_ICONS[index]}
                </div>

                {/* Valeur animée */}
                <div className="flex items-end justify-center gap-0.5 mb-2">
                  <span
                    className="counter-value font-display font-bold text-cream leading-none tracking-tight"
                    data-target={valeur}
                    style={{ fontSize: "clamp(2.4rem, 3.8vw, 3.5rem)" }}
                  >
                    0
                  </span>
                  <span
                    className="font-display font-bold text-gold leading-none pb-1 tracking-tight"
                    style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}
                  >
                    {suffixe}
                  </span>
                </div>

                {/* Label */}
                <p className="font-heading font-semibold text-sm tracking-[0.15em] uppercase text-gold/70 mb-1 group-hover:text-gold transition-colors duration-300">
                  {label}
                </p>

                {/* Desc */}
                <p className="font-sans text-xs text-cream/35 tracking-wide group-hover:text-cream/55 transition-colors duration-300">
                  {desc}
                </p>

                {/* Trait doré bas */}
                <div className="w-0 group-hover:w-8 h-px bg-rouge mx-auto mt-4 transition-all duration-500 ease-out" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

