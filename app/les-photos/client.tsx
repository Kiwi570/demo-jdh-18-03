"use client";

/**
 * Les Photos — v01.4
 * - Photos réordonnées pour une narration émotionnelle (vue générale → intime)
 * - Mode Viewer : clic sur la grande photo → Lightbox fullscreen
 * - Mode Masonry : clip-path reveal au scroll (keyframe clip-reveal-up)
 * - Encart Instagram en pied de page
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DernieresPhotosSection } from "@/components/sections/DernieresPhotosSection";
import { gsap } from "@/lib/gsap";
import { PageHero } from "@/components/ui/PageHero";

type Category = "tous" | "table" | "terrasse" | "piscine" | "pool-party" | "receptions";
type ViewMode  = "viewer" | "masonry";
interface Photo { src: string; caption: string; category: Exclude<Category, "tous">; isPortrait?: boolean; }

// ── Photos réordonnées pour narration émotionnelle ───────────────────────────
// Vue générale → extérieur → piscine (le joyau) → intérieur → réceptions
// isPortrait : true = format 3/4, false = format 16/9 (défaut paysage)
const PHOTOS: Photo[] = [
  // ── Vue générale
  { src: "/images/hero/hero-bg.jpg",           caption: "Les Jardins de l'Hacienda",              category: "terrasse"   },
  { src: "/images/espaces/terrasse.jpg",        caption: "La grande terrasse ombragée",            category: "terrasse"   },
  { src: "/images/espaces/visite.jpg",          caption: "Le domaine — une parenthèse hors du temps", category: "terrasse" },
  // ── La piscine
  { src: "/images/espaces/piscine.jpg",         caption: "La piscine des Jardins",                 category: "piscine"    },
  { src: "/images/receptions/mariage-4.jpg",    caption: "La piscine illuminée en soirée",         category: "piscine",   isPortrait: true },
  { src: "/images/receptions/mariage-5.jpg",    caption: "Cocktails au bord de l'eau",             category: "piscine"    },
  // ── Pool Parties
  { src: "/images/espaces/pool-party.jpg",      caption: "Pool Party — l'été en fête",             category: "pool-party" },
  { src: "/images/receptions/mariage-6.jpg",    caption: "Soirée dansante — la nuit des Jardins",  category: "pool-party", isPortrait: true },
  { src: "/images/receptions/mariage-3.jpg",    caption: "Décoration florale — préparatifs",       category: "pool-party" },
  // ── La Table
  { src: "/images/espaces/restaurant.jpg",      caption: "La salle du restaurant",                 category: "table"      },
  { src: "/images/receptions/mariage-2.jpg",    caption: "Dressage de table — élégance",           category: "table",     isPortrait: true },
  { src: "/images/receptions/mariage-1.jpg",    caption: "L'art de recevoir",                      category: "table"      },
  // ── Réceptions
  { src: "/images/espaces/visite.jpg",          caption: "Privatisation du domaine",               category: "receptions" },
  { src: "/images/receptions/mariage-1.jpg",    caption: "Mariage en Lorraine",                    category: "receptions", isPortrait: true },
  { src: "/images/receptions/mariage-5.jpg",    caption: "Buffet de réception",                    category: "receptions" },
  { src: "/images/receptions/mariage-3.jpg",    caption: "Décoration sur mesure",                  category: "receptions", isPortrait: true },
];

// Ratios masonry — mix portrait / paysage / carré sur 3 colonnes
const MASONRY_RATIOS = [
  "16/9","3/4","1/1",
  "1/1","16/9","3/4",
  "3/4","1/1","16/9",
  "16/9","3/4","1/1",
  "1/1","3/4","16/9",
  "3/4",
];

const FILTERS: { id: Category; label: string }[] = [
  { id: "tous",       label: "Toutes"       },
  { id: "terrasse",   label: "La Terrasse"  },
  { id: "piscine",    label: "La Piscine"   },
  { id: "pool-party", label: "Pool Parties" },
  { id: "table",      label: "La Table"     },
  { id: "receptions", label: "Réceptions"   },
];

const THUMB_DESKTOP = 6;
const THUMB_MOBILE  = 4;

// ── Lightbox fullscreen ───────────────────────────────────────────────────────

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos:  Photo[];
  index:   number;
  onClose: () => void;
  onPrev:  () => void;
  onNext:  () => void;
}) {
  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(8,4,2,0.97)", backdropFilter: "blur(16px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo : ${photo.caption}`}
    >
      {/* Fermer */}
      <button
        className="absolute top-5 right-5 w-11 h-11 rounded-full flex items-center justify-center border border-white/15 text-white/50 hover:text-white hover:border-white/50 transition-all duration-300 z-10"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
        aria-label="Fermer"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Compteur */}
      <div className="absolute top-5 left-5 font-sans text-xs tracking-[0.25em] uppercase text-white/30 z-10">
        {index + 1} / {photos.length}
      </div>

      {/* Image — stop propagation */}
      <div
        className="relative w-full max-w-6xl mx-6"
        style={{ maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative overflow-hidden"
          style={{
            maxHeight: "80vh",
            display:   "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.caption}
            width={1400}
            height={900}
            quality={92}
            priority
            className="w-auto h-auto object-contain"
            style={{ maxHeight: "80vh", maxWidth: "100%" }}
          />
        </div>

        {/* Légende */}
        <div className="text-center mt-5">
          <p className="font-display font-light italic text-white/75 text-xl">{photo.caption}</p>
        </div>
      </div>

      {/* Flèche gauche */}
      <button
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center border border-white/15 text-white/55 hover:text-gold hover:border-gold/50 transition-all duration-300 z-10"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
        onClick={e => { e.stopPropagation(); onPrev(); }}
        aria-label="Photo précédente"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Flèche droite */}
      <button
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center border border-white/15 text-white/55 hover:text-gold hover:border-gold/50 transition-all duration-300 z-10"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
        onClick={e => { e.stopPropagation(); onNext(); }}
        aria-label="Photo suivante"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      {/* Hint clavier */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-sans text-xs text-white/20 tracking-[0.22em] uppercase hidden md:block">
        ← → pour naviguer · Échap pour fermer
      </p>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function PhotosClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const initialCat   = (searchParams.get("cat") as Category) ?? "tous";

  const [activeFilter,    setActiveFilter]    = useState<Category>(initialCat);
  const [activeIndex,     setActiveIndex]     = useState(0);
  const [thumbOffset,     setThumbOffset]     = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [thumbVisible,    setThumbVisible]    = useState(THUMB_DESKTOP);
  const [viewMode,        setViewMode]        = useState<ViewMode>("viewer");
  const [lightboxIdx,     setLightboxIdx]     = useState<number | null>(null);

  const touchStartX  = useRef(0);
  const mainImgRef   = useRef<HTMLDivElement>(null);
  const masonryRef   = useRef<HTMLDivElement>(null);

  // Responsive thumbs
  useEffect(() => {
    const check = () => setThumbVisible(window.innerWidth < 640 ? THUMB_MOBILE : THUMB_DESKTOP);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filtered = activeFilter === "tous" ? PHOTOS : PHOTOS.filter(p => p.category === activeFilter);
  const total    = filtered.length;
  const current  = filtered[activeIndex] ?? filtered[0];

  const changeFilter = (cat: Category) => {
    setActiveFilter(cat);
    setActiveIndex(0);
    setThumbOffset(0);
    const params = new URLSearchParams();
    if (cat !== "tous") params.set("cat", cat);
    router.replace(cat === "tous" ? "/les-photos" : `/les-photos?${params}`, { scroll: false });
  };

  const goTo = useCallback((idx: number) => {
    if (isTransitioning || idx === activeIndex) return;
    const dir = idx > activeIndex ? 1 : -1;
    setIsTransitioning(true);
    if (mainImgRef.current) {
      gsap.fromTo(mainImgRef.current,
        { opacity: 0, x: dir * 24 },
        { opacity: 1, x: 0, duration: 0.38, ease: "power3.out",
          onStart:    () => setActiveIndex(idx),
          onComplete: () => setIsTransitioning(false),
        }
      );
    } else {
      setActiveIndex(idx);
      setIsTransitioning(false);
    }
    const maxOffset = Math.max(0, total - thumbVisible);
    if      (idx < thumbOffset)                     setThumbOffset(Math.max(0, idx));
    else if (idx >= thumbOffset + thumbVisible)      setThumbOffset(Math.min(maxOffset, idx - thumbVisible + 1));
  }, [activeIndex, isTransitioning, thumbOffset, total, thumbVisible]);

  const goPrev = useCallback(() => goTo((activeIndex - 1 + total) % total), [goTo, activeIndex, total]);
  const goNext = useCallback(() => goTo((activeIndex + 1) % total),         [goTo, activeIndex, total]);

  // Lightbox navigation
  const lightboxPrev = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + total) % total : null), [total]);
  const lightboxNext = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % total : null),         [total]);

  // Clavier
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx !== null) {
        if (e.key === "ArrowLeft")  lightboxPrev();
        if (e.key === "ArrowRight") lightboxNext();
        if (e.key === "Escape")     setLightboxIdx(null);
        return;
      }
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, lightboxIdx, lightboxPrev, lightboxNext]);

  // Init viewer animation
  useEffect(() => {
    if (!mainImgRef.current) return;
    gsap.fromTo(mainImgRef.current, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" });
  }, []);

  // Masonry — clip-path reveal au scroll
  useEffect(() => {
    if (viewMode !== "masonry" || !masonryRef.current) return;

    const items = masonryRef.current.querySelectorAll<HTMLElement>(".masonry-item");

    // Reset initial state
    gsap.set(items, { clipPath: "inset(100% 0 0 0)", opacity: 0, y: 12 });

    const ctx = gsap.context(() => {
      items.forEach((el, i) => {
        gsap.to(el, {
          clipPath: "inset(0% 0 0 0)",
          opacity:  1,
          y:        0,
          duration: 0.7,
          ease:     "power4.out",
          delay:    (i % 3) * 0.06,
          scrollTrigger: {
            trigger:      el,
            start:        "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    }, masonryRef);

    return () => ctx.revert();
  }, [viewMode, activeFilter]);

  const visibleThumbs = filtered.slice(thumbOffset, thumbOffset + thumbVisible);

  return (
    <>
      <PageHero
        variant="compact"
        image="/images/hero/hero-bg.jpg"
        eyebrow="Le domaine en images"
        title="Les Photos"
        subtitle="Restaurant, terrasse, piscine et réceptions — chaque espace raconte une histoire."
      />

      {/* ── FAN POLAROID — invitation émotionnelle avant la galerie ── */}
      <DernieresPhotosSection />

      {/* ── FILTRES STICKY + TOGGLE VUE ── */}
      <div className="sticky top-20 z-40 border-b border-terracotta/12 transition-all duration-300" style={{ background: "rgba(237,232,220,0.97)", backdropFilter: "blur(12px)" }}>
        <div className="container-main">
          {/* Ligne 1 : filtres + compteur */}
          <div className="flex items-center gap-3 pt-3 pb-2">
            <div className="flex overflow-x-auto hide-scrollbar gap-2 flex-1">
              {FILTERS.map(({ id, label }) => {
                const count = id === "tous" ? PHOTOS.length : PHOTOS.filter(p => p.category === id).length;
                return (
                  <button
                    key={id}
                    onClick={() => changeFilter(id)}
                    className="shrink-0 font-sans text-xs tracking-[0.16em] uppercase px-5 py-2 transition-all duration-300"
                    style={{
                      borderRadius: "40px",
                      border:       activeFilter === id ? "none" : "1px solid rgba(30,16,8,0.18)",
                      background:   activeFilter === id ? "#C0392B" : "transparent",
                      color:        activeFilter === id ? "white" : "rgba(30,16,8,0.55)",
                      fontWeight:   activeFilter === id ? "600" : "400",
                    }}
                  >
                    {label}
                    <span className="ml-2 font-sans text-xs opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
            <span className="font-sans text-xs text-terracotta/55 self-center shrink-0 pl-2 font-medium hidden sm:block">
              {total} photo{total > 1 ? "s" : ""}
            </span>
          </div>
          {/* Ligne 2 : compteur mobile + toggle */}
          <div className="flex items-center justify-between pb-2">
            <span className="font-sans text-xs text-terracotta/45 font-medium sm:hidden">
              {total} photo{total > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-1 shrink-0 p-1 border border-terracotta/15 rounded-lg ml-auto" style={{ background: "rgba(30,16,8,0.04)" }}>
              <button
                onClick={() => setViewMode("viewer")}
                className="p-2 transition-all duration-200"
                style={{ background: viewMode === "viewer" ? "rgba(201,169,110,0.15)" : "transparent" }}
                title="Vue détaillée"
                aria-pressed={viewMode === "viewer"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={viewMode === "viewer" ? "#C0392B" : "rgba(30,16,8,0.3)"} strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 21V9"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className="p-2 transition-all duration-200"
                style={{ background: viewMode === "masonry" ? "rgba(201,169,110,0.15)" : "transparent" }}
                title="Vue grille"
                aria-pressed={viewMode === "masonry"}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={viewMode === "masonry" ? "#C0392B" : "rgba(30,16,8,0.3)"} strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/>
                  <rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/>
                  <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
            </div>
          </div>
          {/* end ligne 2 */}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          VUE DÉTAILLÉE (Viewer)
      ═══════════════════════════════════════════════════ */}
      {viewMode === "viewer" && (
        <section className="py-10 md:py-16" style={{ background: "#EDE8DC" }}>
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8">

            {/* Image principale — ratio adaptatif portrait/paysage */}
            <div
              ref={mainImgRef}
              className="relative w-full overflow-hidden rounded-2xl mb-5 select-none cursor-zoom-in" data-cursor-zoom
              style={{
                aspectRatio: current?.isPortrait ? "3/4" : "16/9",
                background:  "#0a0604",
                maxHeight:   current?.isPortrait ? "70vh" : undefined,
                transition:  "aspect-ratio 0.4s ease",
              }}
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
              }}
              onClick={() => setLightboxIdx(activeIndex)}
            >
              {current && (
                <Image
                  key={current.src}
                  src={current.src}
                  alt={current.caption}
                  fill quality={90} priority
                  sizes="(max-width: 768px) 100vw, 900px"
                  className="object-cover object-center"
                />
              )}

              {/* Overlay bas */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(15,8,5,0.88), transparent)" }}
              />

              {/* Légende + compteur */}
              <div className="absolute bottom-5 left-6 right-20 pointer-events-none">
                <p className="font-display font-light italic text-cream/90 text-lg md:text-xl leading-snug">
                  {current?.caption}
                </p>
                <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold/50 mt-1">
                  {activeIndex + 1} / {total}
                </p>
              </div>

              {/* Hint zoom */}
              <div className="absolute top-4 right-4 pointer-events-none">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(245,240,232,0.6)" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35M11 8v6M8 11h6"/>
                  </svg>
                </div>
              </div>

              {/* Flèches */}
              <button
                onClick={e => { e.stopPropagation(); goPrev(); }}
                aria-label="Photo précédente"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/35 backdrop-blur-sm border border-white/10 flex items-center justify-center text-cream/70 hover:text-gold hover:border-gold/50 hover:bg-black/60 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); goNext(); }}
                aria-label="Photo suivante"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/35 backdrop-blur-sm border border-white/10 flex items-center justify-center text-cream/70 hover:text-gold hover:border-gold/50 hover:bg-black/60 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            {/* Miniatures */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setThumbOffset(o => Math.max(0, o - 1))}
                disabled={thumbOffset === 0}
                aria-label="Précédent"
                className="shrink-0 w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>

              <div className="flex-1 flex gap-2 md:gap-3">
                {visibleThumbs.map((photo, relIdx) => {
                  const absIdx   = thumbOffset + relIdx;
                  const isActive = absIdx === activeIndex;
                  return (
                    <button
                      key={`${photo.src}-${absIdx}`}
                      onClick={() => goTo(absIdx)}
                      className="relative overflow-hidden rounded-xl focus:outline-none transition-all duration-350 group"
                      style={{
                        flex:       "1 1 0",
                        aspectRatio: "1/1",
                        border:     isActive ? "2px solid #C9A96E" : "2px solid rgba(201,169,110,0.08)",
                        transform:  isActive ? "translateY(-5px)" : "translateY(0)",
                        boxShadow:  isActive ? "0 10px 28px rgba(201,169,110,0.22)" : "none",
                        opacity:    isActive ? 1 : 0.45,
                      }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.caption}
                        fill sizes="100px" quality={55}
                        className={`object-cover transition-all duration-500 ${!isActive ? "group-hover:opacity-80 group-hover:scale-105" : ""}`}
                      />
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setThumbOffset(o => Math.min(total - thumbVisible, o + 1))}
                disabled={thumbOffset >= total - thumbVisible}
                aria-label="Suivant"
                className="shrink-0 w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/50 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>

            <p className="text-center font-sans text-xs text-cream/20 tracking-[0.18em] uppercase mt-5 hidden md:block">
              ← → pour naviguer · Cliquer sur la photo pour l&apos;agrandir
            </p>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          VUE GRILLE (Masonry) — clip-path reveal
      ═══════════════════════════════════════════════════ */}
      {viewMode === "masonry" && (
        <section className="py-10 md:py-16" style={{ background: "#EDE8DC" }}>
          <div className="container-main">
            <div ref={masonryRef} className="columns-2 md:columns-3 gap-3 space-y-3">
              {filtered.map((photo, i) => (
                <div
                  key={photo.src}
                  className="masonry-item group relative overflow-hidden break-inside-avoid cursor-zoom-in" data-cursor-zoom
                  style={{
                    aspectRatio:  MASONRY_RATIOS[i % MASONRY_RATIOS.length],
                    borderRadius: "10px",
                    clipPath:     "inset(100% 0 0 0)",  // état initial pour GSAP
                  }}
                  onClick={() => setLightboxIdx(i)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    quality={75}
                    className="object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  {/* Overlay hover */}
                  <div
                    className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(15,8,5,0.82), transparent 55%)" }}
                  >
                    <p className="font-sans text-xs tracking-[0.15em] uppercase text-gold/85">
                      {photo.caption}
                    </p>
                  </div>
                  {/* Icône zoom */}
                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(8,4,2,0.7)", backdropFilter: "blur(6px)" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(245,240,232,0.85)" strokeWidth="2.5" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center font-sans text-xs text-terracotta/30 tracking-[0.2em] uppercase mt-8">
              Cliquer sur une photo pour l&apos;agrandir · Utiliser les filtres en haut pour naviguer par espace
            </p>
            {/* CTA fin masonry */}
            <div className="text-center mt-14 pt-10" style={{ borderTop: "1px solid rgba(30,16,8,0.08)" }}>
              <p className="font-heading font-light text-terracotta/50 text-lg italic mb-6">
                Ces espaces n&apos;attendent plus que vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn-primary px-8 py-3.5">Réserver une table</Link>
                <Link href="/receptions" className="btn-outline-terracotta px-8 py-3.5">Organiser un événement</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── LIGHTBOX FULLSCREEN ── */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}

      {/* ── ENCART INSTAGRAM ── */}
      <section
        className="py-14 md:py-16"
        style={{ background: "#EDE8DC" }}
      >
        <div className="container-main">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-10"
            style={{
              background:   "#FAFAF7",
              borderRadius: "16px",
              border:       "1px solid rgba(30,16,8,0.07)",
              boxShadow:    "0 8px 40px rgba(30,16,8,0.08)",
            }}
          >
            {/* Gauche — texte */}
            <div className="flex-1 text-center md:text-left">
              <p className="eyebrow text-gold/70 mb-2">Suivez-nous</p>
              <h3
                className="font-display font-bold text-terracotta tracking-tight mb-2"
                style={{ fontSize: "clamp(1.4rem, 2vw, 2rem)" }}
              >
                Vous avez partagé un moment ici ?
              </h3>
              <p className="font-heading font-light text-terracotta/55 text-base mb-5 max-w-md">
                Taguez-nous sur Instagram — chaque saison, de nouveaux moments à découvrir.
              </p>

              {/* Hashtags */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {["#LesJardins", "#Hacienda54", "#PoolParty", "#Moineville"].map(tag => (
                  <span
                    key={tag}
                    className="font-sans text-xs px-3 py-1.5 tracking-wide"
                    style={{
                      color:      "rgba(30,16,8,0.5)",
                      border:     "1px solid rgba(30,16,8,0.12)",
                      background: "rgba(30,16,8,0.03)",
                      borderRadius: "40px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Droite — bouton Instagram */}
            <div className="flex flex-col items-center gap-4 shrink-0">
              <a
                href="https://www.instagram.com/lesjardinsdel.hacienda/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-7 py-4 transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background:   "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                  borderRadius: "10px",
                  color:        "white",
                }}
                aria-label="Voir notre compte Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
                </svg>
                <div>
                  <p className="font-heading font-semibold text-sm leading-none mb-0.5">@lesjardinsdel.hacienda</p>
                  <p className="font-sans text-xs opacity-75">Nous suivre sur Instagram</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-section" style={{ background: "#EDE8DC" }}>
        <div className="container-main text-center max-w-xl mx-auto">
          <div
            className="w-full h-px mb-12"
            style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.2), transparent)" }}
          />
          <span className="eyebrow text-gold/50 mb-4 block">Vous avez aimé ?</span>
          <h2
            className="font-display font-bold text-cream tracking-tight mb-6"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
          >
            Venez vivre l&apos;expérience
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact"    className="btn-primary px-10 py-4">Réserver une table</Link>
            <Link href="/receptions" className="btn-ghost px-10 py-4 text-sm">Organiser un événement</Link>
          </div>
        </div>
      </section>
    </>
  );
}
