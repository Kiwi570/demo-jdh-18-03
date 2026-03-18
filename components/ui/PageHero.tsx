"use client";

/**
 * PageHero — v01.2
 * Système de Hero modulaire avec 4 variantes distinctes.
 *
 * Variantes :
 *  "editorial"  → La Table, Réceptions — 68vh, grain texture, split-text word by word
 *  "fullscreen" → Les Espaces, Les Photos — 100vh, clip-path reveal, parallax fort
 *  "compact"    → Contact, Événements — 46vh, direct, info immédiatement visible
 *  "gradient"   → Sans image (legacy fallback) — fond dégradé pur
 *
 * L'ancienne API (sans variant) est rétrocompatible → "editorial" par défaut.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export type HeroVariant = "editorial" | "fullscreen" | "compact" | "gradient";

interface PageHeroProps {
  eyebrow:   string;
  title:     string;
  subtitle?: string;
  image?:    string;
  gradient?: string;
  variant?:  HeroVariant;
  /** Rétrocompat — remplacé par variant si fourni */
  height?:   "full" | "half";
  /** Contenu additionnel sous le titre (badges, CTAs, etc.) */
  children?: React.ReactNode;
  /** Désactive le Breadcrumb sur cette page */
  noBreadcrumb?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function splitWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden mr-[0.22em] last:mr-0">
      <span className="hero-word inline-block will-change-transform">{word}</span>
    </span>
  ));
}

// ── Variante Editorial ────────────────────────────────────────────────────────

function HeroEditorial({
  eyebrow, title, subtitle, image, gradient, children, noBreadcrumb,
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);
  const grainRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      // Ken Burns doux sur l'image
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { scale: 1.07 }, { scale: 1, duration: 2.0, ease: "power2.out" });
        // Parallax léger au scroll
        gsap.to(imageRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end:   "bottom top",
            scrub: true,
          },
        });
      }

      // Grain subtle en fondu
      if (grainRef.current) {
        tl.fromTo(grainRef.current, { opacity: 0 }, { opacity: 1, duration: 1.5 }, 0);
      }

      // Eyebrow
      tl.fromTo(".hero-eyebrow-ed",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        0.3
      );

      // Mots du titre — slide depuis le bas (overflow hidden)
      tl.fromTo(".hero-word",
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.85, ease: "power4.out" },
        0.5
      );

      // Séparateur
      tl.fromTo(".hero-sep-ed",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.out", transformOrigin: "left" },
        0.85
      );

      // Sous-titre + contenu additionnel
      tl.fromTo(".hero-sub-ed",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.65, ease: "power3.out" },
        0.95
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: "clamp(460px, 68vh, 720px)", paddingBottom: "clamp(3.5rem, 6vw, 5rem)", paddingTop: "6rem" }}
    >
      {/* ── Image de fond ── */}
      {image && (
        <div ref={imageRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image src={image} alt="" fill quality={90} priority sizes="100vw" className="object-cover object-center" />
        </div>
      )}

      {/* ── Overlay gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background: image
            ? `linear-gradient(to top, rgba(15,8,5,0.92) 0%, rgba(15,8,5,0.55) 45%, rgba(15,8,5,0.25) 100%),
               linear-gradient(105deg, rgba(30,16,8,0.4) 0%, transparent 60%)`
            : `linear-gradient(135deg, var(--color-terracotta), var(--color-terracotta-mid))`,
        }}
      />

      {/* ── Grain texture (éditorial signature) ── */}
      <div
        ref={grainRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          mixBlendMode: "overlay",
        }}
        aria-hidden="true"
      />

      {/* ── Ligne or en bas ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.35), transparent)" }} />

      {/* ── Breadcrumb ── */}
      {!noBreadcrumb && <Breadcrumb />}

      {/* ── Contenu ── */}
      <div className="relative z-10 container-main w-full">
        <span className="hero-eyebrow-ed eyebrow text-gold/65 mb-4 block opacity-0">
          {eyebrow}
        </span>

        <h1
          className="font-display font-extrabold text-cream leading-none mb-5 tracking-tight"
          style={{ fontSize: "clamp(3rem, 6.5vw, 6.5rem)", letterSpacing: "-0.01em", lineHeight: "1.0" }}
        >
          {splitWords(title)}
        </h1>

        <div className="hero-sep-ed w-14 h-px bg-rouge mb-5 opacity-0" />

        {subtitle && (
          <p className="hero-sub-ed font-heading font-light italic text-cream/60 opacity-0"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.35rem)", maxWidth: "42rem" }}>
            {subtitle}
          </p>
        )}

        {children && (
          <div className="hero-sub-ed mt-6 opacity-0">{children}</div>
        )}
      </div>
    </section>
  );
}

