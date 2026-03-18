import type { Metadata } from "next";
import { Suspense } from "react";
import PhotosClient from "./client";

export const metadata: Metadata = {
  title: "Les Photos — Restaurant, Terrasse, Piscine & Mariages | Les Jardins de l'Hacienda",
  description: "Galerie photo des Jardins de l'Hacienda : restaurant gastronomique, terrasse ombragée, piscine à ciel ouvert, pool parties estivales et réceptions de mariage à Moineville (54).",
  alternates: { canonical: "https://www.lesjardinsdelhacienda54.com/les-photos" },
  openGraph: {
    title: "Les Photos — Les Jardins de l'Hacienda",
    description: "Restaurant, terrasse, piscine et réceptions à Moineville. Une parenthèse hors du temps en images.",
    images: ["/og-image.jpg"],
  },
};

export default function LesPhotosPage() {
  return (
    <Suspense>
      <PhotosClient />
    </Suspense>
  );
}
