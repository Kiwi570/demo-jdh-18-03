import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export type RevealType = "fade-up" | "fade-left" | "clip-reveal" | "stagger";

export interface UseRevealOptions {
  type?:     RevealType;
  delay?:    number;
  stagger?:  number;
  duration?: number;
  start?:    string;
  selector?: string; // CSS selector inside container, defaults to direct children
}

/**
 * useReveal — Hook GSAP ScrollTrigger universel
 *
 * Usage :
 *   const ref = useReveal<HTMLDivElement>({ type: "stagger", stagger: 0.1 });
 *   return <div ref={ref}>...</div>
 *
 * Tous les enfants directs (ou les éléments `.sr-item`) sont animés à l'entrée.
 */
export function useReveal<T extends HTMLElement = HTMLElement>({
  type     = "fade-up",
  delay    = 0,
  stagger  = 0.1,
  duration = 0.85,
  start    = "top 82%",
  selector,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = selector
      ? container.querySelectorAll<HTMLElement>(selector)
      : Array.from(container.children) as HTMLElement[];

    if (!targets.length) return;

    // Définition des états initial / final selon le type
    type FromVars = Record<string, string | number>;
    type ToVars   = Record<string, string | number | object | boolean | undefined>;

    let from: FromVars = {};
    let to:   ToVars   = {};

    switch (type) {
      case "fade-up":
        from = { opacity: 0, y: 30 };
        to   = { opacity: 1, y: 0 };
        break;
      case "fade-left":
        from = { opacity: 0, x: -30 };
        to   = { opacity: 1, x: 0 };
        break;
      case "clip-reveal":
        from = { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 16 };
        to   = { clipPath: "inset(0 0 0% 0)",   opacity: 1, y: 0 };
        break;
      case "stagger":
      default:
        from = { opacity: 0, y: 22 };
        to   = { opacity: 1, y: 0 };
        break;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, from, {
        ...to,
        delay,
        stagger,
        duration,
        ease: type === "clip-reveal" ? "power4.out" : "power3.out",
        scrollTrigger: {
          trigger: container,
          start,
          toggleActions: "play none none none",
        },
      });
    }, container);

    return () => ctx.revert();
  }, [type, delay, stagger, duration, start, selector]);

  return ref;
}
