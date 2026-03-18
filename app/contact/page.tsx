import type { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./client";

export const metadata: Metadata = {
  title: "Contact & Réservation",
  description:
    "Réservez une table aux Jardins de l'Hacienda à Moineville. Horaires, adresse, numéros de téléphone et formulaire de contact. À 15 min de Metz, 20 min de Nancy.",
  alternates: {
    canonical: "https://www.lesjardinsdelhacienda54.com/contact",
  },
  openGraph: {
    title: "Contact & Réservation | Les Jardins de l'Hacienda",
    description: "6 Vathier Haye, 54580 Moineville. À 15 min de Metz, 20 min de Nancy.",
  },
};

export default function ContactPage() {
  return <Suspense><ContactClient /></Suspense>;
}
