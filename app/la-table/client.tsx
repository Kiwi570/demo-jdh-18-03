"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { MENU, type TabId } from "@/lib/data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { IconProducteurs, IconViande, IconSaison } from "@/components/ui/Icons";

// ── Images cohérentes avec la restauration ──────────────────────
const SECTION_IMAGES: Record<Exclude<TabId, "formules">, { src: string; label: string }> = {
  entrees:     { src: "/images/espaces/restaurant.jpg",      label: "La salle du restaurant — les entrées" },
  plats:       { src: "/images/receptions/mariage-2.jpg",    label: "L'art de dresser — plats signatures" },
  desserts:    { src: "/images/receptions/mariage-3.jpg",    label: "Décoration florale — l'art du dessert" },
  suggestions: { src: "/images/espaces/terrasse.jpg",        label: "La terrasse — les suggestions de la semaine" },
  boissons:    { src: "/images/espaces/terrasse.jpg",        label: "La terrasse — boire sous le ciel lorrain" },
};

const SECTION_LABELS: Record<Exclude<TabId, "formules">, string> = {
  entrees: "Entrées", plats: "Plats", desserts: "Desserts",
  suggestions: "Suggestions du Chef", boissons: "Boissons",
};

const SECTION_NUMBERS: Record<Exclude<TabId, "formules">, string> = {
  entrees: "01", plats: "02", desserts: "03", suggestions: "04", boissons: "05",
};

const CARTE_TABS = (["entrees", "plats", "desserts", "suggestions", "boissons"] as Exclude<TabId, "formules">[]);

// ── Filtres disponibles ─────────────────────────────────────────
type FilterId = "tous" | "chef" | "vege" | "budget";
const FILTERS: { id: FilterId; label: string }[] = [
  { id: "tous",   label: "Tout" },
  { id: "chef",   label: "Signature du Chef" },
  { id: "vege",   label: "Végétarien" },
  { id: "budget", label: "Moins de 15€" },
];

// ── Semaine courante ────────────────────────────────────────────
function getWeekLabel(): string {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  return `${fmt(monday)} — ${fmt(sunday)}`;
}

// ── Fourchette de prix d'une section ───────────────────────────
function getPriceRange(tabId: Exclude<TabId, "formules">): string {
  const prices = MENU[tabId]
    .map(i => i.price)
    .filter((p): p is number => p !== null && p !== undefined);
  if (prices.length === 0) return "Sur ardoise";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `${min}€` : `${min}–${max}€`;
}

// ── Nombre de plats filtrés ─────────────────────────────────────
function countFiltered(tabId: Exclude<TabId, "formules">, filter: FilterId): number {
  if (tabId === "suggestions") return MENU.suggestions.length;
  return MENU[tabId].filter(item => {
    if (filter === "tous")   return true;
    if (filter === "chef")   return !!item.chef;
    if (filter === "vege")   return !!item.vege;
    if (filter === "budget") return item.price !== null && item.price !== undefined && item.price < 15;
    return true;
  }).length;
}

type HoverKey = string | null;

const VALID_TABS = ["entrees", "plats", "desserts", "suggestions", "boissons"] as const;

