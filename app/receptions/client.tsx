"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { GALERIE } from "@/lib/data";
import { PageHero } from "@/components/ui/PageHero";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { SectionTransition } from "@/components/ui/SectionTransition";

// ── Types ─────────────────────────────────────────────────────────────────────
type FormState  = "idle" | "loading" | "success" | "error";
type FunnelStep = 1 | 2 | 3;
type OccasionId = "mariage" | "anniversaire" | "bapteme" | "corporate" | "autre";

// ── Occasions ─────────────────────────────────────────────────────────────────
const OCCASIONS: Array<{
  id: OccasionId; label: string; desc: string;
  capacity: string; prixFrom: string; image: string; color: string;
}> = [
  { id: "mariage",      label: "Mariage",              color: "#C0392B", capacity: "40 à 200 invités",   prixFrom: "À partir de 65€ / pers.",  image: "/images/receptions/mariage-1.jpg",
    desc: "Le plus beau jour de votre vie dans le plus bel écrin de Lorraine. Salle, terrasse et piscine privatisés pour un moment unique et inoubliable." },
  { id: "anniversaire", label: "Anniversaire",          color: "#A8884A", capacity: "10 à 150 personnes", prixFrom: "À partir de 45€ / pers.",  image: "/images/espaces/terrasse.jpg",
    desc: "Une célébration mémorable dans un cadre exceptionnel. Menu sur mesure du Chef selon vos goûts, votre thème et votre ambiance souhaitée." },
  { id: "bapteme",      label: "Baptême & Communion",   color: "#2D4A3E", capacity: "20 à 80 personnes",  prixFrom: "À partir de 42€ / pers.",  image: "/images/espaces/terrasse.jpg",
    desc: "Réunissez famille et proches dans un cadre chaleureux et verdoyant. Service attentionné, espace adapté aux enfants, atmosphère conviviale." },
  { id: "corporate",    label: "Événement d'entreprise",color: "#2C3E50", capacity: "20 à 200 personnes", prixFrom: "Devis personnalisé",        image: "/images/espaces/restaurant.jpg",
    desc: "Séminaire, team building ou soirée de gala dans un lieu d'exception. Équipements disponibles, domaine entièrement privatisable, service traiteur." },
  { id: "autre",        label: "Autre célébration",     color: "#8B7355", capacity: "10 à 200 personnes", prixFrom: "Devis sur mesure",         image: "/images/receptions/mariage-5.jpg",
    desc: "Chaque événement est unique. Contactez-nous pour un devis sur mesure parfaitement adapté à votre projet et à vos envies les plus précises." },
];

