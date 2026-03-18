"use client";

/**
 * BackToTop — v01.1
 * Bouton de retour en haut, discret, bas gauche.
 * Apparaît après 600px de scroll. Animation GSAP.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      opacity:       visible ? 1 : 0,
      y:             visible ? 0 : 16,
      duration:      0.35,
      ease:          "power2.out",
      pointerEvents: visible ? "auto" : "none",
    });
  }, [visible]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      ref={btnRef}
      onClick={scrollToTop}
      aria-label="Retour en haut de page"
      className="fixed bottom-6 left-6 z-50 w-11 h-11 flex items-center justify-center border border-gold/30 text-gold/60 hover:text-gold hover:border-gold/70 hover:bg-gold/8 transition-colors duration-300 opacity-0"
      style={{ pointerEvents: "none", background: "rgba(30,16,8,0.88)", backdropFilter: "blur(10px)" }}
    >
      <svg
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
