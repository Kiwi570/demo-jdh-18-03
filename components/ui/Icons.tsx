"use client";

import type { CSSProperties } from "react";

// Bibliothèque d'icônes SVG fines — remplace tous les emojis
// Usage: <IconMariage className="w-7 h-7 text-gold/60" />

interface IconProps {
  className?:  string;
  strokeWidth?: number;
  style?:       CSSProperties;
  color?:       string;
}

export function IconMariage({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 1 3 3v1h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V5a3 3 0 0 1 3-3z"/>
      <circle cx="12" cy="14" r="2"/>
      <path d="M9 8V5"/>
      <path d="M15 8V5"/>
    </svg>
  );
}

export function IconCoupe({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22h8"/>
      <path d="M12 11v11"/>
      <path d="M20 2H4l2 7a6 6 0 0 0 12 0z"/>
    </svg>
  );
}

export function IconFleur({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V3m0 4.5c0 2.485-2.015 4.5-4.5 4.5M3 12h4.5"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 16.5A4.5 4.5 0 1 1 7.5 12M12 16.5A4.5 4.5 0 1 0 16.5 12M12 16.5V21"/>
    </svg>
  );
}

export function IconPoigneeMain({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.4 5.4 0 0 0-.42-7.81z"/>
    </svg>
  );
}

// Atouts icons
export function IconSalle({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18"/>
      <path d="M9 21V9"/>
    </svg>
  );
}

export function IconTerrasse({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/>
      <path d="M3 7h18"/>
      <path d="M12 7v6"/>
      <path d="M8 13h8"/>
    </svg>
  );
}

export function IconPiscine({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h20"/>
      <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>
      <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>
      <circle cx="7" cy="5" r="2"/>
      <path d="M7 7v3"/>
      <path d="M17 7V3"/>
      <path d="M17 3l-4 4"/>
    </svg>
  );
}

export function IconMenu({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
      <path d="M18 15v7"/>
    </svg>
  );
}

export function IconService({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18"/>
      <path d="M12 4v12"/>
      <path d="M3 16a9 9 0 0 1 18 0"/>
    </svg>
  );
}

export function IconPartenaires({ className = "w-6 h-6", strokeWidth = 1 }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3"/>
      <circle cx="5" cy="19" r="3"/>
      <circle cx="19" cy="19" r="3"/>
      <path d="M12 8v3"/>
      <path d="M9.5 17.5 12 14l2.5 3.5"/>
    </svg>
  );
}

// La Table — Philosophie
export function IconProducteurs({ className = "w-6 h-6", strokeWidth = 1, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12"/>
      <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
      <path d="M8 5.1A11 11 0 0 1 12 5a11 11 0 0 1 4 .1"/>
      <path d="M6 3c1.5 1.5 2.3 3.5 2 5.5"/>
      <path d="M18 3c-1.5 1.5-2.3 3.5-2 5.5"/>
      <path d="M12 5c0-2 .5-4 2-6"/>
      <path d="M12 5c0-2-.5-4-2-6"/>
    </svg>
  );
}

export function IconViande({ className = "w-6 h-6", strokeWidth = 1, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 8c0-2.8 2.2-5 5-5s5 2.2 5 5c0 1.5-.7 2.9-1.8 3.8L12 21l-3.2-9.2A5 5 0 0 1 7 8z"/>
    </svg>
  );
}

export function IconSaison({ className = "w-6 h-6", strokeWidth = 1, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M3 12h1m16 0h1M12 3v1m0 16v1"/>
      <path d="m5.6 5.6.7.7m11.4-.7-.7.7M5.6 18.4l.7-.7m11.4.7-.7-.7"/>
    </svg>
  );
}
