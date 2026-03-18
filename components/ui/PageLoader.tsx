"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export function PageLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hacienda-loaded");
    if (hasLoaded) {
      setIsVisible(false);
      return;
    }
    // Sur navigation retour (popstate), ne pas rejouer le loader
    const handlePop = () => setIsVisible(false);
    window.addEventListener("popstate", handlePop);

    const logo = logoRef.current;
    const bar = barRef.current;
    const curtainL = curtainLeftRef.current;
    const curtainR = curtainRightRef.current;
    if (!logo || !bar || !curtainL || !curtainR) return;

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("hacienda-loaded", "true");
        setIsVisible(false);
      },
    });

    tl.fromTo(logo, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" })
      .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut", transformOrigin: "left" }, "+=0.1")
      .to(logo, { opacity: 0, y: -12, duration: 0.3, ease: "power2.in" }, "-=0.15")
      .to(curtainL, { scaleX: 0, duration: 0.55, ease: "power3.inOut", transformOrigin: "right" }, "+=0.05")
      .to(curtainR, { scaleX: 0, duration: 0.55, ease: "power3.inOut", transformOrigin: "left" }, "<");

    return () => {
      tl.kill();
      window.removeEventListener("popstate", handlePop);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={loaderRef} id="page-loader" aria-hidden="true">
      <div ref={curtainLeftRef} className="absolute inset-y-0 left-0 w-1/2 bg-terracotta z-10" />
      <div ref={curtainRightRef} className="absolute inset-y-0 right-0 w-1/2 bg-terracotta z-10" />
      <div className="absolute inset-0 bg-terracotta" />

      <div className="relative z-20 flex flex-col items-center gap-8">
        <div ref={logoRef} className="text-center opacity-0">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold/70 mb-3">Bienvenue aux</p>
          <h1 className="font-display font-extrabold italic text-4xl md:text-5xl text-cream tracking-tight">Les Jardins</h1>
          <div className="w-16 h-px bg-gold mx-auto my-3" />
          <h2 className="font-heading font-semibold text-xl md:text-2xl text-gold tracking-widest">de l&apos;Hacienda</h2>
          <p className="font-sans text-2xs tracking-[0.5em] uppercase text-cream/40 mt-4">Moineville · Lorraine</p>
        </div>

        <div className="w-48 h-px bg-white/10 relative overflow-hidden">
          <div ref={barRef} className="absolute inset-y-0 left-0 progress-gold" style={{ scaleX: 0, transformOrigin: "left" } as React.CSSProperties} />
        </div>
      </div>
    </div>
  );
}
