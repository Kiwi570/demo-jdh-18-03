"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useCookieConsent } from "@/components/ui/CookieBanner";
import { HORAIRES, DAY_MAP } from "@/lib/data/horaires";

// ── Hook ouverture dynamique ─────────────────────────────────────────────────
function useOpenStatus() {
  const now         = new Date();
  const day         = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const todayEntry  = HORAIRES.find(h => DAY_MAP[h.jour] === day);
  if (!todayEntry || todayEntry.ferme) return { open: false, label: "Fermé aujourd'hui", service: null };

  function parseRange(s: string | null): [number, number] | null {
    if (!s) return null;
    const parts = s.split("–").map(p =>
      p.trim().replace("h", ":").replace(/(\d+):(\d*)/, (_, h, m) => {
        const hh = parseInt(h);
        const mm = m ? parseInt(m.padEnd(2, "0")) : 0;
        return String(hh * 60 + mm);
      })
    );
    if (parts.length !== 2) return null;
    return [parseInt(parts[0]), parseInt(parts[1])];
  }

  const midiRange = parseRange(todayEntry.midi);
  const soirRange = parseRange(todayEntry.soir);

  if (midiRange && currentTime >= midiRange[0] && currentTime <= midiRange[1])
    return { open: true, label: "Ouvert · Service du midi", service: todayEntry.midi };
  if (soirRange && currentTime >= soirRange[0] && currentTime <= soirRange[1])
    return { open: true, label: "Ouvert · Service du soir", service: todayEntry.soir };

  const nextSoir = soirRange && currentTime < soirRange[0] ? soirRange : null;
  if (nextSoir) {
    const h = Math.floor(nextSoir[0] / 60);
    const m = nextSoir[0] % 60;
    return { open: false, label: `Ouvre ce soir à ${h}h${m > 0 ? String(m).padStart(2,"00") : "00"}`, service: todayEntry.soir };
  }
  return { open: false, label: "Fermé ce soir", service: null };
}