export default function LaTablePage() {
  const searchParams   = useSearchParams();
  const router         = useRouter();

  // Lire l'onglet depuis l'URL (ex: /la-table?onglet=plats)
  const tabFromUrl = searchParams.get("onglet") as Exclude<TabId, "formules"> | null;
  const initialTab = tabFromUrl && VALID_TABS.includes(tabFromUrl as typeof VALID_TABS[number])
    ? tabFromUrl as Exclude<TabId, "formules">
    : "entrees";

  const [activeSection, setActiveSection]   = useState<Exclude<TabId, "formules">>(initialTab);
  const [ambianceKey, setAmbianceKey]       = useState<Exclude<TabId, "formules">>(initialTab);
  const [imgFading, setImgFading]           = useState(false);
  const [hoverKey, setHoverKey]             = useState<HoverKey>(null);
  // Filtre par section
  const [filterMap, setFilterMap]           = useState<Record<string, FilterId>>(
    Object.fromEntries(CARTE_TABS.map(t => [t, "tous" as FilterId]))
  );
  // Progression nav (0–1)
  const [navProgress, setNavProgress]       = useState(0);

  const sectionRefs   = useRef<Record<string, HTMLDivElement | null>>({});
  const separatorRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const numberRefs    = useRef<Record<string, HTMLSpanElement | null>>({});

  const weekLabel = getWeekLabel();

  // ── Cross-fade image 500ms ──────────────────────────────────
  const triggerAmbianceChange = useCallback((next: Exclude<TabId, "formules">) => {
    if (next === ambianceKey) return;
    setImgFading(true);
    setTimeout(() => { setAmbianceKey(next); setImgFading(false); }, 500);
  }, [ambianceKey]);

  // ── IntersectionObserver ────────────────────────────────────
  useEffect(() => {
    // Init progress bar based on initial scroll position
    const initialIdx = CARTE_TABS.indexOf(initialTab);
    if (initialIdx >= 0) setNavProgress((initialIdx + 1) / CARTE_TABS.length);

    const observers: IntersectionObserver[] = [];
    CARTE_TABS.forEach((tabId, idx) => {
      const el = sectionRefs.current[tabId];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(tabId);
            triggerAmbianceChange(tabId);
            setNavProgress((idx + 1) / CARTE_TABS.length);
            // Persistance URL — shallow update sans rechargement
            router.replace(`/la-table?onglet=${tabId}`, { scroll: false });
          }
        },
        { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [triggerAmbianceChange]);

  // ── GSAP reveals ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>(".separator-draw").forEach(el => {
        gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: "power3.out", transformOrigin: "left center",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" } });
      });
      CARTE_TABS.forEach(tabId => {
        const numEl = numberRefs.current[tabId];
        if (!numEl) return;
        gsap.to(numEl, { y: -40, ease: "none",
          scrollTrigger: { trigger: sectionRefs.current[tabId], start: "top bottom", end: "bottom top", scrub: 1.5 } });
      });
      document.querySelectorAll<HTMLElement>(".section-title-reveal").forEach(el => {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)", y: 20, opacity: 0 },
          { clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1, duration: 0.85, ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" } });
      });
      document.querySelectorAll<HTMLElement>(".carte-section").forEach(section => {
        const items = section.querySelectorAll<HTMLElement>(".plat-item");
        gsap.fromTo(items, { opacity: 0, y: 22 }, { opacity: 1, y: 0, stagger: 0.075, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none" } });
      });
      // Filtres
      gsap.fromTo(".filter-row", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: ".filter-row", start: "top 90%", toggleActions: "play none none none" } });
      gsap.fromTo(".philosophy-item", { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".philosophy-section", start: "top 80%" } });
      gsap.fromTo(".week-badge-strip", { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out",
          scrollTrigger: { trigger: ".week-badge-strip", start: "top 95%", toggleActions: "play none none none" } });
    });
    return () => ctx.revert();
  }, []);

  const scrollTo = (tabId: string) => {
    setTimeout(() => {
      sectionRefs.current[tabId]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const setFilter = (tabId: string, filter: FilterId) => {
    setFilterMap(prev => ({ ...prev, [tabId]: filter }));
  };

  const getFilteredItems = (tabId: Exclude<TabId, "formules">) => {
    const filter = filterMap[tabId] ?? "tous";
    return MENU[tabId].filter(item => {
      if (filter === "tous")   return true;
      if (filter === "chef")   return !!item.chef;
      if (filter === "vege")   return !!item.vege;
      if (filter === "budget") return item.price !== null && item.price !== undefined && item.price < 15;
      return true;
    });
  };

  const ambiance = SECTION_IMAGES[ambianceKey];
  const activeFilter = filterMap[activeSection] ?? "tous";
  const activeCount  = countFiltered(activeSection, activeFilter);
  const priceRange   = getPriceRange(activeSection);

  return (
    <>
      {/* HERO */}
      <PageHero
        variant="compact"
        image="/images/chef/chef-plat.avif"
        eyebrow="Restaurant · Moineville"
        title="La Table"
        subtitle="La cuisine de saison du Chef Régis Clauss, renouvelée chaque semaine."
      />

      {/* ═══════════════════════════════════════════════════════
          BANDEAU SEMAINE VIVANT — promesse de fraîcheur
      ═══════════════════════════════════════════════════════ */}
      <div
        className="week-badge-strip opacity-0"
        style={{ background: "#F5F0E8", borderBottom: "1px solid rgba(30,16,8,0.09)" }}
      >
        <div className="container-main py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="font-sans text-xs tracking-[0.22em] uppercase text-terracotta/55">
              Carte en cours
            </span>
            <span className="w-px h-3 bg-terracotta/20" />
            <span className="font-heading font-medium text-terracotta text-sm">
              Semaine du {weekLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(30,16,8,0.3)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="font-sans text-xs text-terracotta/40 tracking-wide">
              Produits frais · Filières locales · Non halal
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MANIFESTE — valeurs du Chef en grand format
      ═══════════════════════════════════════════════════════ */}
      <section
        className="philosophy-section overflow-hidden"
        style={{ background: "#1E1008" }}
      >
        <div className="container-main pt-20 pb-20">

          {/* ── Titre manifeste ── */}
          <div className="text-center mb-16">
            <span className="eyebrow text-gold/50 mb-4 block">Notre philosophie</span>
            <h2
              className="font-display font-bold text-cream leading-none tracking-tight"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 4.5rem)", letterSpacing: "-0.015em" }}
            >
              Cuisiner avec
              <em className="italic text-rouge-light"> conviction</em>
            </h2>
          </div>

          {/* ── 3 valeurs avec chiffres display dominants ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gold/20">
            {[
              {
                num:    "52",
                unit:   "cartes / an",
                title:  "Carte renouvelée",
                desc:   "La semaine dicte le menu, le marché inspire le Chef. Chaque lundi, tout recommence.",
                icon:   "saison",
                accent: "#C0392B",
              },
              {
                num:    "100",
                unit:   "% français",
                title:  "Viandes françaises",
                desc:   "Races sélectionnées, filières courtes. Traçabilité garantie de l'élevage à l'assiette.",
                icon:   "viande",
                accent: "#C9A96E",
              },
              {
                num:    "0",
                unit:   "km inutile",
                title:  "Producteurs locaux",
                desc:   "En direct avec les agriculteurs et artisans de Lorraine — frais, traçables, de saison.",
                icon:   "producteurs",
                accent: "#2D4A3E",
              },
            ].map(({ num, unit, title, desc, icon, accent }) => (
              <div
                key={title}
                className="philosophy-item group relative px-8 md:px-12 py-14 text-center overflow-hidden opacity-0"
              >
                {/* Chiffre display en arrière-plan — opacité 15% bien visible */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  aria-hidden="true"
                >
                  <span
                    className="font-display font-black leading-none"
                    style={{
                      fontSize:      "clamp(8rem, 14vw, 13rem)",
                      color:         `${accent}`,
                      opacity:       0.22,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {num}
                  </span>
                </div>

                {/* Contenu */}
                <div className="relative z-10">
                  {/* Icône — cercle w-14 h-14 avec icône w-6 h-6 bien proportionnée */}
                  <div className="flex justify-center mb-5">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
                    >
                      {icon === "producteurs" ? <IconProducteurs className="w-6 h-6" strokeWidth={1.2} style={{ color: accent }} /> :
                       icon === "viande"      ? <IconViande      className="w-6 h-6" strokeWidth={1.2} style={{ color: accent }} /> :
                                               <IconSaison      className="w-6 h-6" strokeWidth={1.2} style={{ color: accent }} />}
                    </div>
                  </div>

                  {/* Valeur animée */}
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span
                      className="font-display font-bold leading-none"
                      style={{ fontSize: "clamp(2.8rem, 4vw, 3.8rem)", color: accent, letterSpacing: "-0.02em" }}
                    >
                      {num}
                    </span>
                    <span className="font-sans text-xs tracking-[0.15em] uppercase text-cream/40 pb-1">
                      {unit}
                    </span>
                  </div>

                  <h3 className="font-heading font-semibold text-cream text-base mb-3 tracking-wide">
                    {title}
                  </h3>
                  <div className="w-5 h-px mx-auto mb-4" style={{ background: `${accent}60` }} />
                  <p
                    className="font-sans font-light text-sm leading-relaxed max-w-xs mx-auto"
                    style={{ color: "rgba(245,240,232,0.62)" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition sombre → cream avant la carte */}
      <div className="h-24 w-full pointer-events-none" style={{ background: "linear-gradient(to bottom, #1E1008, #F5F0E8)" }} />

      {/* LA CARTE — 3 colonnes */}
      <section className="bg-cream" style={{ minHeight: "100vh" }}>
        <div className="w-full" style={{ maxWidth: "1320px", margin: "0 auto" }}>
          <div className="flex gap-0">

            {/* ── NAV STICKY GAUCHE ─────────────────────────────────── */}
            <aside className="hidden lg:flex flex-col shrink-0 py-20"
              style={{ width: "160px", marginRight: "72px", position: "sticky", top: "96px", alignSelf: "flex-start", height: "fit-content" }}>

              {/* Barre de progression verticale */}
              <div className="absolute left-0 top-20 bottom-0 w-0.5 overflow-hidden" style={{ background: "rgba(30,16,8,0.06)" }}>
                <div className="w-0.5 bg-rouge transition-all duration-1000 ease-out" style={{ height: `${navProgress * 100}%` }} />
              </div>

              <div className="mb-8 pl-5">
                <span className="eyebrow text-gold/70 mb-3 block" style={{ fontSize: "0.75rem" }}>La Carte</span>
                <div className="w-7 h-[2px] bg-rouge" />
              </div>

              <nav className="flex flex-col pl-5">
                {CARTE_TABS.map(tabId => {
                  const isActive = activeSection === tabId;
                  const shortLabel: Record<string, string> = {
                    entrees: "Entrées", plats: "Plats", desserts: "Desserts",
                    suggestions: "Suggestions", boissons: "Boissons",
                  };
                  return (
                    <button key={tabId} onClick={() => scrollTo(tabId)} className="group flex items-center gap-3 py-3 text-left">
                      <div className="shrink-0" style={{ width: isActive ? "26px" : "8px", height: "2px", background: isActive ? "#C0392B" : "rgba(30,16,8,0.18)", transition: "width 0.45s cubic-bezier(0.16,1,0.3,1), background 0.3s ease", borderRadius: "1px" }} />
                      <span className="font-sans tracking-[0.1em] uppercase whitespace-nowrap"
                        style={{
                          fontSize: "0.9rem",
                          color: isActive ? "#1E1008" : "rgba(30,16,8,0.40)",
                          fontWeight: isActive ? "800" : "600",
                          transition: "color 0.3s ease",
                        }}>
                        {shortLabel[tabId]}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-10 pt-6 border-t border-terracotta/8 pl-5">
                <p className="font-sans text-xs tracking-[0.2em] uppercase text-terracotta/40 mb-3">Nos formules</p>
                {MENU.formules.map((f) => {
                  const SHORT: Record<string, string> = {
                    "Formule Déjeuner — Entrée + Plat":           "Déj. 2 services",
                    "Formule Déjeuner — Entrée + Plat + Dessert": "Déj. 3 services",
                    "Menu Découverte — 4 Services":               "Découverte · 4 plats",
                    "Menu Prestige — 5 Services":                 "Prestige · 5 plats",
                  };
                  const label = SHORT[f.name] ?? f.name.split("—")[0].trim();
                  return (
                    <div key={f.name} className="flex items-baseline justify-between gap-2 mb-2">
                      <span className="font-sans text-terracotta/55 leading-tight"
                        style={{ fontSize: "0.68rem" }}>
                        {label}
                      </span>
                      <span className="font-display font-bold text-gold shrink-0"
                        style={{ fontSize: "0.9rem" }}>
                        {f.price}€
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-5 border-t border-terracotta/8 pl-5">
                <p className="font-sans" style={{ fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(30,16,8,0.45)", lineHeight: 1.8 }}>
                  Produits locaux · Viandes FR · Non halal
                </p>
              </div>
              <div className="mt-5 pt-5 border-t border-terracotta/5 pl-5">
                <p className="font-display font-bold select-none" style={{ fontSize: "5rem", lineHeight: 1, color: "rgba(30,16,8,0.07)" }}>52</p>
                <p className="font-sans text-xs tracking-[0.14em] uppercase text-terracotta/35 mt-1">cartes / an</p>
              </div>
            </aside>

            {/* ── COLONNE CENTRALE ─────────────────────────────────── */}
            <div className="flex-1 min-w-0 py-16 md:py-20">

              {/* ── MICRO-CARD FLOTTANTE MOBILE — contexte enrichi v01.6 ── */}
            <div
              className="lg:hidden sticky z-30 -mx-5 px-5 py-3 mb-6"
              style={{
                top:               "80px",
                background:        "rgba(245,240,232,0.97)",
                backdropFilter:    "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom:      "1px solid rgba(30,16,8,0.09)",
                boxShadow:         "0 4px 16px rgba(30,16,8,0.06)",
              }}
            >
              <div className="flex items-center justify-between gap-3">

                {/* Miniature ambiance circulaire */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="relative overflow-hidden shrink-0"
                    style={{
                      width:        "44px",
                      height:       "44px",
                      borderRadius: "50%",
                      border:       "2px solid rgba(201,169,110,0.4)",
                      boxShadow:    "0 2px 10px rgba(201,169,110,0.2)",
                    }}
                  >
                    <Image
                      src={ambiance.src}
                      alt={ambiance.label}
                      fill
                      sizes="44px"
                      className="object-cover"
                      style={{ filter: "brightness(1.35) saturate(1.15)" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-2xs tracking-[0.2em] uppercase text-terracotta/45 leading-none mb-0.5">
                      {SECTION_LABELS[activeSection]}
                    </p>
                    <p className="font-heading font-semibold text-terracotta text-sm leading-none truncate">
                      {activeCount} plat{activeCount > 1 ? "s" : ""}
                      {activeFilter !== "tous" && <span className="text-rouge"> filtrés</span>}
                    </p>
                  </div>
                </div>

                {/* Prix + badge semaine */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="text-right">
                    <p className="font-sans text-2xs tracking-[0.1em] uppercase text-terracotta/30 leading-none mb-0.5">
                      Prix
                    </p>
                    <p
                      className="font-display font-bold leading-none"
                      style={{ fontSize: "1.05rem", color: "#C0392B", letterSpacing: "-0.01em" }}
                    >
                      {getPriceRange(activeSection)}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5"
                    style={{
                      background:   "rgba(30,16,8,0.04)",
                      border:       "1px solid rgba(30,16,8,0.08)",
                      borderRadius: "6px",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-sans text-2xs tracking-[0.1em] uppercase text-terracotta/40">
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav mobile — pills */}
              <div className="lg:hidden mb-10 -mx-5 px-5">
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1" style={{ scrollSnapType: "x mandatory" }}>
                  {CARTE_TABS.map(tabId => (
                    <button key={tabId} onClick={() => scrollTo(tabId)}
                      className="shrink-0 px-4 py-2 font-heading font-medium text-xs tracking-[0.1em] uppercase transition-all duration-300"
                      style={{ borderRadius: "40px", scrollSnapAlign: "start", background: activeSection === tabId ? "#C0392B" : "rgba(30,16,8,0.06)", color: activeSection === tabId ? "white" : "rgba(30,16,8,0.5)", border: activeSection === tabId ? "1px solid transparent" : "1px solid rgba(30,16,8,0.1)" }}>
                      {SECTION_LABELS[tabId]}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTIONS DE LA CARTE */}
              {CARTE_TABS.map(tabId => {
                const activeF   = filterMap[tabId] ?? "tous";
                const filtered  = tabId === "suggestions" ? MENU.suggestions : getFilteredItems(tabId);
                const count     = filtered.length;
                const range     = getPriceRange(tabId);

                return (
                  <div key={tabId} ref={el => { sectionRefs.current[tabId] = el; }}
                    data-section={tabId} className="carte-section mb-32 scroll-mt-32">

                    {/* En-tête section */}
                    <div className="relative mb-8">
                      <span ref={el => { numberRefs.current[tabId] = el; }}
                        className="absolute -top-4 left-0 font-display font-bold select-none pointer-events-none"
                        style={{ fontSize: "clamp(7rem, 12vw, 11rem)", lineHeight: 0.85, color: "rgba(30,16,8,0.09)", zIndex: 0 }}>
                        {SECTION_NUMBERS[tabId]}
                      </span>
                      <div className="relative z-10 pt-16">
                        <h2 className="section-title-reveal font-display font-bold text-terracotta tracking-tight"
                          style={{ fontSize: "clamp(3rem, 5vw, 4.2rem)", lineHeight: 1.0 }}>
                          {SECTION_LABELS[tabId]}
                        </h2>
                      </div>
                      <div ref={el => { separatorRefs.current[tabId] = el; }} className="separator-draw mt-6 h-[1.5px] origin-left" style={{ background: "rgba(30,16,8,0.22)" }} />
                    </div>

                    {/* ── FILTRES + SOUS-TITRE ── */}
                    {tabId !== "suggestions" && (
                      <div className="mb-9">
                        {/* Pills de filtre */}
                        <div className="filter-row flex flex-wrap gap-2 mb-4">
                          {FILTERS.map(f => {
                            const isOn = activeF === f.id;
                            // Cacher les filtres qui ne matchent rien (sauf "tous")
                            const cnt = countFiltered(tabId, f.id);
                            // Masquer si 0 résultat OU si le filtre match tout (inutile)
                            const total = countFiltered(tabId, "tous");
                            if (f.id !== "tous" && (cnt === 0 || cnt === total)) return null;
                            return (
                              <button key={f.id}
                                onClick={() => setFilter(tabId, f.id)}
                                className="font-sans text-xs tracking-[0.1em] uppercase transition-all duration-250"
                                style={{
                                  padding: "5px 14px",
                                  borderRadius: "40px",
                                  border: isOn ? "1px solid #C0392B" : "1px solid rgba(30,16,8,0.12)",
                                  background: isOn ? "#C0392B" : "transparent",
                                  color: isOn ? "white" : "rgba(30,16,8,0.45)",
                                  fontWeight: isOn ? "600" : "400",
                                  cursor: "pointer",
                                }}>
                                {f.label}
                                {f.id !== "tous" && !isOn && (
                                  <span style={{ marginLeft: "6px", opacity: 0.5, fontSize: "10px" }}>{cnt}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                        {/* Sous-titre dynamique */}
                        <p className="font-sans text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(30,16,8,0.28)", display: "flex", alignItems: "center", gap: "10px" }}>
                          <span>{count} proposition{count > 1 ? "s" : ""}</span>
                          <span style={{ flex: 1, height: "1px", background: "rgba(30,16,8,0.07)", display: "block" }} />
                          {((tabId as string) !== "boissons" && (tabId as string) !== "suggestions") && (
                            <span>{range}</span>
                          )}
                          <span>· semaine du {weekLabel.split("—")[0].trim()}</span>
                        </p>
                      </div>
                    )}

                    {/* ── SUGGESTIONS — ardoise ── */}
                    {tabId === "suggestions" ? (
                      <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1E1008 0%, #1a0f08 100%)", border: "1px solid rgba(201,169,110,0.18)" }}>
                        {MENU.suggestions.map((item, i) => (
                          <div key={i} className="plat-item group relative flex items-start justify-between gap-6 px-8 py-7 transition-colors duration-300"
                            style={{ borderBottom: i < MENU.suggestions.length - 1 ? "1px solid rgba(201,169,110,0.07)" : "none" }}
                            onMouseEnter={() => setHoverKey(`suggestions-${i}`)} onMouseLeave={() => setHoverKey(null)}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2.5">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.45)" strokeWidth="1.5" strokeLinecap="round">
                                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                                <span className="font-sans text-2xs tracking-[0.18em] uppercase" style={{ color: "rgba(201,169,110,0.5)" }}>Ardoise du jour</span>
                              </div>
                              <h3 className="font-display font-bold mb-2 transition-colors duration-300"
                                style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)", color: hoverKey === `suggestions-${i}` ? "#C9A96E" : "rgba(245,240,232,0.88)" }}>
                                {item.name}
                              </h3>
                              <p className="font-sans text-sm font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.4)" }}>{item.desc}</p>
                            </div>
                            <span className="shrink-0 font-sans text-xs tracking-[0.14em] uppercase pt-1 transition-colors duration-300"
                              style={{ color: hoverKey === `suggestions-${i}` ? "rgba(201,169,110,0.7)" : "rgba(201,169,110,0.28)" }}>
                              Sur ardoise
                            </span>
                          </div>
                        ))}
                        <div className="px-8 py-4 flex items-center gap-3" style={{ borderTop: "1px solid rgba(201,169,110,0.07)", background: "rgba(255,255,255,0.02)" }}>
                          <div className="w-4 h-px" style={{ background: "rgba(201,169,110,0.28)" }} />
                          <p className="font-sans text-2xs tracking-[0.22em] uppercase" style={{ color: "rgba(201,169,110,0.32)" }}>Demandez le détail à votre serveur</p>
                        </div>
                      </div>

                    ) : (
                      /* ── PLATS NORMAUX avec filtrage et tags ── */
                      <div className="flex flex-col gap-3">
                        {filtered.length === 0 ? (
                          /* État vide si filtre ne match rien */
                          <div className="py-12 text-center">
                            <p className="font-display font-light italic text-terracotta/30" style={{ fontSize: "1.2rem" }}>
                              Aucun plat pour ce filtre
                            </p>
                            <button onClick={() => setFilter(tabId, "tous")}
                              className="mt-4 font-sans text-xs tracking-[0.18em] uppercase text-rouge/60 hover:text-rouge transition-colors duration-300">
                              Voir tous les plats →
                            </button>
                          </div>
                        ) : (
                          filtered.map((item, i) => {
                            const key = `${tabId}-${i}`;
                            const isHov = hoverKey === key;
                            const isLast = i === filtered.length - 1;
                            const isSignature = !!item.chef;
                            const nullPriceText = () => {
                              if (tabId === "boissons") {
                                if (item.name.toLowerCase().includes("vins")) return "Au verre";
                                return "Selon sélection";
                              }
                              return "Sur ardoise";
                            };

                            return (
                              <div key={`${tabId}-filtered-${i}`}
                                className="plat-item group relative"
                                onMouseEnter={() => setHoverKey(key)}
                                onMouseLeave={() => setHoverKey(null)}
                                style={{
                                  // Plats "Signature" sur fond ambre doux
                                  background: isSignature
                                    ? isHov
                                      ? "rgba(201,169,110,0.10)"
                                      : "rgba(201,169,110,0.06)"
                                    : isHov
                                      ? "rgba(30,16,8,0.03)"
                                      : "transparent",
                                  borderRadius: isSignature ? "12px" : "8px",
                                  marginLeft: isSignature ? "-8px" : "0",
                                  marginRight: isSignature ? "-8px" : "0",
                                  padding: isSignature ? "0 8px" : "0",
                                  marginBottom: isSignature ? "4px" : "0",
                                  border: isSignature
                                    ? `1px solid rgba(201,169,110,${isHov ? "0.3" : "0.15"})`
                                    : "1px solid transparent",
                                  transition: "background 0.3s ease, border-color 0.3s ease",
                                }}
                              >
                                <div className="relative flex items-start justify-between gap-10 py-6"
                                  style={{ borderBottom: (!isSignature && !isLast) ? "1px solid rgba(30,16,8,0.12)" : "none" }}>

                                  {/* Trait rouge hover (uniquement sur plats normaux) */}
                                  {!isSignature && (
                                    <div className="absolute bottom-0 left-0 h-px pointer-events-none"
                                      style={{ width: isHov ? "100%" : "0%", background: "rgba(192,57,43,0.15)", transition: "width 0.4s cubic-bezier(0.16,1,0.3,1)" }} />
                                  )}

                                  <div className="flex-1 min-w-0">
                                    {/* Badges */}
                                    <div className="flex items-center gap-2 flex-wrap mb-2.5">
                                      {item.chef && (
                                        <span className="font-sans text-xs tracking-[0.14em] uppercase px-3 py-1"
                                          style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.32)", color: "#8B6A3A", borderRadius: "4px" }}>
                                          ✦ Signature du Chef
                                        </span>
                                      )}
                                      {item.vege && (
                                        <span className="font-sans text-xs tracking-[0.14em] uppercase px-3 py-1"
                                          style={{ background: "rgba(45,74,62,0.1)", border: "1px solid rgba(45,74,62,0.22)", color: "#2D4A3E", borderRadius: "4px" }}>
                                          Végétarien
                                        </span>
                                      )}
                                      {item.note && (
                                        <span className="font-sans text-xs tracking-[0.14em] uppercase px-3 py-1"
                                          style={{ background: "rgba(139,115,85,0.08)", border: "1px solid rgba(139,115,85,0.18)", color: "#8B7355", borderRadius: "4px" }}>
                                          Midi uniquement
                                        </span>
                                      )}
                                    </div>

                                    {/* Nom */}
                                    <h3 className="font-display font-bold mb-2.5"
                                      style={{
                                        fontSize: isSignature ? "clamp(1.7rem, 2.5vw, 2.1rem)" : "clamp(1.6rem, 2.3vw, 1.95rem)",
                                        lineHeight: 1.15,
                                        color: isHov
                                          ? (isSignature ? "#A8884A" : "#C0392B")
                                          : "#1E1008",
                                        transition: "color 0.22s ease",
                                        letterSpacing: "-0.01em",
                                      }}>
                                      {item.name}
                                      {item.chef && (
                                        <svg
                                          width="14" height="14" viewBox="0 0 24 24" fill="#C0392B"
                                          style={{ display: "inline", marginLeft: "8px", verticalAlign: "middle", opacity: 0.6 }}>
                                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                        </svg>
                                      )}
                                    </h3>

                                    {/* Description */}
                                    <p className="font-sans text-base font-light leading-relaxed mb-3"
                                      style={{ color: isHov ? "rgba(30,16,8,0.78)" : "rgba(30,16,8,0.68)", transition: "color 0.22s ease" }}>
                                      {item.desc}
                                    </p>

                                    {/* ── TAGS INGRÉDIENTS ── */}
                                    {item.tags && item.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5"
                                        style={{ opacity: isHov ? 1 : 0.80, transition: "opacity 0.3s ease" }}>
                                        {item.tags.map(tag => (
                                          <span key={tag}
                                            className="font-sans text-xs"
                                            style={{
                                              padding: "2px 10px",
                                              borderRadius: "20px",
                                              background: isSignature
                                                ? "rgba(201,169,110,0.12)"
                                                : "rgba(30,16,8,0.05)",
                                              color: isSignature
                                                ? "rgba(139,106,58,0.8)"
                                                : "rgba(30,16,8,0.4)",
                                              border: isSignature
                                                ? "1px solid rgba(201,169,110,0.2)"
                                                : "1px solid rgba(30,16,8,0.08)",
                                            }}>
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Prix */}
                                  {item.price !== null && item.price !== undefined ? (
                                    <div className="shrink-0 text-right pt-1"
                                      style={{ transform: isHov ? "scale(1.05)" : "scale(1)", transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
                                      <p className="font-display font-bold leading-none"
                                        style={{
                                          fontSize: "clamp(1.7rem, 2.2vw, 2rem)",
                                          color: isHov
                                            ? (isSignature ? "#A8884A" : "#C0392B")
                                            : (isSignature ? "rgba(168,136,74,0.90)" : "rgba(192,57,43,0.85)"),
                                          transition: "color 0.22s ease",
                                          letterSpacing: "-0.02em",
                                        }}>
                                        {item.price}
                                        <span style={{ fontSize: "0.5em", marginLeft: "2px", opacity: 0.75 }}>€</span>
                                      </p>
                                    </div>
                                  ) : (
                                    <span className="shrink-0 font-sans text-xs pt-2 tracking-[0.1em] uppercase"
                                      style={{ color: "rgba(30,16,8,0.32)" }}>
                                      {nullPriceText()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pied de carte */}
              <div className="flex items-center gap-5 pt-10 mt-4 border-t border-terracotta/8">
                <div className="w-10 h-px" style={{ background: "rgba(201,169,110,0.4)" }} />
                <p className="font-sans text-xs tracking-[0.22em] uppercase text-terracotta/48">
                  Produits frais · Viandes françaises · Non halal · Carte renouvelée chaque semaine
                </p>
                <div className="flex-1 h-px bg-terracotta/5" />
              </div>
            </div>

            {/* ── COLONNE DROITE ─────────────────────────────────────── */}
            <div className="hidden lg:block shrink-0" style={{ width: "260px", marginLeft: "56px", position: "sticky", top: "96px", alignSelf: "flex-start", height: "fit-content" }}>
              <div className="pt-20">

                {/* Image avec overlay léger et correct */}
                <div className="relative overflow-hidden mb-4"
                  style={{ aspectRatio: "3/4", borderRadius: "14px", boxShadow: "0 32px 80px rgba(15,8,5,0.28)", background: "#2D1A0A" }}>
                  <div style={{ opacity: imgFading ? 0 : 1, transition: "opacity 0.5s ease", position: "absolute", inset: 0 }}>
                    <Image src={ambiance.src} alt={ambiance.label} fill quality={90} sizes="280px"
                      className="object-cover object-center"
                      style={{
                        animation: "kenBurns 10s ease-in-out infinite alternate",
                        filter: "brightness(1.1) saturate(1.15) contrast(1.04)",
                      }} />
                    <div className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(15,8,5,0.85) 0%, rgba(15,8,5,0.12) 40%, transparent 65%)" }} />
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-5">
                      <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-3 h-px bg-rouge/70" />
                        <p className="font-sans text-xs tracking-[0.2em] uppercase text-cream/60">{SECTION_LABELS[ambianceKey]}</p>
                      </div>
                      <p className="font-display font-light italic text-cream/80 text-sm line-clamp-1">{ambiance.label}</p>
                    </div>
                  </div>
                </div>

                {/* Stats compactes — nb plats + fourchette prix */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="px-3 py-3.5 text-center" style={{ background: "rgba(30,16,8,0.04)", border: "1px solid rgba(30,16,8,0.07)", borderRadius: "8px" }}>
                    <p className="font-display font-bold text-terracotta leading-none mb-1.5" style={{ fontSize: "1.8rem" }}>
                      {activeCount}
                    </p>
                    <p className="font-sans text-xs tracking-[0.12em] uppercase text-terracotta/40">
                      {activeFilter === "tous" ? "plats" : "filtrés"}
                    </p>
                  </div>
                  <div className="px-3 py-3.5 text-center" style={{ background: "rgba(192,57,43,0.05)", border: "1px solid rgba(192,57,43,0.1)", borderRadius: "8px" }}>
                    <p className="font-display font-bold leading-none mb-1.5" style={{ fontSize: "1.3rem", color: "#C0392B" }}>
                      {priceRange}
                    </p>
                    <p className="font-sans text-xs tracking-[0.12em] uppercase text-terracotta/40">fourchette</p>
                  </div>
                </div>

                {/* Citation Chef */}
                <blockquote className="pl-4 mb-4" style={{ borderLeft: "2px solid rgba(201,169,110,0.4)" }}>
                  <p className="font-display font-medium italic text-terracotta/78 leading-snug" style={{ fontSize: "1.08rem" }}>
                    &ldquo;Je cuisine ce que la saison me donne, avec ce que le terroir m&apos;inspire.&rdquo;
                  </p>
                  <cite className="font-sans text-xs tracking-[0.2em] uppercase text-gold/70 not-italic mt-2.5 block">
                    — Régis Clauss
                  </cite>
                </blockquote>

                {/* Badge semaine */}
                <div className="flex items-center gap-2.5 mb-4 px-3.5 py-2.5"
                  style={{ background: "rgba(30,16,8,0.04)", border: "1px solid rgba(30,16,8,0.08)", borderRadius: "6px" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-pulse-slow shrink-0" />
                  <p className="font-sans text-xs tracking-[0.12em] uppercase text-terracotta/45 leading-snug">
                    Carte · semaine du {weekLabel.split("—")[0].trim()}
                  </p>
                </div>

                <div className="h-px mb-4" style={{ background: "rgba(30,16,8,0.07)" }} />

                {/* CTAs */}
                <Link href="/contact" className="flex items-center justify-between px-5 py-4 mb-3 group transition-all duration-300 hover:opacity-90"
                  style={{ background: "#C0392B", borderRadius: "8px" }}>
                  <span className="font-sans text-xs tracking-[0.15em] uppercase text-white/90">Réserver une table</span>
                  <svg width="13" height="6" viewBox="0 0 16 8" fill="none" className="group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M0 4H14M10 1L14 4L10 7" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>
                <a href="tel:0609386764" className="flex items-center justify-center gap-2 px-5 py-3 transition-all duration-300 hover:bg-terracotta/8"
                  style={{ border: "1px solid rgba(30,16,8,0.12)", borderRadius: "8px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(30,16,8,0.5)" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="font-sans text-xs text-terracotta/50 tracking-wide">06 09 38 67 64</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CARTE DES SAISONS — déplacée ici depuis la homepage ── */}
      <div className="h-24 w-full pointer-events-none" style={{ background: "linear-gradient(to bottom, #EDE8DC, #1E1008)" }} />
      <div className="h-24 w-full pointer-events-none" style={{ background: "linear-gradient(to bottom, #1E1008, #0f0805)" }} />

      {/* CTA FINAL */}
      <section className="relative overflow-hidden py-section text-center" style={{ background: "#0f0805" }}>
        {/* Image de fond atmosphérique */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image src="/images/espaces/terrasse.jpg" alt="" fill aria-hidden="true"
            sizes="100vw" quality={60}
            className="object-cover"
            style={{ opacity: 0.12, filter: "saturate(0.5) brightness(0.4)" }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(201,169,110,0.09) 0%, transparent 65%)" }} />
        {[640, 440, 280].map((size, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: size, height: size, top: "50%", left: "50%", transform: "translate(-50%, -50%)", border: `1px ${i === 0 ? "dashed" : "solid"} rgba(201,169,110,${0.04 + i * 0.03})` }} />
        ))}
        <div className="relative z-10 container-main max-w-xl">
          <span className="eyebrow text-gold/50 mb-6 block">Réservation</span>
          <h2 className="section-title text-cream mb-5">Une table vous attend</h2>
          <div className="w-10 h-px bg-rouge mx-auto mb-7" />
          <p className="font-heading font-light text-cream/50 text-lg mb-12 leading-relaxed">
            La carte change chaque semaine. Venez découvrir ce que Régis Clauss a préparé pour vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-10 py-4">Réserver une table</Link>
            <a href="tel:0609386764" className="btn-ghost px-10 py-4 text-sm">06 09 38 67 64</a>
          </div>
        </div>
      </section>

    </>
  );
}
