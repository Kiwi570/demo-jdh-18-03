/**
 * Types globaux — Les Jardins de l'Hacienda
 * Les types métier vivent dans lib/data/*.ts (colocalisés avec les données)
 * Ce fichier contient les types d'UI et de layout
 */

// ── Layout ──────────────────────────────────────────────────
export type HeroVariant = "editorial" | "fullscreen" | "compact" | "gradient";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ── Forms ────────────────────────────────────────────────────
export type FormState = "idle" | "loading" | "success" | "error";

export interface ContactFormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}

export interface ReceptionFormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  typeEvenement: string;
  date: string;
  invites: string;
  message: string;
}

// ── API responses ────────────────────────────────────────────
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// ── Cookie consent ───────────────────────────────────────────
export type ConsentValue = "accepted" | "refused" | null;
