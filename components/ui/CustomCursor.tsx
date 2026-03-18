"use client";

/**
 * CustomCursor — v02.0 (Étape 3)
 * Cursor enrichi avec labels contextuels.
 * Attributs HTML supportés :
 *   data-cursor-hover     → anneau doré élargi (liens/boutons standards)
 *   data-cursor-text="X"  → affiche le texte X dans l'anneau (ex: "VOIR", "RÉSERVER")
 *   data-cursor-zoom      → icône loupe (galeries photos)
 *   data-magnetic         → attraction magnétique vers le centre de l'élément
 */

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef    = useRef<HTMLDivElement>(null);
  const ringRef   = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLSpanElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const mouse    = { x: -200, y: -200 };
    const dotPos   = { x: -200, y: -200 };
    const ringPos  = { x: -200, y: -200 };

    let magnetTarget: { cx: number; cy: number } | null = null;
    let cursorMode: "default" | "hover" | "zoom" | "text" = "default";
    let cursorText = "";
    let isClicking = false;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);

      // ── Mode magnétique ──
      const magnetic = el?.closest("[data-magnetic]");
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        magnetTarget = { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
      } else {
        magnetTarget = null;
      }

      // ── Mode cursor enrichi — priorité : text > zoom > hover > default ──
      const textEl = el?.closest("[data-cursor-text]") as HTMLElement | null;
      const zoomEl = el?.closest("[data-cursor-zoom]");
      const hoverEl = el?.closest("a, button, [data-cursor-hover]");

      if (textEl) {
        cursorMode = "text";
        cursorText = textEl.dataset.cursorText ?? "";
      } else if (zoomEl) {
        cursorMode = "zoom";
        cursorText = "";
      } else if (hoverEl) {
        cursorMode = "hover";
        cursorText = "";
      } else {
        cursorMode = "default";
        cursorText = "";
      }
    };

    const onDown = () => { isClicking = true; };
    const onUp   = () => { isClicking = false; };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      dotPos.x = mouse.x;
      dotPos.y = mouse.y;

      const targetX = magnetTarget ? lerp(mouse.x, magnetTarget.cx, 0.5) : mouse.x;
      const targetY = magnetTarget ? lerp(mouse.y, magnetTarget.cy, 0.5) : mouse.y;
      ringPos.x = lerp(ringPos.x, targetX, 0.1);
      ringPos.y = lerp(ringPos.y, targetY, 0.1);

      // ── Dot ──
      const dotScale = isClicking ? 0.4 : (cursorMode !== "default" ? 0 : 1);
      dot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%, -50%) scale(${dotScale})`;

      // ── Ring ──
      let ringScale = 1;
      if (isClicking) ringScale = 0.7;
      else if (cursorMode === "zoom")  ringScale = 1.8;
      else if (cursorMode === "text")  ringScale = 2.2;
      else if (cursorMode === "hover") ringScale = magnetTarget ? 1.5 : 1.7;
      else if (magnetTarget)           ringScale = 1.4;

      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${ringScale})`;
      ring.style.borderColor = (cursorMode !== "default" || magnetTarget)
        ? "rgba(201,169,110,0.9)"
        : "rgba(201,169,110,0.35)";
      ring.style.backgroundColor = cursorMode === "text" || cursorMode === "zoom"
        ? "rgba(201,169,110,0.12)"
        : cursorMode === "hover"
          ? "rgba(201,169,110,0.06)"
          : "transparent";

      // ── Label dans l'anneau ──
      if (cursorMode === "text" && cursorText) {
        label.style.opacity   = "1";
        label.style.transform = "translate(-50%, -50%) scale(1)";
        label.textContent     = cursorText;
      } else if (cursorMode === "zoom") {
        label.style.opacity   = "1";
        label.style.transform = "translate(-50%, -50%) scale(1)";
        label.textContent     = "✕";  // replaced below with SVG via innerHTML trick
        label.innerHTML       = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.9)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
      } else {
        label.style.opacity   = "0";
        label.style.transform = "translate(-50%, -50%) scale(0.7)";
        label.textContent     = "";
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
    };
  }, []);

  return (
    <>
      {/* Point intérieur */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
        aria-hidden="true"
        style={{
          width:  "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: "#C9A96E",
          transition: "transform 0.08s ease, opacity 0.15s ease",
        }}
      />

      {/* Anneau avec lag */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform flex items-center justify-center"
        aria-hidden="true"
        style={{
          width:  "38px",
          height: "38px",
          borderRadius: "50%",
          border: "1px solid rgba(201,169,110,0.35)",
          transition: "transform 0.05s linear, border-color 0.22s ease, background-color 0.22s ease",
        }}
      >
        {/* Label contextuel centré dans l'anneau */}
        <span
          ref={labelRef}
          className="absolute pointer-events-none"
          style={{
            top:      "50%",
            left:     "50%",
            transform: "translate(-50%, -50%) scale(0.7)",
            opacity:  0,
            transition: "opacity 0.18s ease, transform 0.18s ease",
            fontSize: "7px",
            fontFamily: "var(--font-heading), system-ui, sans-serif",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color:    "rgba(201,169,110,0.95)",
            whiteSpace: "nowrap",
            display:  "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>
    </>
  );
}
