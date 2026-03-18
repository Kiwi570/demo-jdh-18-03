/**
 * Données des événements — Les Jardins de l'Hacienda
 * Source unique pour app/evenements/client.tsx et components/sections/EvenementsSection.tsx
 * Mettre à jour les dates et disponibilités avant chaque saison
 */

export type Category = "tous" | "soiree-theme" | "pool-party" | "diner-special" | "concert";

export interface EventItem {
  id: string;
  title: string;
  category: Exclude<Category, "tous">;
  date: string;
  dateShort: string;
  time: string;
  price: number;
  desc: string;
  icon: string;
  spots: number;
  isSoldOut: boolean;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "tous",         label: "Tous" },
  { id: "soiree-theme", label: "Soirées à thème" },
  { id: "pool-party",   label: "Pool Party" },
  { id: "diner-special",label: "Dîners spéciaux" },
  { id: "concert",      label: "Concerts & Lives" },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  "tous":          "text-gold border-gold/30",
  "soiree-theme":  "text-rouge-light border-rouge/30",
  "pool-party":    "text-rouge border-rouge/40",
  "diner-special": "text-stone-light border-stone-light/30",
  "concert":       "text-gold-dark border-gold-dark/30",
};

export const EVENTS: EventItem[] = [
  { id: "1", title: "Soirée Libanaise",       category: "soiree-theme",  date: "Vendredi 28 Mars 2026",      dateShort: "28 Mar 26",  time: "19h30", price: 45, icon: "IconTerrasse",   spots: 12, isSoldOut: false, desc: "Une soirée aux saveurs du Liban : mezze, grillades, musique orientale et ambiance festive. Une immersion culinaire et culturelle inoubliable." },
  { id: "2", title: "Menu de Pâques",          category: "diner-special", date: "Dimanche 20 Avril 2026",     dateShort: "20 Avr 26",  time: "12h00", price: 55, icon: "IconSaison",     spots: 8,  isSoldOut: false, desc: "Un menu de fête élaboré par le Chef Régis Clauss pour célébrer Pâques en famille. Menu enfant disponible." },
  { id: "3", title: "Pool Party Tropical",     category: "pool-party",    date: "Samedi 14 Juin 2026",        dateShort: "14 Jun 26",  time: "15h00", price: 35, icon: "IconPiscine",    spots: 30, isSoldOut: false, desc: "La Pool Party de l'ouverture estivale ! DJ, cocktails exotiques, buffet tropical et ambiance resort au bord de la piscine." },
  { id: "4", title: "Soirée Jazz & Terrasse",  category: "concert",       date: "Vendredi 27 Juin 2026",      dateShort: "27 Jun 26",  time: "20h00", price: 40, icon: "IconPartenaires", spots: 0,  isSoldOut: true,  desc: "Un quartet de jazz en live sur la terrasse, sous les étoiles. Dîner servi tout au long de la soirée, réservation par table." },
  { id: "5", title: "Nuit Méditerranéenne",    category: "soiree-theme",  date: "Samedi 12 Juillet 2026",     dateShort: "12 Jul 26",  time: "19h00", price: 50, icon: "IconTerrasse",   spots: 20, isSoldOut: false, desc: "Une soirée inspirée des rivages méditerranéens : cuisine grecque et italienne, musique ensoleillée, décoration estivale." },
  { id: "6", title: "Pool Party Ibiza",        category: "pool-party",    date: "Samedi 26 Juillet 2026",     dateShort: "26 Jul 26",  time: "15h00", price: 38, icon: "IconCoupe",      spots: 25, isSoldOut: false, desc: "Le grand rendez-vous de l'été ! DJ international, open bar cocktails, buffet premium, ambiance blanche et dorée." },
  { id: "7", title: "Soirée Blues & Terrasse", category: "concert",       date: "Vendredi 21 Août 2026",      dateShort: "21 Août 26", time: "20h00", price: 35, icon: "IconPartenaires", spots: 18, isSoldOut: false, desc: "Un trio blues acoustique en live sur la terrasse. Dîner à la carte servi pendant le concert dans une ambiance chaleureuse." },
  { id: "8", title: "Concert Electro Lounge", category: "concert",       date: "Samedi 19 Septembre 2026",   dateShort: "19 Sep 26",  time: "21h00", price: 30, icon: "IconPartenaires", spots: 22, isSoldOut: false, desc: "Une nuit electro lounge pour clôturer la saison estivale. DJ set intimiste, cocktails signatures et ambiance feutrée au bord de la piscine." },
];