// ── Variante Fullscreen ───────────────────────────────────────────────────────

function HeroFullscreen({
  eyebrow, title, subtitle, image, children, noBreadcrumb,
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ken Burns
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { scale: 1.08 }, { scale: 1, duration: 2.2, ease: "power2.out" });
        gsap.to(imageRef.current, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end:   "bottom top",
            scrub: true,
          },
        });
      }

      const tl = gsap.timeline({ delay: 0.15 });

      tl.fromTo(".hero-eyebrow-fs",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        0
      );

      // Clip-path reveal sur chaque mot
      tl.fromTo(".hero-word",
        { clipPath: "inset(0 0 105% 0)", y: 20, opacity: 0 },
        { clipPath: "inset(0 0 0% 0)",   y: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: "power4.out" },
        0.3
      );

      tl.fromTo(".hero-sep-fs",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power3.out", transformOrigin: "left" },
        0.8
      );

      tl.fromTo(".hero-sub-fs",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out" },
        0.9
      );

      // Scroll indicator
      tl.fromTo(".hero-scroll-fs",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        1.4
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {image && (
        <div ref={imageRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image src={image} alt="" fill quality={90} priority sizes="100vw" className="object-cover object-center" />
        </div>
      )}

      <div className="absolute inset-0" style={{
        background: "linear-gradient(to bottom, rgba(15,8,5,0.3) 0%, rgba(15,8,5,0.55) 50%, rgba(15,8,5,0.80) 100%)",
      }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)" }} />

      {!noBreadcrumb && <Breadcrumb />}

      <div className="relative z-10 text-center container-main">
        <span className="hero-eyebrow-fs eyebrow text-gold/65 mb-5 block opacity-0">
          {eyebrow}
        </span>

        <h1
          className="font-display font-extrabold text-cream leading-none mb-6 tracking-tight"
          style={{ fontSize: "clamp(3.5rem, 8vw, 8.5rem)", letterSpacing: "-0.015em", lineHeight: "0.98" }}
        >
          {splitWords(title)}
        </h1>

        <div className="hero-sep-fs w-16 h-px bg-rouge mx-auto mb-5 opacity-0" style={{ transformOrigin: "left" }} />

        {subtitle && (
          <p className="hero-sub-fs font-heading font-light text-cream/55 italic opacity-0"
            style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)", maxWidth: "38rem", margin: "0 auto" }}>
            {subtitle}
          </p>
        )}

        {children && <div className="hero-sub-fs mt-6 opacity-0">{children}</div>}
      </div>

      {/* Scroll indicator */}
      <div
        className="hero-scroll-fs absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
        aria-hidden="true"
      >
        <span className="font-sans text-2xs tracking-[0.4em] uppercase text-cream/30">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent animate-bounce-scroll" />
      </div>
    </section>
  );
}

// ── Variante Compact ──────────────────────────────────────────────────────────

