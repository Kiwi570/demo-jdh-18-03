/**
 * Données de la carte — Les Jardins de l'Hacienda
 * Source unique pour app/la-table/client.tsx
 */

export type TabId = "formules" | "entrees" | "plats" | "desserts" | "suggestions" | "boissons";

export interface MenuItem {
  name: string;
  desc: string;
  price: number | null;
  chef?: boolean;
  vege?: boolean;
  note?: boolean;
  special?: boolean;
  tags?: string[];   // ← NOUVEAU : ingrédients clés
}

export const MENU: Record<TabId, MenuItem[]> = {
  formules: [
    { name: "Formule Déjeuner — Entrée + Plat",          desc: "Du mardi au vendredi midi · Plat du jour + entrée ou dessert",             price: 22, note: true },
    { name: "Formule Déjeuner — Entrée + Plat + Dessert", desc: "Du mardi au vendredi midi · Menu complet 3 services",                      price: 28, note: true },
    { name: "Menu Découverte — 4 Services",               desc: "Entrée · Poisson · Viande · Dessert · Accord vins en option",              price: 55, chef: true },
    { name: "Menu Prestige — 5 Services",                 desc: "Plaisir ultime · Accord Mets & Vins inclus · Sur réservation",             price: 75, chef: true },
  ],
  entrees: [
    { name: "Velouté de butternut rôti",      desc: "Crème de coco, graines de courge torréfiées, huile de truffe",       price: 12,
      tags: ["Butternut", "Truffe", "Coco"] },
    { name: "Tartare de bœuf façon hacienda", desc: "Câpres, cornichons, jaune d'œuf confit, chips de pomme de terre",    price: 16, chef: true,
      tags: ["Bœuf", "Œuf confit", "Câpres"] },
    { name: "Salade de chèvre chaud",          desc: "Miel de lavande, noix caramélisées, roquette sauvage",               price: 13, vege: true,
      tags: ["Chèvre", "Miel", "Roquette"] },
    { name: "Carpaccio de Saint-Jacques",      desc: "Agrumes, aneth, caviar d'Aquitaine",                                 price: 18, chef: true,
      tags: ["Saint-Jacques", "Caviar", "Agrumes"] },
  ],
  plats: [
    { name: "Filet de bœuf Charolais",         desc: "Jus corsé, gratin dauphinois, légumes du moment",                   price: 32, chef: true,
      tags: ["Charolais", "Gratin", "Légumes"] },
    { name: "Pavé de saumon Label Rouge",       desc: "Beurre blanc citronné, pommes grenailles, épinards frais",          price: 26,
      tags: ["Saumon", "Beurre blanc", "Épinards"] },
    { name: "Magret de canard",                 desc: "Sauce aux cerises, polenta crémeuse, haricots verts",               price: 28,
      tags: ["Canard", "Cerises", "Polenta"] },
    { name: "Risotto aux champignons des bois", desc: "Parmesan 24 mois, truffe d'été, huile de persil",                  price: 22, vege: true,
      tags: ["Champignons", "Truffe", "Parmesan"] },
  ],
  desserts: [
    { name: "Fondant au chocolat Valrhona",  desc: "Cœur coulant, glace vanille Bourbon, crumble cacao",                  price: 10, chef: true,
      tags: ["Valrhona", "Vanille", "Cacao"] },
    { name: "Tarte Tatin maison",             desc: "Pommes caramélisées, crème fraîche fermière",                         price: 9,
      tags: ["Pommes", "Caramel", "Crème"] },
    { name: "Assiette de fromages affinés",  desc: "Sélection du meilleur fromager de la région",                         price: 11,
      tags: ["Fromages", "Lorraine", "Affinés"] },
    { name: "Panna cotta fleur d'oranger",   desc: "Coulis de fruits rouges, tuile dentelle",                              price: 8,
      tags: ["Fleur d'oranger", "Fruits rouges", "Tuile"] },
  ],
  suggestions: [
    { name: "Suggestion du Chef — Entrée de la semaine", desc: "Inspirée du marché du matin. Demandez à votre serveur pour le détail du jour.", price: null, special: true },
    { name: "Suggestion du Chef — Plat de la semaine",   desc: "Un plat signature en édition limitée, selon l'arrivage et l'humeur du Chef.",   price: null, special: true },
    { name: "Suggestion du Chef — Dessert de la semaine",desc: "Une création sucrée renouvelée chaque semaine avec les fruits de saison.",       price: null, special: true },
    { name: "Accord Mets & Vins personnalisé",           desc: "Le Chef et notre sommelier s'associent pour vous proposer l'accord parfait.",    price: null, special: true },
  ],
  boissons: [
    { name: "Sélection de vins au verre",        desc: "Cave curatée par notre sommelier — vins de France et d'ailleurs",            price: null,
      tags: ["Blanc", "Rouge", "Rosé"] },
    { name: "Cocktails signatures de la maison", desc: "Créations de notre barman, inspirées des jardins et du terroir lorrain",      price: 12,
      tags: ["Signature", "Artisanal", "Saison"] },
    { name: "Eaux minérales",                    desc: "Plate ou pétillante",                                                         price: 4 },
    { name: "Jus de fruits frais pressés",       desc: "Pressés à la commande selon la saison",                                       price: 5,
      tags: ["Frais", "Saison", "Pressés"] },
  ],
};

export const TABS: { id: TabId; label: string }[] = [
  { id: "formules",    label: "Formules & Menus" },
  { id: "entrees",     label: "Entrées" },
  { id: "plats",       label: "Plats" },
  { id: "desserts",    label: "Desserts" },
  { id: "suggestions", label: "Suggestions du Chef" },
  { id: "boissons",    label: "Boissons" },
];
