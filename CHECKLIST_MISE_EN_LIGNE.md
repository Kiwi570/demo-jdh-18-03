# ✅ Checklist mise en ligne — Les Jardins de l'Hacienda
**Version : 1.6.0 — Production Ready | Stack : Next.js 15, React 19, TypeScript, Tailwind CSS**

---

## 1. VARIABLES D'ENVIRONNEMENT

Créer `.env.local` à la racine du projet (copier `.env.example`) :

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
CONTACT_EMAIL=contact@lesjardinsdelhacienda54.com
FROM_EMAIL=noreply@lesjardinsdelhacienda54.com
NEXT_PUBLIC_SITE_URL=https://www.lesjardinsdelhacienda54.com
NEXT_PUBLIC_PHONE=0609386764
```

⚠️  Sans RESEND_API_KEY, tous les formulaires retournent une erreur 500.
⚠️  Sur Vercel : Dashboard → Settings → Environment Variables

---

## 2. MENTIONS LÉGALES — CHAMPS À COMPLÉTER

Ouvrir `app/mentions-legales/page.tsx` et remplir les champs `[ à compléter ]` :
- [ ] Forme juridique (SARL, SAS, EI…)
- [ ] Numéro SIRET
- [ ] Directeur de publication

---

## 3. RESEND — CONFIGURATION EMAIL

1. Créer un compte sur resend.com
2. Vérifier le domaine lesjardinsdelhacienda54.com (enregistrements DNS TXT)
3. Générer une clé API → ajouter dans Vercel Environment Variables
4. Tester l'envoi depuis /contact en staging
5. Vérifier réception email confirmation utilisateur (v1.6)

---

## 4. DÉPLOIEMENT VERCEL

```bash
git init && git add . && git commit -m "feat: Hacienda v1.6"
git remote add origin https://github.com/VOTRE_USER/hacienda.git
git push -u origin main
# Puis : Vercel → Import → Add env vars → Deploy
```

Domaine custom : Vercel Dashboard → Domains → Add lesjardinsdelhacienda54.com
Ajouter enregistrements DNS A + CNAME Vercel chez le registrar

---

## 5. PLAUSIBLE ANALYTICS

1. Compte sur plausible.io → ajouter lesjardinsdelhacienda54.com
2. Script déjà intégré dans app/layout.tsx — aucune action code
3. Privacy-first, aucun cookie, RGPD natif

---

## 6. GOOGLE MAPS

Aucune clé API requise pour l'embed basique.
Si usage > 25 000 chargements/mois : créer une clé Google Maps API et l'insérer dans :
- components/layout/Footer.tsx
- components/sections/LocalisationSection.tsx
- app/contact/client.tsx

---

## 7. TESTS CROSS-DEVICE OBLIGATOIRES

| Appareil | Navigateur | Points critiques |
|---|---|---|
| iPhone 14 | Safari | Hero WebGL, menu mobile, formulaires |
| iPhone 12 mini | Safari | CarteSaisons tabs, TroisUnivers swipe |
| Samsung Galaxy | Chrome Android | Sphère Instagram, pool-party tab |
| iPad | Chrome | ChefSection layout, grille 3 colonnes |
| MacBook | Chrome | Cursor custom, CardStack, toutes pages |
| MacBook | Firefox | Animations CSS, grid |
| MacBook | Safari | Fonts, performance |
| Windows | Chrome | Build complet, formulaires, emails |

---

## 8. TESTS FORMULAIRES & APIS

- [ ] /contact → email reçu + email confirmation utilisateur
- [ ] /receptions → tunnel 3 étapes → email reçu + confirmation utilisateur
- [ ] /evenements → réservation → email event-booking
- [ ] /evenements → liste d'attente → email waitlist
- [ ] Footer newsletter → email inscription reçu
- [ ] Rate limiting → 10+ envois rapides → blocage 429 confirmé

---

## 9. SEO FINAL

- [ ] sitemap.xml accessible en production
- [ ] robots.txt accessible
- [ ] Soumettre sitemap dans Google Search Console
- [ ] Schema.org validé sur validator.schema.org
- [ ] Open Graph validé sur opengraph.xyz
- [ ] Lighthouse mobile ≥ 90 (Performance, SEO, Accessibility)

---

## 10. PERFORMANCE — CORE WEB VITALS

Cibles :
- LCP < 2.5s ✅ Hero preload ajouté v1.6
- CLS < 0.1  ✅ Images fill + sizes corrects
- INP < 200ms ✅ Sphère lazy-loadée v1.4

Outils : PageSpeed Insights (pagespeed.web.dev) · WebPageTest depuis Paris CDG

---

## 11. RGPD & COOKIES

- [ ] CookieBanner s'affiche à la première visite
- [ ] Google Maps bloqué avant acceptation cookies
- [ ] Google Maps s'affiche après acceptation
- [ ] Lien "Confidentialité & Cookies" → ancre #confidentialite OK
- [ ] Champs mentions légales complétés (SIRET, forme juridique…)

---

## 12. VIDÉO CHEF (OPTIONNEL)

Déposer dans /public/videos/ :
- chef-cuisine.mp4 (H.264, portrait 4:5, muet, < 5MB)
- chef-cuisine.webm (VP9, < 3MB)
La vidéo se lance automatiquement. Fallback photo si absente.

---

## 13. CONTENU À VALIDER AVEC LE CLIENT

- [ ] lib/data/menu.ts — plats, descriptions, prix
- [ ] lib/data/events.ts — dates, prix, disponibilités 2026
- [ ] lib/data/testimonials.ts — avis clients
- [ ] lib/data/stats.ts — chiffres clés + GOOGLE_RATING (note actuelle)
- [ ] lib/data/horaires.ts — horaires d'ouverture
- [ ] public/images/ — toutes les photos sont les bonnes

---

*Checklist v1.6 — Production Ready*
