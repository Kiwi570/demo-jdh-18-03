"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { PageHero } from "@/components/ui/PageHero";
import { SectionReveal } from "@/components/ui/SectionReveal";

const ESPACES = [
  { id: "restaurant", label: "Le Restaurant" },
  { id: "terrasse", label: "La Terrasse" },
  { id: "piscine", label: "La Piscine" },
];

// Vraies photos du lieu
const ESPACES_IMAGES: Record<string, string> = {
  restaurant:   "/images/espaces/restaurant.jpg",
  terrasse:     "/images/espaces/terrasse.jpg",
  piscine:      "/images/espaces/piscine.jpg",
};


const ESPACES_GALLERY: Record<string, { src: string; label: string }[]> = {
  restaurant: [
    { src: "/images/receptions/mariage-2.jpg",    label: "Dressage de table — élégance" },
    { src: "/images/receptions/mariage-3.jpg",    label: "Décoration florale" },
    { src: "/images/receptions/mariage-1.jpg",    label: "Réception en salle" },
  ],
  terrasse: [
    { src: "/images/hero/hero-bg.jpg",             label: "Les Jardins de l'Hacienda" },
    { src: "/images/receptions/mariage-6.jpg",     label: "Soirée en terrasse" },
    { src: "/images/espaces/visite.jpg",           label: "Vue d'ensemble du domaine" },
  ],
  piscine: [
    { src: "/images/espaces/pool-party.jpg",       label: "Pool Party estivale" },
    { src: "/images/receptions/mariage-4.jpg",     label: "Baignade & détente" },
    { src: "/images/receptions/mariage-5.jpg",     label: "Cocktails au bord de l'eau" },
  ],
};

const ESPACES_DATA = [
  {
    id: "restaurant",
    eyebrow: "01 · Intérieur",
    title: "Le Restaurant",
    desc: "Un espace chaleureux et raffiné, pensé pour les repas en toute intimité. En hiver, le feu de cheminée crée une atmosphère incomparable. La salle principale accueille jusqu'à 80 couverts dans un décor élégant mêlant bois, pierre et touches dorées.",
    details: ["Jusqu'à 80 couverts", "Cheminée en hiver", "Climatisation", "Accessible PMR"],
    gradient: "from-terracotta to-terracotta-mid",
    accent: "rgba(201,169,110,0.15)",
    reverse: false,
  },
  {
    id: "terrasse",
    eyebrow: "02 · Extérieur",
    title: "La Terrasse",
    desc: "Dès les beaux jours, la terrasse devient le cœur battant des Jardins. Ombragée et verdoyante, elle offre une expérience de repas en plein air dans un cadre naturel et paisible. Les arbres centenaires filtrent la lumière pour créer une atmosphère unique.",
    details: ["Jusqu'à 120 couverts", "Ombragée & verdoyante", "Chauffage extérieur", "Disponible d'Avril à Octobre"],
    gradient: "from-forest to-terracotta",
    accent: "rgba(45,74,62,0.3)",
    reverse: true,
  },
  {
    id: "piscine",
    eyebrow: "03 · Le Joyau",
    title: "La Piscine",
    desc: "L'atout maître des Jardins de l'Hacienda. Chauffée et ouverte dès la mi-juin selon la météo, la piscine devient le cœur de l'établissement tout l'été — cocktails à la main, musique douce, reflets de lumière sur l'eau. Un espace de détente et de convivialité unique en Lorraine.",
    details: ["Piscine chauffée", "Bar en bord de piscine", "Transats & parasols", "Ouverte de Juin à Septembre"],
    gradient: "from-forest-dark to-forest",
    accent: "rgba(45,74,62,0.5)",
    special: true,
    reverse: false,
  },
];


// ── Mini-galerie composant ──────────────────────────────────────────────────
// ── badges d'infos pratiques par espace ──────────────────────────────────────
const ESPACES_BADGES: Record<string, { icon: string; label: string }[]> = {
  restaurant:  [{ icon: "users", label: "80 couverts" }, { icon: "fire", label: "Cheminée hiver" }, { icon: "snow", label: "Climatisé" }, { icon: "access", label: "Accessible PMR" }],
  terrasse:    [{ icon: "users", label: "120 couverts" }, { icon: "tree", label: "Ombragée" }, { icon: "heat", label: "Chauffage ext." }, { icon: "cal", label: "Avr – Oct" }],
  piscine:     [{ icon: "pool", label: "Chauffée" }, { icon: "bar", label: "Bar bord eau" }, { icon: "sun", label: "Transats & parasols" }, { icon: "cal", label: "Juin – Sept" }],
};

