import type { Metadata } from "next";
import { HeroSection }           from "@/components/sections/HeroSection";
import { AccrocheSection }       from "@/components/sections/AccrocheSection";
import { TroisUniversSection }   from "@/components/sections/TroisUniversSection";
import { ChefSection }           from "@/components/sections/ChefSection";
import { EvenementsSection }     from "@/components/sections/EvenementsSection";
import { TemoignagesSection }    from "@/components/sections/TemoignagesSection";
import { HaciendaPresentationSection } from "@/components/sections/HaciendaPresentationSection";
import { LocalisationSection }   from "@/components/sections/LocalisationSection";
import { AlbumSection }          from "@/components/sections/AlbumSection";
import { SectionTransition }     from "@/components/ui/SectionTransition";

export const metadata: Metadata = {
  title: "Les Jardins de l'Hacienda — Restaurant, Terrasse & Réceptions à Moineville",
  description: "Restaurant gastronomique entre Metz et Nancy. Cuisine de saison du Chef Régis Clauss, terrasse ombragée, piscine estivale et espaces privatisables pour vos réceptions. À Moineville (54).",
  alternates: { canonical: "https://www.lesjardinsdelhacienda54.com" },
  openGraph: {
    title: "Les Jardins de l'Hacienda — Restaurant & Réceptions en Lorraine",
    description: "Une parenthèse hors du temps entre Metz et Nancy. Cuisine gastronomique, terrasse, piscine et espaces événementiels à Moineville.",
    images: ["/og-image.jpg"],
  },
};

// Couleurs de fond de chaque section — source unique de vérité (v3.4)
// Hero                → #0f0805 (nuit)
// Accroche            → #EDE8DC (cream-warm) puis bande stats → #1E1008 (nuit)
// TroisUnivers        → #F5F0E8 (cream)
// Chef                → #EDE8DC (cream-warm)
// Événements          → #1E1008 (terracotta sombre)
// Albums              → #EDE8DC (cream-warm)
// Localisation        → #F5F0E8 (cream)
// Témoignages         → #1E1008 (sombre)
// HaciendaPresentation→ #F5F0E8 (cream)
// CTA Final           → #0f0805 (nuit)

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Accroche + chiffres clés (fin de section = fond sombre #1E1008) ── */}
      <SectionTransition from="#0f0805" to="#EDE8DC" height={56} />
      <AccrocheSection />

      {/* ── Trois univers — transition depuis le fond sombre de la bande stats ── */}
      <SectionTransition from="#1E1008" to="#F5F0E8" height={56} />
      <TroisUniversSection />

      {/* ── Chef ── fond cream-warm pour distinguer de TroisUnivers */}
      <SectionTransition from="#F5F0E8" to="#EDE8DC" height={32} />
      <ChefSection />

      {/* ── Événements du moment ── */}
      <SectionTransition from="#EDE8DC" to="#1E1008" height={56} />
      <EvenementsSection />

      {/* ── Localisation ── */}
      <SectionTransition from="#1E1008" to="#F5F0E8" height={56} />
      <LocalisationSection />

      {/* ── Témoignages ── */}
      <SectionTransition from="#F5F0E8" to="#1E1008" height={56} />
      <TemoignagesSection />

      {/* ── Albums (CardStack) — après les témoignages ── */}
      <SectionTransition from="#1E1008" to="#EDE8DC" height={56} />
      <AlbumSection />

      {/* ── Présentation Hacienda + CTA ── */}
      <SectionTransition from="#EDE8DC" to="#F5F0E8" height={40} />
      <HaciendaPresentationSection />
    </>
  );
}
