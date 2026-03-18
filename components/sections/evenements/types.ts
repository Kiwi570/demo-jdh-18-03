/**
 * Types et constantes partagés pour EvenementsSection
 */

export type Step = "idle" | "s1" | "s2" | "s3" | "s4";

export interface BookingState {
  step: Step;
  guests: number;
  prenom: string;
  nom: string;
  email: string;
  loading: boolean;
  bookingRef: string;
}

export const BOOKING_DEFAULT: BookingState = {
  step: "idle",
  guests: 2,
  prenom: "",
  nom: "",
  email: "",
  loading: false,
  bookingRef: "",
};

export const EVENT_THUMB: Record<string, string> = {
  "1": "/images/espaces/terrasse.jpg",       // Soirée Libanaise
  "2": "/images/espaces/restaurant.jpg",      // Menu de Pâques
  "3": "/images/espaces/pool-party.jpg",      // Pool Party Tropical
};

export const CATEGORY_LABELS: Record<string, string> = {
  "soiree-theme":  "Soirée thème",
  "pool-party":    "Pool Party",
  "diner-special": "Dîner spécial",
  "concert":       "Concert & Live",
};

export const EVENT_DETAILS: Record<string, {
  lieu: string;
  duree: string;
  inclus: string;
  dress?: string;
}> = {
  "1": { lieu: "Grande terrasse",    duree: "~3h",   inclus: "Mezze, grillades & musique live", dress: "Tenue décontractée" },
  "2": { lieu: "Salle de réception", duree: "~2h30", inclus: "Menu 4 services + menu enfant",   dress: "Tenue de ville" },
  "3": { lieu: "Piscine & pool bar", duree: "~5h",   inclus: "DJ, cocktails exotiques & buffet", dress: "Tenue estivale" },
};

export const ACCENT: Record<string, string> = {
  "soiree-theme":  "#C0392B",
  "pool-party":    "#2D4A3E",
  "diner-special": "#A8884A",
  "concert":       "#321608",
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
