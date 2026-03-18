"use client";

/**
 * TroisUniversSection — v02.0
 * Desktop : grille 3 colonnes portrait avec hover interactif
 * Mobile  : swipe horizontal snap scroll + indicateur pagination dots
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

const UNIVERS = [
  {
    id:       "table",
    title:    "La Table",
    subtitle: "Une cuisine de saison réinventée chaque semaine par le Chef Régis Clauss",
    href:     "/la-table",
    cta:      "Découvrir la carte",
    accent:   "#C9A96E",
    image:    "/images/univers-table.avif",
    num:      "01",
  },
  {
    id:       "espaces",
    title:    "Les Espaces",
    subtitle: "Du restaurant intime à la grande terrasse estivale avec piscine",
    href:     "/les-espaces",
    cta:      "Visiter les lieux",
    accent:   "#2D4A3E",
    image:    "/images/univers-espaces.avif",
    num:      "02",
  },
  {
    id:       "receptions",
    title:    "Vos Événements",
    subtitle: "Mariages, anniversaires, soirées privées dans un cadre d'exception",
    href:     "/receptions",
    cta:      "Organiser mon événement",
    accent:   "#C0392B",
    image:    "/images/univers-evenements.avif",
    num:      "03",
  },
];

export function TroisUniversSection() {
  const sectionRef     = useRef<HTMLElement>(null);
  const scrollRef      = useRef<HTMLDivElement>(null);
  const [hoveredId,    setHoveredId]    = useState<string | null>(null);
  const [activeIndex,  setActiveIndex]  = useState(0);
  const [isMobile,     setIsMobile]     = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".univers-panel",
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger:  0.12,
          duration: 1,
          ease:     "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   "top 78%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isMobile || !scrollRef.current) return;
    const cards = Array.from(scrollRef.current.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const idx = cards.indexOf(visible[0].target as HTMLElement);
          if (idx >= 0) setActiveIndex(idx);
        }
      },
      { threshold: 0.55, root: scrollRef.current }
    );
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [isMobile]);

  const scrollToCard = useCallback((idx: number) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[idx] as HTMLElement;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIndex(idx);
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream py-section relative">
      <div className="container-main">

        <div className="text-center mb-14">
          <span className="eyebrow text-gold/70 mb-4 block">La Table · Les Espaces · Les Événements</span>
          <h2 className="section-title text-terracotta">Trois mondes, <em className="italic text-rouge">une adresse</em></h2>
        </div>

        {/* ── DESKTOP : grille 3 colonnes ── */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-2">
          {UNIVERS.map(({ id, title, subtitle, href, cta, accent, image, num }) => {
            const isHovered = hoveredId === id;
            const isDimmed  = hoveredId !== null && !isHovered;
            return (
              <Link
                key={id}
                href={href}
                className="univers-panel group opacity-0 relative overflow-hidden block"
                data-cursor-text="DÉCOUVRIR"
                style={{
                  aspectRatio:  "3/4",
                  borderRadius: "14px",
                  boxShadow:    isHovered ? "0 28px 70px rgba(15,8,5,0.32)" : "0 8px 32px rgba(15,8,5,0.18)",
                  transform:    isHovered ? "translateY(-6px) scale(1.01)" : isDimmed ? "scale(0.97)" : "scale(1)",
                  opacity:      isDimmed ? 0.7 : 1,
                  transition:   "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease, box-shadow 0.5s ease",
                }}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <Image src={image} alt={title} fill sizes="33vw" quality={85} className="object-cover object-center" style={{ transform: isHovered ? "scale(1.07)" : "scale(1)", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)", filter: id === "table" ? "brightness(1.07) saturate(1.15) sepia(0.04)" : id === "espaces" ? "brightness(1.12) saturate(1.07) hue-rotate(3deg)" : "brightness(1.02) contrast(1.04) saturate(0.95)" }} />

                {/* Overlay gradient de base — couvre seulement le tiers bas */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,8,5,0.96) 0%, rgba(15,8,5,0.82) 22%, rgba(15,8,5,0.30) 45%, transparent 65%)" }} />

                {/* Overlay accent couleur au hover */}
                <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${accent}18 0%, transparent 65%)`, opacity: isHovered ? 1 : 0, transition: "opacity 0.5s ease" }} />

                {/* Numéro */}
                <div className="absolute top-5 right-5 font-display font-bold" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: isHovered ? "rgba(245,240,232,0.7)" : "rgba(245,240,232,0.35)", transition: "color 0.3s ease" }}>{num}</div>

                {/* Trait bas animé */}
                <div className="absolute bottom-0 left-0 h-0.5" style={{ width: isHovered ? "100%" : "0%", background: accent, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />

                {/* Zone texte */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-7 pb-8 pt-10"
                  style={{
                    background: isHovered
                      ? "linear-gradient(to top, rgba(30,8,5,0.97) 0%, rgba(30,8,5,0.92) 60%, rgba(30,8,5,0.5) 85%, transparent 100%)"
                      : "transparent",
                    transition: "background 0.5s ease",
                    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                  }}
                >
                  {/* Trait décoratif */}
                  <div className="mb-4" style={{ width: isHovered ? "40px" : "20px", height: "1.5px", background: "rgba(245,240,232,0.6)", transition: "width 0.5s ease" }} />

                  <h3
                    className="font-display font-bold text-cream leading-tight mb-2 tracking-tight transition-all duration-400"
                    style={{ fontSize: isHovered ? "clamp(1.9rem, 2.6vw, 2.4rem)" : "clamp(1.7rem, 2.3vw, 2.1rem)" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-heading font-light text-cream/75 leading-relaxed mb-4"
                    style={{
                      fontSize: "0.92rem",
                      maxHeight: isHovered ? "80px" : "0px",
                      opacity: isHovered ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
                    }}
                  >
                    {subtitle}
                  </p>
                  <span
                    className="inline-flex items-center gap-2.5 font-sans tracking-[0.16em] uppercase transition-all duration-400"
                    style={{
                      color: isHovered ? accent : "rgba(245,240,232,0.70)",
                      fontSize: isHovered ? "0.8rem" : "0.72rem",
                    }}
                  >
                    {cta}
                    <svg width="14" height="7" viewBox="0 0 16 8" fill="none" style={{ transform: isHovered ? "translateX(6px)" : "translateX(0)", transition: "transform 0.4s ease" }}>
                      <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── MOBILE : swipe horizontal snap scroll — visible jusqu'à lg ── */}
        <div className="lg:hidden">
          <div className="flex items-center justify-end gap-1.5 mb-3 pr-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(30,16,8,0.3)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            <span className="font-sans text-xs text-terracotta/30 tracking-[0.18em] uppercase">Glissez</span>
          </div>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar"
            style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", marginLeft: "-20px", marginRight: "-20px", paddingLeft: "20px", paddingRight: "20px" }}
          >
            {UNIVERS.map(({ id, title, subtitle, href, cta, accent, image, num }, idx) => (
              <Link
                key={id}
                href={href}
                className="univers-panel opacity-0 relative overflow-hidden block shrink-0"
                style={{
                  width: "85vw", maxWidth: "340px", aspectRatio: "3/4", borderRadius: "16px",
                  scrollSnapAlign: "center",
                  boxShadow: activeIndex === idx ? "0 24px 60px rgba(15,8,5,0.35)" : "0 8px 24px rgba(15,8,5,0.18)",
                  transform: activeIndex === idx ? "scale(1.01)" : "scale(0.96)",
                  opacity:   activeIndex === idx ? 1 : 0.7,
                  transition: "transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease",
                }}
              >
                <Image src={image} alt={title} fill sizes="85vw" quality={80} className="object-cover object-center" style={{ filter: id === "table" ? "brightness(1.07) saturate(1.15) sepia(0.04)" : id === "espaces" ? "brightness(1.12) saturate(1.07) hue-rotate(3deg)" : "brightness(1.02) contrast(1.04) saturate(0.95)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,8,5,0.95) 0%, rgba(15,8,5,0.5) 50%, rgba(15,8,5,0.05) 80%, transparent 100%)" }} />
                <div className="absolute top-4 right-4 font-display font-bold" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(245,240,232,0.4)" }}>{num}</div>
                <div className="absolute bottom-0 left-0 h-0.5 transition-all duration-500" style={{ width: activeIndex === idx ? "100%" : "0%", background: accent }} />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-7">
                  <div className="h-px mb-3" style={{ width: "24px", background: accent }} />
                  <h3 className="font-display font-bold text-cream leading-tight mb-2 tracking-tight" style={{ fontSize: "clamp(1.5rem, 5vw, 1.8rem)" }}>{title}</h3>
                  <p className="font-heading font-light text-xs text-cream/60 leading-relaxed mb-4">{subtitle}</p>
                  <span className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.16em] uppercase" style={{ color: accent }}>
                    {cta}
                    <svg width="12" height="6" viewBox="0 0 16 8" fill="none"><path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots pagination */}
          <div className="flex items-center justify-center gap-2.5 mt-5">
            {UNIVERS.map((u, i) => (
              <button
                key={u.id}
                onClick={() => scrollToCard(i)}
                aria-label={`Voir ${u.title}`}
                className="rounded-full transition-all duration-300"
                style={{ width: activeIndex === i ? "24px" : "6px", height: "6px", background: activeIndex === i ? UNIVERS[i].accent : "rgba(30,16,8,0.15)" }}
              />
            ))}
          </div>
        </div>

      </div>
      {/* Filet décoratif bas */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.20), transparent)" }} />
    </section>
  );
}
