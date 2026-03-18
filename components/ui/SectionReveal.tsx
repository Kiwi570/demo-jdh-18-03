"use client";

/**
 * SectionReveal — Composant wrapper universel pour les animations d'entrée
 *
 * Remplace le pattern GSAP répété dans chaque composant :
 *   gsap.fromTo(".class-name", { opacity:0, y:30 }, { ... scrollTrigger })
 *
 * Usage simple :
 *   <SectionReveal>
 *     <span className="eyebrow">Découvrez</span>
 *     <h2>Titre</h2>
 *     <p>Description</p>
 *   </SectionReveal>
 *
 * Usage avancé :
 *   <SectionReveal type="clip-reveal" stagger={0.15} start="top 75%">
 *     <div className="sr-item">...</div>
 *     <div className="sr-item">...</div>
 *   </SectionReveal>
 *
 * Si des éléments `.sr-item` sont présents → seuls ceux-là sont animés.
 * Sinon → tous les enfants directs sont animés.
 */

import React from "react";
import { useReveal, type RevealType } from "@/lib/hooks/useReveal";

interface SectionRevealProps {
  children:  React.ReactNode;
  type?:     RevealType;
  delay?:    number;
  stagger?:  number;
  duration?: number;
  start?:    string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export function SectionReveal({
  children,
  type      = "stagger",
  delay     = 0,
  stagger   = 0.1,
  duration  = 0.85,
  start     = "top 82%",
  className = "",
  as,
}: SectionRevealProps) {
  const ref = useReveal<HTMLDivElement>({ type, delay, stagger, duration, start });
  const Tag = (as ?? "div") as "div";

  return (
    <Tag ref={ref} className={className || undefined}>
      {children}
    </Tag>
  );
}
