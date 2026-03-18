/**
 * Témoignages clients — Les Jardins de l'Hacienda
 * Source unique pour TemoignagesSection et receptions/client.tsx
 * ⚠️  À valider avec le client : remplacer par de vrais avis Google avant mise en ligne
 */

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  occasion: string;
}

export interface WeddingTestimonial {
  couple: string;
  date: string;
  comment: string;
  initials: string;
}

export const TEMOIGNAGES: Testimonial[] = [
  {
    id: "1",
    name: "Marie-Claire D.",
    rating: 5,
    comment: "Une expérience gastronomique mémorable. Le Chef Régis Clauss nous a proposé une carte du marché absolument sublime. La terrasse en été est un vrai bijou.",
    date: "Juillet 2025",
    occasion: "Déjeuner en famille",
  },
  {
    id: "2",
    name: "Thomas & Julie",
    rating: 5,
    comment: "Nous avons fêté notre anniversaire de mariage ici. Un accueil impeccable, une cuisine raffinée et un cadre enchanteur autour de la piscine. On reviendra sans aucun doute.",
    date: "Août 2025",
    occasion: "Anniversaire de mariage",
  },
  {
    id: "3",
    name: "Stéphane R.",
    rating: 5,
    comment: "Le meilleur restaurant de la région sans hésiter. La pool party de juillet était une expérience unique. Ambiance, service et cuisine au top du top.",
    date: "Juillet 2025",
    occasion: "Pool Party",
  },
  {
    id: "4",
    name: "Famille Bertrand",
    rating: 5,
    comment: "Notre mariage aux Jardins était exactement ce dont nous rêvions. L'équipe a été d'une attention et d'un professionnalisme exemplaires du début à la fin.",
    date: "Juin 2025",
    occasion: "Mariage",
  },
];

export const TEMOIGNAGES_MARIAGES: WeddingTestimonial[] = [
  {
    couple: "Sarah & Laurent M.",
    date: "Juin 2025",
    comment: "Nous avons célébré notre mariage aux Jardins de l'Hacienda et c'était au-delà de tout ce que l'on pouvait espérer. L'équipe a pensé à chaque détail, le Chef nous a concocté un menu qui a bluffé nos 140 invités. Un an après, on nous en parle encore.",
    initials: "S&L",
  },
  {
    couple: "Emma & Thomas B.",
    date: "Septembre 2025",
    comment: "La piscine illuminée pour notre soirée de mariage était d'une beauté absolue. Nos invités n'en revenaient pas d'être en Lorraine dans un endroit pareil. Du premier rendez-vous avec l'équipe jusqu'au dernier slow, tout était parfait.",
    initials: "E&T",
  },
  {
    couple: "Clara & Maxime V.",
    date: "Juillet 2025",
    comment: "On cherchait un lieu qui allie l'élégance et la convivialité. L'Hacienda a dépassé toutes nos attentes. Le Chef Régis a composé un menu sur mesure qui a ému nos proches aux larmes — l'accord mets et vins était divin. Un lieu de mariage exceptionnel en Lorraine.",
    initials: "C&M",
  },
  {
    couple: "Aurélie & Nicolas P.",
    date: "Mai 2025",
    comment: "Notre séminaire d'entreprise s'est transformé en véritable moment de magie. La privatisation du domaine, le menu gastronomique, l'accueil de l'équipe — tout était à la hauteur d'un établissement 5 étoiles. Nous reviendrons pour notre prochain événement sans aucun doute.",
    initials: "A&N",
  },
];
