import type { Metadata } from "next";
import { Suspense } from "react";
import ReceptionsClient from "./client";

export const metadata: Metadata = {
  title: "Réceptions & Mariages — Événements Privés | Les Jardins de l'Hacienda",
  description: "Organisez votre mariage, anniversaire, baptême ou séminaire aux Jardins de l'Hacienda. Jusqu'à 200 personnes, espaces privatisables, menu sur mesure du Chef Régis Clauss. Devis gratuit.",
  alternates: { canonical: "https://www.lesjardinsdelhacienda54.com/receptions" },
  openGraph: {
    title: "Réceptions & Mariages | Les Jardins de l'Hacienda",
    description: "Le plus beau jour de votre vie dans le plus bel écrin de Lorraine. Jusqu'à 200 invités.",
    images: ["/images/receptions/mariage-1.jpg"],
  },
};

export default function ReceptionsPage() {
  return <Suspense><ReceptionsClient /></Suspense>;
}
