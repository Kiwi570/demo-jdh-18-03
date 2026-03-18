"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { CATEGORIES, EVENTS, CATEGORY_COLORS, type Category, type EventItem } from "@/lib/data";
import { PageHero } from "@/components/ui/PageHero";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { MiniCalendar }   from "@/components/ui/MiniCalendar";


// ── Groupement chronologique par mois ─────────────────────────────────────────
const MONTH_LABELS: Record<string, string> = {
  "01": "Janvier", "02": "Février", "03": "Mars", "04": "Avril",
  "05": "Mai",     "06": "Juin",    "07": "Juillet", "08": "Août",
  "09": "Septembre", "10": "Octobre", "11": "Novembre", "12": "Décembre",
};

function getMonthKey(dateStr: string): string {
  // "Vendredi 28 Mars 2026" → extraire mois
  const parts = dateStr.trim().split(" ");
  const monthName = parts[2]?.toLowerCase() ?? "";
  const monthMap: Record<string, string> = {
    janvier:"01",février:"02",mars:"03",avril:"04",mai:"05",juin:"06",
    juillet:"07",août:"08",septembre:"09",octobre:"10",novembre:"11",décembre:"12",
  };
  const year = parts[3] ?? "2026";
  const num  = monthMap[monthName] ?? "01";
  return `${year}-${num}`;
}

function groupByMonth(events: typeof EVENTS): { key: string; label: string; items: typeof EVENTS }[] {
  const map = new Map<string, typeof EVENTS>();
  for (const e of events) {
    const k = getMonthKey(e.date);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(e);
  }
  return Array.from(map.entries())
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([key, items]) => {
      const [year, month] = key.split("-");
      return { key, label: `${MONTH_LABELS[month] ?? month} ${year}`, items };
    });
}

// Image spécifique par événement — diversifiée
const EVENT_IMAGES: Record<string, string> = {
  "1": "/images/espaces/terrasse.jpg",           // Soiree Libanaise
  "2": "/images/espaces/restaurant.jpg",          // Menu de Paques
  "3": "/images/espaces/pool-party.jpg",          // Pool Party Tropical
  "4": "/images/receptions/mariage-6.jpg",        // Soiree Jazz
  "5": "/images/receptions/mariage-1.jpg",        // Nuit Mediterraneenne
  "6": "/images/espaces/piscine.jpg",             // Pool Party Ibiza
  "7": "/images/receptions/mariage-3.jpg",        // Soiree Blues
  "8": "/images/receptions/mariage-5.jpg",        // Concert Electro
};

// Mini formulaire liste d'attente
type WaitlistState = "idle" | "open" | "loading" | "success" | "error";

function WaitlistForm({ eventTitle, onClose }: { eventTitle: string; onClose: () => void }) {
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<WaitlistState>("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("success");
  };

  if (state === "success") {
    return (
      <div className="mt-4 border border-gold/20 bg-gold/5 p-4 text-center">
        <p className="font-heading italic text-sm text-gold mb-1">Inscription confirmée ✓</p>
        <p className="font-sans text-2xs text-cream/40">Nous vous contacterons si une place se libère.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 border border-gold/15 bg-white/3 p-4">
      <p className="font-sans text-xs tracking-widest uppercase text-gold/60 mb-3">
        Liste d&apos;attente — {eventTitle}
      </p>
      <input type="text" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} required disabled={state === "loading"}
        className="w-full bg-transparent border-b border-cream/20 py-2 font-sans text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors duration-300" />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required disabled={state === "loading"}
        className="w-full bg-transparent border-b border-cream/20 py-2 font-sans text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors duration-300" />
      {state === "error" && <p className="font-sans text-xs text-red-300">{errMsg}</p>}
      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={state === "loading"}
          className="flex-1 bg-gold/20 border border-gold/30 hover:bg-gold hover:text-terracotta py-2 font-sans text-xs tracking-widest uppercase text-gold transition-all duration-300 disabled:opacity-50">
          {state === "loading" ? "…" : "M'inscrire"}
        </button>
        <button type="button" onClick={onClose}
          className="px-4 py-2 font-sans text-xs tracking-widest uppercase text-terracotta/35 hover:text-cream/60 transition-colors duration-200">
          Annuler
        </button>
      </div>
    </form>
  );
}

