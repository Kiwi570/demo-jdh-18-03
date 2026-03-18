import type { Metadata } from "next";
import { Suspense } from "react";
import LesEspacesClient from "./client";

export const metadata: Metadata = {
  title: "Les Espaces — Restaurant, Terrasse & Piscine | Les Jardins de l'Hacienda",
  description: "Restaurant intime, grande terrasse ombragée, piscine estivale et pool parties. Découvrez les 5 espaces des Jardins de l'Hacienda à Moineville entre Metz et Nancy.",
  alternates: { canonical: "https://www.lesjardinsdelhacienda54.com/les-espaces" },
  openGraph: {
    title: "Les Espaces | Les Jardins de l'Hacienda",
    description: "Restaurant, terrasse, piscine — trois univers pour un lieu d'exception en Lorraine.",
    images: ["/images/espaces/terrasse.jpg"],
  },
};

export default function LesEspacesPage() {
  return <Suspense><LesEspacesClient /></Suspense>;
}
