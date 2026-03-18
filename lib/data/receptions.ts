/**
 * Données réceptions — Les Jardins de l'Hacienda
 * Source unique pour app/receptions/client.tsx
 */

export interface Occasion {
  id: string;
  iconKey: string;
  title: string;
  desc: string;
  capacity: string;
}

export interface Atout {
  title: string;
  desc: string;
  iconKey: string;
}

export interface GalerieImage {
  src: string;
  caption: string;
}

export const OCCASIONS: Occasion[] = [
  { id: "mariage",      iconKey: "mariage",     title: "Mariage",               desc: "Le plus beau jour de votre vie dans le plus bel écrin de Lorraine",   capacity: "Jusqu'à 200 invités" },
  { id: "anniversaire", iconKey: "anniversaire", title: "Anniversaire",          desc: "Une célébration mémorable, à la hauteur de chaque étape de la vie",    capacity: "De 10 à 150 personnes" },
  { id: "bapteme",      iconKey: "bapteme",      title: "Baptême & Communion",   desc: "Réunissez famille et proches dans un cadre chaleureux et verdoyant",    capacity: "De 20 à 80 personnes" },
  { id: "corporate",    iconKey: "corporate",    title: "Événement d'entreprise",desc: "Séminaire, team building ou soirée de gala dans un lieu d'exception",  capacity: "De 20 à 200 personnes" },
];

export const ATOUTS: Atout[] = [
  { title: "Salle de réception",    desc: "Espace privatisable jusqu'à 200 personnes, décorable selon vos envies.", iconKey: "salle" },
  { title: "Terrasse privatisable", desc: "La grande terrasse ombragée, idéale pour cocktails et apéritifs.",        iconKey: "terrasse" },
  { title: "Piscine disponible",    desc: "En été, la piscine peut être intégrée à votre réception.",                iconKey: "piscine" },
  { title: "Menu sur mesure",       desc: "Le Chef Régis Clauss conçoit un menu personnalisé selon vos goûts.",       iconKey: "menu" },
  { title: "Service traiteur",      desc: "Notre brigade assure un service impeccable du cocktail au dessert.",       iconKey: "service" },
  { title: "Réseau de partenaires", desc: "Fleuristes, photographes, DJ, animation — les meilleurs de la région.",   iconKey: "partenaires" },
];

export const GALERIE: GalerieImage[] = [
  { src: "/images/receptions/mariage-1.jpg",  caption: "Cérémonie & réception"        },
  { src: "/images/receptions/mariage-2.jpg",  caption: "La terrasse en soirée"        },
  { src: "/images/receptions/mariage-3.jpg",  caption: "Décoration florale"           },
  { src: "/images/receptions/mariage-4.jpg",  caption: "La piscine illuminée"         },
  { src: "/images/receptions/mariage-5.jpg",  caption: "Cocktail & buffet"            },
  { src: "/images/receptions/mariage-6.jpg",  caption: "Soirée dansante"              },
  { src: "/images/espaces/terrasse.jpg",       caption: "La grande terrasse ombragée" },
  { src: "/images/espaces/piscine.jpg",        caption: "La piscine des Jardins"      },
  { src: "/images/espaces/pool-party.jpg",     caption: "Pool Party & réceptions"     },
  { src: "/images/espaces/restaurant.jpg",     caption: "La salle du restaurant"      },
  { src: "/images/espaces/visite.jpg",         caption: "Découverte du domaine"       },
  { src: "/images/hero/piscine-hero.avif",     caption: "L'esprit des Jardins"        },
  { src: "/images/hero/hero-bg.jpg",           caption: "Les Jardins de l'Hacienda"   },
  { src: "/images/univers-espaces.avif",       caption: "Nos espaces d'exception"     },
  { src: "/images/univers-evenements.avif",    caption: "Ambiance événementielle"     },
  { src: "/images/univers-table.avif",         caption: "L'art de recevoir"           },
];
