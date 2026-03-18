import type { MetadataRoute } from "next";

const SITE_URL = "https://www.lesjardinsdelhacienda54.com";

// Date de dernière mise à jour des pages statiques
const STATIC_DATE = new Date("2026-03-18");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/la-table`,
      lastModified: new Date(),       // La carte change chaque semaine
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/receptions`,
      lastModified: STATIC_DATE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/evenements`,
      lastModified: new Date(),       // Les événements changent souvent
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/les-espaces`,
      lastModified: STATIC_DATE,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified: STATIC_DATE,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
