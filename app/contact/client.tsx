"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PageHero } from "@/components/ui/PageHero";
import { SectionTransition } from "@/components/ui/SectionTransition";
import { HORAIRES, DAY_MAP } from "@/lib/data/horaires";
import { useCookieConsent } from "@/components/ui/CookieBanner";
import type { FormState } from "@/types";

const PHONE_RESA   = "0609386764";
const PHONE_EVENTS = "0618212810";

// Mapping des paramètres URL vers les valeurs du select objet
const OBJET_MAP: Record<string, string> = {
  "visite":      "privatisation",
  "reservation": "reservation",
  "evenement":   "evenement",
  "mariage":     "privatisation",
  "seminaire":   "evenement",
};

export default function ContactPage() {
  const today        = new Date().getDay();
  const searchParams = useSearchParams();
  const cookieConsent = useCookieConsent();
  const [formData, setFormData] = useState({
    nom: "", email: "", objet: "", date: "", personnes: "", message: "",
  });
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg,  setErrorMsg]  = useState("");
  const pageRef = useRef<HTMLDivElement>(null);

  // 1.8 — Pré-remplissage depuis l'URL (?objet=visite, etc.)
  useEffect(() => {
    const objetParam = searchParams.get("objet");
    if (objetParam && OBJET_MAP[objetParam]) {
      setFormData(prev => ({ ...prev, objet: OBJET_MAP[objetParam] }));
      // Scroller vers le formulaire si paramètre présent
      setTimeout(() => {
        document.getElementById("message")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 800);
    }
  }, [searchParams]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".action-col",
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".actions-section", start: "top 80%" } }
      );
      gsap.fromTo(".horaire-row",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.06, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".info-section", start: "top 80%" } }
      );
      gsap.fromTo(".map-block",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".map-block", start: "top 85%" } }
      );
      gsap.fromTo(".form-field",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.07, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".form-section", start: "top 80%" } }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("success");
    setFormData({ nom: "", email: "", objet: "", date: "", personnes: "", message: "" });
  };

  const showDateField   = ["reservation", "evenement", "groupe"].includes(formData.objet);
  const showGuestsField = ["evenement", "groupe", "privatisation"].includes(formData.objet);

  return (
    <div ref={pageRef}>
      <PageHero
        variant="compact"
        image="/images/espaces/terrasse.jpg"
        eyebrow="Nous rejoindre · Les Jardins"
        title="Prenons contact"
        subtitle="6 Vathier Haye · 54580 Moineville · Entre Metz et Nancy"
      />

      {/* ── DEUX COLONNES D'ACTION — v01.5 sans doublon téléphone ── */}
      <section className="actions-section bg-cream py-section">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* COL 01 — Appeler & contacter (tous les numéros + WhatsApp) */}
          <div className="action-col opacity-0">
            <div className="border-t-2 border-rouge pt-6 mb-6">
              <span className="eyebrow text-rouge/60 mb-2 block">01 · Appeler</span>
              <h2 className="font-heading font-semibold text-2xl text-terracotta">Nous appeler &amp; contacter</h2>
            </div>
            <p className="font-sans text-base font-light text-terracotta/60 leading-relaxed mb-6">
              La façon la plus rapide pour toute demande : réservation, événement, information pratique.
            </p>

            {/* Les 2 numéros clairement différenciés */}
            <div className="space-y-3 mb-5">
              {[
                { label: "Pour une réservation restaurant", tel: PHONE_RESA,   display: "06 09 38 67 64", primary: true,  note: "Règlement sur place · Annulation 24h avant" },
                { label: "Pour un événement / réception",  tel: PHONE_EVENTS, display: "06 18 21 28 10", primary: false, note: "Mariages, séminaires, privatisations" },
              ].map(({ label, tel, display, primary, note }) => (
                <a
                  key={tel}
                  href={`tel:${tel}`}
                  className="group flex items-center justify-between p-4 transition-all duration-300"
                  style={{
                    border:     primary ? "1px solid rgba(192,57,43,0.35)" : "1px solid rgba(30,16,8,0.1)",
                    background: primary ? "rgba(192,57,43,0.04)" : "transparent",
                    borderRadius: "6px",
                  }}
                >
                  <div>
                    <p className="font-sans text-xs tracking-[0.12em] uppercase mb-1"
                      style={{ color: primary ? "rgba(192,57,43,0.6)" : "rgba(30,16,8,0.4)" }}>
                      {label}
                    </p>
                    <p className="font-heading font-semibold text-xl text-terracotta group-hover:text-rouge transition-colors duration-300 mb-0.5">
                      {display}
                    </p>
                    <p className="font-sans text-xs text-terracotta/35">{note}</p>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    className="transition-colors duration-300 shrink-0"
                    style={{ color: primary ? "rgba(192,57,43,0.4)" : "rgba(201,169,110,0.4)" }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </a>
              ))}
            </div>

            {/* WhatsApp card dédiée */}
            <a
              href={`https://wa.me/33${PHONE_RESA.replace(/^0/,"")}?text=${encodeURIComponent("Bonjour, je souhaite réserver une table aux Jardins de l'Hacienda.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background:   "rgba(37,211,102,0.06)",
                border:       "1px solid rgba(37,211,102,0.28)",
                borderRadius: "8px",
              }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#25D366" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <p className="font-sans text-xs tracking-[0.12em] uppercase mb-0.5" style={{ color: "rgba(37,211,102,0.7)" }}>WhatsApp</p>
                <p className="font-heading font-semibold text-terracotta text-sm group-hover:text-emerald-700 transition-colors duration-300">
                  Envoyer un message rapide
                </p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(37,211,102,0.5)" strokeWidth="2" strokeLinecap="round" className="ml-auto">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          {/* COL 02 — Nous écrire */}
          <div className="action-col opacity-0">
            <div className="border-t-2 border-gold pt-6 mb-6">
              <span className="eyebrow text-gold/70 mb-2 block">02 · Par écrit</span>
              <h2 className="font-heading font-semibold text-2xl text-terracotta">Nous écrire</h2>
            </div>
            <p className="font-sans text-base font-light text-terracotta/60 leading-relaxed mb-6">
              Pour vos projets d&apos;événements, devis, demandes spéciales ou questions non urgentes.
            </p>

            {/* Email */}
            <a
              href="mailto:contact@lesjardinsdelhacienda54.com"
              className="group flex items-center gap-3 mb-4 p-4 border border-terracotta/10 hover:border-gold transition-all duration-300"
              style={{ borderRadius: "6px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className="text-gold/40 group-hover:text-gold transition-colors duration-300 shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span className="font-sans text-sm text-terracotta/65 group-hover:text-rouge transition-colors duration-300 break-all">
                contact@lesjardinsdelhacienda54.com
              </span>
            </a>

            {/* Formulaire guidé */}
            <a
              href="#message"
              className="btn-primary w-full justify-center mb-3"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="mr-2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Écrire un message guidé
            </a>
            <p className="font-sans text-xs text-terracotta/35 text-center tracking-wide">
              Formulaire 3 étapes · Réponse sous 24h · Devis gratuit
            </p>

            {/* Note réseaux sociaux */}
            <div className="mt-8 pt-6 border-t border-terracotta/8">
              <p className="eyebrow text-gold/60 mb-4">Réseaux sociaux</p>
              <div className="flex gap-5">
                <a href="https://www.instagram.com/lesjardinsdel.hacienda/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-sm text-terracotta/50 hover:text-gold transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                  Instagram
                </a>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-sm text-terracotta/50 hover:text-gold transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  Facebook
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── HORAIRES + CARTE ── */}
      <SectionTransition from="#F5F0E8" to="#1E1008" height={48} />
      <section className="info-section bg-terracotta py-section">
        <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <div className="mb-8">
              <span className="eyebrow text-gold/60 mb-3 block">Planning</span>
              <h2 className="font-display font-bold text-cream tracking-tight" style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)" }}>
                Horaires d&apos;ouverture
              </h2>
            </div>

            {/* Horaires en grille 2 colonnes — plus lisible que la liste */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {HORAIRES.map(({ jour, midi, soir, ferme }) => {
                const isToday = DAY_MAP[jour] === today;
                return (
                  <div
                    key={jour}
                    className={`horaire-row opacity-0 flex flex-col px-4 py-3.5 transition-all duration-300 ${ferme ? "opacity-40" : ""}`}
                    style={{
                      background:   isToday ? "rgba(201,169,110,0.12)" : ferme ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                      border:       isToday ? "1px solid rgba(201,169,110,0.3)" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "8px",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-sans text-sm tracking-wide font-medium ${ferme ? "text-cream/30 line-through" : isToday ? "text-gold" : "text-cream/75"}`}>
                        {jour}
                      </span>
                      {isToday && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="font-sans text-2xs tracking-[0.2em] uppercase text-green-400/70">Aujourd&apos;hui</span>
                        </span>
                      )}
                      {ferme && <span className="font-sans text-2xs tracking-widest uppercase text-cream/25">Fermé</span>}
                    </div>
                    {!ferme && (
                      <div className="flex flex-col gap-0.5">
                        {midi && (
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-2xs tracking-widest uppercase text-cream/35 w-8">Midi</span>
                            <span className={`font-sans text-sm ${isToday ? "text-gold/90" : "text-cream/60"}`}>{midi}</span>
                          </div>
                        )}
                        {soir && (
                          <div className="flex items-center gap-2">
                            <span className="font-sans text-2xs tracking-widest uppercase text-cream/35 w-8">Soir</span>
                            <span className={`font-sans text-sm ${isToday ? "text-gold/90" : "text-cream/60"}`}>{soir}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-4 border border-gold/15 mb-8">
              <p className="font-sans text-xs text-cream/35 tracking-wide">
                * Horaires susceptibles d&apos;être modifiés les jours fériés · Nous contacter pour confirmer
              </p>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <p className="eyebrow text-gold/60 mb-4">Réseaux sociaux</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/lesjardinsdel.hacienda/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-sm text-cream/50 hover:text-gold transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>Instagram
                </a>
                <span className="text-cream/20">·</span>
                <a href="https://www.facebook.com/lesjardinsdelhacienda54" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-sm text-cream/50 hover:text-gold transition-colors duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Carte */}
          <div className="map-block opacity-0">
            <div className="mb-6">
              <span className="eyebrow text-gold/60 mb-3 block">Localisation</span>
              <h2 className="font-display font-bold text-cream tracking-tight" style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)" }}>
                Nous trouver
              </h2>
            </div>
            {/* ── Carte Google Maps — réelle avec consentement, SVG sinon ── */}
            <div
              className="relative overflow-hidden border border-gold/20 group mb-4"
              style={{ height: "300px" }}
            >
              {cookieConsent === "accepted" ? (
                <>
                  <iframe
                    src="https://maps.google.com/maps?q=Les+Jardins+de+l%27Hacienda+6+Vathier+Haye+54580+Moineville+France&output=embed&hl=fr&z=15"
                    width="100%"
                    height="300"
                    style={{ border: 0, display: "block", position: "absolute", inset: 0, filter: "saturate(1.05)" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Les Jardins de l'Hacienda"
                    aria-label="Carte Google Maps — Les Jardins de l'Hacienda, 6 Vathier Haye, 54580 Moineville"
                  />
                  <div className="absolute top-4 left-4 bg-terracotta/95 border border-gold/20 px-4 py-3 shadow-lg pointer-events-none"
                    style={{ backdropFilter: "blur(8px)" }}>
                    <p className="font-display font-bold italic text-cream text-sm tracking-tight leading-none mb-0.5">Les Jardins</p>
                    <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold/70">de l&apos;Hacienda</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                      <p className="font-sans" style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "rgba(245,240,232,0.5)" }}>6 Vathier Haye · 54580</p>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="absolute inset-0 block w-full"
                  aria-label="Activer les cookies pour voir la carte"
                  onClick={() => {
                    // Scroll to cookie banner or show it
                    const banner = document.querySelector("[data-cookie-banner]") as HTMLElement | null;
                    if (banner) { banner.style.display = "flex"; banner.scrollIntoView({ behavior: "smooth" }); }
                    else { localStorage.removeItem("cookie-consent"); window.location.reload(); }
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                    style={{ background: "#F5F0E8" }}>
                    <svg width="48" height="48" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                      <path d="M36 4 L68 36 L36 68 L4 36 Z" stroke="#C9A96E" strokeWidth="1.5" fill="none" opacity="0.7"/>
                      <path d="M36 16 L56 36 L36 56 L16 36 Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.4"/>
                      <text x="36" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontSize="16" fontStyle="italic" fontWeight="600" fill="#C9A96E" opacity="0.9">JH</text>
                    </svg>
                    <div className="text-center">
                      <p className="font-display font-bold text-terracotta text-base tracking-tight mb-1">6 Vathier Haye</p>
                      <p className="font-sans text-xs tracking-[0.2em] uppercase text-terracotta/50 mb-1">54580 Moineville</p>
                      <p className="font-sans text-xs text-terracotta/35">Entre Metz et Nancy</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:bg-rouge/8"
                      style={{ border: "1px solid rgba(192,57,43,0.2)", background: "rgba(192,57,43,0.04)" }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span className="font-sans text-xs tracking-[0.14em] uppercase text-rouge/70">
                        Cliquer pour activer la carte
                      </span>
                    </div>
                  </div>
                </button>
              )}
            </div>
                        {/* ── COMMENT VENIR — bloc accès v01.4 ── */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                {
                  icon: "map-pin",
                  label: "Adresse",
                  value: "6 Vathier Haye",
                  sub:   "54580 Moineville",
                  href:  "https://maps.google.com/?q=6+Vathier+Haye+54580+Moineville",
                },
                {
                  icon: "car",
                  label: "Parking",
                  value: "Gratuit",
                  sub:   "50+ places sur place",
                  href:  null,
                  accent: true,
                },
                {
                  icon: "clock",
                  label: "Depuis Metz",
                  value: "20 min",
                  sub:   "A31 sortie 30",
                  href:  "https://maps.google.com/maps/dir//6+Vathier+Haye+54580+Moineville",
                },
                {
                  icon: "clock",
                  label: "Depuis Nancy",
                  value: "25 min",
                  sub:   "A31 sortie 30",
                  href:  "https://maps.google.com/maps/dir//6+Vathier+Haye+54580+Moineville",
                },
              ].map(({ icon, label, value, sub, href, accent }) => {
                const Inner = (
                  <div
                    key={label}
                    className="p-4 transition-all duration-300 group"
                    style={{
                      background:   accent ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.04)",
                      border:       accent ? "1px solid rgba(201,169,110,0.25)" : "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "8px",
                    }}
                  >
                    <p className="font-sans text-2xs tracking-[0.15em] uppercase mb-1"
                      style={{ color: accent ? "rgba(201,169,110,0.7)" : "rgba(201,169,110,0.5)" }}>
                      {label}
                    </p>
                    <p className={`font-heading font-semibold text-base leading-none mb-0.5 ${accent ? "text-gold" : "text-cream/80"}`}>
                      {value}
                    </p>
                    <p className="font-sans text-xs text-cream/40">{sub}</p>
                    {href && (
                      <p className="font-sans text-2xs tracking-[0.12em] uppercase text-gold/30 group-hover:text-gold/60 mt-2 transition-colors duration-300">
                        Itinéraire →
                      </p>
                    )}
                  </div>
                );
                return href
                  ? <a key={label} href={href} target="_blank" rel="noopener noreferrer">{Inner}</a>
                  : <div key={label}>{Inner}</div>;
              })}
            </div>
            <div className="flex gap-4">
              <a href="https://maps.google.com/?q=6+Vathier+Haye+54580+Moineville" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-sans text-sm text-cream/50 hover:text-gold transition-colors duration-300">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Google Maps
              </a>
              <span className="text-cream/20">·</span>
              <a href="https://maps.apple.com/?q=Les+Jardins+de+l+Hacienda+Moineville" target="_blank" rel="noopener noreferrer"
                className="font-sans text-sm text-cream/50 hover:text-gold transition-colors duration-300">Apple Maps</a>
            </div>
          </div>
        </div>
      </section>


      {/* ── FORMULAIRE GUIDÉ ── */}
      <section id="message" className="form-section bg-cream pb-section pt-0">
        <div className="container-main max-w-2xl">
          <div className="text-center mb-12">
            <span className="eyebrow text-gold/70 mb-4 block">03 · Nous écrire</span>
            <h2 className="section-title text-terracotta mb-4">Envoyez-nous un message</h2>
            <p className="font-sans font-light text-terracotta/50">Décrivez votre demande — nous répondons sous 48h.</p>
          </div>

          {formState === "success" ? (
            <div
              className="text-center py-14 px-8"
              style={{
                background:   "linear-gradient(135deg, rgba(201,169,110,0.06), rgba(192,57,43,0.04))",
                border:       "1px solid rgba(201,169,110,0.18)",
                borderRadius: "16px",
                animation:    "fadeIn 0.6s ease forwards",
              }}
            >
              {/* Cercle coche animé */}
              <div className="relative w-20 h-20 mx-auto mb-8">
                {/* Cercle de fond pulsant */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:  "rgba(201,169,110,0.08)",
                    animation:   "pulse-ring 1.5s ease-out",
                  }}
                />
                {/* Cercle principal */}
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background:   "linear-gradient(135deg, #C9A96E, #E8D090)",
                    boxShadow:    "0 8px 32px rgba(201,169,110,0.35)",
                    animation:    "star-celebrate 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
                  }}
                >
                  <svg
                    width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="#1E1008" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ animation: "fadeIn 0.4s ease 0.4s both" }}
                  >
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>

              <p
                className="font-display font-bold tracking-tight mb-3"
                style={{
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  color:    "#1E1008",
                  animation: "fadeIn 0.5s ease 0.3s both",
                }}
              >
                Message envoyé !
              </p>
              <p
                className="font-heading font-light text-base text-terracotta/60 mb-2"
                style={{ animation: "fadeIn 0.5s ease 0.5s both" }}
              >
                Nous vous répondons sous 48 heures.
              </p>
              <div
                className="flex items-center justify-center gap-2 mt-6"
                style={{ animation: "fadeIn 0.5s ease 0.7s both" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-sans text-xs tracking-[0.15em] uppercase text-terracotta/45">
                  Réponse garantie sous 48h
                </span>
              </div>
              <div
                className="mt-8 pt-6 flex justify-center gap-4"
                style={{
                  borderTop:  "1px solid rgba(30,16,8,0.07)",
                  animation:  "fadeIn 0.5s ease 0.8s both",
                }}
              >
                <a
                  href="tel:0609386764"
                  className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.16em] uppercase text-terracotta/45 hover:text-rouge transition-colors duration-300"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Si urgent : 06 09 38 67 64
                </a>
                <Link
                  href="/"
                  className="font-sans text-xs tracking-[0.16em] uppercase text-terracotta/35 hover:text-terracotta transition-colors duration-300"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nom + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { name: "nom",   label: "Nom complet", type: "text"  },
                  { name: "email", label: "Email",        type: "email" },
                ].map(({ name, label, type }) => (
                  <div key={name} className="form-field opacity-0">
                    <label className="label-elegant">{label}</label>
                    <input type={type} name={name} required value={formData[name as keyof typeof formData]}
                      onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))}
                      className="input-elegant" placeholder={label} disabled={formState === "loading"}/>
                  </div>
                ))}
              </div>

              {/* Objet — sélecteur visuel boutons ── v02.0 */}
              <div className="form-field opacity-0">
                <label className="label-elegant">Objet de votre demande</label>
                {/* Hidden input pour la validation du formulaire */}
                <input type="hidden" name="objet" value={formData.objet} required />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                  {[
                    { value: "reservation",   label: "Réservation",     sub: "Restaurant",          icon: "🍽️" },
                    { value: "evenement",      label: "Événement",       sub: "Soirée thème",        icon: "🎉" },
                    { value: "groupe",         label: "Groupe",          sub: "Table de 8+ couverts",  icon: "👥" },
                    { value: "privatisation",  label: "Privatisation",   sub: "Mariage · Séminaire", icon: "💍" },
                    { value: "info",           label: "Info",            sub: "Renseignements",      icon: "💬" },
                    { value: "autre",          label: "Autre",           sub: "Autre demande",       icon: "✉️" },
                  ].map(({ value, label, sub, icon }) => {
                    const isActive = formData.objet === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={formState === "loading"}
                        onClick={() => setFormData(p => ({ ...p, objet: value }))}
                        className="relative flex flex-col items-start gap-0.5 px-4 py-3.5 text-left transition-all duration-250"
                        style={{
                          background:  isActive ? "rgba(192,57,43,0.07)" : "rgba(30,16,8,0.03)",
                          border:      isActive ? "1.5px solid rgba(192,57,43,0.55)" : "1.5px solid rgba(30,16,8,0.1)",
                          borderRadius: "8px",
                          transform:   isActive ? "translateY(-1px)" : "translateY(0)",
                          boxShadow:   isActive ? "0 4px 16px rgba(192,57,43,0.12)" : "none",
                        }}
                      >
                        {/* Indicator dot */}
                        {isActive && (
                          <span
                            className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
                            style={{ background: "#C0392B" }}
                          />
                        )}
                        <span className="text-base leading-none mb-0.5" aria-hidden="true">{icon}</span>
                        <span
                          className="font-heading font-semibold text-sm leading-none transition-colors duration-200"
                          style={{ color: isActive ? "#C0392B" : "#1E1008" }}
                        >
                          {label}
                        </span>
                        <span
                          className="font-sans text-xs leading-none"
                          style={{ color: isActive ? "rgba(192,57,43,0.6)" : "rgba(30,16,8,0.4)" }}
                        >
                          {sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Message de validation si rien sélectionné et tentative d'envoi */}
                {formState === "error" && !formData.objet && (
                  <p className="font-sans text-xs text-rouge/70 mt-2">Veuillez sélectionner un objet</p>
                )}
              </div>

              {/* Date + Nb personnes — conditionnels selon l'objet */}
              {(showDateField || showGuestsField) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {showDateField && (
                    <div className="form-field opacity-0">
                      <label className="label-elegant">Date souhaitée</label>
                      <input type="date" name="date" value={formData.date}
                        onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                        disabled={formState === "loading"} className="input-elegant bg-cream"/>
                    </div>
                  )}
                  {showGuestsField && (
                    <div className="form-field opacity-0">
                      <label className="label-elegant">Nombre de personnes</label>
                      <input type="number" name="personnes" min="1" max="500" value={formData.personnes}
                        onChange={e => setFormData(p => ({ ...p, personnes: e.target.value }))}
                        placeholder="Ex : 40" disabled={formState === "loading"} className="input-elegant"/>
                    </div>
                  )}
                </div>
              )}

              {/* Message */}
              <div className="form-field opacity-0">
                <label className="label-elegant">Votre message</label>
                <textarea name="message" required rows={4} value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  placeholder="Précisez vos envies, vos questions ou tout détail utile…"
                  disabled={formState === "loading"} className="input-elegant resize-none w-full"/>
              </div>

              {formState === "error" && <p className="font-sans text-xs text-red-500">{errorMsg}</p>}

              <div className="form-field opacity-0">
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  data-magnetic
                  className="w-full py-4 flex items-center justify-center gap-3 font-sans text-sm tracking-[0.18em] uppercase font-semibold text-white transition-all duration-400 disabled:cursor-not-allowed"
                  style={{
                    background:   formState === "loading"
                      ? "rgba(192,57,43,0.7)"
                      : "#C0392B",
                    borderRadius: "8px",
                    boxShadow:    formState === "loading"
                      ? "none"
                      : "0 4px 20px rgba(192,57,43,0.3)",
                    transform:    formState === "loading" ? "scale(0.98)" : "scale(1)",
                    transition:   "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {formState === "loading" ? (
                    <>
                      {/* Spinner CSS pur */}
                      <svg
                        className="animate-spin"
                        width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      <span>Envoi en cours…</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Envoyer le message
                    </>
                  )}
                </button>
                <p className="font-sans text-2xs text-terracotta/30 text-center mt-4 tracking-wide">
                  Vos données restent confidentielles · Réponse garantie sous 48h
                </p>
              </div>
            </form>
          )}
        </div>
      </section>
      <SectionTransition from="#F5F0E8" to="#1E1008" height={48} />
    </div>
  );
}
