"use client";

/**
 * ScrollProgress — v01.0
 * Fine barre de progression de lecture en haut de page (2px, dorée).
 * Apparaît dès le premier scroll, disparaît en haut de page.
 * Performant : requestAnimationFrame + will-change:transform.
 */

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let rafId = 0;
    let lastProgress = 0;

    const update = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      // Seulement re-render si changement significatif (évite jank)
      if (Math.abs(progress - lastProgress) > 0.0005) {
        lastProgress = progress;
        // scaleX de 0 à 1 — plus performant que width%
        bar.style.transform = `scaleX(${progress})`;
        bar.style.opacity   = progress > 0.005 ? "1" : "0";
      }
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9997] pointer-events-none"
      style={{ height: "2px" }}
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left will-change-transform"
        style={{
          background:  "linear-gradient(to right, #C0392B, #C9A96E, #DFC08A)",
          transform:   "scaleX(0)",
          opacity:     0,
          transition:  "opacity 0.3s ease",
        }}
      />
    </div>
  );
}
