"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const wrapRef   = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const prevPath  = useRef<string | null>(null); // null = premier render

  useEffect(() => {
    const isFirstRender = prevPath.current === null;
    prevPath.current = pathname;

    if (isFirstRender) {
      // Première visite — fade in simple
      gsap.fromTo(wrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.05 }
      );
    } else {
      // Navigation entre pages — rideau haut/bas
      const tl = gsap.timeline();
      tl.set(curtainRef.current, { display: "block" })
        .fromTo(curtainRef.current,
          { yPercent: 100 },
          { yPercent: 0, duration: 0.45, ease: "power3.inOut" }
        )
        .fromTo(wrapRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.01 }
        )
        .to(curtainRef.current,
          { yPercent: -100, duration: 0.45, ease: "power3.inOut", delay: 0.05 }
        )
        .set(curtainRef.current, { display: "none" });
    }
  }, [pathname]);

  return (
    <>
      {/* Rideau de transition */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        style={{
          display: "none",
          position: "fixed",
          inset: 0,
          zIndex: 9995,
          background: "#1E1008",
          pointerEvents: "none",
        }}
      >
        {/* Logo centré pendant la transition */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <p style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.1rem", color: "rgba(201,169,110,0.6)", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 300 }}>
            Les Jardins de l&apos;Hacienda
          </p>
          <div style={{ width: "32px", height: "1px", background: "rgba(201,169,110,0.4)" }} />
        </div>
      </div>

      {/* Contenu de la page */}
      <div ref={wrapRef}>
        {children}
      </div>
    </>
  );
}
