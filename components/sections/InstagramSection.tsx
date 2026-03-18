"use client";

/**
 * GalerieSection — "Nos moments en images"
 * Remplace l'ancienne section avec fausse stat Instagram hardcodée.
 * La sphère interactive reste, on supprime le compteur "+2 400 abonnés" fictif
 * et on adopte un positionnement honnête : galerie du domaine + invitation Instagram.
 */

import { useRef, useEffect, useState } from "react";
import SphereImageGrid, { ImageData } from "@/components/ui/SphereImageGrid";

const BASE_PHOTOS = [
  // Sélection optimisée — chaque photo est la meilleure représentante de son univers
  { src: "/images/espaces/piscine.jpg",     alt: "La piscine des Jardins de l'Hacienda" },
  { src: "/images/hero/hero-bg.jpg",            alt: "Les Jardins de l'Hacienda — vue d'ensemble" },
  { src: "/images/espaces/pool-party.jpg",      alt: "Pool Party estivale — Les Jardins" },
  { src: "/images/espaces/restaurant.jpg",  alt: "L'art de la table — gastronomie" },
  { src: "/images/receptions/mariage-1.jpg",    alt: "Mariage en Lorraine — Les Jardins" },
  { src: "/images/espaces/terrasse.jpg",        alt: "La grande terrasse ombragée" },
  { src: "/images/receptions/mariage-6.jpg",    alt: "Soirée dansante — ambiance festive" },
  { src: "/images/espaces/restaurant.jpg",      alt: "La salle du restaurant" },
  { src: "/images/receptions/mariage-3.jpg",    alt: "Décoration florale de réception" },
  { src: "/images/espaces/terrasse.jpg",     alt: "Les espaces du domaine" },
  { src: "/images/receptions/mariage-4.jpg",    alt: "La piscine illuminée en soirée" },
  { src: "/images/receptions/mariage-6.jpg", alt: "Ambiance événementielle" },
  { src: "/images/espaces/piscine.jpg",         alt: "La piscine — détente et convivialité" },
  { src: "/images/espaces/visite.jpg",          alt: "Privatisation — découverte du domaine" },
  { src: "/images/receptions/mariage-5.jpg",    alt: "Cocktail & buffet de réception" },
];

const IMAGES: ImageData[] = BASE_PHOTOS.map((p, i) => ({ id: `img-${i}`, src: p.src, alt: p.alt }));

// Hashtags réels utilisés sur Instagram
const HASHTAGS = ["#LesJardins", "#Moineville", "#PoolParty", "#Hacienda"];

export function InstagramSection() {
  const [sphereSize, setSphereSize] = useState(520);
  const [sphereVisible, setSphereVisible] = useState(false);
  const sphereRef = useRef<HTMLDivElement>(null);

  // Sphère responsive
  useEffect(() => {
    const update = () => {
      if (!sphereRef.current) return;
      const w = sphereRef.current.clientWidth;
      setSphereSize(Math.max(300, Math.min(w * 0.95, 920)));
    };
    update();
    const ro = new ResizeObserver(update);
    if (sphereRef.current) ro.observe(sphereRef.current);
    return () => ro.disconnect();
  }, []);

  // Chargement différé de la sphère — uniquement quand visible dans le viewport
  useEffect(() => {
    if (!sphereRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setSphereVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    observer.observe(sphereRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-visible" style={{ background: "#EDE8DC" }}>
      <div className="py-16 md:py-20">
        <div className="container-main">

          {/* Card principale */}
          <div
            className="w-full overflow-hidden rounded-2xl"
            style={{
              background: "#FAFAF7",
              border: "1px solid rgba(30,16,8,0.08)",
              boxShadow: "0 24px 60px rgba(30,16,8,0.12), 0 4px 16px rgba(30,16,8,0.07)",
            }}
          >
            {/* ── En-tête texte ── */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-8 py-8">

              {/* Gauche — titre */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-px h-5 bg-rouge/50" />
                  <span className="font-sans text-xs tracking-[0.25em] uppercase text-gold/80">
                    Nos moments
                  </span>
                </div>
                <h2
                  className="font-display font-bold text-terracotta leading-tight mb-3"
                  style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.8rem)" }}
                >
                  L&apos;Hacienda
                  <em className="italic ml-3" style={{ color: "#C0392B" }}>en images</em>
                </h2>
                <p
                  className="font-display font-light italic mb-6"
                  style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)", color: "rgba(30,16,8,0.45)" }}
                >
                  Chaque saison, de nouveaux moments à partager.
                </p>

                {/* Invitation Instagram — sans compteur fictif */}
                <a
                  href="https://www.instagram.com/lesjardinsdel.hacienda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-4 py-3 transition-all duration-300 hover:opacity-80"
                  style={{ background: "rgba(30,16,8,0.04)", border: "1px solid rgba(30,16,8,0.1)" }}
                  aria-label="Suivre Les Jardins de l'Hacienda sur Instagram"
                >
                  {/* Icône Instagram avec dégradé */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/>
                      <circle cx="12" cy="12" r="4"/>
                      <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-terracotta text-sm leading-none mb-0.5">
                      @lesjardinsdel.hacienda
                    </p>
                    <p className="font-sans text-xs" style={{ color: "rgba(30,16,8,0.4)" }}>
                      Suivez-nous sur Instagram
                    </p>
                  </div>
                  {/* Flèche discrète */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-terracotta/30 ml-2">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>

              {/* Droite — hashtags + CTA */}
              <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
                <div className="flex flex-wrap gap-2 justify-end">
                  {HASHTAGS.map(tag => (
                    <span
                      key={tag}
                      className="font-sans text-xs px-3 py-1.5 tracking-wide"
                      style={{ color: "rgba(30,16,8,0.5)", border: "1px solid rgba(30,16,8,0.12)", background: "rgba(30,16,8,0.03)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="https://www.instagram.com/lesjardinsdel.hacienda/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-7 py-3.5 group hover:opacity-90 transition-opacity duration-300"
                  style={{ background: "#C0392B", borderRadius: "6px" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                  </svg>
                  <span className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-white">
                    Voir toutes les photos
                  </span>
                  <svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Séparateur */}
            <div className="h-px mx-8" style={{ background: "rgba(30,16,8,0.07)" }} />

            {/* ── Sphère photo interactive — chargée uniquement au scroll ── */}
            <div
              ref={sphereRef}
              className="w-full flex flex-col items-center justify-center py-4"
              style={{ minHeight: "360px" }}
            >
              {sphereVisible ? (
                <SphereImageGrid
                  images={IMAGES}
                  containerSize={sphereSize}
                  sphereRadius={sphereSize * 0.42}
                  baseImageScale={0.20}
                  dragSensitivity={0.6}
                  momentumDecay={0.96}
                  maxRotationSpeed={6}
                  autoRotate={true}
                  autoRotateSpeed={0.22}
                  perspective={1100}
                />
              ) : (
                <div style={{ width: sphereSize, height: sphereSize * 0.84, background: "rgba(30,16,8,0.03)", borderRadius: "50%" }} />
              )}
              {/* Hint gestuel */}
              <div className="flex items-center gap-2 pb-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "rgba(30,16,8,0.22)" }}>
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
                <p
                  className="font-sans select-none"
                  style={{ fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(30,16,8,0.30)" }}
                >
                  Faites tourner la sphère
                </p>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ color: "rgba(30,16,8,0.22)" }}>
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
