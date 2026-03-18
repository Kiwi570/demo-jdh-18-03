import type { Metadata } from "next";
import { Suspense } from "react";
import EvenementsClient from "./client";
import { EVENTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Événements — Soirées, Concerts & Pool Parties | Les Jardins de l'Hacienda",
  description: "Agenda des événements aux Jardins de l'Hacienda : soirées à thème, pool parties estivales, concerts en live et dîners spéciaux à Moineville. Réservez vos places en ligne.",
  alternates: { canonical: "https://www.lesjardinsdelhacienda54.com/evenements" },
  openGraph: {
    title: "Événements | Les Jardins de l'Hacienda",
    description: "Pool parties, soirées à thème, concerts — l'agenda événementiel des Jardins de l'Hacienda en Lorraine.",
    images: ["/images/espaces/pool-party.jpg"],
  },
};

const SITE_URL = "https://www.lesjardinsdelhacienda54.com";
const VENUE = {
  "@type": "Place",
  "name": "Les Jardins de l'Hacienda",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "6 Vathier Haye",
    "addressLocality": "Moineville",
    "postalCode": "54580",
    "addressCountry": "FR",
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 49.2125, "longitude": 5.9789 },
};

// Mapping catégories → types Schema.org
const CATEGORY_SCHEMA: Record<string, string> = {
  "soiree-theme":  "SocialEvent",
  "pool-party":    "SocialEvent",
  "diner-special": "FoodEvent",
  "concert":       "MusicEvent",
};

function buildEventsSchema() {
  const eventSchemas = EVENTS.filter(e => !e.isSoldOut).map(event => {
    // Convert "28 Mar 26" → "2026-03-28"
    const parts = event.dateShort.split(" ");
    const monthMap: Record<string, string> = {
      "Jan":"01","Fév":"02","Mar":"03","Avr":"04","Mai":"05","Jun":"06",
      "Jul":"07","Août":"08","Sep":"09","Oct":"10","Nov":"11","Déc":"12",
    };
    const [day, mon, yr] = parts;
    const m = monthMap[mon] ?? "01";
    const y = yr?.length === 2 ? `20${yr}` : yr ?? "2026";
    const [h, mi] = event.time.replace("h",":").split(":").map(Number);
    const isoDate = `${y}-${m}-${String(day).padStart(2,"0")}T${String(h).padStart(2,"0")}:${String(mi||0).padStart(2,"0")}:00`;

    return {
      "@context": "https://schema.org",
      "@type": CATEGORY_SCHEMA[event.category] ?? "Event",
      "name": event.title,
      "description": event.desc,
      "startDate": isoDate,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": VENUE,
      "organizer": {
        "@type": "Organization",
        "name": "Les Jardins de l'Hacienda",
        "url": SITE_URL,
        "telephone": "+33609386764",
      },
      "offers": {
        "@type": "Offer",
        "price": String(event.price),
        "priceCurrency": "EUR",
        "availability": event.spots > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
        "url": `${SITE_URL}/evenements`,
        "validFrom": new Date().toISOString().split("T")[0],
      },
      "remainingAttendeeCapacity": event.spots,
      "image": `${SITE_URL}/images/espaces/pool-party.jpg`,
      "url": `${SITE_URL}/evenements`,
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Événements — Les Jardins de l'Hacienda",
    "url": `${SITE_URL}/evenements`,
    "numberOfItems": eventSchemas.length,
    "itemListElement": eventSchemas.map((schema, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": schema,
    })),
  };
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildEventsSchema()) }}
      />
      <Suspense><EvenementsClient /></Suspense>
    </>
  );
}
