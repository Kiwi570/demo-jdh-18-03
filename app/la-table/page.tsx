import type { Metadata } from "next";
import { Suspense } from "react";
import LaTableClient from "./client";
import { MENU } from "@/lib/data";

export const metadata: Metadata = {
  title: "La Table — Menu & Cuisine de Saison | Les Jardins de l'Hacienda",
  description:
    "Cuisine de saison du Chef Régis Clauss, renouvelée chaque semaine. Formules déjeuner, menus gastronomiques, entrées, plats, desserts — une carte qui évolue avec les produits du terroir lorrain. À Moineville (54).",
  alternates: { canonical: "https://www.lesjardinsdelhacienda54.com/la-table" },
  openGraph: {
    title: "La Table — Cuisine de Saison | Les Jardins de l'Hacienda",
    description: "Une cuisine de saison réinventée chaque semaine par le Chef Régis Clauss. Entre Metz et Nancy.",
    images: ["/og-image.jpg"],
  },
};

const SITE_URL = "https://www.lesjardinsdelhacienda54.com";

function buildMenuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${SITE_URL}/la-table#menu`,
    name: "Carte des Jardins de l'Hacienda",
    description: "Cuisine de saison du Chef Régis Clauss, renouvelée chaque semaine.",
    url: `${SITE_URL}/la-table`,
    inLanguage: "fr-FR",
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: "Formules & Menus",
        hasMenuItem: MENU.formules.filter(i => i.price !== null).map(i => ({
          "@type": "MenuItem", name: i.name, description: i.desc,
          offers: { "@type": "Offer", price: String(i.price), priceCurrency: "EUR", availability: "https://schema.org/InStock" },
        })),
      },
      {
        "@type": "MenuSection",
        name: "Entrées",
        hasMenuItem: MENU.entrees.map(i => ({
          "@type": "MenuItem", name: i.name, description: i.desc,
          suitableForDiet: i.vege ? ["https://schema.org/VegetarianDiet"] : undefined,
          offers: { "@type": "Offer", price: String(i.price), priceCurrency: "EUR", availability: "https://schema.org/InStock" },
        })),
      },
      {
        "@type": "MenuSection",
        name: "Plats",
        hasMenuItem: MENU.plats.map(i => ({
          "@type": "MenuItem", name: i.name, description: i.desc,
          suitableForDiet: i.vege ? ["https://schema.org/VegetarianDiet"] : undefined,
          offers: { "@type": "Offer", price: String(i.price), priceCurrency: "EUR", availability: "https://schema.org/InStock" },
        })),
      },
      {
        "@type": "MenuSection",
        name: "Desserts",
        hasMenuItem: MENU.desserts.map(i => ({
          "@type": "MenuItem", name: i.name, description: i.desc,
          offers: { "@type": "Offer", price: String(i.price), priceCurrency: "EUR", availability: "https://schema.org/InStock" },
        })),
      },
    ],
  };
}

export default function LaTablePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildMenuSchema()) }} />
      <Suspense><LaTableClient /></Suspense>
    </>
  );
}
