# Les Jardins de l'Hacienda — Site Web

**Version actuelle : v01.7 — Production ready**
**Date :** Mars 2026
**Stack :** Next.js 15 · React 19 · TypeScript · Tailwind CSS · GSAP 3 · WebGL

---

## 🏠 Présentation

Site web du restaurant gastronomique **Les Jardins de l'Hacienda** à Moineville (54), entre Metz et Nancy.

- Restaurant · Terrasse ombragée · Piscine chauffée
- Chef Régis Clauss — cuisine de saison renouvelée chaque semaine
- Réceptions & mariages jusqu'à 200 personnes

**URL de production :** https://www.lesjardinsdelhacienda54.com

---

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrir **http://localhost:3000**

```bash
npm run build   # build de production
npm start       # démarrer le serveur de production
```

---

## 🗂️ Structure du projet

```
app/                        — Pages Next.js App Router
  page.tsx                  — Accueil (10 sections)
  la-table/                 — Menu & carte restaurant
  les-espaces/              — 5 espaces (restaurant, terrasse, piscine…)
  receptions/               — Mariages & événements + formulaire
  evenements/               — Agenda avec FeaturedCard + MiniCalendar
  les-photos/               — Galerie viewer + masonry + lightbox
  contact/                  — 2 colonnes + horaires + carte SVG
  mentions-legales/         — Page légale
  api/                      — Routes API (contact, réceptions, newsletter…)

components/
  layout/                   — Navbar, Footer
  sections/                 — Sections de la homepage
  ui/                       — Composants réutilisables

lib/
  data/                     — Source de vérité (events, menu, horaires…)
  hooks/                    — useReveal (GSAP ScrollTrigger)
  providers.tsx             — Lenis + GSAP + FloatingCTA

public/
  images/                   — Photos (espaces, réceptions, hero, chef)
```

---

## 🎨 Design System

| Token | Valeur |
|---|---|
| `terracotta` | `#1E1008` |
| `rouge` | `#C0392B` |
| `gold` | `#C9A96E` |
| `cream` | `#F5F0E8` |
| `forest` | `#2D4A3E` |

**Typographie :** Fraunces (display) · Outfit (heading) · DM Sans (corps)

---

## ⚙️ Variables d'environnement

Copier `.env.example` en `.env.local` et remplir :

```
NEXT_PUBLIC_SITE_URL=https://www.lesjardinsdelhacienda54.com
NEXT_PUBLIC_PHONE=0609386764
CONTACT_EMAIL=contact@lesjardinsdelhacienda54.com
FROM_EMAIL=noreply@lesjardinsdelhacienda54.com
RESEND_API_KEY=re_xxxxx
```

---

## 📦 Déploiement

Le projet est configuré pour **Vercel** (`vercel.json`).

1. Connecter le repo GitHub à Vercel
2. Ajouter les variables d'environnement dans le dashboard Vercel
3. Chaque push sur `main` déclenche un déploiement automatique

Région configurée : **cdg1 (Paris)** — optimal depuis la Lorraine.

---

## 📝 Pour le client

Voir `GUIDE_CLIENT.md` pour modifier les événements, horaires, menu et photos sans développeur.

---

## 📋 Historique

Voir `CHANGELOG.md` pour le détail de toutes les versions.
