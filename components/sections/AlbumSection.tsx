"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useEffect } from "react";
import { CardStack, CardStackItem } from "@/components/ui/CardStack";

// ── 6 albums — un par univers du domaine ────────────────────────────────────
interface Album extends CardStackItem {
  cta:  string;
  href: string;
}

const ALBUMS: Album[] = [
  {
    id:          "table",
    title:       "La Table",
    description: "La cuisine du Chef Régis Clauss",
    imageSrc:    "/images/espaces/restaurant.jpg",
    href:        "/la-table",
    cta:         "Voir la carte",
    tag:         "Restaurant",
  },
  {
    id:          "terrasse",
    title:       "La Terrasse",
    description: "Notre grande terrasse ombragée",
    imageSrc:    "/images/espaces/terrasse.jpg",
    href:        "/les-espaces",
    cta:         "Découvrir",
    tag:         "Espaces",
  },
  {
    id:          "piscine",
    title:       "La Piscine",
    description: "La piscine des Jardins",
    imageSrc:    "/images/espaces/piscine.jpg",
    href:        "/les-espaces",
    cta:         "Découvrir",
    tag:         "Espaces",
  },
  {
    id:          "pool-party",
    title:       "Pool Parties",
    description: "L'été au bord de l'eau",
    imageSrc:    "/images/espaces/pool-party.jpg",
    href:        "/evenements",
    cta:         "Voir les événements",
    tag:         "Événements",
  },
  {
    id:          "receptions",
    title:       "Mariages & Réceptions",
    description: "Vos plus beaux moments",
    imageSrc:    "/images/receptions/mariage-1.jpg",
    href:        "/receptions",
    cta:         "Organiser",
    tag:         "Réceptions",
  },
  {
    id:          "domaine",
    title:       "Le Domaine",
    description: "Les Jardins de l'Hacienda",
    imageSrc:    "/images/hero/hero-bg.jpg",
    href:        "/les-photos",
    cta:         "Voir les photos",
    tag:         "Le domaine",
  },
];

// ── Card personnalisée Hacienda ──────────────────────────────────────────────
function HaciendaCard({ item, active }: { item: Album; active: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">

      {/* Photo — next/image optimisé */}
      <Image
        src={item.imageSrc!}
        alt={item.title}
        fill
        draggable={false}
        loading="eager"
        sizes="(max-width: 768px) 100vw, 480px"
        className="object-cover transition-transform duration-700"
        style={{ transform: active ? "scale(1.04)" : "scale(1)" }}
      />

      {/* Overlay dégradé */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: active
            ? "linear-gradient(to top, rgba(30,16,8,0.88) 0%, rgba(30,16,8,0.25) 55%, transparent 100%)"
            : "linear-gradient(to top, rgba(15,8,5,0.80) 0%, rgba(15,8,5,0.20) 60%, transparent 100%)",
          transition: "background 0.5s ease",
        }}
      />

      {/* Badge catégorie haut gauche */}
      <div className="absolute top-4 left-4">
        <span
          className="font-sans text-xs tracking-[0.2em] uppercase px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(201,169,110,0.20)",
            border: "1px solid rgba(201,169,110,0.35)",
            color: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(6px)",
          }}
        >
          {item.tag}
        </span>
      </div>

      {/* Numéro haut droite */}
      <div
        className="absolute top-4 right-4 font-display font-bold text-white/10 select-none pointer-events-none"
        style={{ fontSize: "3rem", lineHeight: 1 }}
      >
        {String(ALBUMS.findIndex(a => a.id === item.id) + 1).padStart(2, "0")}
      </div>

      {/* Contenu bas */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">

        {/* Trait doré */}
        <div
          className="mb-3 h-px origin-left transition-all duration-500"
          style={{
            width: active ? "48px" : "24px",
            background: "#C9A96E",
            opacity: active ? 1 : 0.5,
          }}
        />

        <h3
          className="font-display font-bold text-white leading-tight tracking-tight mb-1"
          style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)" }}
        >
          {item.title}
        </h3>
        <p className="font-heading font-light text-white/65 text-sm mb-4">
          {item.description}
        </p>

        {/* CTA — visible uniquement sur la carte active */}
        <div
          className="transition-all duration-400"
          style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(8px)" }}
        >
          <Link
            href={item.href}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-2.5 font-sans text-xs tracking-[0.18em] uppercase text-gold hover:text-white transition-colors duration-300"
          >
            {item.cta}
            <svg width="14" height="7" viewBox="0 0 16 8" fill="none">
              <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Bordure gold sur la carte active */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-400"
        style={{ border: active ? "1.5px solid rgba(201,169,110,0.45)" : "1.5px solid rgba(201,169,110,0.08)" }}
      />
    </div>
  );
}

// ── Section principale ───────────────────────────────────────────────────────
export function AlbumSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".album-header > *",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".album-stack",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none none" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
      <section ref={sectionRef} className="overflow-hidden pb-28" style={{ background: "#EDE8DC" }}>

        {/* Header */}
        <div className="album-header container-main text-center pt-14 pb-10">
          <span className="eyebrow text-gold/70 mb-4 block">Le domaine en images</span>
          <h2
            className="font-display font-bold text-terracotta tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Explorez nos <em className="italic text-rouge">univers</em>
          </h2>
        </div>

        {/* CardStack */}
        <div className="album-stack w-full max-w-5xl mx-auto px-4">
          <CardStack<Album>
            items={ALBUMS}
            initialIndex={0}
            autoAdvance
            intervalMs={6000}
            pauseOnHover
            showDots
            maxVisible={5}
            cardWidth={480}
            cardHeight={380}
            overlap={0.46}
            spreadDeg={46}
            perspectivePx={1100}
            depthPx={130}
            tiltXDeg={10}
            activeLiftPx={22}
            activeScale={1.03}
            inactiveScale={0.93}
            renderCard={(item, { active }) => (
              <HaciendaCard item={item} active={active} />
            )}
          />
        </div>

        {/* Hint swipe */}
        <p className="text-center font-sans text-xs text-terracotta/55 tracking-[0.22em] uppercase mt-4 md:hidden">
          Glisser pour naviguer
        </p>
        <p className="text-center font-sans text-xs text-terracotta/55 tracking-[0.22em] uppercase mt-4 hidden md:block">
          Clic ou ← → pour naviguer
        </p>

      </section>
  );
}
