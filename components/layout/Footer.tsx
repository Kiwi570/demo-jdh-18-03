"use client";

import Link from "next/link";
import { useState } from "react";
import { HORAIRES_FOOTER, DAY_MAP } from "@/lib/data/horaires";
import { useCookieConsent } from "@/components/ui/CookieBanner";

const NAV_LINKS = [
  { label: "Accueil",     href: "/" },
  { label: "La Table",    href: "/la-table" },
  { label: "Les Espaces", href: "/les-espaces" },
  { label: "Réceptions",  href: "/receptions" },
  { label: "Événements",  href: "/evenements" },
];

type NewsletterState = "idle" | "loading" | "success" | "error";

export function Footer() {
  const [email, setEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<NewsletterState>("idle");
  const today = new Date().getDay();
  const cookieConsent = useCookieConsent();

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterState("success");
    setEmail("");
  };

  return (
    <footer className="bg-terracotta text-cream">

      {/* ── BANDE SUPÉRIEURE ── */}
      <div className="border-t border-gold/20">
        <div className="container-main py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* ── COLONNE 1 : Identité ── */}
            <div className="flex flex-col gap-6">
              <div>
                {/* Logo losange + texte */}
                <div className="flex items-center gap-3 mb-3">
                  <svg width="32" height="32" viewBox="0 0 72 72" fill="none" aria-hidden="true">
                    <path d="M36 4 L68 36 L36 68 L4 36 Z" stroke="#C9A96E" strokeWidth="1.5" fill="none" opacity="0.8"/>
                    <path d="M36 16 L56 36 L36 56 L16 36 Z" stroke="#C9A96E" strokeWidth="0.8" fill="none" opacity="0.4"/>
                    <text x="36" y="42" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fontStyle="italic" fontWeight="600" fill="#C9A96E" opacity="0.95">JH</text>
                  </svg>
                  <div>
                    <h2 className="font-display font-bold italic text-2xl text-cream leading-none tracking-tight">Les Jardins</h2>
                    <div className="w-8 h-px bg-gold my-1.5 opacity-60" />
                    <p className="font-sans text-[10px] tracking-[0.38em] uppercase text-gold/80">de l&apos;Hacienda</p>
                  </div>
                </div>
              </div>

              <p className="font-sans text-base font-light text-cream/55 leading-relaxed max-w-xs">
                Restaurant, terrasse et piscine à Moineville. Une parenthèse hors du temps entre Metz et Nancy.
              </p>

              {/* Réseaux sociaux */}
              <div className="flex gap-4">
                <a href="https://www.facebook.com/lesjardinsdelhacienda54" target="_blank" rel="noopener noreferrer"
                  className="flex-center w-9 h-9 border border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all duration-300 hover:-translate-y-0.5" aria-label="Facebook">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/lesjardinsdel.hacienda/" target="_blank" rel="noopener noreferrer"
                  className="flex-center w-9 h-9 border border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all duration-300 hover:-translate-y-0.5" aria-label="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://www.tripadvisor.fr/Restaurant_Review-Les_Jardins_de_l_Hacienda-Moineville" target="_blank" rel="noopener noreferrer"
                  className="flex-center w-9 h-9 border border-gold/30 text-gold/60 hover:border-gold hover:text-gold transition-all duration-300 hover:-translate-y-0.5" aria-label="TripAdvisor">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 17c-1.49 0-2.75-.55-3.76-1.44l1.34-1.34C10.28 16.71 11.1 17 12 17s1.72-.29 2.42-.78l1.34 1.34C14.75 18.45 13.49 19 12 19zm5.5-5.5c0 1.38-.57 2.63-1.49 3.54l-1.33-1.33c.52-.6.82-1.38.82-2.21 0-1.93-1.57-3.5-3.5-3.5S8.5 11.57 8.5 13.5c0 .83.3 1.61.82 2.21l-1.33 1.33C7.07 16.13 6.5 14.88 6.5 13.5 6.5 10.46 8.96 8 12 8s5.5 2.46 5.5 5.5zM12 15.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </a>
              </div>

              {/* Newsletter — fonctionnelle */}
              <div className="mt-2">
                <p className="eyebrow text-gold/50 mb-3">
                  <label htmlFor="newsletter-email">Newsletter</label>
                </p>
                {newsletterState === "success" ? (
                  <p className="font-sans text-xs text-gold/80 tracking-wide px-3 py-2 rounded" style={{ background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)" }}>✓ Merci, vous êtes inscrit !</p>
                ) : (
                  <>
                    <form onSubmit={handleNewsletter} className="flex gap-0">
                      <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (newsletterState === "error") setNewsletterState("idle");
                        }}
                        placeholder="votre@email.fr"
                        required
                        disabled={newsletterState === "loading"}
                        aria-label="Adresse e-mail pour la newsletter"
                        className="flex-1 bg-white/5 border border-gold/20 border-r-0 px-4 py-2.5 font-sans text-xs text-cream placeholder-cream/30 focus:outline-none focus:border-gold/50 transition-colors duration-300 disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={newsletterState === "loading"}
                        aria-label="S'inscrire à la newsletter"
                        className="bg-gold/20 border border-gold/20 px-4 py-2.5 text-gold hover:bg-gold hover:text-terracotta transition-all duration-300 disabled:opacity-50"
                      >
                        {newsletterState === "loading" ? (
                          <div className="w-3.5 h-3.5 border border-gold/60 border-t-gold rounded-full animate-spin" />
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        )}
                      </button>
                    </form>
                    {newsletterState === "error" && (
                      <p className="font-sans text-2xs text-red-300/70 mt-2">Erreur — veuillez réessayer.</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* ── COLONNE 2 : Navigation + Horaires ── */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="eyebrow text-gold/50 mb-4">Navigation</p>
                <ul className="flex flex-col gap-2">
                  {NAV_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="group inline-flex items-center gap-1.5 font-sans text-base text-cream/55 hover:text-gold transition-all duration-300 tracking-wide"
                      >
                        <span className="transition-transform duration-300 group-hover:translate-x-1">{label}</span>
                        <svg
                          width="10" height="10" viewBox="0 0 16 8" fill="none"
                          className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300"
                        >
                          <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="eyebrow text-gold/50 mb-4">Horaires</p>
                <ul className="flex flex-col gap-1.5">
                  {HORAIRES_FOOTER.map(({ jour, horaire }) => {
                    const isToday = DAY_MAP[jour] === today;
                    return (
                      <li key={jour} className={`flex justify-between gap-4 font-sans text-xs ${
                        isToday ? "text-gold" : horaire === "Fermé" ? "text-cream/40" : "text-cream/45"
                      }`}>
                        <span className={`tracking-wide ${isToday ? "font-medium" : "font-light"}`}>
                          {jour}{isToday && <span className="ml-2 text-gold/60">·</span>}
                        </span>
                        <span className="text-right">{horaire}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="font-sans text-2xs text-cream/40 mt-3 tracking-wide">* Réservation en ligne uniquement</p>
              </div>
            </div>

            {/* ── COLONNE 3 : Contact & Carte ── */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="eyebrow text-gold/50 mb-4">Nous trouver</p>
                <address className="not-italic font-sans text-sm text-cream/50 leading-relaxed font-light">
                  6 Vathier Haye<br />54580 Moineville<br />Meurthe-et-Moselle, France
                </address>
                <a href="https://maps.google.com/?q=6+Vathier+Haye,+54580+Moineville" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 font-sans text-xs tracking-widest uppercase text-gold/60 hover:text-gold transition-colors duration-300">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Itinéraire GPS
                </a>
              </div>

              <div>
                <p className="eyebrow text-gold/50 mb-4">Nous appeler</p>
                <div className="flex flex-col gap-2">
                  <a href="tel:0609386764" className="group flex items-center gap-3">
                    <span className="font-sans text-lg text-cream/75 hover:text-gold transition-colors duration-300 tracking-wide group-hover:text-gold">06 09 38 67 64</span>
                    <span className="font-sans text-2xs text-cream/40 tracking-widest uppercase">Résa</span>
                  </a>
                  <a href="tel:0618212810" className="group flex items-center gap-3">
                    <span className="font-sans text-lg text-cream/75 hover:text-gold transition-colors duration-300 tracking-wide group-hover:text-gold">06 18 21 28 10</span>
                    <span className="font-sans text-2xs text-cream/40 tracking-widest uppercase">Events</span>
                  </a>
                </div>
              </div>

              {/* Carte Google Maps — réelle et interactive */}
              <div
                className="relative overflow-hidden border border-gold/15 hover:border-gold/30 transition-all duration-300"
                style={{ height: "140px" }}
              >
                {cookieConsent === "accepted" ? (
                  /* ── Iframe Google Maps réel après consentement ── */
                  <iframe
                    src="https://maps.google.com/maps?q=Les+Jardins+de+l%27Hacienda+6+Vathier+Haye+54580+Moineville+France&output=embed&hl=fr&z=15"
                    width="100%"
                    height="140"
                    style={{
                      border: 0,
                      display: "block",
                      filter: "grayscale(0.25) contrast(1.05) brightness(0.92)",
                    }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Les Jardins de l'Hacienda — Moineville 54580"
                    aria-label="Carte Google Maps — Les Jardins de l'Hacienda"
                  />
                ) : (
                  /* ── Placeholder avant consentement ── */
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
                    style={{ background: "#1a2e27" }}
                  >
                    {/* Grille décorative */}
                    <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                      <line x1="0" y1="45" x2="200" y2="45" stroke="#C9A96E" strokeWidth="1"/>
                      <line x1="0" y1="90" x2="200" y2="90" stroke="#C9A96E" strokeWidth="0.5"/>
                      <line x1="65" y1="0" x2="65" y2="140" stroke="#C9A96E" strokeWidth="1"/>
                      <line x1="130" y1="0" x2="130" y2="140" stroke="#C9A96E" strokeWidth="0.5"/>
                    </svg>
                    {/* Pin animé */}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
                      <div className="absolute -inset-1.5 rounded-full border border-gold/35" />
                    </div>
                    <p className="relative z-10 font-sans text-2xs tracking-[0.25em] uppercase text-gold/50 text-center leading-relaxed px-4">
                      Acceptez les cookies<br/>pour afficher la carte
                    </p>
                    <a
                      href="https://maps.google.com/?q=6+Vathier+Haye,+54580+Moineville"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 font-sans text-2xs tracking-widest uppercase text-gold/40 hover:text-gold transition-colors duration-300"
                    >
                      Itinéraire GPS →
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── COPYRIGHT ── */}
      <div className="border-t border-white/5">
        <div className="container-main py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-2xs text-cream/20 tracking-widest">
            © {new Date().getFullYear()} Les Jardins de l&apos;Hacienda · Tous droits réservés
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center md:justify-end">
            <Link href="/mentions-legales" className="font-sans text-2xs text-cream/20 hover:text-cream/40 tracking-widest transition-colors duration-300">
              Mentions légales
            </Link>
            <span className="text-cream/10">·</span>
            <Link href="/mentions-legales#confidentialite" className="font-sans text-2xs text-cream/20 hover:text-cream/40 tracking-widest transition-colors duration-300">
              Confidentialité & Cookies
            </Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
