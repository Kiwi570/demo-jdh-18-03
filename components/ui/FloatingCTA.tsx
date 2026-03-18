"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

const PHONE     = process.env.NEXT_PUBLIC_PHONE     ?? "0609386764";
const PHONE_RAW = PHONE.replace(/\s/g, "");
const WHATSAPP  = `https://wa.me/33${PHONE_RAW.replace(/^0/, "")}?text=${encodeURIComponent("Bonjour, je souhaite réserver une table aux Jardins de l'Hacienda.")}`;

export function FloatingCTA() {
  const [visible,  setVisible]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Apparaît après 500px de scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fade in/out du conteneur principal
  useEffect(() => {
    if (!wrapRef.current) return;
    gsap.to(wrapRef.current, {
      opacity:       visible ? 1 : 0,
      y:             visible ? 0 : 20,
      duration:      0.4,
      ease:          "power2.out",
      pointerEvents: visible ? "auto" : "none",
    });
  }, [visible]);

  // Animation stagger des 3 boutons au expand/collapse
  useEffect(() => {
    if (!actionsRef.current) return;
    const buttons = actionsRef.current.querySelectorAll<HTMLElement>(".float-btn");
    if (expanded) {
      gsap.set(actionsRef.current, { pointerEvents: "auto" });
      gsap.fromTo(buttons,
        { opacity: 0, y: 12, scale: 0.92 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.06,
          duration: 0.4,
          ease: "back.out(1.4)",
        }
      );
    } else {
      gsap.to(buttons, {
        opacity: 0, y: 8, scale: 0.94,
        stagger: { each: 0.04, from: "end" },
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          if (actionsRef.current) {
            gsap.set(actionsRef.current, { pointerEvents: "none" });
          }
        },
      });
    }
  }, [expanded]);

  // Ferme le panneau si on clique ailleurs
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const phoneFormatted = PHONE_RAW.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

  return (
    <div
      ref={wrapRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 opacity-0"
      style={{ pointerEvents: "none" }}
    >
      {/* ── Panneau d'actions étendu ── */}
      <div
        ref={actionsRef}
        className="flex flex-col gap-2"
        style={{ pointerEvents: "none" }}
      >
        {/* Réserver une table */}
        <Link
          href="/contact"
          onClick={() => setExpanded(false)}
          className="float-btn flex items-center gap-3 bg-rouge text-white px-4 py-3 shadow-xl hover:bg-rouge-light transition-all duration-300 group opacity-0"
          style={{ borderRadius: "8px", minWidth: "200px" }}
        >
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-2xs tracking-[0.15em] uppercase text-white/60 leading-none mb-0.5">Formulaire</span>
            <span className="font-heading font-semibold text-sm leading-none">Réserver une table</span>
          </div>
        </Link>

        {/* WhatsApp */}
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setExpanded(false)}
          className="float-btn flex items-center gap-3 text-white px-4 py-3 shadow-xl hover:opacity-90 transition-all duration-300 group opacity-0"
          style={{ background: "#25D366", borderRadius: "8px", minWidth: "200px" }}
          aria-label="Contacter sur WhatsApp"
        >
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-2xs tracking-[0.15em] uppercase text-white/60 leading-none mb-0.5">WhatsApp</span>
            <span className="font-heading font-semibold text-sm leading-none">Envoyer un message</span>
          </div>
        </a>

        {/* Appel téléphonique */}
        <a
          href={`tel:${PHONE_RAW}`}
          onClick={() => setExpanded(false)}
          className="float-btn flex items-center gap-3 bg-terracotta border border-gold/25 text-cream px-4 py-3 shadow-xl hover:bg-terracotta-mid hover:border-gold/50 transition-all duration-300 group opacity-0"
          style={{ borderRadius: "8px", minWidth: "200px" }}
          aria-label={`Appeler le ${phoneFormatted}`}
        >
          <div className="w-7 h-7 rounded-full bg-rouge/20 flex items-center justify-center shrink-0 group-hover:bg-rouge/35 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-rouge-light">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-2xs tracking-[0.15em] uppercase text-gold/55 leading-none mb-0.5">Téléphone</span>
            <span className="font-heading font-semibold text-sm text-cream leading-none">{phoneFormatted}</span>
          </div>
        </a>
      </div>

      {/* ── Bouton principal (toggle) ── */}
      <button
        onClick={() => setExpanded(o => !o)}
        aria-label={expanded ? "Fermer le menu de contact" : "Nous contacter"}
        aria-expanded={expanded}
        className="relative flex items-center gap-2.5 bg-rouge text-white px-5 py-3.5 shadow-2xl hover:bg-rouge-light active:scale-95 transition-all duration-300 group"
        style={{ borderRadius: "10px" }}
      >
        {/* Indicateur pulsant (quand fermé) */}
        {!expanded && (
          <span className="absolute -top-1 -right-1 w-3 h-3">
            <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-60"/>
            <span className="relative block w-3 h-3 rounded-full bg-gold"/>
          </span>
        )}

        {/* Icône — alterne entre croix et étoile */}
        <div className="w-6 h-6 flex items-center justify-center transition-transform duration-300"
          style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}>
          {expanded ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          )}
        </div>

        <span className="font-heading font-semibold text-sm tracking-[0.08em]">
          {expanded ? "Fermer" : "Nous contacter"}
        </span>
      </button>
    </div>
  );
}
