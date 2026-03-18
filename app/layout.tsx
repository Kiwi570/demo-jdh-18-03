import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Navbar }     from "@/components/layout/Navbar";
import { Footer }     from "@/components/layout/Footer";
import { BackToTop }  from "@/components/ui/BackToTop";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});


const SCHEMA_LD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Les Jardins de l'Hacienda",
  "description": "Restaurant gastronomique avec terrasse ombragée et piscine à Moineville, entre Metz et Nancy. Cuisine de saison du Chef Régis Clauss, renouvelée chaque semaine. Espaces privatisables pour mariages, réceptions et événements d'entreprise.",
  "image": [
    "https://www.lesjardinsdelhacienda54.com/og-image.jpg",
    "https://www.lesjardinsdelhacienda54.com/images/hero/piscine-hero.avif",
    "https://www.lesjardinsdelhacienda54.com/images/espaces/terrasse.jpg",
    "https://www.lesjardinsdelhacienda54.com/images/espaces/restaurant.jpg"
  ],
  "url": "https://www.lesjardinsdelhacienda54.com",
  "telephone": "+33609386764",
  "email": "contact@lesjardinsdelhacienda54.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "6 Vathier Haye",
    "addressLocality": "Moineville",
    "addressRegion": "Meurthe-et-Moselle",
    "postalCode": "54580",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 49.2125,
    "longitude": 5.9789
  },
  "servesCuisine": ["Cuisine française", "Gastronomique", "Cuisine de saison"],
  "priceRange": "€€€",
  "currenciesAccepted": "EUR",
  "paymentAccepted": "Cash, Credit Card",
  "acceptsReservations": true,
  "menu": "https://www.lesjardinsdelhacienda54.com/la-table",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "300"
  },
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Terrasse", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Piscine", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Parking gratuit", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Accessible PMR", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Salle privatisable", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Climatisation", "value": true }
  ],
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "19:00", "closes": "22:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "19:00", "closes": "22:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "12:00", "closes": "14:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "19:00", "closes": "22:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "12:00", "closes": "14:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "19:00", "closes": "22:30" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "12:00", "closes": "14:30" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "19:00", "closes": "22:30" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "12:00", "closes": "15:00" }
  ],
  "hasMap": "https://maps.google.com/?q=6+Vathier+Haye,+54580+Moineville",
  "sameAs": [
    "https://www.facebook.com/lesjardinsdelhacienda54",
    "https://www.instagram.com/lesjardinsdel.hacienda/",
    "https://www.tripadvisor.fr/Restaurant_Review-Les_Jardins_de_l_Hacienda-Moineville"
  ],
  "founder": {
    "@type": "Person",
    "name": "Régis Clauss",
    "jobTitle": "Chef de cuisine"
  }
};

const SITE_URL = "https://www.lesjardinsdelhacienda54.com";
const SITE_NAME = "Les Jardins de l'Hacienda";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Restaurant · Terrasse · Piscine`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Restaurant gastronomique avec terrasse et piscine à Moineville, entre Metz et Nancy. Cuisine de saison du Chef Régis Clauss. Réceptions, mariages, pool parties.",
  keywords: [
    "restaurant Moineville", "restaurant Metz", "restaurant Nancy", "restaurant Lorraine",
    "terrasse piscine restaurant", "mariage Lorraine", "réception Meurthe-et-Moselle",
    "pool party Lorraine", "Chef Régis Clauss", "cuisine gastronomique Metz",
    "Les Jardins de l'Hacienda", "restaurant entre Metz et Nancy",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Restaurant · Terrasse · Piscine`,
    description:
      "Une parenthèse hors du temps entre Metz et Nancy. Restaurant gastronomique, terrasse, piscine et réceptions d'exception à Moineville.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Restaurant Terrasse Piscine`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Restaurant · Terrasse · Piscine`,
    description: "Une parenthèse hors du temps entre Metz et Nancy.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1E1008",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${outfit.variable} ${dmSans.variable}`}>
      <head>
        {/* ── Preconnect — réduit la latence des fonts Google ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* ── DNS prefetch Plausible ── */}
        <link rel="dns-prefetch" href="https://plausible.io" />
        {/* ── Preload image Hero (LCP critique) ── */}
        <link
          rel="preload"
          as="image"
          href="/images/hero/piscine-hero.avif"
          type="image/avif"
        />
        {/* ── Schema.org JSON-LD ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_LD) }}
        />
      </head>
      <body className="font-sans bg-cream-white text-terracotta overflow-x-hidden">
        <noscript>
          <div style={{ background: "#1E1008", color: "#F5F0E8", textAlign: "center", padding: "2rem", fontFamily: "Georgia, serif" }}>
            <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Les Jardins de l&apos;Hacienda</p>
            <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>Ce site nécessite JavaScript pour fonctionner. Veuillez l&apos;activer dans votre navigateur.</p>
            <p style={{ marginTop: "1rem", fontSize: "0.8rem", opacity: 0.4 }}>6 Vathier Haye, 54580 Moineville · 06 09 38 67 64</p>
          </div>
        </noscript>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </Providers>
        {/* ── Plausible Analytics — privacy-first, sans cookie ── */}
        <Script
          defer
          data-domain="lesjardinsdelhacienda54.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