function BadgeIcon({ icon }: { icon: string }) {
  const props = { width: 13, height: 13, viewBox: "0 0 24 24", fill: "none" as const, stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" as const };
  switch (icon) {
    case "users":  return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "cal":    return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "sun":    return <svg {...props}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
    case "music":  return <svg {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case "lock":   return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
    case "home":   return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "chef":   return <svg {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/><path d="M18 15v7"/></svg>;
    default:       return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
  }
}

function SpaceInfoBadges({ id }: { id: string }) {
  const badges = ESPACES_BADGES[id] ?? [];
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {badges.map(({ icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 px-3 py-1.5"
          style={{
            background:   "rgba(30,16,8,0.05)",
            border:       "1px solid rgba(30,16,8,0.10)",
            borderRadius: "40px",
          }}
        >
          <span style={{ color: "rgba(168,136,74,0.75)" }}>
            <BadgeIcon icon={icon} />
          </span>
          <span className="font-sans text-xs tracking-wide" style={{ color: "rgba(30,16,8,0.58)" }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Mini-galerie scrollable horizontal ───────────────────────────────────────
function MiniGallery({ id }: { id: string }) {
  const photos   = ESPACES_GALLERY[id] ?? [];
  const [active, setActive]   = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!photos.length) return null;

  const scrollToIndex = (i: number) => {
    setActive(i);
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[i] as HTMLElement;
    child?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div className="mt-6">
      {/* Scrollable horizontal */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto hide-scrollbar pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => { scrollToIndex(i); setLightbox(i); }}
            data-cursor-zoom
            className="relative shrink-0 overflow-hidden group"
            style={{
              width:        "clamp(160px, 42vw, 220px)",
              aspectRatio:  "4/3",
              borderRadius: "10px",
              scrollSnapAlign: "start",
              border:       i === active
                ? "2px solid rgba(201,169,110,0.7)"
                : "2px solid rgba(201,169,110,0.1)",
              transition:   "border-color 0.3s ease",
            }}
          >
            <Image
              src={p.src}
              alt={p.label}
              fill
              sizes="220px"
              quality={70}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
              style={{ background: "linear-gradient(to top, rgba(15,8,5,0.7), transparent)" }}
            >
              <p className="font-sans text-xs tracking-[0.12em] uppercase text-cream/80 px-3 pb-2.5">
                {p.label}
              </p>
            </div>
            {/* Loupe */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(15,8,5,0.7)", backdropFilter: "blur(6px)" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(245,240,232,0.85)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Indicateur de progression */}
      <div className="flex items-center gap-1.5 mt-2.5 justify-center">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Photo ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === active ? "16px" : "5px",
              height:     "5px",
              background: i === active
                ? "rgba(201,169,110,0.8)"
                : "rgba(30,16,8,0.18)",
            }}
          />
        ))}
      </div>

      {/* Lightbox inline */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(15,8,5,0.95)", backdropFilter: "blur(12px)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center border border-white/20 text-white/60 hover:text-white transition-colors"
            aria-label="Fermer"
            onClick={() => setLightbox(null)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Navigation flèches */}
          {lightbox > 0 && (
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-black/50 flex items-center justify-center text-white/60 hover:text-white"
              onClick={e => { e.stopPropagation(); setLightbox(l => (l! > 0 ? l! - 1 : l)); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          )}
          {lightbox < photos.length - 1 && (
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-white/20 bg-black/50 flex items-center justify-center text-white/60 hover:text-white"
              onClick={e => { e.stopPropagation(); setLightbox(l => (l! < photos.length - 1 ? l! + 1 : l)); }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          )}

          <div
            className="relative overflow-hidden max-w-4xl max-h-[80vh] w-full mx-8"
            style={{ borderRadius: "12px", border: "1px solid rgba(201,169,110,0.2)" }}
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={photos[lightbox].src}
              alt={photos[lightbox].label}
              width={1200}
              height={800}
              quality={90}
              className="w-full h-auto object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4" style={{ background: "linear-gradient(to top, rgba(15,8,5,0.85), transparent)" }}>
              <p className="font-display font-light italic text-cream/75 text-sm">{photos[lightbox].label}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LesEspacesPage() {
  const [activeSpace, setActiveSpace] = useState("restaurant");
  const navRef = useRef<HTMLDivElement>(null);
  const [navSticky, setNavSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      setNavSticky(nav.getBoundingClientRect().top <= 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver — sync onglet actif avec la section visible
  useEffect(() => {
    const sections = ESPACES.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Trouve la section la plus visible à l'écran
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSpace(visible[0].target.id);
        }
      },
      { threshold: [0.2, 0.5], rootMargin: "-80px 0px -30% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".espace-section").forEach((section) => {
        gsap.fromTo(
          section.querySelectorAll(".espace-reveal"),
          { opacity: 0, y: 35 },
          {
            opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none none" },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHero
        variant="compact"
        image="/images/hero/hero-bg.jpg"
        eyebrow="Le domaine · Moineville"
        title="Les Espaces"
        subtitle="Chaque coin de l'Hacienda raconte une histoire."
      />

      {/* Navigation sticky */}
      <div
        ref={navRef}
        className="sticky top-20 z-40 border-b border-terracotta/12 transition-all duration-300"
        style={{ background: "rgba(237,232,220,0.97)", backdropFilter: "blur(12px)" }}
      >
        <div className="container-main">
          <div className="flex items-center overflow-x-auto gap-0 hide-scrollbar">
            {ESPACES.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setActiveSpace(id)}
                className="shrink-0 px-6 py-4 font-sans text-sm tracking-[0.18em] uppercase transition-all duration-300 border-b-2"
                style={{
                  borderBottomColor: activeSpace === id ? "#C0392B" : "transparent",
                  color: activeSpace === id ? "#1E1008" : "rgba(30,16,8,0.42)",
                  fontWeight: activeSpace === id ? "700" : "400",
                }}
              >
                {label}
              </a>
            ))}
            {/* CTA privatisation — droite de la nav */}
            <div className="ml-auto pl-4 shrink-0 flex items-center">
              <Link
                href="/receptions"
                className="flex items-center gap-2 px-4 py-2 font-sans text-xs tracking-[0.16em] uppercase font-semibold transition-all duration-300 hover:bg-rouge hover:text-white hover:border-rouge"
                style={{ border: "1px solid #C0392B", color: "#C0392B", borderRadius: "6px" }}
              >
                Privatiser
                <svg width="10" height="6" viewBox="0 0 16 8" fill="none">
                  <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sections espaces */}
      {ESPACES_DATA.map(({ id, eyebrow, title, desc, details, accent, reverse, special }, idx) => {
        const isEven = idx % 2 === 0;

        return (
        <div key={id}>
        <section
          id={id}
          className="espace-section relative py-section"
          style={{ background: isEven ? "#EDE8DC" : "#F5F0E8" }}
        >
          {/* Numéro watermark */}
          <div className="absolute pointer-events-none select-none overflow-hidden" style={{ right: 0, top: 0, bottom: 0, width: "50%", zIndex: 0 }} aria-hidden="true">
            <span className="absolute font-display font-black" style={{
              fontSize: "clamp(12rem, 20vw, 18rem)",
              lineHeight: 1,
              color: "rgba(30,16,8,0.04)",
              right: "-2rem",
              top: "50%",
              transform: "translateY(-50%)",
              letterSpacing: "-0.05em",
            }}>
              {String(idx + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="container-main relative z-10">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
              reverse ? "lg:grid-flow-dense" : ""
            }`}>

              {/* Bloc visuel */}
              <div className={`espace-reveal relative opacity-0 ${reverse ? "lg:col-start-2" : ""}`}>
                <div className={`relative overflow-hidden rounded-xl ${special ? "ring-1 ring-gold/25" : ""}`} style={{ aspectRatio: "16/10" }}>
                  <Image
                    src={ESPACES_IMAGES[id] || "/images/espaces/restaurant.jpg"}
                    alt={title}
                    fill
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    style={{ filter: "brightness(1.05) saturate(1.08)" }}
                  />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(15,8,5,0.35) 100%)" }}
                  />

                  {/* Overlay spécial piscine */}
                  {special && (
                    <>
                      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} aria-hidden="true">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="waveGrad1" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#7BAAC0" stopOpacity="0.25"/>
                              <stop offset="100%" stopColor="#4A8FA8" stopOpacity="0"/>
                            </linearGradient>
                          </defs>
                          <path d="M-20 80 Q 80 55, 160 85 Q 240 115, 320 80 Q 380 60, 420 75 L420 110 Q 380 95, 320 110 Q 240 135, 160 110 Q 80 85, -20 110Z"
                            fill="url(#waveGrad1)" style={{ animation: "wave1 4s ease-in-out infinite" }} />
                          <path d="M-20 140 Q 100 115, 200 145 Q 300 175, 420 140 L420 165 Q 300 195, 200 165 Q 100 135, -20 165Z"
                            fill="url(#waveGrad1)" style={{ animation: "wave2 5.5s ease-in-out infinite reverse" }} />
                          <circle cx="80" cy="95" r="3" fill="rgba(200,230,248,0.4)" style={{ animation: "sparkle 3s ease-in-out infinite" }}/>
                          <circle cx="200" cy="150" r="2" fill="rgba(200,230,248,0.3)" style={{ animation: "sparkle 4s ease-in-out infinite 1s" }}/>
                          <circle cx="320" cy="110" r="2.5" fill="rgba(200,230,248,0.35)" style={{ animation: "sparkle 5s ease-in-out infinite 2s" }}/>
                        </svg>
                      </div>
                      <div className="absolute bottom-5 right-5 z-10">
                        <div className="px-4 py-2.5" style={{ background: "rgba(13,30,26,0.75)", border: "1px solid rgba(123,170,192,0.35)", backdropFilter: "blur(8px)", borderRadius: "8px" }}>
                          <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold/60 mb-0.5">Le Joyau</p>
                          <p className="font-heading font-medium italic text-sm text-cream/85">
                            Cocktail à la main,<br />les pieds dans l&apos;eau.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Coin déco */}
                  <div className="absolute top-4 right-4 w-10 h-10 border border-gold/20 rounded-sm pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-10 h-10 border border-gold/20 rounded-sm pointer-events-none" />
                </div>
              </div>

              {/* Bloc texte */}
              <div className={reverse ? "lg:col-start-1 lg:row-start-1" : ""}>
                <span className="espace-reveal eyebrow mb-4 block opacity-0" style={{ color: "rgba(168,136,74,0.85)" }}>{eyebrow}</span>
                <h2 className="espace-reveal font-display font-bold tracking-tight mb-4 opacity-0 text-terracotta"
                  style={{ fontSize: "clamp(2rem, 3.2vw, 3rem)", letterSpacing: "-0.01em", lineHeight: "1.1" }}>
                  {title}
                </h2>
                <div className="espace-reveal w-10 h-[2px] mb-6 opacity-0" style={{ background: "#C0392B" }} />

                <div className="espace-reveal opacity-0">
                  <SpaceInfoBadges id={id} />
                </div>

                <p className="espace-reveal font-sans text-base font-light leading-relaxed mb-6 opacity-0"
                  style={{ color: "rgba(30,16,8,0.68)" }}>
                  {desc}
                </p>

                <div className="espace-reveal opacity-0">
                  <MiniGallery id={id} />
                </div>

                <div className="espace-reveal mt-6 opacity-0">
                  {id === "pool-party" ? (
                    <Link href="/contact" className="btn-primary">Organiser ma Pool Party</Link>
                  ) : id === "visite" ? (
                    <Link href="/contact" className="btn-primary">Organiser mon événement</Link>
                  ) : id === "restaurant" ? (
                    <Link href="/contact" className="btn-primary">Réserver une table</Link>
                  ) : id === "piscine" ? (
                    <Link href="/contact" className="btn-primary">Privatiser la piscine</Link>
                  ) : (
                    <Link href="/contact" className="btn-primary">Privatiser la terrasse</Link>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
        </div>
        );
      })}

      {/* CTA final */}
      <section className="relative overflow-hidden" style={{ background: "#1E1008" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(45,74,62,0.22) 0%, transparent 60%)" }} />

        <div className="relative z-10 container-main py-section">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Gauche — texte */}
            <div>
              <span className="eyebrow text-gold/60 mb-5 block">Venez constater par vous-même</span>
              <h2
                className="font-display font-bold text-cream tracking-tight mb-6 leading-tight"
                style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)", letterSpacing: "-0.01em" }}
              >
                Les photos ne rendent pas
                <em className="italic text-rouge-light"> justice</em>
              </h2>
              <div className="w-12 h-px bg-gold mb-6" />
              <p className="font-heading font-light text-cream/55 text-lg mb-10 leading-relaxed max-w-md">
                Chaque espace doit être vécu, ressenti. Réservez une table et laissez-vous surprendre par la beauté des lieux — ou contactez-nous pour une visite privée du domaine.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" data-magnetic data-cursor-text="RÉSERVER" className="btn-primary px-10 py-4">
                  Réserver une table
                </Link>
                <Link
                  href="/contact?objet=visite"
                  className="btn-ghost px-10 py-4 text-sm"
                >
                  Demander une visite
                </Link>
              </div>
            </div>

            {/* Droite — 3 photos en mosaic — photos mariage non encore vues */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "3/4" }}>
                <Image src="/images/receptions/mariage-1.jpg" alt="Réception aux Jardins" fill sizes="300px" quality={80} className="object-cover" style={{ filter: "brightness(1.05)" }} />
              </div>
              <div className="flex flex-col gap-3">
                <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "4/3" }}>
                  <Image src="/images/receptions/mariage-4.jpg" alt="Soirée privée" fill sizes="220px" quality={80} className="object-cover" style={{ filter: "brightness(1.05)" }} />
                </div>
                <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "4/3" }}>
                  <Image src="/images/espaces/pool-party.jpg" alt="Pool Party" fill sizes="220px" quality={80} className="object-cover" style={{ filter: "brightness(1.05)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