export function LocalisationSection() {
  const sectionRef    = useRef<HTMLElement>(null);
  const cookieConsent = useCookieConsent();
  const openStatus    = useOpenStatus();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".loc-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream py-section overflow-hidden">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ── COLONNE GAUCHE ─────────────────────────────────────── */}
          <div>
            <span className="loc-reveal eyebrow text-gold/60 mb-6 block opacity-0">
              Nous trouver
            </span>

            {/* Titre */}
            <h2 className="loc-reveal font-display font-bold text-terracotta mb-5 opacity-0 tracking-tight"
              style={{ fontSize: "clamp(2.2rem, 3.8vw, 3.8rem)", lineHeight: "1.05" }}>
              Entre Metz et Nancy,<br />
              <em className="italic text-rouge">à 20 minutes</em>
            </h2>

            {/* Séparateur unique or */}
            <div className="loc-reveal mb-8 opacity-0" style={{ width: "48px", height: "2px", background: "linear-gradient(to right, #C9A96E, rgba(201,169,110,0.2))" }} />

            {/* Infos clés — 3 lignes simples, pas de cards */}
            <div className="loc-reveal flex flex-col gap-4 mb-10 opacity-0">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: "6 Vathier Haye, 54580 Moineville",
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                  label: "Metz 20 min · Nancy 25 min · A31 sortie 30",
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>,
                  label: "Parking privé gratuit sur place",
                },
              ].map(({ icon, label }, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "rgba(192,57,43,0.08)", color: "#C0392B" }}
                  >
                    {icon}
                  </div>
                  <span className="font-heading text-base text-terracotta/70">{label}</span>
                </div>
              ))}
            </div>

            {/* Badge horaire dynamique — pill colorée */}
            <div className="loc-reveal opacity-0 mb-6">
              <div
                className="inline-flex items-center gap-2.5 px-4 py-2.5"
                style={{
                  background: openStatus.open ? "rgba(74,222,128,0.10)" : "rgba(30,16,8,0.05)",
                  border: openStatus.open ? "1px solid rgba(74,222,128,0.35)" : "1px solid rgba(30,16,8,0.10)",
                  borderRadius: "40px",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: openStatus.open ? "#4ade80" : "rgba(30,16,8,0.25)",
                    animation: openStatus.open ? "pulse 2s infinite" : "none",
                  }}
                />
                <span className="font-sans text-sm" style={{ color: openStatus.open ? "#166534" : "rgba(30,16,8,0.5)" }}>
                  {openStatus.label}
                  {openStatus.service && (
                    <span className="ml-2 opacity-60">· {openStatus.service}</span>
                  )}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="loc-reveal opacity-0">
              <Link href="/contact" className="btn-primary text-sm px-8 py-3">
                Réserver une table
              </Link>
            </div>
          </div>

          {/* ── COLONNE DROITE — carte ───────────────────────────────── */}
          <div className="loc-reveal opacity-0">
            <div
              className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group"
              style={{ aspectRatio: "4/3", borderRadius: "16px", border: "1px solid rgba(201,169,110,0.20)" }}
            >
              {cookieConsent === "accepted" ? (
                <>
                  <iframe
                    src="https://maps.google.com/maps?q=Les+Jardins+de+l%27Hacienda+6+Vathier+Haye+54580+Moineville+France&output=embed&hl=fr&z=15"
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: "absolute", inset: 0, display: "block", filter: "saturate(1.1) contrast(1.02)" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Les Jardins de l'Hacienda"
                    aria-label="Carte Google Maps — Les Jardins de l'Hacienda"
                  />
                  <div className="absolute bottom-4 right-4 bg-terracotta/95 border border-gold/25 px-4 py-3 shadow-xl pointer-events-none"
                    style={{ backdropFilter: "blur(8px)", borderRadius: "8px" }}>
                    <p className="font-display font-bold italic text-cream text-sm tracking-tight leading-none mb-0.5">Les Jardins</p>
                    <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold/75">de l&apos;Hacienda</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                      <p className="font-sans" style={{ fontSize: "0.6rem", letterSpacing: "0.08em", color: "rgba(245,240,232,0.5)" }}>6 Vathier Haye · 54580</p>
                    </div>
                  </div>
                </>
              ) : (
                <a
                  href="https://maps.google.com/?q=Les+Jardins+de+l+Hacienda+6+Vathier+Haye+54580+Moineville"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 block"
                  aria-label="Ouvrir dans Google Maps"
                >
                  <div className="absolute inset-0" style={{ background: "#EAF0E6" }}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 375" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="terrainGradLoc" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#E8EFE3"/>
                          <stop offset="100%" stopColor="#DDE8D6"/>
                        </linearGradient>
                        <pattern id="foretLoc" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
                          <circle cx="3" cy="3" r="1.5" fill="#96B888" opacity="0.7"/>
                        </pattern>
                      </defs>
                      <rect width="500" height="375" fill="url(#terrainGradLoc)"/>
                      <polygon points="340,0 500,0 500,130 450,145 400,130 360,110 330,80 320,40" fill="#96B888" opacity="0.75"/>
                      <path d="M 85 0 Q 82 80, 80 160 Q 78 240, 82 375" fill="none" stroke="#9BA5B8" strokeWidth="9" strokeLinecap="round"/>
                      <path d="M 85 0 Q 82 80, 80 160 Q 78 240, 82 375" fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="12,8" opacity="0.9"/>
                      <path d="M 118 190 Q 155 185, 195 182 Q 230 180, 263 179 Q 280 179, 295 180" fill="none" stroke="#F5C060" strokeWidth="5.5" strokeLinecap="round"/>
                      <path d="M 295 180 Q 330 178, 365 175 Q 400 172, 440 170 L 500 168" fill="none" stroke="#F5C060" strokeWidth="4.5" strokeLinecap="round"/>
                      <rect x="55" y="100" width="30" height="14" rx="2" fill="#4A6FA8" opacity="0.92"/>
                      <text x="70" y="111" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#FFFFFF" fontFamily="sans-serif">A31</text>
                      <rect x="182" y="171" width="28" height="13" rx="2" fill="#E8971E" opacity="0.93"/>
                      <text x="196" y="181" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#2C1800" fontFamily="sans-serif">D13</text>
                      <text x="55" y="360" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#3A3028" fontFamily="sans-serif">METZ</text>
                      <text x="468" y="360" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#3A3028" fontFamily="sans-serif">NANCY</text>
                      <text x="268" y="210" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1E1008" fontFamily="sans-serif">Moineville</text>
                    </svg>
                    <div className="absolute" style={{ left: "61%", top: "47.5%", transform: "translate(-50%, -100%)" }}>
                      <div className="relative flex flex-col items-center" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))" }}>
                        <div className="absolute -inset-3 rounded-full animate-ping" style={{ background: "rgba(192,57,43,0.20)", animationDuration: "2s" }}/>
                        <div className="relative w-9 h-9 rounded-full bg-rouge flex items-center justify-center border-2 border-white z-10" style={{ boxShadow: "0 2px 12px rgba(192,57,43,0.6)" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        </div>
                        <div className="w-1.5 h-1.5 bg-rouge rounded-full -mt-1 z-10"/>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-terracotta/97 border border-gold/25 px-4 py-3 shadow-xl" style={{ backdropFilter: "blur(8px)", borderRadius: "8px" }}>
                      <p className="font-display font-bold italic text-cream text-sm tracking-tight leading-none mb-0.5">Les Jardins</p>
                      <p className="font-sans text-xs tracking-[0.25em] uppercase text-gold/75">de l&apos;Hacienda</p>
                    </div>
                    <div className="absolute inset-0 bg-terracotta/0 group-hover:bg-terracotta/8 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-terracotta/90 border border-gold/30 px-5 py-3 flex items-center gap-2 shadow-xl" style={{ borderRadius: "8px" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gold"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span className="font-sans text-xs tracking-[0.18em] uppercase text-cream">Ouvrir Google Maps</span>
                      </div>
                    </div>
                  </div>
                </a>
              )}
            </div>

            {/* Liens accès rapide */}
            <div className="flex items-center gap-6 mt-4">
              <a href="https://maps.google.com/?q=Les+Jardins+de+l+Hacienda+Moineville+54" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 font-sans text-sm text-terracotta/50 hover:text-rouge transition-colors duration-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Google Maps
              </a>
              <span className="text-terracotta/20">·</span>
              <a href="https://maps.apple.com/?q=Les+Jardins+de+l+Hacienda+Moineville" target="_blank" rel="noopener noreferrer"
                className="font-sans text-sm text-terracotta/50 hover:text-rouge transition-colors duration-300">
                Apple Maps
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