// ── Témoignages variés (mariages + anniversaire + corporate) ──────────────────
// On garde les 2 témoignages les plus contrastés : mariage + corporate
const TEMOIGNAGES = [
  {
    couple: "Emma & Thomas B.",
    date: "Septembre 2025",
    comment: "La piscine illuminée pour notre soirée de mariage était d'une beauté absolue. Du premier rendez-vous avec l'équipe jusqu'au dernier slow, tout était parfait.",
    initials: "E&T",
    occasion: "Mariage",
    occasionColor: "#C0392B",
    avatarColor: "#C0392B",
  },
  {
    couple: "Clara & Maxime V.",
    date: "Juillet 2025",
    comment: "Le Chef Régis a composé un menu sur mesure qui a ému nos proches aux larmes. L'accord mets et vins était divin. Un lieu de mariage exceptionnel en Lorraine.",
    initials: "C&M",
    occasion: "Mariage",
    occasionColor: "#C0392B",
    avatarColor: "#9B2D22",
  },
  {
    couple: "Famille Bertrand",
    date: "Juin 2025",
    comment: "Notre anniversaire aux Jardins était exactement ce dont nous rêvions. L'équipe a été d'une attention et d'un professionnalisme exemplaires du début à la fin.",
    initials: "FB",
    occasion: "Anniversaire",
    occasionColor: "#A8884A",
    avatarColor: "#A8884A",
  },
  {
    couple: "Groupe Stellaris RH",
    date: "Novembre 2025",
    comment: "Notre séminaire d'entreprise s'est transformé en moment de magie. La privatisation du domaine, le menu gastronomique, l'accueil — tout au niveau d'un établissement 5 étoiles.",
    initials: "SR",
    occasion: "Corporate",
    occasionColor: "#2C3E50",
    avatarColor: "#2C3E50",
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
// 3 questions les plus fréquentes — les 2 autres via le formulaire ou téléphone
const FAQ = [
  { q: "Peut-on apporter sa propre musique / DJ ?", a: "Oui, tout à fait. Vous pouvez venir avec votre propre DJ ou groupe. Nous disposons d'un système sonore professionnel sur place. Nous pouvons également vous recommander des prestataires de confiance de la région." },
  { q: "Quel est le délai pour réserver une date ?", a: "Les week-ends de haute saison (mai–septembre) se réservent 8 à 18 mois à l'avance. Les dates de semaine et basse saison sont souvent disponibles dans les 3–6 mois. Contactez-nous pour vérifier la disponibilité." },
  { q: "Les régimes alimentaires sont-ils pris en compte ?", a: "Oui, sans exception. Le Chef Régis Clauss adapte systématiquement les menus aux allergies, intolérances et régimes végétariens ou vegan. Un échange préalable est organisé lors de la préparation du menu." },
  { q: "Peut-on visiter le domaine avant de réserver ?", a: "Absolument. Nous vous accueillons pour une visite complète avec un verre de bienvenue, sans engagement. C'est l'occasion de découvrir les espaces, de rencontrer notre équipe et de commencer à imaginer votre événement dans ce cadre." },
  { q: "Quel acompte est demandé à la réservation ?", a: "Un acompte de 30% est demandé pour confirmer votre réservation et bloquer la date. Le solde est réglé 30 jours avant l'événement. Nous acceptons les chèques, virements et cartes bancaires." },
];

// ── Galerie orbitale 2D ────────────────────────────────────────────────────────
function ArcGallery() {
  const total      = GALERIE.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile,  setIsMobile]  = useState(false);
  const touchStartX = useRef(0);
  const isDragging  = useRef(false);
  const animRef     = useRef<number>(0);
  const currentAngle = useRef(0); // angle courant en radians
  const targetAngle  = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Dimensions
  const CARD_W   = isMobile ? 140 : 300;
  const CARD_H   = isMobile ? 94  : 200;
  const RX       = isMobile ? 160 : 540; // rayon horizontal (ellipse)
  const RY       = isMobile ? 30  : 85;  // rayon vertical (écrasement)
  const sceneH   = isMobile ? 340 : 460;
  const centerY  = isMobile ? 200 : 250; // position verticale centre de l'ellipse

  // Chaque carte a un angle fixe sur l'ellipse
  const angleStep = (Math.PI * 2) / total;

  // Animation douce vers targetAngle
  useEffect(() => {
    const animate = () => {
      const diff = targetAngle.current - currentAngle.current;
      // Normalise pour prendre le chemin le plus court
      const normalized = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
      currentAngle.current += normalized * 0.08;
      setRenderKey(k => k + 1); // force re-render
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const [, setRenderKey] = useState(0); // juste pour déclencher re-renders

  const goTo = useCallback((idx: number) => {
    // L'angle du front (12h) est -π/2, on veut idx au front
    targetAngle.current = -idx * angleStep;
    setActiveIdx(idx);
  }, [angleStep]);

  const goPrev = useCallback(() => goTo((activeIdx - 1 + total) % total), [activeIdx, total, goTo]);
  const goNext = useCallback(() => goTo((activeIdx + 1) % total),         [activeIdx, total, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  // Calcule la position de chaque carte selon l'angle courant
  const cards = GALERIE.map((item, i) => {
    const angle = i * angleStep + currentAngle.current;
    const x = Math.cos(angle) * RX; // position X sur l'ellipse
    const y = Math.sin(angle) * RY; // position Y (écrasée)
    // Profondeur simulée par sin : -1 = arrière, +1 = avant
    const depth = Math.sin(angle); // -1..+1
    const scale = 0.55 + 0.45 * ((depth + 1) / 2); // 0.55..1.00
    const opacity = 0.25 + 0.75 * ((depth + 1) / 2); // 0.25..1.00
    const zIndex = Math.round((depth + 1) * 50);
    const isActive = i === activeIdx;
    return { ...item, i, x, y, scale, opacity, zIndex, isActive, depth };
  });

  // Tri par profondeur pour overlapping correct
  const sorted = [...cards].sort((a, b) => a.depth - b.depth);

  const titleFontSize = isMobile ? "clamp(1.8rem,5vw,3rem)" : "clamp(2.4rem,5vw,5rem)";

  return (
    <>
      <SectionTransition from="#EDE8DC" to="#0E0805" height={56} />
      <section className="galerie-section overflow-hidden" style={{ background: "#0E0805" }}>

      {/* Titre */}
      <div className="flex flex-col items-center pt-14 pb-4 pointer-events-none">
        <span className="eyebrow text-gold/45 mb-5 block tracking-[0.3em]">Galerie</span>
        <h2 className="font-display font-bold text-cream text-center leading-none tracking-tight" style={{ fontSize: titleFontSize, opacity: 0.90 }}>
          Ils ont choisi<br />l&apos;Hacienda
        </h2>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-8 h-px" style={{ background: "rgba(201,169,110,0.3)" }} />
          <p className="font-sans text-xs tracking-[0.25em] uppercase" style={{ color: "rgba(201,169,110,0.45)" }}>
            {total} photos · 6 ans de moments mémorables
          </p>
          <div className="w-8 h-px" style={{ background: "rgba(201,169,110,0.3)" }} />
        </div>
      </div>

      {/* Scène orbitale */}
      <div className="relative w-full select-none"
        style={{ height: `${sceneH}px` }}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; isDragging.current = false; }}
        onTouchMove={e => { isDragging.current = true; }}
        onTouchEnd={e => {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 30) dx < 0 ? goNext() : goPrev();
        }}>

        {/* Cartes positionnées par trigonométrie */}
        {sorted.map(({ src, caption, i, x, y, scale, opacity, zIndex, isActive }) => (
          <div
            key={src}
            onClick={() => {
              if (isDragging.current) return;
              if (isActive) return;
              x < 0 ? goPrev() : goNext();
            }}
            role="button"
            tabIndex={0}
            aria-label={caption}
            onKeyDown={e => e.key === "Enter" && goTo(i)}
            className="absolute focus:outline-none"
            style={{
              width:     `${CARD_W}px`,
              height:    `${CARD_H}px`,
              left:      `calc(50% + ${x}px - ${CARD_W / 2}px)`,
              top:       `${centerY + y - CARD_H / 2}px`,
              transform: `scale(${scale})`,
              opacity,
              zIndex,
              cursor:    isActive ? "default" : "pointer",
              transition: "none", // fluidité gérée par rAF
            }}
          >
            <div className="w-full h-full overflow-hidden relative" style={{
              borderRadius: "10px",
              boxShadow: isActive
                ? "0 16px 50px rgba(0,0,0,0.9), 0 0 0 1.5px rgba(201,169,110,0.55)"
                : "0 4px 16px rgba(0,0,0,0.6)",
            }}>
              <Image
                src={src} alt={caption} fill
                sizes={`${CARD_W}px`}
                style={{
                  objectFit: "cover",
                  filter: isActive ? "brightness(1.1)" : "brightness(0.55)",
                }}
              />
              {isActive && (
                <div className="absolute inset-0 pointer-events-none"
                  style={{ borderRadius: "10px", border: "1.5px solid rgba(201,169,110,0.5)" }} />
              )}
            </div>
          </div>
        ))}

        {/* Flèches */}
        {[
          { dir: "prev", onClick: goPrev, cls: "left-4 md:left-8", poly: "15 18 9 12 15 6" },
          { dir: "next", onClick: goNext, cls: "right-4 md:right-8", poly: "9 18 15 12 9 6" },
        ].map(({ dir, onClick, cls, poly }) => (
          <button key={dir} onClick={onClick}
            aria-label={dir === "prev" ? "Photo précédente" : "Photo suivante"}
            className={`absolute ${cls} top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-gold/25 bg-black/50 backdrop-blur-sm flex items-center justify-center text-cream/55 hover:text-gold hover:border-gold/55 transition-all duration-300`}
            style={{ zIndex: 200 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points={poly} />
            </svg>
          </button>
        ))}
      </div>

      {/* Légende + dots */}
      <div className="text-center pb-12 pt-4">
        <p className="font-display font-light italic text-cream/70 text-lg mb-1">{GALERIE[activeIdx].caption}</p>
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold/30 mb-5">{activeIdx + 1} / {total}</p>
        <div className="flex justify-center gap-1.5 flex-wrap px-8">
          {GALERIE.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Photo ${i + 1}`}
              className="rounded-full focus:outline-none transition-all duration-300"
              style={{
                width:      i === activeIdx ? "18px" : "5px",
                height:     "5px",
                background: i === activeIdx ? "#C9A96E" : "rgba(201,169,110,0.18)",
              }} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-5 md:hidden">
          <p className="font-sans text-xs text-cream/25 tracking-[0.2em] uppercase">← Glisser →</p>
        </div>
        <p className="font-sans text-xs text-cream/35 tracking-[0.2em] uppercase mt-4 hidden md:block">
          ← → pour naviguer · Clic pour centrer
        </p>
      </div>
    </section>
    </>
  );
}

function OccasionIcon({ id, size = 24 }: { id: OccasionId; size?: number }) {
  const p = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "mariage":      return <svg {...p} viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
    case "anniversaire": return <svg {...p} viewBox="0 0 24 24"><path d="M20 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>;
    case "bapteme":      return <svg {...p} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "corporate":    return <svg {...p} viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>;
    default:             return <svg {...p} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>;
  }
}

// ── Dots funnel ───────────────────────────────────────────────────────────────
function StepDots({ step, total = 3 }: { step: FunnelStep; total?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => {
        const done = i + 1 < step; const cur = i + 1 === step;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full transition-all duration-400"
              style={{ width: cur ? "28px" : "8px", height: "8px", background: done || cur ? "#C9A96E" : "rgba(201,169,110,0.18)" }}>
              {done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            {i < total - 1 && <div className="w-8 h-px" style={{ background: done ? "rgba(201,169,110,0.5)" : "rgba(201,169,110,0.12)" }}/>}
          </div>
        );
      })}
    </div>
  );
}

// ── Formulaire 3 étapes ───────────────────────────────────────────────────────
interface FunnelProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  formData: Record<string, string>;
  formState: FormState;
  errorMsg: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

function ReceptionFunnel({ formRef, formData, formState, errorMsg, handleChange, handleSubmit }: FunnelProps) {
  const [step, setStep]           = useState<FunnelStep>(1);
  const [guestsCount, setGuests]  = useState(80);

  const iClass = "w-full bg-transparent border-b border-cream/25 py-3 font-sans text-base text-cream placeholder-cream/25 focus:outline-none focus:border-gold transition-colors duration-300";
  const lClass = "block font-sans text-xs tracking-[0.2em] uppercase text-gold/55 mb-2";

  const step1OK = formData.typeEvenement !== "";
  const step3OK = formData.prenom !== "" && formData.email !== "";

  const getEspace = (n: number) => {
    if (n <= 30)  return { label: "Salle intérieure",         sub: "Espace intime et chaleureux",          color: "#C9A96E" };
    if (n <= 80)  return { label: "Salle + Terrasse",          sub: "Le choix le plus populaire",           color: "#C9A96E" };
    if (n <= 130) return { label: "Terrasse + Piscine",        sub: "Réception en plein air",               color: "#2D4A3E" };
    return              { label: "Domaine complet privatisé",  sub: "L'expérience exclusive des Jardins",  color: "#C0392B" };
  };
  const espace = getEspace(guestsCount);

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <StepDots step={step} />

      {/* Étape 1 — Type */}
      {step === 1 && (
        <div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold/60 mb-6 text-center">Étape 1 · Votre événement</p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {OCCASIONS.map(({ id, label }) => {
              const sel = formData.typeEvenement === id;
              return (
                <button key={id} type="button"
                  onClick={() => handleChange({ target: { name: "typeEvenement", value: id } } as React.ChangeEvent<HTMLSelectElement>)}
                  className="flex items-center gap-3 p-4 text-left transition-all duration-300"
                  style={{ border: sel ? "1px solid rgba(201,169,110,0.6)" : "1px solid rgba(201,169,110,0.12)", background: sel ? "rgba(201,169,110,0.1)" : "transparent", borderRadius: "10px" }}>
                  <div className="shrink-0" style={{ color: sel ? "#C9A96E" : "rgba(245,240,232,0.3)" }}>
                    <OccasionIcon id={id} size={20} />
                  </div>
                  <span className="font-sans text-xs tracking-[0.1em] uppercase leading-tight" style={{ color: sel ? "#C9A96E" : "rgba(245,240,232,0.5)" }}>{label}</span>
                  {sel && (
                    <div className="ml-auto shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <button type="button" disabled={!step1OK} onClick={() => setStep(2)}
            className="w-full py-4 font-sans text-xs tracking-[0.18em] uppercase text-white transition-all duration-300 disabled:opacity-30"
            style={{ background: step1OK ? "#C0392B" : "rgba(201,169,110,0.15)", borderRadius: "6px" }}>
            Continuer →
          </button>
        </div>
      )}

      {/* Étape 2 — Date + Slider */}
      {step === 2 && (
        <div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold/60 mb-6 text-center">Étape 2 · Vos informations</p>
          <div className="space-y-7 mb-8">
            <div>
              <label className={lClass}>Date envisagée</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className={iClass}/>
            </div>
            <div>
              <label className={lClass}>Nombre d&apos;invités</label>
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display font-bold text-cream" style={{ fontSize: "2.2rem", lineHeight: 1, letterSpacing: "-0.02em" }}>{guestsCount}</span>
                <span className="font-sans text-xs tracking-[0.1em] uppercase text-cream/30">personnes</span>
              </div>
              <input type="range" min="10" max="200" step="5" value={guestsCount}
                onChange={e => { const v = Number(e.target.value); setGuests(v); handleChange({ target: { name: "invites", value: String(v) } } as React.ChangeEvent<HTMLInputElement>); }}
                className="w-full mb-4" style={{ accentColor: "#C0392B" }} />
              <div className="flex items-center gap-3 px-4 py-3 transition-all duration-400"
                style={{ background: `${espace.color}12`, border: `1px solid ${espace.color}28`, borderRadius: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={espace.color} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <div>
                  <p className="font-sans text-xs font-semibold" style={{ color: espace.color }}>{espace.label}</p>
                  <p className="font-sans text-xs" style={{ color: "rgba(245,240,232,0.38)" }}>{espace.sub}</p>
                </div>
              </div>
            </div>
            <div>
              <label className={lClass}>Votre projet en quelques mots</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={2}
                placeholder="Décors, ambiance, envies particulières…" className={`${iClass} resize-none`}/>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 font-sans text-xs tracking-[0.18em] uppercase text-cream/35 hover:text-cream/55 transition-colors border border-cream/10 hover:border-cream/22" style={{ borderRadius: "6px" }}>← Retour</button>
            <button type="button" onClick={() => setStep(3)} className="flex-[2] py-4 font-sans text-xs tracking-[0.18em] uppercase text-white" style={{ background: "#C0392B", borderRadius: "6px" }}>Continuer →</button>
          </div>
        </div>
      )}

      {/* Étape 3 — Contact + récap enrichi */}
      {step === 3 && (
        <div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold/60 mb-6 text-center">Étape 3 · Vos coordonnées</p>
          <div className="p-4 mb-6" style={{ border: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.06)", borderRadius: "10px" }}>
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-gold/55 mb-3">Récapitulatif</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.typeEvenement && (
                <span className="font-sans text-xs px-2.5 py-1 capitalize" style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.25)", color: "#C9A96E", borderRadius: "4px" }}>
                  {OCCASIONS.find(o => o.id === formData.typeEvenement)?.label}
                </span>
              )}
              {formData.date && (
                <span className="font-sans text-xs px-2.5 py-1" style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", color: "rgba(245,240,232,0.55)", borderRadius: "4px" }}>
                  {new Date(formData.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              )}
              {(formData.invites || guestsCount > 0) && (
                <span className="font-sans text-xs px-2.5 py-1" style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.15)", color: "rgba(245,240,232,0.55)", borderRadius: "4px" }}>
                  {formData.invites || guestsCount} invités
                </span>
              )}
            </div>
            {formData.typeEvenement && (
              <p className="font-sans text-xs" style={{ color: "rgba(245,240,232,0.32)" }}>
                Estimation indicative ·{" "}
                <span style={{ color: "#C9A96E" }}>{OCCASIONS.find(o => o.id === formData.typeEvenement)?.prixFrom}</span>
              </p>
            )}
          </div>
          <div className="space-y-5 mb-7">
            {[{ name: "prenom", label: "Prénom", type: "text" }, { name: "nom", label: "Nom", type: "text" },
              { name: "email", label: "Email", type: "email" }, { name: "telephone", label: "Téléphone", type: "tel" }].map(({ name, label, type }) => (
              <div key={name}>
                <label className={lClass}>{label}</label>
                <input type={type} name={name} required={["prenom","email"].includes(name)} value={formData[name] ?? ""} onChange={handleChange} placeholder={label} className={iClass}/>
              </div>
            ))}
          </div>
          {formState === "error" && <div className="border border-red-400/20 bg-red-400/5 p-3 mb-4 rounded"><p className="font-sans text-xs text-red-300">{errorMsg}</p></div>}
          <div className="flex gap-3 mb-5">
            <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 font-sans text-xs tracking-[0.18em] uppercase text-cream/35 hover:text-cream/55 transition-colors border border-cream/10" style={{ borderRadius: "6px" }}>← Retour</button>
            <button type="submit" disabled={formState === "loading" || !step3OK}
              className="flex-[2] py-4 font-sans text-xs tracking-[0.18em] uppercase text-white disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ background: "#C0392B", borderRadius: "6px" }}>
              {formState === "loading"
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Envoi…</>
                : "Envoyer ma demande"}
            </button>
          </div>
          {/* Téléphone visible AVANT soumission */}
          <div className="text-center mb-4">
            <a href="tel:0618212810" className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.14em] uppercase text-cream/30 hover:text-gold/60 transition-colors duration-300">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Ou appelez-nous · 06 18 21 28 10
            </a>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.45)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span className="font-sans text-xs tracking-[0.1em] uppercase text-cream/38">Données confidentielles</span>
            </div>
            <span className="text-cream/10">·</span>
            <div className="flex items-center gap-1.5">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.45)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="font-sans text-xs tracking-[0.1em] uppercase text-cream/38">Réponse sous 24h</span>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ReceptionsPage() {
  const [formData, setFormData] = useState({ prenom: "", nom: "", email: "", telephone: "", typeEvenement: "", date: "", invites: "", message: "" });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg]   = useState("");
  // Mariage ouvert par défaut ✅
  const [activeOccasion, setActiveOccasion] = useState<OccasionId | null>("mariage");
  const [activeTimeline, setActiveTimeline] = useState<number>(0);
  const [openFaq, setOpenFaq]               = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Init via GSAP — évite conflit opacity-0 Tailwind
      gsap.set(".hero-stat, .hero-cta", { opacity: 0, y: 20 });
      gsap.set(".occasion-card, .timeline-step, .espace-card, .prestation-card, .temoignage-card, .faq-item", { opacity: 0, y: 30 });

      gsap.fromTo(".hero-stat",       { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1,  duration: 0.7, ease: "power3.out", delay: 0.4 });
      gsap.fromTo(".hero-cta",        { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "power3.out", delay: 0.7 });
      gsap.fromTo(".occasion-card",   { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1,  duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".occasions-section", start: "top 80%" } });
      gsap.fromTo(".timeline-step",   { opacity: 0, y: 25 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".timeline-section", start: "top 82%" } });
      gsap.fromTo(".espace-card",     { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".espaces-section", start: "top 80%" } });
      gsap.fromTo(".prestation-card", { opacity: 0, y: 25 }, { opacity: 1, y: 0, stagger: 0.1,  duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".prestations-section", start: "top 80%" } });
      gsap.fromTo(".temoignage-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".temoignages-section", start: "top 80%" } });
      gsap.fromTo(".faq-item",        { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".faq-section", start: "top 82%" } });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) gsap.to(formRef.current, { opacity: 0, y: -10, duration: 0.4, onComplete: () => { setFormState("success"); } });
    else setFormState("success");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (formState === "error") setFormState("idle");
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const TIMELINE_STEPS = [
    { title: "Contact",        desc: "Formulaire en ligne ou appel direct. Devis gratuit et personnalisé sous 24h.",                         detail: "Notre responsable événements vous rappelle dans les 24h pour comprendre votre projet, vos envies et vos contraintes. Aucun engagement à ce stade.",               icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/> },
    { title: "Visite",         desc: "Rendez-vous au domaine pour découvrir les espaces et visualiser votre événement.",                      detail: "Nous vous accueillons pour une visite complète des espaces avec un verre de bienvenue. Vous repartez avec un devis détaillé et des idées plein la tête.",           icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
    { title: "Menu sur mesure",desc: "Le Chef Régis Clauss compose votre carte selon vos goûts, thème et budget.",                           detail: "Une séance dégustation est organisée pour valider chaque plat. Allergies, régimes spéciaux, accord mets & vins — tout est personnalisé jusqu'au dernier détail.", icon: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/><path d="M18 15v7"/></> },
    { title: "Coordination",   desc: "Notre équipe orchestre chaque détail : décors, prestataires, timing, logistics.",                       detail: "Un coordinator dédié est votre interlocuteur unique. Il gère les prestataires, le plan de table, le timing de la journée et les imprévus le jour J.",             icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    { title: "Le Grand Jour",  desc: "Vous profitez pleinement — nous gérons tout. Un souvenir gravé pour toujours.",                        detail: "Le jour J, votre équipe arrive 6h avant vos invités. Vous ne vous occupez de rien — sauf de vivre le plus beau moment de votre vie.",                            icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/> },
  ];

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO — titre poétique + image la + lumineuse
      ══════════════════════════════════════════════════════ */}
      <PageHero
        variant="compact"
        image="/images/receptions/mariage-1.jpg"
        eyebrow="Événements & Célébrations"
        title="Votre plus beau jour"
        subtitle="Le plus bel écrin de Lorraine vous attend — jusqu'à 200 invités, domaine entièrement privatisable."
      />

      {/* Chiffres clés + 2 CTA — section unique, pas de doublon ✅ */}
      <section style={{ background: "#1E1008" }}>
        <div className="container-main py-12 md:py-16">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {[{ val: "300+", label: "Réceptions organisées" }, { val: "200", label: "Invités maximum" }, { val: "4,7★", label: "Note Google" }, { val: "Dès 42€", label: "Par personne" }].map(({ val, label }) => (
              <div key={label} className="hero-stat flex items-center gap-3 px-4 py-2.5"
                style={{ border: "1px solid rgba(201,169,110,0.2)", borderRadius: "40px", background: "rgba(201,169,110,0.07)" }}>
                <span className="font-display font-bold text-gold" style={{ fontSize: "1.15rem", letterSpacing: "-0.01em" }}>{val}</span>
                <span className="font-sans text-xs tracking-[0.12em] uppercase text-cream/40">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#formulaire" className="hero-cta btn-primary px-10 py-4 text-sm">Organiser mon événement</a>
            <Link href="/les-espaces" className="hero-cta btn-ghost px-10 py-4 text-sm">Visiter les espaces</Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          OCCASIONS — accordéon interactif, mariage ouvert par défaut ✅
      ══════════════════════════════════════════════════════ */}
      <section className="occasions-section py-section" style={{ background: "#EDE8DC" }}>
        <div className="container-main">
          <SectionReveal type="clip-reveal" start="top 82%" className="text-center mb-14">
            <span className="eyebrow text-gold/70 mb-4 block">Pour chaque moment</span>
            <h2 className="section-title text-terracotta">Vos occasions</h2>
          </SectionReveal>
          <div className="flex flex-col gap-3">
            {OCCASIONS.map(({ id, label, desc, capacity, prixFrom, image, color }) => {
              const isOpen = activeOccasion === id;
              return (
                <div
                  key={id}
                  className="occasion-card overflow-hidden transition-all duration-500"
                  style={{
                    borderRadius: "14px",
                    boxShadow:    isOpen
                      ? `0 20px 60px rgba(15,8,5,0.2), 0 0 0 1px ${color}35`
                      : "0 2px 12px rgba(15,8,5,0.07)",
                    border:       isOpen
                      ? `1px solid ${color}40`
                      : "1px solid rgba(30,16,8,0.12)",
                    background:   isOpen
                      ? "rgba(255,255,255,0.95)"
                      : "#FAFAF7",
                    backdropFilter: isOpen ? "blur(8px)" : "none",
                  }}
                >
                  <button
                    onClick={() => setActiveOccasion(isOpen ? null : id)}
                    className="w-full flex items-center gap-4 px-7 py-5 text-left"
                    style={{ background: "transparent" }}
                  >
                    <div
                      className="shrink-0 transition-all duration-300"
                      style={{
                        color:     isOpen ? color : "rgba(30,16,8,0.3)",
                        transform: isOpen ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      <OccasionIcon id={id} size={24} />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-display font-bold tracking-tight transition-all duration-300"
                        style={{
                          fontSize:  "clamp(1.2rem,2vw,1.6rem)",
                          color:     isOpen ? color : "#1E1008",
                          transform: isOpen ? "scale(1.01)" : "scale(1)",
                          transformOrigin: "left",
                        }}
                      >
                        {label}
                      </h3>
                      {!isOpen && <p className="font-sans text-xs text-terracotta/40 mt-0.5">{capacity}</p>}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {isOpen && (
                        <span
                          className="hidden md:block font-sans text-xs tracking-[0.1em] uppercase px-3 py-1.5"
                          style={{
                            background:   `${color}12`,
                            border:       `1px solid ${color}30`,
                            color,
                            borderRadius: "4px",
                          }}
                        >
                          {capacity}
                        </span>
                      )}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-400"
                        style={{
                          background: isOpen ? color : "rgba(30,16,8,0.06)",
                          transform:  isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          boxShadow:  isOpen ? `0 4px 12px ${color}40` : "none",
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke={isOpen ? "white" : "rgba(30,16,8,0.4)"}
                          strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Contenu déroulant */}
                  <div
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{ maxHeight: isOpen ? "500px" : "0px" }}
                  >
                    <div className="flex flex-col md:grid md:grid-cols-2">
                      {/* Photo */}
                      <div className="relative overflow-hidden" style={{ minHeight: "220px" }}>
                        <Image src={image} alt={label} fill sizes="(max-width: 768px) 100vw, 50vw" quality={85}
                          className="object-cover" style={{ filter: "brightness(1.1) saturate(1.05)" }} />
                        <div className="absolute inset-0 md:hidden"
                          style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.95) 100%)" }} />
                        <div className="absolute inset-0 hidden md:block"
                          style={{ background: "linear-gradient(to right, transparent 55%, rgba(255,255,255,0.95) 100%)" }} />
                      </div>
                      {/* Texte */}
                      <div className="px-7 py-7 md:px-8 md:py-8 flex flex-col justify-center">
                        <p className="font-heading font-light text-terracotta/85 text-base leading-relaxed mb-6">{desc}</p>
                        <div className="flex flex-wrap gap-3 mb-6">
                          <div className="flex items-center gap-2">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <span className="font-sans text-sm text-terracotta/60">{capacity}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            <span className="font-sans text-sm" style={{ color }}>{prixFrom}</span>
                          </div>
                        </div>
                        <a
                          href="#formulaire"
                          className="inline-flex items-center gap-2.5 font-sans text-xs tracking-[0.16em] uppercase px-6 py-3 text-white hover:opacity-90 transition-opacity w-fit"
                          style={{ background: color, borderRadius: "6px", boxShadow: `0 4px 16px ${color}35` }}
                        >
                          Demander un devis
                          <svg width="12" height="6" viewBox="0 0 16 8" fill="none">
                            <path d="M0 4H14M10 1L14 4L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TIMELINE — interactive, étapes cliquables ✅
      ══════════════════════════════════════════════════════ */}
      <section className="timeline-section py-section" style={{ background: "#F5F0E8" }}>
        <div className="container-main">
          <SectionReveal type="clip-reveal" start="top 82%" className="text-center mb-6">
            <span className="eyebrow text-gold/70 mb-4 block">Comment ça se passe ?</span>
            <h2 className="section-title text-terracotta">De votre premier contact<br /><em className="italic text-rouge">au grand jour</em></h2>
            <p className="font-heading font-light text-terracotta/50 text-base mt-4 max-w-xl mx-auto">
              De la première rencontre au dernier slow, notre équipe est à vos côtés à chaque étape.
            </p>
            <div className="w-12 h-px bg-rouge mx-auto mt-6" />
          </SectionReveal>

          {/* Steps cliquables */}
          <div className="relative mt-14">
            <div className="absolute hidden md:block" style={{ top: "28px", left: "10%", right: "10%", height: "1px", background: "linear-gradient(to right, transparent, rgba(192,57,43,0.18), rgba(192,57,43,0.28), rgba(192,57,43,0.18), transparent)" }} />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
              {TIMELINE_STEPS.map(({ title, desc, icon }, idx) => {
                const isActive    = activeTimeline === idx;
                const isDone      = idx < activeTimeline;
                const isLast      = idx === TIMELINE_STEPS.length - 1;
                const isStarClick = isLast && isActive;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTimeline(idx)}
                    className="timeline-step flex flex-col items-center text-center group cursor-pointer"
                    style={{ background: "none", border: "none", padding: "0" }}
                  >
                    <div className="relative mb-4">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-400"
                        style={{
                          background:  isLast && isActive ? "linear-gradient(135deg,#C0392B,#A8884A)" : isActive ? "#C0392B" : isDone ? "rgba(192,57,43,0.15)" : "#FAFAF7",
                          border:      isActive || isDone ? "none" : "1px solid rgba(30,16,8,0.1)",
                          boxShadow:   isStarClick
                            ? "0 0 0 4px rgba(201,169,110,0.15), 0 8px 28px rgba(192,57,43,0.45)"
                            : isActive ? "0 8px 28px rgba(192,57,43,0.35)" : "none",
                          transform:   isActive ? "scale(1.12)" : "scale(1)",
                          animation:   isStarClick ? "glow-gold 2s ease-in-out infinite" : "none",
                        }}
                      >
                        {isLast ? (
                          <svg
                            width="18" height="18" viewBox="0 0 24 24" stroke="none"
                            style={{
                              fill:      isActive ? "#FFD700" : "rgba(30,16,8,0.2)",
                              animation: isStarClick ? "star-celebrate 0.7s cubic-bezier(0.34,1.56,0.64,1)" : "none",
                            }}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round"
                            stroke={isActive ? "white" : isDone ? "#C0392B" : "rgba(30,16,8,0.3)"}>{icon}</svg>
                        )}
                      </div>
                      <span
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center font-sans font-bold text-white"
                        style={{
                          fontSize:   "0.58rem",
                          background: isActive ? "#C0392B" : isDone ? "rgba(192,57,43,0.5)" : "rgba(30,16,8,0.1)",
                          color:      isActive || isDone ? "white" : "rgba(30,16,8,0.3)",
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3
                      className="font-heading font-bold text-sm mb-1.5 transition-colors duration-300"
                      style={{ color: isActive ? (isLast ? "#C9A96E" : "#C0392B") : "#1E1008" }}
                    >
                      {title}
                    </h3>
                    <p className="font-sans font-light text-xs text-terracotta/45 leading-relaxed">{desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Panneau détail de l'étape active — fadeIn via key change */}
            <div className="mt-10" style={{ animation: "fadeIn 0.35s ease forwards" }} key={activeTimeline}>
              <div className="flex items-start gap-5 p-7 max-w-2xl mx-auto"
                style={{ background: "white", borderRadius: "14px", border: `1px solid rgba(192,57,43,0.12)`, boxShadow: "0 8px 32px rgba(15,8,5,0.07)" }}>
                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center" style={{ background: "#C0392B" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                    {TIMELINE_STEPS[activeTimeline].icon}
                  </svg>
                </div>
                <div>
                  <p className="font-heading font-semibold text-terracotta mb-2">{TIMELINE_STEPS[activeTimeline].title}</p>
                  <p className="font-sans font-light text-sm text-terracotta/60 leading-relaxed">{TIMELINE_STEPS[activeTimeline].detail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ESPACES — version compacte (3 photos + lien) ✅
      ══════════════════════════════════════════════════════ */}
      {/* ── Encart espaces compact — v01.5 ────────────────────────────────
          Section espaces allégée : lien vers /les-espaces + 4 badges
      ─────────────────────────────────────────────────────────────────── */}
      <section style={{ background: "#F5F0E8" }}>
        <div className="container-main py-12">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-6"
            style={{
              background:   "rgba(30,16,8,0.04)",
              border:       "1px solid rgba(30,16,8,0.08)",
              borderRadius: "12px",
            }}
          >
            <div>
              <p className="eyebrow text-gold/60 mb-1">Le cadre</p>
              <p className="font-heading font-semibold text-terracotta text-lg">
                Salle · Terrasse · Piscine · Domaine entier
              </p>
              <p className="font-sans text-sm text-terracotta/50 mt-1">
                De 20 à 200 personnes · Privatisation complète possible
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              {[
                { label: "200 couverts max" },
                { label: "Parking 50+ places" },
                { label: "Piscine (Juin–Sept)" },
                { label: "Accessible PMR" },
              ].map(({ label }) => (
                <span
                  key={label}
                  className="font-sans text-xs tracking-wide px-3 py-1.5"
                  style={{
                    background:   "rgba(30,16,8,0.06)",
                    border:       "1px solid rgba(30,16,8,0.1)",
                    borderRadius: "40px",
                    color:        "rgba(30,16,8,0.55)",
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
            <Link
              href="/les-espaces"
              className="shrink-0 flex items-center gap-2 font-sans text-xs tracking-[0.16em] uppercase text-terracotta/45 hover:text-rouge transition-colors duration-300"
            >
              Voir les espaces
              <svg width="12" height="6" viewBox="0 0 16 8" fill="none">
                <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GALERIE 3D — WOW moment intact ✅
      ══════════════════════════════════════════════════════ */}
      <ArcGallery />

      {/* ══════════════════════════════════════════════════════
          FAQ — avant les témoignages pour lever les objections
      ══════════════════════════════════════════════════════ */}
      <section className="faq-section py-section" style={{ background: "#1E1008" }}>
        <div className="container-main max-w-3xl">
          <SectionReveal type="clip-reveal" start="top 82%" className="text-center mb-14">
            <span className="eyebrow text-gold/60 mb-4 block">Questions fréquentes</span>
            <h2 className="section-title text-cream">Vous avez des questions ?</h2>
            <p className="font-heading font-light text-cream/40 text-base mt-4">On y répond ici — pour les autres, appelez-nous.</p>
          </SectionReveal>
          <div className="flex flex-col gap-2">
            {FAQ.map(({ q, a }, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="faq-item overflow-hidden transition-all duration-400"
                  style={{ borderRadius: "10px", border: isOpen ? "1px solid rgba(201,169,110,0.25)" : "1px solid rgba(201,169,110,0.08)", background: isOpen ? "rgba(201,169,110,0.07)" : "rgba(255,255,255,0.03)" }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left" style={{ background: "transparent" }}>
                    <span className="font-heading font-medium text-cream/85 text-sm leading-snug">{q}</span>
                    <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{ background: isOpen ? "#C0392B" : "rgba(201,169,110,0.12)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "white" : "rgba(201,169,110,0.7)"} strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </button>
                  <div className="overflow-hidden transition-all duration-400 ease-in-out" style={{ maxHeight: isOpen ? "200px" : "0px" }}>
                    <p className="font-sans font-light text-sm text-cream/50 leading-relaxed px-6 pb-6">{a}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <p className="font-sans text-xs text-cream/30 mb-3">Vous ne trouvez pas votre réponse ?</p>
            <a href="tel:0618212810" className="inline-flex items-center gap-2.5 font-sans text-xs tracking-[0.16em] uppercase text-gold/55 hover:text-gold transition-colors duration-300">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Appelez-nous au 06 18 21 28 10
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TÉMOIGNAGES — après FAQ, juste avant le formulaire
      ══════════════════════════════════════════════════════ */}
      <section className="temoignages-section py-section" style={{ background: "#1E1008" }}>
        <div className="container-main">
          <SectionReveal type="clip-reveal" start="top 82%" className="text-center mb-16">
            <span className="eyebrow text-gold/60 mb-4 block">Ils nous font confiance</span>
            <h2 className="section-title text-cream">Ce qu&apos;ils en disent</h2>
            <div className="flex items-center justify-center gap-2 mt-5">
              {[1,2,3,4,5].map(i => <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#C9A96E" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
              <span className="font-display font-bold text-gold ml-2" style={{ fontSize: "1.05rem" }}>4,7</span>
              <span className="font-sans text-xs text-cream/30 tracking-wide">— +300 avis Google vérifiés</span>
            </div>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {TEMOIGNAGES.map(({ couple, date, comment, initials, occasion, occasionColor, avatarColor }) => (
              <div
                key={couple}
                className="temoignage-card group relative overflow-hidden"
                style={{
                  background:   "rgba(255,255,255,0.04)",
                  border:       "1px solid rgba(201,169,110,0.10)",
                  borderRadius: "14px",
                  padding:      "clamp(28px, 5vw, 40px)",
                }}
              >
                <div
                  className="absolute -top-3 -left-1 font-display font-black leading-none select-none pointer-events-none"
                  style={{ fontSize: "clamp(7rem, 12vw, 10rem)", color: "rgba(201,169,110,0.06)", zIndex: 0 }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#C9A96E" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <p
                    className="font-display font-light italic text-cream/85 leading-relaxed mb-8"
                    style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)", lineHeight: "1.65" }}
                  >
                    {comment}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-sm text-white"
                        style={{ background: avatarColor }}
                      >
                        {initials}
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-sm text-cream/90">{couple}</p>
                        <p className="font-sans text-xs text-cream/35">{date}</p>
                      </div>
                    </div>
                    <span
                      className="font-sans text-xs tracking-[0.12em] uppercase px-3 py-1.5"
                      style={{
                        background:   `${occasionColor}22`,
                        border:       `1px solid ${occasionColor}40`,
                        color:        occasionColor === "#4A2010" ? "#B8906A" : occasionColor,
                        borderRadius: "4px",
                      }}
                    >
                      {occasion}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-8 h-px bg-gold w-0 group-hover:w-16 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FORMULAIRE — juste après les témoignages
      ══════════════════════════════════════════════════════ */}
      <section id="formulaire" className="form-section pb-section" style={{ background: "#1E1008" }}>
        <div className="container-main max-w-xl">
          <SectionReveal type="clip-reveal" start="top 82%" className="text-center mb-10 pt-section">
            <span className="eyebrow text-gold/70 mb-4 block">Commençons ensemble</span>
            <h2 className="section-title text-cream mb-4">Faites-nous part de votre projet</h2>
            <p className="font-sans font-light text-cream/45">3 étapes · Moins de 2 minutes · Devis gratuit</p>
          </SectionReveal>

          <div
            className="relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", borderRadius: "20px", padding: "40px", border: "1px solid rgba(201,169,110,0.12)" }}
          >
            {/* Losange watermark en fond */}
            <div
              className="absolute pointer-events-none select-none"
              style={{ right: "-40px", bottom: "-40px", opacity: 0.04 }}
              aria-hidden="true"
            >
              <svg width="260" height="260" viewBox="0 0 72 72" fill="none">
                <path d="M36 4 L68 36 L36 68 L4 36 Z" stroke="#C9A96E" strokeWidth="1.5" fill="none"/>
                <path d="M36 16 L56 36 L36 56 L16 36 Z" stroke="#C9A96E" strokeWidth="0.8" fill="none"/>
                <text x="36" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fontStyle="italic" fontWeight="600" fill="#C9A96E">JH</text>
              </svg>
            </div>

            {formState === "success" ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full border-2 border-gold/40 flex items-center justify-center mx-auto mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="font-display font-bold text-2xl text-gold mb-3 tracking-tight">Merci pour votre demande !</p>
                <p className="font-sans text-sm text-cream/50 mb-2">Nous vous contacterons dans les 24 heures.</p>
                <div className="flex items-center justify-center gap-2 mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-sans text-xs tracking-[0.15em] uppercase text-green-400/70">Réponse garantie sous 24h</span>
                </div>
                <a href="tel:0618212810" className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.18em] uppercase text-gold/60 hover:text-gold transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Ou appelez-nous au 06 18 21 28 10
                </a>
              </div>
            ) : (
              <ReceptionFunnel formRef={formRef} formData={formData} formState={formState} errorMsg={errorMsg} handleChange={handleChange} handleSubmit={handleSubmit} />
            )}

            {/* Signal urgence 2026 */}
            {formState !== "success" && (
              <div className="mt-8 pt-7 border-t border-gold/8 text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.5)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <p className="font-sans text-xs tracking-[0.15em] uppercase text-gold/40">Dates disponibles en 2026</p>
                </div>
                <p className="font-sans text-xs text-cream/22 leading-relaxed">
                  Printemps · Automne encore disponibles — Les week-ends d&apos;été 2026 sont presque complets.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