// ── Composant card partagé — évite la duplication dans les 2 vues ────────────
// ── Couleurs de fond par catégorie — ambiance unique par type ────────────────
const CATEGORY_BG: Record<string, string> = {
  "soiree-theme":  "#2a0e06",   // terracotta chaud
  "pool-party":    "#0d1e1a",   // bleu-vert profond
  "diner-special": "#1a1308",   // or sombre
  "concert":       "#0f0e14",   // nuit froide
};

// ── Couleur accent par catégorie ─────────────────────────────────────────────
const CATEGORY_ACCENT: Record<string, string> = {
  "soiree-theme":  "#C0392B",
  "pool-party":    "#2D4A3E",
  "diner-special": "#A8884A",
  "concert":       "#5A4A8A",
};

// ── Overlay gradient par catégorie — donne une identité colorée à chaque image ─
const CATEGORY_OVERLAY: Record<string, string> = {
  "soiree-theme":  "linear-gradient(to top, rgba(192,57,43,0.92) 0%, rgba(192,57,43,0.45) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)",
  "pool-party":    "linear-gradient(to top, rgba(45,74,62,0.92) 0%, rgba(45,74,62,0.45) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)",
  "diner-special": "linear-gradient(to top, rgba(30,16,8,0.95) 0%, rgba(168,136,74,0.4) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)",
  "concert":       "linear-gradient(to top, rgba(20,15,40,0.95) 0%, rgba(90,74,138,0.5) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)",
};

