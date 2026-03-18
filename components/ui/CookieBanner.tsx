"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "hacienda-cookies-consent";

export type CookieConsent = "accepted" | "refused" | null;

export function useCookieConsent(): CookieConsent {
  const [consent, setConsent] = useState<CookieConsent>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY) as CookieConsent;
      if (stored === "accepted" || stored === "refused") {
        setConsent(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handler = () => {
      try {
        const stored = localStorage.getItem(COOKIE_KEY) as CookieConsent;
        setConsent(stored);
      } catch {}
    };
    window.addEventListener("hacienda-consent-update", handler);
    return () => window.removeEventListener("hacienda-consent-update", handler);
  }, []);

  return consent;
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: "accepted" | "refused") => {
    try {
      localStorage.setItem(COOKIE_KEY, choice);
      window.dispatchEvent(new Event("hacienda-consent-update"));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-[9990] p-4 md:p-5"
      style={{ pointerEvents: "none", animation: "slideUpCookie 0.45s cubic-bezier(0.16,1,0.3,1) forwards" }}
    >
      <div
        className="max-w-2xl mx-auto"
        style={{ pointerEvents: "auto" }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            background: "rgba(15,8,5,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: "12px",
          }}
        >
          {/* Ligne dorée haut */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.5), transparent)" }}
          />

          <div className="px-6 py-4 md:px-7 md:py-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-7">

              {/* Icône + Texte */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Icône cookie stylisée */}
                <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.8)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
                    <circle cx="8" cy="13" r="1" fill="rgba(201,169,110,0.8)"/>
                    <circle cx="12" cy="9" r="1" fill="rgba(201,169,110,0.8)"/>
                    <circle cx="16" cy="13" r="1" fill="rgba(201,169,110,0.8)"/>
                  </svg>
                </div>
                <div>
                  <p className="font-sans text-xs tracking-[0.22em] uppercase text-gold/65 mb-1">
                    Cookies &amp; confidentialité
                  </p>
                  <p className="font-sans text-sm font-light leading-relaxed" style={{ color: "rgba(245,240,232,0.52)" }}>
                    Ce site utilise Plausible Analytics (sans cookie) et Google Maps pour vous aider à nous trouver.
                    Aucune donnée personnelle transmise à des tiers publicitaires.{" "}
                    <a href="/mentions-legales"
                      className="underline underline-offset-2 transition-colors duration-200"
                      style={{ color: "rgba(201,169,110,0.65)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(201,169,110,1)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,169,110,0.65)")}>
                      En savoir plus
                    </a>
                  </p>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleChoice("refused")}
                  aria-label="Refuser les cookies"
                  className="font-sans text-xs tracking-[0.14em] uppercase transition-all duration-200 px-4 py-2.5"
                  style={{ color: "rgba(245,240,232,0.3)", border: "1px solid rgba(245,240,232,0.1)", borderRadius: "6px" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.55)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,240,232,0.22)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.3)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,240,232,0.1)"; }}
                >
                  Refuser
                </button>
                <button
                  onClick={() => handleChoice("accepted")}
                  aria-label="Accepter les cookies"
                  className="font-sans text-xs tracking-[0.14em] uppercase text-white font-medium transition-all duration-200 px-5 py-2.5"
                  style={{ background: "#C0392B", borderRadius: "6px" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#E04535")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#C0392B")}
                >
                  Accepter
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
