/**
 * Chiffres clés & statistiques — Les Jardins de l'Hacienda
 * Source unique de vérité pour AccrocheSection et TemoignagesSection
 * ⚠️ Valider ces chiffres avec le client avant mise en ligne
 */

export interface StatItem {
  valeur: number;
  suffixe: string;
  label: string;
  desc: string;
}

export const CHIFFRES_CLES: StatItem[] = [
  { valeur: 300, suffixe: "+",    label: "Événements",    desc: "Mariages, soirées, séminaires" },
  { valeur: new Date().getFullYear() - 2018, suffixe: " ans", label: "Avec le Chef",  desc: "Régis Clauss à vos côtés" },
  { valeur: 52,  suffixe: "",     label: "Menus par an",  desc: "Carte renouvelée chaque semaine" },
  { valeur: 200, suffixe: "",     label: "Convives max.", desc: "Pour vos grandes réceptions" },
];

/**
 * Note & avis Google — source unique de vérité
 * Mettre à jour ici pour que TemoignagesSection se mette à jour automatiquement
 */
export const GOOGLE_RATING = {
  note: "4,7",        // Affiché tel quel (format FR avec virgule)
  noteNum: 4.7,       // Valeur numérique pour les étoiles
  avis: 300,          // Nombre d'avis total
  label: "avis Google",
};

/**
 * 3 prochains événements mis en avant sur la homepage
 * Garder synchronisé avec lib/data/events.ts
 */
export const HOMEPAGE_EVENT_IDS = ["1", "2", "3"];