function EventPageCard({
  event,
  waitlistOpen,
  setWaitlistOpen,
}: {
  event: EventItem;
  waitlistOpen: string | null;
  setWaitlistOpen: (id: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const accent   = CATEGORY_ACCENT[event.category] ?? "#C9A96E";
  const overlay  = CATEGORY_OVERLAY[event.category] ?? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)";
  const catLabel = CATEGORIES.find(c => c.id === event.category)?.label ?? "";

  return (
    <div
      id={`event-${event.id}`}
      className="event-card group relative overflow-hidden opacity-0 w-full"
      style={{
        borderRadius:  "16px",
        aspectRatio:   "21/9",
        boxShadow:     hovered ? `0 24px 60px rgba(15,8,5,0.30), 0 0 0 1.5px ${accent}35` : "0 6px 28px rgba(15,8,5,0.12)",
        transform:     hovered ? "translateY(-5px)" : "translateY(0)",
        transition:    "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease",
        cursor:        "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image pleine carte */}
      <Image
        src={EVENT_IMAGES[event.id] || "/images/espaces/restaurant.jpg"}
        alt={event.title}
        fill
        sizes="(max-width: 768px) 100vw, 70vw"
        quality={85}
        className="object-cover"
        style={{
          transform:  hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 1.8s cubic-bezier(0.16,1,0.3,1)",
          filter:     hovered ? "brightness(1.06) saturate(1.08)" : "brightness(1)",
        }}
      />

      {/* Overlay coloré catégorie */}
      <div className="absolute inset-0" style={{ background: overlay, opacity: hovered ? 0.95 : 0.82, transition: "opacity 0.5s ease" }} />
      {/* Vignette haut */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 40%)" }} />

      {/* Badge catégorie haut gauche */}
      <div className="absolute top-5 left-5 z-10">
        <span className="font-sans text-xs tracking-[0.18em] uppercase px-3 py-1.5 backdrop-blur-sm font-semibold"
          style={{ background: `${accent}30`, border: `1px solid ${accent}70`, color: "rgba(245,240,232,0.95)", borderRadius: "40px" }}>
          {catLabel}
        </span>
      </div>

      {/* Badge spots / complet haut droite */}
      <div className="absolute top-5 right-5 z-10">
        {event.isSoldOut ? (
          <span className="font-sans text-xs tracking-[0.12em] uppercase px-3 py-1.5 backdrop-blur-sm font-semibold"
            style={{ background: "rgba(192,57,43,0.4)", border: "1px solid rgba(192,57,43,0.7)", color: "rgba(245,240,232,0.95)", borderRadius: "40px" }}>
            Complet
          </span>
        ) : event.spots > 0 && event.spots <= 15 ? (
          <span className="font-sans text-xs tracking-[0.12em] uppercase flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-sm"
            style={{ background: "rgba(0,0,0,0.5)", border: `1px solid ${accent}60`, color: "rgba(245,240,232,0.9)", borderRadius: "40px" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
            {event.spots} places
          </span>
        ) : null}
      </div>

      {/* Contenu bas */}
      <div className="absolute bottom-0 left-0 right-0 z-10" style={{ padding: "clamp(20px, 3vw, 32px)" }}>
        <div className="flex items-end justify-between gap-6">

          {/* Gauche — date + titre */}
          <div className="flex-1 min-w-0">
            {/* Date pill */}
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 backdrop-blur-sm"
                style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "6px" }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.85)" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span className="font-display font-bold text-cream" style={{ fontSize: "0.85rem", letterSpacing: "-0.01em" }}>
                  {event.dateShort}
                </span>
                <span className="text-cream/40 text-xs">·</span>
                <span className="font-sans text-xs text-cream/65">{event.time}</span>
              </div>
            </div>
            {/* Titre */}
            <h3 className="font-display font-bold text-cream leading-tight tracking-tight"
              style={{
                fontSize:      "clamp(1.5rem, 2.5vw, 2.1rem)",
                letterSpacing: "-0.01em",
                textShadow:    "0 2px 16px rgba(0,0,0,0.5)",
                transform:     hovered ? "translateY(-3px)" : "translateY(0)",
                transition:    "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              }}>
              {event.title}
            </h3>
          </div>

          {/* Droite — prix + CTA */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            {/* Prix */}
            <div className="text-right">
              <span className="font-display font-black leading-none" style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: accent, letterSpacing: "-0.02em" }}>
                {event.price}€
              </span>
              <span className="font-sans text-xs text-cream/45 ml-1">/ pers.</span>
            </div>
            {/* CTA */}
            {event.isSoldOut ? (
              waitlistOpen === event.id ? (
                <WaitlistForm eventTitle={event.title} onClose={() => setWaitlistOpen(null)} />
              ) : (
                <button onClick={() => setWaitlistOpen(event.id)}
                  className="px-6 py-2.5 font-sans text-xs tracking-[0.16em] uppercase backdrop-blur-sm transition-all duration-300"
                  style={{ border: "1px solid rgba(255,255,255,0.22)", color: "rgba(245,240,232,0.55)", borderRadius: "8px", background: "rgba(0,0,0,0.35)" }}>
                  Liste d&apos;attente
                </button>
              )
            ) : (
              <Link href="/contact"
                className="flex items-center gap-2 px-6 py-2.5 font-sans text-xs tracking-[0.16em] uppercase text-white font-semibold transition-all duration-400"
                style={{
                  background:     hovered ? accent : "rgba(255,255,255,0.18)",
                  border:         `1px solid ${hovered ? accent : "rgba(255,255,255,0.3)"}`,
                  borderRadius:   "8px",
                  backdropFilter: "blur(8px)",
                  transition:     "background 0.4s ease, border-color 0.4s ease",
                  boxShadow:      hovered ? `0 4px 20px ${accent}50` : "none",
                }}>
                Réserver
                <svg width="11" height="6" viewBox="0 0 16 8" fill="none"
                  style={{ transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.3s ease" }}>
                  <path d="M0 4H14M10 1L14 4L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Helpers partage & agenda ─────────────────────────────────────────────────

/** Génère un lien .ics téléchargeable pour ajouter à l'agenda */
function downloadIcs(event: EventItem) {
  const dateStr = event.date; // "Vendredi 28 Mars 2026"
  // Estimation de la date ISO depuis les données textuelles
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Les Jardins de l'Hacienda//FR",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title} — Les Jardins de l'Hacienda`,
    `DESCRIPTION:${event.desc} — ${event.price}€/pers.`,
    "LOCATION:6 Vathier Haye\\, 54580 Moineville\\, France",
    `DTSTART:${dateStr}`,
    "DURATION:PT3H",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `${event.title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Copie l'URL de la page avec ancre de l'événement */
function shareEvent(eventId: string) {
  const url = `${window.location.origin}/evenements?cat=tous#event-${eventId}`;
  navigator.clipboard?.writeText(url).catch(() => {});
}

// ── Carte événement vedette — Bannière cinématique pleine largeur v01.6 ──────

function FeaturedEventCard({
  event,
  waitlistOpen,
  setWaitlistOpen,
}: {
  event: EventItem;
  waitlistOpen: string | null;
  setWaitlistOpen: (id: string | null) => void;
}) {
  const [copied,   setCopied]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const bgAccent  = CATEGORY_BG[event.category]     ?? "#1a0c06";
  const accent    = CATEGORY_ACCENT[event.category] ?? "#C9A96E";
  const catLabel  = CATEGORIES.find(c => c.id === event.category)?.label ?? "";

  // Date ISO pour le countdown
  const isoDate = useMemo(() => {
    const parts = event.dateShort.split(" ");
    const monthMap: Record<string, string> = {
      "Jan":"01","Fév":"02","Mar":"03","Avr":"04","Mai":"05","Jun":"06",
      "Jul":"07","Août":"08","Sep":"09","Oct":"10","Nov":"11","Déc":"12",
    };
    const [day, mon, yr] = parts;
    const m = monthMap[mon] ?? "01";
    const y = yr?.length === 2 ? `20${yr}` : yr ?? "2026";
    const [h, mi] = event.time.replace("h",":").split(":").map(Number);
    return `${y}-${m}-${String(day).padStart(2,"0")}T${String(h).padStart(2,"0")}:${String(mi||0).padStart(2,"0")}:00`;
  }, [event.dateShort, event.time]);

  const daysUntil       = useMemo(() => Math.max(0, Math.floor((new Date(isoDate).getTime() - Date.now()) / 86400000)), [isoDate]);
  const isWithin14Days  = daysUntil <= 14 && daysUntil > 0;

  return (
    <div
      id={`event-${event.id}`}
      className="event-card group relative overflow-hidden mb-10 opacity-0"
      style={{
        borderRadius: "14px",
        boxShadow:    "0 32px 80px rgba(0,0,0,0.6)",
        background:   bgAccent,
        minHeight:    "480px",
      }}
    >
      {/* ── Image pleine surface — parallax subtil au hover ── */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={EVENT_IMAGES[event.id] ?? "/images/espaces/restaurant.jpg"}
          alt={event.title}
          fill
          priority
          sizes="100vw"
          quality={88}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          onLoad={() => setImgLoaded(true)}
        />
        {/* Overlay en 3 couches pour profondeur et lisibilité */}
        {/* 1. Dégradé latéral droite → sombre pour contenu */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${bgAccent}f0 0%, ${bgAccent}b0 40%, ${bgAccent}20 70%, transparent 100%)`,
          }}
        />
        {/* 2. Dégradé bas constant */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, transparent 75%)",
          }}
        />
        {/* 3. Vignette subtile tout autour */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
          }}
        />
      </div>

      {/* ── Contenu superposé ── */}
      <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12" style={{ minHeight: "480px" }}>

        {/* Haut — badges */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Badge "À la une" gold */}
            <span
              className="font-sans text-xs tracking-[0.22em] uppercase px-4 py-1.5 font-semibold"
              style={{
                background:   "linear-gradient(90deg, #C9A96E, #E8D090, #C9A96E)",
                color:        "#1E1008",
                borderRadius: "40px",
                letterSpacing: "0.2em",
              }}
            >
              ✦ À la une
            </span>
            {/* Badge catégorie */}
            <span
              className="font-sans text-xs tracking-[0.16em] uppercase px-3 py-1.5 backdrop-blur-sm"
              style={{
                background:   "rgba(0,0,0,0.45)",
                border:       `1px solid ${accent}60`,
                color:        "rgba(245,240,232,0.85)",
                borderRadius: "40px",
              }}
            >
              {catLabel}
            </span>
          </div>

          {/* Countdown si < 14j */}
          {isWithin14Days && (
            <div
              className="flex items-center gap-2 backdrop-blur-sm px-3 py-1.5"
              style={{
                background:   "rgba(0,0,0,0.5)",
                border:       "1px solid rgba(201,169,110,0.2)",
                borderRadius: "8px",
              }}
            >
              <p className="font-sans text-xs tracking-[0.18em] uppercase text-gold/60">Dans</p>
              <CountdownTimer targetDate={isoDate} compact />
            </div>
          )}

          {/* Spots si peu de places */}
          {!event.isSoldOut && event.spots <= 15 && !isWithin14Days && (
            <div
              className="flex items-center gap-2 backdrop-blur-sm px-4 py-2"
              style={{
                background:   "rgba(0,0,0,0.5)",
                border:       "1px solid rgba(255,80,80,0.3)",
                borderRadius: "8px",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="font-sans text-xs text-red-300">{event.spots} places restantes</span>
            </div>
          )}
        </div>

        {/* Bas — titre, infos, CTA */}
        <div className="max-w-xl">
          {/* Titre — très grand, Fraunces */}
          <h2
            className="font-display font-bold text-cream leading-none tracking-tight mb-4"
            style={{
              fontSize:      "clamp(2.2rem, 5vw, 4.2rem)",
              letterSpacing: "-0.02em",
              textShadow:    "0 2px 20px rgba(0,0,0,0.5)",
            }}
          >
            {event.title}
          </h2>

          {/* Date + heure + prix sur une ligne */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="font-sans text-base text-cream/75 tracking-wide">
              {event.date}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: accent }}
            />
            <span className="font-sans text-base text-cream/75">
              {event.time}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: accent }}
            />
            <span
              className="font-display font-bold"
              style={{ fontSize: "1.3rem", color: accent, letterSpacing: "-0.01em" }}
            >
              {event.price}€
            </span>
            <span className="font-sans text-sm text-cream/45">/ pers.</span>
          </div>

          {/* Trait accent */}
          <div
            className="h-px mb-6 w-16 group-hover:w-32 transition-all duration-700"
            style={{ background: accent }}
          />

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {event.isSoldOut ? (
              <div className="flex items-center gap-3">
                <span
                  className="font-sans text-sm tracking-[0.1em] uppercase px-5 py-3"
                  style={{
                    background:   "rgba(255,80,80,0.12)",
                    border:       "1px solid rgba(255,80,80,0.3)",
                    borderRadius: "6px",
                    color:        "#ff9090",
                  }}
                >
                  Complet
                </span>
                {waitlistOpen === event.id ? (
                  <WaitlistForm eventTitle={event.title} onClose={() => setWaitlistOpen(null)} />
                ) : (
                  <button
                    onClick={() => setWaitlistOpen(event.id)}
                    className="font-sans text-xs tracking-[0.18em] uppercase px-5 py-3 border border-gold/25 text-cream/45 hover:text-gold hover:border-gold/50 transition-all duration-300"
                    style={{ borderRadius: "6px" }}
                  >
                    Liste d&apos;attente
                  </button>
                )}
              </div>
            ) : (
              <Link
                href="/contact"
                className="group/cta inline-flex items-center gap-3 px-8 py-4 font-sans text-sm tracking-[0.18em] uppercase font-semibold text-white transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{
                  background:   accent,
                  borderRadius: "8px",
                  boxShadow:    `0 8px 30px ${accent}50`,
                }}
              >
                Réserver ma place
                <svg width="14" height="8" viewBox="0 0 16 8" fill="none" className="group-hover/cta:translate-x-1 transition-transform duration-300">
                  <path d="M0 4H14M10 1L14 4L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
            )}

            {/* Agenda + Partager */}
            <button
              onClick={() => downloadIcs(event)}
              className="inline-flex items-center gap-2 px-4 py-3 text-cream/45 hover:text-gold transition-all duration-300"
              style={{
                background:   "rgba(0,0,0,0.45)",
                border:       "1px solid rgba(201,169,110,0.18)",
                borderRadius: "6px",
                backdropFilter: "blur(8px)",
              }}
              title="Ajouter à mon agenda"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="font-sans text-xs tracking-[0.12em] uppercase">Agenda</span>
            </button>

            <button
              onClick={() => { shareEvent(event.id); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="inline-flex items-center gap-2 px-4 py-3 text-cream/45 hover:text-gold transition-all duration-300"
              style={{
                background:   "rgba(0,0,0,0.45)",
                border:       "1px solid rgba(201,169,110,0.18)",
                borderRadius: "6px",
                backdropFilter: "blur(8px)",
              }}
              title="Copier le lien"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              <span className="font-sans text-xs tracking-[0.12em] uppercase">
                {copied ? "✓ Copié" : "Partager"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EvenementsPage() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const initialCat    = (searchParams.get("cat") as Category) ?? "tous";
  const [activeFilter, setActiveFilter] = useState<Category>(initialCat);
  const [waitlistOpen, setWaitlistOpen] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered      = activeFilter === "tous" ? EVENTS : EVENTS.filter(e => e.category === activeFilter);
  // 1.2 — FeaturedCard seulement en vue "tous", basée sur la catégorie filtrée si actif
  const featuredEvent = activeFilter === "tous"
    ? (EVENTS.find(e => !e.isSoldOut) ?? EVENTS[0])
    : null; // cachée quand filtre actif
  const restEvents    = activeFilter === "tous"
    ? filtered.filter(e => e.id !== featuredEvent?.id)
    : filtered;

  // 1.3 — Index date → eventId pour le MiniCalendar
  const { eventDates, dateToEventId, eventColors } = useMemo(() => {
    const monthMap: Record<string, string> = {
      "Jan":"01","Fév":"02","Mar":"03","Avr":"04","Mai":"05","Jun":"06",
      "Jul":"07","Août":"08","Sep":"09","Oct":"10","Nov":"11","Déc":"12",
    };
    const dates: string[] = [];
    const index: Record<string, string> = {};
    const colors: Record<string, string> = {};
    EVENTS.forEach(e => {
      const parts = e.dateShort.split(" ");
      const [day, mon, yr] = parts;
      const m = monthMap[mon] ?? "01";
      const y = yr?.length === 2 ? `20${yr}` : yr ?? "2026";
      const dateStr = `${y}-${m}-${String(day).padStart(2,"0")}`;
      dates.push(dateStr);
      index[dateStr] = e.id;
      colors[dateStr] = CATEGORY_ACCENT[e.category] ?? "#C0392B";
    });
    return { eventDates: dates, dateToEventId: index, eventColors: colors };
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".event-card");
    gsap.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.55, ease: "power3.out" });
  }, [activeFilter]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialise via GSAP (évite conflit opacity-0 Tailwind)
      gsap.set(".filter-bar", { opacity: 0, y: 20 });
      gsap.set(".calendar-block", { opacity: 0, x: 20 });
      gsap.fromTo(".filter-bar", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".filter-bar", start: "top 85%" } });
      gsap.fromTo(".calendar-block", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".calendar-block", start: "top 85%" } });
    });
    return () => ctx.revert();
  }, []);

  // 1.3 — Handler MiniCalendar corrigé : cible l'event correspondant à la date
  const handleCalendarDayClick = (dateStr: string) => {
    const eventId = dateToEventId[dateStr];
    if (!eventId) return;
    const anchor = document.getElementById(`event-${eventId}`);
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const categoryLabel = CATEGORIES.find(c => c.id === activeFilter)?.label ?? "";

  return (
    <>
      <PageHero
        variant="compact"
        image="/images/espaces/pool-party.jpg"
        eyebrow="Agenda · Les Jardins"
        title="Les Événements"
        subtitle="Un agenda d'exception pour vivre l'Hacienda autrement."
      />

      {/* ── Filtres sticky ── */}
      <section className="border-b border-terracotta/12 sticky top-20 z-40" style={{ background: "rgba(237,232,220,0.97)", backdropFilter: "blur(12px)" }}>
        <div className="container-main">
          <div className="filter-bar flex flex-wrap gap-3 py-4">
            {CATEGORIES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveFilter(id);
                  const params = new URLSearchParams();
                  if (id !== "tous") params.set("cat", id);
                  router.replace(id === "tous" ? "/evenements" : `/evenements?${params}`, { scroll: false });
                }}
                className="font-sans text-xs tracking-[0.16em] uppercase px-5 py-2 transition-all duration-300"
                style={{
                  borderRadius: "40px",
                  border:       activeFilter === id ? "none" : "1px solid rgba(30,16,8,0.18)",
                  background:   activeFilter === id ? (CATEGORY_ACCENT[id] ?? "#C0392B") : "transparent",
                  color:        activeFilter === id ? "white" : "rgba(30,16,8,0.55)",
                  fontWeight:   activeFilter === id ? "600" : "400",
                }}
              >
                {label}
              </button>
            ))}
            <span className="ml-auto font-sans text-xs text-terracotta/65 self-center font-medium">
              {filtered.length} événement{filtered.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* ── Grille d'événements ── */}
      <section className="pt-8 pb-section" style={{ background: "#EDE8DC" }}>
        <div className="container-main">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading font-light italic text-2xl text-terracotta/35">
                Aucun événement dans cette catégorie pour le moment.
              </p>
            </div>

          ) : activeFilter === "tous" ? (
            /* ── Vue "Tous" : FeaturedCard + groupement mois + sidebar calendrier ── */
            <div ref={gridRef}>
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

                {/* Colonne gauche — événements */}
                <div className="flex-1 min-w-0">
                  {/* 1.2 — FeaturedCard uniquement en vue "tous" */}
                  {featuredEvent && (
                    <FeaturedEventCard
                      event={featuredEvent}
                      waitlistOpen={waitlistOpen}
                      setWaitlistOpen={setWaitlistOpen}
                    />
                  )}

                  {groupByMonth(restEvents).map(({ key, label, items }) => (
                    <div key={key} className="mb-14">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1" style={{ background: "rgba(30,16,8,0.2)" }}/>
                        <span className="font-sans text-xs tracking-[0.3em] uppercase text-terracotta/75 shrink-0 font-medium">
                          {label}
                        </span>
                        <div className="h-px flex-1" style={{ background: "rgba(30,16,8,0.2)" }}/>
                      </div>
                      <div className="flex flex-col gap-4">
                        {items.map((event) => (
                          <EventPageCard
                            key={event.id}
                            event={event}
                            waitlistOpen={waitlistOpen}
                            setWaitlistOpen={setWaitlistOpen}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Colonne droite — calendrier + privatisation (1.4) */}
                <div
                  className="calendar-block hidden lg:block shrink-0"
                  style={{ width: "330px", position: "sticky", top: "120px", alignSelf: "flex-start" }}
                >
                  <p className="eyebrow text-gold/65 mb-4">Prochaines dates</p>
                  <MiniCalendar
                    eventDates={eventDates}
                    eventColors={eventColors}
                    onDayClick={handleCalendarDayClick}
                  />

                  {/* 1.4 — Privatisation dans la sidebar — visible sans scroller */}
                  <div
                    className="mt-6 p-5"
                    style={{
                      background:   "rgba(30,16,8,0.07)",
                      border:       "1px solid rgba(30,16,8,0.14)",
                      borderRadius: "10px",
                    }}
                  >
                    <p className="eyebrow text-gold/70 mb-2">Soirée sur mesure ?</p>
                    <p className="font-sans text-xs text-terracotta/65 leading-relaxed mb-4">
                      Privatisation complète, thème personnalisé, DJ, menu Chef — on construit ça ensemble.
                    </p>
                    <div className="flex flex-col gap-2">
                      <a
                        href="tel:0618212810"
                        className="flex items-center gap-2 px-4 py-2.5 font-sans text-xs tracking-[0.14em] uppercase text-white transition-all duration-300 hover:opacity-85"
                        style={{ background: "#C0392B", borderRadius: "5px" }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        Appeler
                      </a>
                      <Link
                        href="/contact"
                        className="flex items-center gap-2 px-4 py-2.5 font-sans text-xs tracking-[0.14em] uppercase text-gold/70 hover:text-gold transition-colors duration-300"
                        style={{ border: "1px solid rgba(201,169,110,0.25)", borderRadius: "5px" }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        Formulaire de demande
                      </Link>
                    </div>
                  </div>
                  {/* Prochains events liste */}
                  <div className="mt-5 flex flex-col gap-2">
                    <p className="eyebrow text-gold/55 mb-1">À venir</p>
                    {EVENTS.filter(e => !e.isSoldOut).slice(0, 3).map(e => {
                      const a = CATEGORY_ACCENT[e.category] ?? "#C0392B";
                      return (
                        <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-terracotta/5 cursor-pointer"
                          style={{ border: "1px solid rgba(30,16,8,0.07)" }}
                          onClick={() => { const el = document.getElementById(`event-${e.id}`); el?.scrollIntoView({ behavior: "smooth", block: "center" }); }}>
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: a }} />
                          <div className="flex-1 min-w-0">
                            <p className="font-sans text-xs font-semibold text-terracotta truncate">{e.title}</p>
                            <p className="font-sans text-xs text-terracotta/45">{e.dateShort} · {e.time}</p>
                          </div>
                          <span className="font-display font-bold shrink-0" style={{ fontSize: "0.9rem", color: a }}>{e.price}€</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          ) : (
            /* ── Vue filtrée : bandeau contexte + grille 3 colonnes, sans FeaturedCard ── */
            <div ref={gridRef}>
              {/* 1.2 — Bandeau de contexte remplace la FeaturedCard quand filtre actif */}
              <div
                className="flex items-center justify-between mb-8 px-5 py-4"
                style={{
                  background:   "rgba(30,16,8,0.04)",
                  border:       "1px solid rgba(30,16,8,0.10)",
                  borderRadius: "8px",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: CATEGORY_ACCENT[activeFilter] ?? "#C9A96E" }}
                  />
                  <span className="font-sans text-sm text-terracotta/60 tracking-wide">
                    Filtre actif :
                  </span>
                  <span
                    className="font-heading font-semibold text-sm text-cream"
                    style={{ color: CATEGORY_ACCENT[activeFilter] ?? "#C9A96E" }}
                  >
                    {categoryLabel}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveFilter("tous");
                    router.replace("/evenements", { scroll: false });
                  }}
                  className="font-sans text-xs tracking-[0.14em] uppercase text-terracotta/40 hover:text-rouge transition-colors duration-300 flex items-center gap-1.5"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Effacer
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {filtered.map((event) => (
                  <EventPageCard
                    key={event.id}
                    event={event}
                    waitlistOpen={waitlistOpen}
                    setWaitlistOpen={setWaitlistOpen}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 px-5 py-3 text-center mx-auto max-w-xl"
            style={{ border: "1px solid rgba(30,16,8,0.1)", borderRadius: "6px", background: "rgba(30,16,8,0.04)" }}>
            <p className="font-sans text-xs text-terracotta/50 tracking-wide">
              * Toutes les réservations se font en ligne · Un acompte peut être demandé pour confirmer votre place
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "#1E1008" }} className="py-12 lg:py-section-sm">
        <div className="container-main max-w-3xl text-center">
          <SectionReveal type="clip-reveal" start="top 82%" className="mb-6">
            <span className="eyebrow text-gold/60 mb-4 block">Soirée sur mesure</span>
            <h2 className="section-title text-cream">Créez votre propre soirée</h2>
            <div className="divider-gold" />
          </SectionReveal>
          <p className="font-heading font-light text-cream/65 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Vous avez une idée de soirée qui ne figure pas dans notre agenda ?
            DJ, thème, menu spécial, décoration — nous construisons avec vous
            une soirée unique, exactement comme vous l&apos;imaginez.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0618212810" className="btn-primary">Appeler pour en parler</a>
            <Link href="/contact" className="btn-ghost">Envoyer votre idée</Link>
          </div>
        </div>
      </section>
    </>
  );
}
