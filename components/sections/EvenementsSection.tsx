"use client";

/**
 * EvenementsSection — version homepage simplifiée
 * Cards accordéon légères : photo + titre + desc + lien vers /evenements
 * Le tunnel de réservation complet reste sur la page /evenements dédiée.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { EVENTS, HOMEPAGE_EVENT_IDS, CATEGORIES } from "@/lib/data";
import { ACCENT, CATEGORY_LABELS, EVENT_THUMB } from "./evenements/types";

const homepageEvents = EVENTS.filter(e => HOMEPAGE_EVENT_IDS.includes(e.id));

export function EvenementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>("1");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".events-header > *",
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" } },
      );
      gsap.fromTo(".event-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" } },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-section" style={{ background: "#1E1008" }}>
      <div className="container-main" style={{ overflowX: "visible" }}>

        {/* En-tête */}
        <div className="events-header flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="eyebrow text-gold/80 mb-3 block">Prochains rendez-vous</span>
            <h2 className="section-title text-cream">En ce <em className="italic text-gold">moment</em></h2>
          </div>
          <Link
            href="/evenements"
            data-cursor-text="AGENDA"
            className="shrink-0 font-sans text-xs tracking-[0.18em] uppercase text-cream/70 hover:text-gold transition-colors duration-300 border border-gold/40 hover:border-gold/70 px-5 py-2.5"
          >
            Voir tous les événements
          </Link>
        </div>

        {/* Cards légères */}
        <div className="flex flex-col gap-4">
          {homepageEvents.map((event, idx) => {
            const isOpen   = openId === event.id;
            const accent   = ACCENT[event.category]  ?? "#C9A96E";
            const imgSrc   = EVENT_THUMB[event.id]   ?? "/images/espaces/restaurant.jpg";
            const num      = String(idx + 1).padStart(2, "0");
            const catLabel = CATEGORY_LABELS[event.category] ?? event.category;

            return (
              <div
                key={event.id}
                className="event-card opacity-0 transition-all duration-500 relative"
                style={{
                  borderRadius: "12px",
                  boxShadow: isOpen
                    ? "0 20px 60px rgba(30,16,8,0.22), 0 4px 16px rgba(30,16,8,0.12)"
                    : "0 4px 20px rgba(30,16,8,0.10)",
                  transform: isOpen ? "translateY(-2px)" : "translateY(0)",
                  overflow: "visible",
                }}
              >
                {/* ── Badge prix intégré — dans l'en-tête, côté droit ── */}
                <div
                  className="absolute z-20 flex flex-col items-center justify-center"
                  style={{
                    right: "56px",
                    top: "50%",
                    transform: isOpen ? "translateY(-120%) scale(1.05)" : "translateY(-50%) scale(1)",
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "#F5F0E8",
                    boxShadow: "0 4px 16px rgba(15,8,5,0.22), 0 0 0 2px rgba(201,169,110,0.25)",
                    transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease",
                    pointerEvents: "none",
                    border: `2px solid ${accent}45`,
                  }}
                >
                  <span className="font-sans text-2xs tracking-[0.08em] uppercase text-terracotta/40 leading-none mb-0.5">dès</span>
                  <p className="font-display font-bold leading-none tracking-tight"
                    style={{ fontSize: "1.35rem", color: "#C0392B", letterSpacing: "-0.02em" }}>
                    {event.price}<span style={{ fontSize: "0.6em", opacity: 0.7 }}>€</span>
                  </p>
                  <p className="font-sans leading-none mt-0.5" style={{ fontSize: "0.58rem", color: "rgba(30,16,8,0.35)", letterSpacing: "0.05em" }}>/ pers.</p>
                </div>

                {/* ── En-tête photo cliquable ── */}
                <button
                  onClick={() => setOpenId(isOpen ? null : event.id)}
                  className="relative w-full text-left overflow-hidden focus:outline-none group block"
                  style={{
                    height: isOpen ? "200px" : "120px",
                    borderRadius: isOpen ? "12px 12px 0 0" : "12px",
                    transition: "height 0.5s cubic-bezier(0.25,0.46,0.45,0.94), border-radius 0.3s ease",
                  }}
                >
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <Image src={imgSrc} alt={event.title} fill sizes="100vw" quality={75} className="object-cover" />
                  </div>
                  <div className="absolute inset-0"
                    style={{
                      background: isOpen
                        ? "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75))"
                        : "linear-gradient(105deg, rgba(0,0,0,0.65), rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15))",
                      transition: "background 0.5s ease",
                    }}
                  />
                  {/* Trait accent gauche */}
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
                  {/* Numéro décoratif */}
                  <div className="absolute right-16 top-1/2 -translate-y-1/2 font-display font-bold text-white/[0.07] pointer-events-none select-none"
                    style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1 }}>
                    {num}
                  </div>
                  {/* Contenu texte */}
                  <div className="relative z-10 h-full flex items-center px-6 md:px-8 gap-5">
                    <div className="flex-1 min-w-0 pr-32">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <span className="font-sans text-xs tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                          style={{ background: `${accent}30`, color: "rgba(255,255,255,0.85)", border: `1px solid ${accent}60` }}>
                          {catLabel}
                        </span>
                        {!event.isSoldOut && event.spots <= 15 && (
                          <span className="font-sans text-xs text-white/70 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />{event.spots} places
                          </span>
                        )}
                        {event.isSoldOut && <span className="font-sans text-xs text-white/50">Complet</span>}
                      </div>
                      <h3 className="font-display font-bold text-white leading-tight tracking-tight"
                        style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)" }}>
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2.5 mt-1">
                        <span className="font-sans text-sm text-white/65">{event.date}</span>
                        <span className="text-white/25">·</span>
                        <span className="font-sans text-sm text-white/65">{event.time}</span>
                      </div>
                    </div>
                    {/* Toggle seul — prix déplacé dans le médaillon */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-400"
                      style={{
                        background: isOpen ? accent : "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(8px)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* ── Panneau ouvert — fond beige clair ── */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
                    borderRadius: "0 0 12px 12px",
                  }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                  <div className="px-6 pb-6 md:px-8 md:pb-7 pt-5"
                    style={{
                      background: "#F5F0E8",
                      borderTop: `2px solid ${accent}40`,
                    }}>
                    <p className="font-heading font-light text-terracotta/75 text-base leading-relaxed mb-5 max-w-2xl">
                      {event.desc}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      {event.isSoldOut ? (
                        <Link href="/evenements"
                          className="inline-flex items-center gap-2.5 font-sans text-sm tracking-[0.1em] uppercase px-8 py-3.5 text-white rounded-xl transition-all duration-300 hover:opacity-90"
                          style={{ background: "rgba(30,16,8,0.6)" }}>
                          Liste d&apos;attente
                          <svg width="13" height="8" viewBox="0 0 16 8" fill="none"><path d="M0 4H14M10 1L14 4L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </Link>
                      ) : (
                        <>
                          <Link href="/evenements"
                            className="inline-flex items-center gap-2.5 font-sans text-sm tracking-[0.1em] uppercase px-8 py-3.5 text-white rounded-xl transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                            style={{ background: accent }}>
                            Réserver ma place
                            <svg width="13" height="8" viewBox="0 0 16 8" fill="none"><path d="M0 4H14M10 1L14 4L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </Link>
                          <span className="inline-flex items-center gap-1.5 font-sans text-xs text-terracotta/45">
                            <svg width="10" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-terracotta/30">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Paiement sécurisé · Réponse sous 24h
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="font-sans text-xs text-cream/30 text-center mt-8 tracking-wide">
          * Toutes les réservations se font en ligne · Un acompte peut être demandé selon l&apos;événement
        </p>

      </div>
    </section>
  );
}