function HeroCompact({
  eyebrow, title, subtitle, image, gradient, children, noBreadcrumb,
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, { scale: 1.05 }, { scale: 1, duration: 1.6, ease: "power2.out" });
      }

      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(".hero-content-cp",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "power3.out" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-end overflow-hidden"
      style={{ height: "380px", minHeight: "380px", paddingBottom: "3.5rem", paddingTop: "5.5rem" }}
    >
      {image && (
        <div ref={imageRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image src={image} alt="" fill quality={85} priority sizes="100vw" className="object-cover object-center" />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          background: image
            ? `linear-gradient(to top, rgba(15,8,5,0.88) 0%, rgba(15,8,5,0.45) 55%, rgba(15,8,5,0.2) 100%)`
            : `linear-gradient(135deg, #1E1008, #321608)`,
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)" }} />

      {!noBreadcrumb && <Breadcrumb />}

      <div className="relative z-10 container-main">
        <span className="hero-content-cp eyebrow text-gold/65 mb-3 block opacity-0">
          {eyebrow}
        </span>
        <h1
          className="hero-content-cp font-display font-bold text-cream leading-none mb-3 tracking-tight opacity-0"
          style={{ fontSize: "clamp(2.4rem, 4.5vw, 4.5rem)", letterSpacing: "-0.01em" }}
        >
          {title}
        </h1>
        <div className="hero-content-cp w-10 h-px bg-rouge mb-3 opacity-0" />
        {subtitle && (
          <p className="hero-content-cp font-heading font-light text-cream/55 italic opacity-0"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}>
            {subtitle}
          </p>
        )}
        {children && <div className="hero-content-cp mt-4 opacity-0">{children}</div>}
      </div>
    </section>
  );
}

// ── Variante Gradient (sans image) ────────────────────────────────────────────

function HeroGradient({ eyebrow, title, subtitle, gradient, children, noBreadcrumb }: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-content-gr",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out", delay: 0.15 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-end overflow-hidden"
      style={{
        minHeight: "clamp(320px, 50vh, 500px)",
        paddingBottom: "3.5rem",
        paddingTop: "5.5rem",
        background: `linear-gradient(135deg, #1E1008 0%, #321608 50%, #1E1008 100%)`,
      }}
    >
      {/* Lueur décorative */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 30% 80%, rgba(201,169,110,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 20%, rgba(192,57,43,0.06) 0%, transparent 45%)",
      }} />

      {/* Losange logo watermark */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.025]" aria-hidden="true">
        <svg width="280" height="280" viewBox="0 0 72 72" fill="none">
          <path d="M36 4 L68 36 L36 68 L4 36 Z" stroke="#C9A96E" strokeWidth="1.5" fill="none"/>
          <path d="M36 16 L56 36 L36 56 L16 36 Z" stroke="#C9A96E" strokeWidth="0.8" fill="none"/>
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.25), transparent)" }} />

      {!noBreadcrumb && <Breadcrumb />}

      <div className="relative z-10 container-main">
        <span className="hero-content-gr eyebrow text-gold/65 mb-4 block opacity-0">{eyebrow}</span>
        <h1
          className="hero-content-gr font-display font-bold text-cream leading-none mb-4 tracking-tight opacity-0"
          style={{ fontSize: "clamp(2.6rem, 5vw, 5rem)", letterSpacing: "-0.01em" }}
        >
          {title}
        </h1>
        <div className="hero-content-gr w-12 h-px bg-rouge mb-4 opacity-0" />
        {subtitle && (
          <p className="hero-content-gr font-heading font-light text-cream/55 italic opacity-0"
            style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)" }}>
            {subtitle}
          </p>
        )}
        {children && <div className="hero-content-gr mt-5 opacity-0">{children}</div>}
      </div>
    </section>
  );
}

// ── Composant principal (router) ─────────────────────────────────────────────

export function PageHero(props: PageHeroProps) {
  // Résolution de la variante — rétrocompat avec l'ancienne prop height
  const variant: HeroVariant = props.variant
    ?? (props.height === "full"  ? "fullscreen" : "editorial");

  switch (variant) {
    case "fullscreen": return <HeroFullscreen {...props} />;
    case "compact":    return <HeroCompact    {...props} />;
    case "gradient":   return <HeroGradient   {...props} />;
    default:           return <HeroEditorial  {...props} />;
  }
}
