# Changelog — Les Jardins de l'Hacienda

Toutes les modifications notables sont documentées ici.
Format : `## vX.X — "Titre" (Date)`

---

## JDH v1.14 — "Réceptions — flow, contenu & polish" — 2026-03-17

### 🔴 Corrections majeures

- **Réordonnancement** : FAQ déplacée AVANT les témoignages. Ordre final : Galerie → FAQ (lever objections) → Témoignages (convaincre) → Formulaire (convertir). Logique commerciale respectée.
- **Transition formulaire** : suppression de la `h-14` cream→sombre redondante entre FAQ et Formulaire (les deux sont déjà sur fond `#1E1008`).

### ✨ Contenu enrichi

- **Témoignages** : 2 → 4. Ajout Clara & Maxime V. (mariage) + Famille Bertrand (anniversaire). Couverture : 2 mariages + 1 anniversaire + 1 corporate.
- **FAQ** : 3 → 5 questions. Ajout "Peut-on visiter le domaine ?" + "Quel acompte est demandé ?".

### 🎨 Améliorations visuelles

- **Galerie 3D desktop** : cartes `220×148px` → `260×175px`, radius `780` → `820`, sceneH `620px` → `680px`. Photos plus immersives.
- **Transition galerie** : `h-14` → `h-24` (plus douce).
- **Descriptions occasions** : opacité `text-terracotta/70` → `/85`. Plus lisibles.
- **Mentions réassurance formulaire** : `text-2xs text-cream/22` → `text-xs text-cream/38`.
- **Watermark losange** : `opacity 0.025` → `0.04`.
- **Signal urgence** : "se remplissent vite" → "sont presque complets" (plus factuel, moins agressif).
- **CTA hero** : "Demander un devis gratuit" → "Organiser mon événement" (plus premium).

---

## JDH v1.13 — "La Table — polish final" — 2026-03-17

### ✨ Corrections polish

- **Image Entrées** : `chef-portrait.avif` → `univers-table.avif`. Plus de confusion avec la section Chef.
- **Gap entre plats** : `gap-1` → `gap-3`. Chaque plat est une unité visuelle distincte.
- **Séparateurs plats** : opacité `0.07` → `0.12`. Les ruptures entre plats sont visibles.
- **Watermark sections** : opacité `0.07` → `0.09`. Plus de présence décorative.
- **Sidebar stats** : `text-2xs` → `text-xs`, padding `py-3` → `py-3.5`, chiffres `1.6/1.2rem` → `1.8/1.3rem`. Plus lisibles.
- **Citation Chef** : opacité `0.75` → `0.78`, auteur `text-gold/65` → `text-gold/70`.
- **Badge semaine sidebar** : `text-2xs text-terracotta/35` → `text-xs text-terracotta/45`.
- **Bandeau semaine** : suppression du `font-display italic` incohérent → `font-heading font-medium` uniforme.
- **Barre progression nav** : `overflow-hidden` ajouté pour éviter le débordement visuel.

---

## JDH v1.12 — "La Table — layout 3 colonnes indépendant & final" — 2026-03-17

### 🔴 Refonte layout 3 colonnes

- **Padding wrapper → 0** : `px-1/px-4` → `px-0`. La carte colle aux bords du maxWidth 1320px.
- **Gap `flex gap` supprimé** → remplacé par `marginRight` sur la nav et `marginLeft` sur la droite. Les espaces sont désormais indépendants et maîtrisés.
- **Gap nav↔centrale** = `marginRight: 72px` sur la nav (généreux, les plats respirent).
- **Gap centrale↔droite** = `marginLeft: 56px` sur la colonne droite.
- **Nav labels** : `0.82rem 500/700` → `0.9rem 600/800`. Réellement lisibles.
- **Info pratiques nav** : 4 lignes séparées → une ligne "Produits locaux · Viandes FR · Non halal".
- **Nav largeur** : `130px` → `160px` pour accueillir les labels plus grands.

---

## JDH v1.11 — "La Table — marges divisées par 2 (×2)" — 2026-03-17

### ✨ Layout
- **Marges encore divisées par 2** — `xl:px-8` (32px) → `xl:px-4` (16px). La carte occupe quasi toute la largeur de l'écran.

---

## JDH v1.10 — "La Table — marges divisées par 2" — 2026-03-17

### ✨ Layout

- **Marges gauche et droite divisées par 2** — le `container-main` (`xl:px-16` = 64px/côté) est remplacé pour cette section par un wrapper custom `xl:px-8` (32px/côté). Symétrique des deux côtés, la carte occupe plus de largeur d'écran.

---

## JDH v1.9 — "La Table — marges symétriques naturelles" — 2026-03-17

### 🔴 Fix layout

- **Suppression du `marginLeft: calc()`** — le hack agressif v1.8 poussait la nav hors du container et collait au bord gauche de l'écran. Retour au comportement naturel du `container-main` : `px-16` symétrique des deux côtés.
- **Nav** : `180px` → `130px`, sans aucun offset custom. Textes `0.85rem` → `0.82rem`.
- **Gap** : `gap-16/gap-20` → `gap-12/gap-14`. Juste la bonne tension entre nav et plats.
- **Colonne droite** : `260px` conservée.
- Résultat : même marge gauche et droite, tout dans le container, symétrique et propre.

---

## JDH v1.8 — "La Table — nav dans la zone morte, layout premium" — 2026-03-17

### 🔴 Fix layout majeur

- **Nav dans la zone morte** — `marginLeft: calc(-1 * (100vw - min(1320px, 100vw)) / 2 - 48px)` : la nav "colonise" la marge gauche inutilisée du container centré. Sur grand écran, elle sort du container et occupe l'espace vide à gauche — technique Stripe Docs / Linear.
- **Gap nav↔central** : `gap-8/gap-10` → `gap-16/gap-20`. Plus d'air entre nav et plats.
- **Colonne droite** : `220px` → `260px`. Plus imposante, plus lisible.
- **Nav labels** : `text-sm 400/700` → `0.85rem 500/700`. Plus lisibles au repos.
- **Nav info pratiques** : `0.72rem` → `0.75rem`, `lineHeight 1.9` → `2`. Plus aéré.
- **Watermark 52** : `5rem` → `5.5rem`. Légèrement plus présent.

---

## JDH v1.7 — "La Table — fix double padding & layout final" — 2026-03-17

### 🔴 Bug critique corrigé

- **Double padding gauche supprimé** — le `pl-14/pl-16` custom était empilé sur le `px-16` du `container-main` → 128px de marge inutile. Retour au `container-main` standard, sans surcharge.
- **Nav en marge négative** (`marginLeft: -8px`) pour coller au bord naturel du container sans déborder — technique propre qui évite tout hack.
- **Gap colonnes** rationalisé : `gap-12/gap-16` → `gap-8/gap-10`. Juste la bonne tension.
- **Colonne droite** : `240px` → `220px`.
- **Nav textes** : labels `text-xs` → `text-sm`, `pl-4` → `pl-5`, `font-size` info pratiques `0.68rem` → `0.72rem`, opacité inactif `0.38` → `0.40`.

---

## JDH v1.6 — "La Table — équilibre final des 3 colonnes" — 2026-03-17

### 🔴 Corrections prioritaires

- **Layout 3 colonnes rééquilibré** — padding conteneur : `pl-8/pl-10` → `pl-14/pl-16`. Gap colonnes : `gap-8/gap-12` → `gap-12/gap-16`. Résultat : plus d'air sans être trop serré.
- **Nav sticky** : `170px` → `150px`. "SUGGESTIONS DU CHEF" abrégé en "SUGGESTIONS" (plus de coupure sur 2 lignes). Numéros de section supprimés de la nav (doublon avec watermark).
- **Noms des plats** : `clamp(1.45rem)` → `clamp(1.6rem)` normal, `clamp(1.55rem)` → `clamp(1.7rem)` signature. Les plats s'imposent.
- **Titre section** : `clamp(2.6rem, 4.5vw, 4rem)` → `clamp(3rem, 5vw, 4.2rem)`. Plus de présence.
- **Numéro redondant** "01" rouge devant le titre → supprimé. Le watermark seul suffit.

### ✨ Améliorations UX

- **Descriptions** : opacité `0.62/0.72` → `0.68/0.78`. Vraiment lisibles maintenant.
- **Prix** : `clamp(1.4rem)` → `clamp(1.7rem)`, opacité `0.75 → 0.85`. Affirmés et lisibles.
- **Séparateurs sections** : opacité `0.15` → `0.22`. Ruptures visuelles bien marquées.
- **Air entre titre et filtres** : `mb-7` → `mb-9`.
- **Air entre sections carte** : `mb-28` → `mb-32`.
- **Colonne droite** : `280px` → `240px`. Mieux proportionnée face à la centrale.
- **pt-14 → pt-16** sur le titre de section (plus d'espace sous le watermark).

---

## JDH v1.5 — "La Table — mise en page resserrée" — 2026-03-17

### ✨ La Table — layout 3 colonnes

- **Padding gauche container** réduit spécifiquement pour cette page : `px-16` → `pl-8/pl-10` sur lg/xl. La marge blanche à gauche est supprimée.
- **Colonne nav sticky** réduite : `210px` → `170px`.
- **Gap entre colonnes** réduit : `gap-14/gap-20` → `gap-8/gap-12`.
- Résultat : la colonne centrale des plats gagne ~100-120px de largeur effective, les noms de plats respirent mieux et le tout est visuellement plus centré et équilibré.

---

## JDH v1.4 — "La Table — lisibilité, hiérarchie & polish" — 2026-03-17

### 🔴 Corrections critiques

- **Nav sticky gauche** — largeur `190px` → `210px`. Tous les textes agrandis : labels `text-xs` → `text-sm`, eyebrow `0.65rem` → `0.72rem`, note produits `0.62rem` → `0.72rem`, numéros `0.65rem` → `0.72rem`. Trait actif `h-px` → `height: 2px` + border-radius. Poids actif `600` → `700`. Watermark 52 : `3.2rem opacity 0.09` → `5rem opacity 0.07`.
- **Hiérarchie nom/prix** — nom du plat agrandi (`clamp 1.25→1.45rem` normal, `1.35→1.55rem` signature). Prix réduit (`clamp 1.7→2.2rem` → `1.4→1.8rem`). Le nom domine désormais visuellement le prix.
- **Descriptions plats** — opacité `0.42` → `0.62` au repos, `0.62` → `0.72` au hover. Lisibles et appétissantes.
- **`<img>` → `<Image>`** dans la section CTA finale (fond terrasse).

### ✨ Améliorations UX & visuelles

- **Badges** (Signature du Chef, Végétarien, Midi) — `text-2xs px-2.5 py-0.5` → `text-xs px-3 py-1`. Plus lisibles. Badge Signature préfixé d'un `✦`.
- **Tags ingrédients** — opacité au repos `0.55` → `0.80`. Toujours visibles et appétissants.
- **Image boissons** — remplacée : `pool-party.jpg` (hors sujet) → `terrasse.jpg` (cohérent restaurant).
- **Image droite colonne** — overlay plus dramatique (`0.75 → 0.85` en bas), ombre `boxShadow` renforcée, kenBurns 8s → 10s, labels `text-2xs` → `text-xs`.
- **Date semaine** — en `font-display italic` dans le bandeau "Carte en cours" pour plus de caractère.
- **Manifeste chiffres** — opacité background `0.15` → `0.22`. Plus d'impact visuel.
- **Citation Chef** — opacité `0.65` → `0.75`, borderLeft `0.3 → 0.4`, auteur `text-2xs` → `text-xs`.
- **Pied de carte** — opacité `text-terracotta/28` → `/48`. Enfin lisible.

---

## JDH v1.3 — "Section Présentation — lisibilité carte & centrage sphère" — 2026-03-17

### ✨ HaciendaPresentationSection

- **Textes carte agrandis** — tous les `text-2xs` passent en `text-xs`, les `text-xs` en `text-sm`. Icônes info pratiques 13px → 15px. Étoiles Google 10px → 13px. Note Google `0.6rem` → `text-xs`. Bouton Réserver padding agrandi. Paddings intérieurs `px-7/pt-8` → `px-8/pt-9` pour plus d'air. Nom du restaurant `1.35rem` → `1.6rem`, sous-titre `1.05rem` → `1.25rem`.
- **Sphère agrandie** — tailles responsive : `380/460/520/600` → `400/500/560/660px`. `sphereRadius` : `40%` → `41%`. `baseImageScale` : `0.14` → `0.15`.
- **Centrage vertical sphère** — colonne droite passe de `justify-start` à `items-center justify-center` avec `minHeight: 520px` (même hauteur que la carte). La sphère est maintenant parfaitement centrée sur le milieu de la carte.

---

## JDH v1.2 — "Section Présentation — carte élargie & sphère agrandie" — 2026-03-17

### ✨ HaciendaPresentationSection

- **Carte de visite** — largeur `300px` fixe → `clamp(300px, 90%, 420px)` (plus large, responsive). Hauteur min `480px` → `520px`. Alignement `justify-end` → `justify-start` pour qu'elle s'ancre naturellement à gauche de sa colonne au lieu de flotter au centre.
- **Sphère 3D** — tailles responsive upgradées : `320/380/420/480px` → `380/460/520/600px`. `sphereRadius` : `37.5%` → `40%` du containerSize. `baseImageScale` : `0.13` → `0.14` (photos légèrement plus grandes et lisibles). État initial `useState` : `480` → `600` (évite le flash au premier rendu desktop).

---

## JDH v1.1 — "Corrections critiques & Polish" — 2026-03-17

### 🔴 Bugs critiques corrigés

- **ChefSection** — Double prop `style` sur `<Image>` fusionnée : `objectPosition` + `animation: kenBurns` coexistent désormais correctement. La photo du Chef s'anime en Ken Burns.
- **TemoignagesSection** — `import React` manquant ajouté (namespace requis par `useReducedMotion` qui utilise `React.useState` / `React.useEffect`).
- **DernieresPhotosSection** — Toutes les balises `<img>` natives remplacées par `<Image>` Next.js (lazy loading, AVIF/WebP, sizing, optimisation automatique).
- **AlbumSection** — Titre h2 dupliqué corrigé : eyebrow "Le domaine en images" + h2 "Explorez nos univers" (textes distincts).
- **EvenementsSection** — Médaillon prix repositionné à l'intérieur du conteneur (`right: 56px` au lieu de `-22px`) ; suppression du `marginRight: "30px"` workaround. Plus de débordement horizontal.
- **CarteSaisonsSection** — Cast hacky `"dishImage" in current && (current as ... & { dishImage: string }).dishImage` remplacé par type `Saison` proprement déclaré avec `dishImage: string`.

### ✨ Nouvelles fonctionnalités

- **CarteSaisonsSection — Auto-rotation** : les saisons défilent automatiquement toutes les 12 secondes. Pause si l'utilisateur survole la section ou si une animation est en cours. Reprise dès que la souris quitte la section.
- **HaciendaPresentationSection — Ordre mobile** : sur mobile, la sphère 3D interactive apparaît en premier (`order-1`) et la carte de visite en second (`order-2`). Sur desktop, l'ordre carte+sphère est conservé.
- **La Table — Persistance URL** : l'onglet actif se reflète dans l'URL via `?onglet=plats` (grâce à `useSearchParams` + `router.replace`). Un lien comme `/la-table?onglet=vegetarien` fonctionne et est partageable.

### 🔧 Architecture & maintenance

- `CarteSaisonsSection` : import `React` ajouté ; `useState` de `isHovered` pour la pause hover ; interface `Saison` TypeScript propre.
- `la-table/client.tsx` : import `useSearchParams` + `useRouter` depuis `next/navigation` ; constante `VALID_TABS` pour valider le paramètre URL.
- `DernieresPhotosSection` : import `Image` from `next/image` ajouté.

---

## [3.4.0] — 2026-03-16 — Corrections bugs & performance

### 🐛 Bugs corrigés
- **SphereImageGrid** : `calculateWorldPositions` wrappé dans `useMemo` — élimine le recalcul O(n²) 60fps
- **SphereImageGrid** : `velocityRef` introduit pour éviter la stale closure dans `updateMomentum` — stoppe la recréation du callback à chaque frame
- **HaciendaPresentationSection** : `gsap.set()` ajouté avant `fromTo` — élimine le flash d'éléments avant animation
- **EvenementsSection** : `overflowX: visible` sur container pour que le médaillon prix ne soit pas coupé
- **ChefSection** : doublon `object-top` supprimé (conflit avec `objectPosition` inline)

### ⚡ Performance
- **TemoignagesSection** : hook `useReducedMotion` — désactive les animations infinies si l'utilisateur a activé 'réduire les animations' + `willChange: transform` ajouté
- **AlbumSection** : intervalMs 4800 → 6000ms (meilleure lisibilité mobile)
- **HaciendaPresentationSection** : taille sphère responsive (320/380/420/480px selon viewport) + wrapper overflow-hidden

### 🔧 Maintenance
- **LocalisationSection** : carte Google Maps ratio 4/5 → 4/3 (meilleur équilibre avec colonne gauche)
- **page.tsx** : commentaire couleurs mis à jour v3.4 avec ordre et sections corrects


## [3.3.0] — 2026-03-16

### ✨ Nouvelle section — HaciendaPresentationSection
- Ajoutée après les Témoignages, fond beige #F5F0E8
- **Gauche** : carte de visite terracotta sombre (300×480px, coins arrondis)
  - Logo losange gold, nom du restaurant, adresse, téléphone, parking
  - Horaires compacts avec surbrillance du jour courant
  - Note Google 4,7 ⭐ + bouton Réserver
- **Droite** : sphère 3D interactive avec photos du domaine
  - 45 images issues du domaine (piscine, terrasse, restaurant, mariages…)
  - Auto-rotation douce + drag interactif
  - Label flottant "Faites tourner"
- Transitions : Témoignages (#1E1008) → Présentation (#F5F0E8) → CTA (#0f0805)


## [3.1.0] — 2026-03-16

### ✨ LocalisationSection — refonte complète
- 4 cards infos pratiques → 3 lignes simples avec icône ronde rouge (plus aéré)
- TravelWidget redesigné : pills de villes cliquables au lieu du select natif
- Résultat trajet en très grand format (2.8rem) — lisible et ludique
- Badge horaire dynamique en pill colorée (vert ouvert / neutre fermé)
- Carte Maps aspect ratio 4/5 + border-radius 16px (plus élégante)
- Séparateur unique dégradé or (suppression double séparateur)


## [3.0.0] — 2026-03-16

### 🎨 EvenementsSection — cards redesignées
- **Médaillon prix flottant** : cercle beige (#F5F0E8) positionné à droite de la card, avec ombre et bordure accent — monte légèrement quand la card est ouverte
- **Panneau ouvert** : fond cream (#F5F0E8) au lieu du sombre #1E1008 — beau contraste clair/sombre
- Textes panneau ouvert adaptés en terracotta (description, mention paiement)
- Bordure top du panneau en couleur accent de l'événement
- Numéro décoratif décalé à droite pour ne pas chevaucher le toggle
- Padding droit du container pour accommoder le médaillon
- Prix retiré de l'en-tête (déplacé dans le médaillon)


## [2.9.0] — 2026-03-16

### 🗑️ Suppression
- **Section "Formules & Menus"** supprimée de la page La Table
- Transition manifeste → carte recousue directement (h-24, sombre → cream)
- State `hoveredFormule` et animation GSAP `formule-card` nettoyés


## [2.8.0] — 2026-03-16 — Polissage visuel page La Table

### ✨ Hero
- Sous-titre réécrit : plus fluide et informatif

### ✨ Bandeau semaine
- Fond changé sombre → cream (#F5F0E8) — vraie rupture visuelle
- Tous les textes adaptés pour fond clair (terracotta au lieu de cream)

### ✨ Section Manifeste
- Descriptions : opacité cream/50 → cream/62 (meilleur contraste)
- Séparateurs entre colonnes : divide-gold/10 → divide-gold/20 (plus visibles)

### ✨ Transitions
- Manifeste → Formules : h-14 → h-24 (fondu plus généreux)
- CarteSaisons : transitions h-14 → h-24 (absorbe le décalage de couleur)

### ✨ Formules
- Star card : lg:-mt-6 → xl:-mt-6 (évite chevauchement tablette)
- Prix cards normales : clamp(2.2rem) → clamp(1.8rem) (moins écrasant)

### ✨ Colonne droite
- Image d'ambiance : brightness(1.55) → brightness(1.15) (fidèle aux couleurs)
- Label image : line-clamp-1 (évite débordement sur 2 lignes)
- Citation Chef : 0.92rem → 1.05rem, terracotta/50 → terracotta/65

### ✨ Carte centrale
- Numéros watermark : 0.055 → 0.08 (perçus sans dominer)
- 52 bas de nav : 0.05 → 0.09 (existant visuellement)
- Barre progression : duration-700 → duration-1000 (plus douce)
- Séparateur sections : h-px 0.1 → h-[1.5px] 0.15 (plus marqué)

### ✨ CTA Final
- Fond photo (terrasse.jpg à opacity 0.12) pour atmosphère
- Suppression du br explicite dans le sous-texte


## [2.7.0] — 2026-03-16 — Polissage visuel homepage

### ✨ Hero
- Eyebrow → "Restaurant gastronomique · Moineville, Lorraine"
- Bouton "Découvrir" transformé en lien textuel avec flèche animée (plus de btn-ghost)
- Scroll indicator → "Les Jardins" en lettres espacées gold (plus poétique)

### ✨ Accroche
- Ligne décorative rouge allongée (w-16 → w-24) et plus épaisse (h-[1.5px])

### ✨ Trois Univers
- Eyebrow → "La Table · Les Espaces · Les Événements" (identitaire)
- Titre : "une adresse" en italic rouge
- Gap réduit à gap-2 (effet tryptique photographique)
- Filet décoratif gold en bas de section

### ✨ Chef
- Fond changé cream → #EDE8DC (cream-warm) — rompt les deux cream consécutifs
- Transition légère depuis TroisUnivers (height 32)
- Blockquote plus grande (clamp 1.5rem) + bordure plus épaisse (border-l-4)
- object-position ajustée pour révéler plus de contexte dans la photo

### ✨ Événements
- Eyebrow → "Prochains rendez-vous"
- Titre → "En ce moment" avec italic gold sur "moment"
- Bouton "Voir tous" plus visible (cream/70, border gold/40)
- Panneau d'expansion : fond #1E1008 + bordure top gold (plus lisible)
- Description texte cream/75 (meilleur contraste)

### ✨ Albums
- Titre → "Le domaine en images" avec italic rouge
- Sous-titre redondant supprimé
- Hint navigation simplifié

### ✨ Localisation
- Horaires dynamiques du jour (hook useOpenStatus) avec indicateur vert animé
- Bouton "Réserver une table" en btn-primary rouge
- Double séparateur (rouge + dégradé gold)

### ✨ Témoignages
- Titre agrandi (clamp 3.5rem)
- CTA "Laisser un avis Google" déplacé sous les colonnes (meilleur flow)

### ✨ CTA Final
- Titre → "Votre prochain souvenir commence ici."
- Séparateur en dégradé gold plus large (80px)
- Photo de fond plus visible (opacity 0.38, brightness 0.50)
- Sous-texte plus sensoriel et évocateur

### 🔧 page.tsx
- Commentaire couleurs mis à jour v2.7
- Transition F5F0E8→EDE8DC (height 32) avant ChefSection


## [2.6.0] — 2026-03-16

### 🎨 TroisUniversSection — lisibilité cards v2
- Gradient recentré sur le tiers bas uniquement (image visible sur 65% de la card)
- Trait décoratif cream/60 au repos (plus visible), accent uniquement au hover
- CTA cream/70 au repos → accent au hover (contraste garanti dans les deux états)
- Fond zone texte transparent au repos, terracotta sombre uniquement au hover


## [2.5.0] — 2026-03-16

### 🎨 TroisUniversSection — lisibilité cards
- Gradient bas renforcé (0.97 opacité) — texte toujours visible au repos
- Titre légèrement plus grand au repos (2rem → 2.1rem)
- CTA toujours à opacity 1 (plus visible sans hover)


## [2.4.0] — 2026-03-16

### 🎨 TroisUniversSection — cards améliorées
- Gap réduit (gap-3) pour cartes plus larges
- Hover : zone texte fond terracotta sombre animé (gradient dynamique)
- Hover : titre agrandi (2rem → 2.4rem) + description plus grande (0.85 → 0.95rem)
- Hover : CTA légèrement agrandi (0.72 → 0.8rem)
- Overlay restructuré en composant dédié zone-texte


## [2.3.0] — 2026-03-16

### 🎨 + 🔀
- **LocalisationSection** : fond remis en beige (#F5F0E8), toutes les couleurs readaptées
- **LocalisationSection** déplacée au-dessus de **TemoignagesSection**
- Nouvel ordre : Albums → Localisation (beige) → Témoignages (sombre) → CTA


## [2.2.0] — 2026-03-16

### 🎨 Design
- **EvenementsSection** ("En ce moment") : fond changé cream → terracotta sombre (#1E1008)
- Titre, bouton, textes et panneaux adaptés pour fond sombre
- Transitions recousues : Chef (#F5F0E8) → Événements (#1E1008) → Albums (#EDE8DC)


## [2.1.0] — 2026-03-16

### 🔀 Ordre sections homepage
- **TemoignagesSection** ("Ce qu'ils en disent") déplacée sous AlbumSection
- Nouvel ordre : Chef → Événements → Albums → Témoignages → Localisation → CTA


## [2.0.0] — 2026-03-16

### 🔀 Ordre sections homepage
- **EvenementsSection** ("En ce moment") déplacée au-dessus de **AlbumSection** ("Nos albums")
- Transitions recousues : Témoignages → Événements → Albums → Localisation
- Double transition redondante avant Localisation supprimée


## [1.9.0] — 2026-03-16

### 🎨 Design
- **LocalisationSection** : fond changé de cream (#F5F0E8) vers terracotta sombre (#1E1008)
- Toutes les couleurs de texte, cartes et widgets adaptées pour fond sombre (cream, gold, borders)
- Transitions homepage recousues : Evenements → Localisation (cream→sombre) et Localisation → CTA (sombre→nuit)


## [1.8.0] — 2026-03-16

### 🗑️ Suppression section
- **InstagramSection** ("L'Hacienda en images" / sphère 3D) supprimée de la homepage
- Import retiré de `app/page.tsx`
- Séparateur décoratif entre Localisation et Instagram supprimé
- Transition recousue directement : Localisation (#F5F0E8) → CTA Final (#0f0805)


## [1.7.0] — 2026-03-16

### 🔀 Déplacement section
- **CarteSaisonsSection** ("Une carte vivante, dictée par la nature") déplacée de la homepage vers la page **La Table**, juste avant le CTA final
- Transitions de fond recousues proprement (cream → sombre → nuit)
- Import et référence supprimés de `app/page.tsx`


## [1.6.0] — Étape 3 : Optimisation & Production — 2026-03-16

### 🚀 Performance
- **next.config.js** : `reactStrictMode: true` · `poweredByHeader: false` · imageSizes enrichi avec 384
- **layout.tsx** : `<link rel="preconnect">` pour fonts.googleapis.com + fonts.gstatic.com · `<link rel="dns-prefetch">` Plausible · `<link rel="preload">` hero image (améliore le LCP)
- **ChefSection** : `preload="none"` sur la balise `<video>` (évite le téléchargement inutile si vidéo absente)
- **vercel.json** : headers Cache-Control immutable sur /images/, /videos/, /_next/static/ · en-têtes sécurité globaux X-Content-Type-Options, X-Frame-Options, Referrer-Policy

### 🔒 APIs & Sécurité
- **api/contact/route.ts** : Honeypot anti-bot (champ `website` vide requis) · Email de confirmation utilisateur après envoi
- **api/reception/route.ts** : Honeypot anti-bot · Email de confirmation organisateur avec délai de réponse 48h
- **api/waitlist/route.ts** : Honeypot anti-bot · Validation longueur champs (prenom < 80, evenement < 200)

### 🗺️ SEO
- **sitemap.ts** : Ajout de /mentions-legales (priority 0.3, changeFrequency yearly)
- **les-photos/page.tsx** : Titre et description SEO enrichis avec mots-clés spécifiques
- **package.json** : name → "web-hacienda", version → "1.6.0"

### 🛡️ RGPD & Légal
- **mentions-legales/page.tsx** : Section 4 enrichie avec titre "& Confidentialité" · `id="confidentialite"` ajouté → le lien footer "Confidentialité & Cookies" fonctionne désormais
- **CHECKLIST_MISE_EN_LIGNE.md** : Refonte complète v1.6 — 13 sections, tests cross-device, APIs, RGPD, contenu client


## [1.5.0] — Étape 2 : Enrichissement UX & Design — 2026-03-16

### 🎨 Sections homepage
- **TroisUniversSection** : grille activée à `lg` (évite cartes étroites sur tablette) · Aspect ratio `2/3` → `3/4` · Filtres CSS réduits de 50% (desktop + mobile) · Mobile visible jusqu'à `lg`
- **ChefSection** : card superposée en `xl:absolute` (était `lg:absolute`) — corrige le chevauchement intermédiaire 1024–1200px
- **CarteSaisonsSection** : opacité numéro décoratif 0.12 → 0.20 · Photo plat de saison ajoutée (vignette 16/9 avec légende) sur les 4 saisons
- **LocalisationSection** : TravelWidget avec bouton reset ×, aria-label select, icônes infos pratiques 16→20px pour meilleur tap mobile

### 📄 Pages secondaires
- **La Table** : image de contexte "Suggestions" corrigée (`restaurant.jpg` au lieu du doublon chef-portrait)
- **Les Espaces** : mini-galerie pool-party et visite déduplicées (images distinctes par espace)
- **Événements** : `gsap.set()` sur filter-bar et calendar-block · `opacity-0` Tailwind supprimé des deux éléments
- **Réceptions** : `gsap.set()` global sur tous les éléments animés · `opacity-0` Tailwind nettoyé sur 8 classes d'animation
- **Les Photos** : boutons filtres enrichis avec badge compteur (nombre de photos par catégorie)
- **not-found** : `gsap.set()` ajouté · `opacity-0` Tailwind supprimé · cohérence anti-conflit GSAP


## [1.4.0] — Étape 1 : Corrections critiques — 2026-03-16

### 🔴 Corrections critiques
- **Navbar** : `gap-1` entre liens desktop · `role="dialog" aria-modal="true"` sur le menu mobile
- **HeroSection** : Double overlay fusionné en un seul unifié · Sous-titre plus sensoriel · Scroll indicator plus visible
- **AccrocheSection** : Micro-icônes SVG sur chaque stat · Description réécrite de façon poétique
- **ChefSection** : Éléments décoratifs masqués mobile (`hidden sm:block`) — évite débordement horizontal
- **AlbumSection** : Image Terrasse corrigée (`terrasse.jpg`) · intervalMs 3200 → 4800ms · Hint contrast amélioré
- **EvenementsSection** : Accordéon `grid-template-rows` remplace `maxHeight` hardcodé · Icône 🔒 Paiement sécurisé · Numéro déco opacité corrigée
- **CtaFinalSection** : `gsap.set()` remplace `opacity-0` Tailwind (conflit) · Photo fond 0.15 → 0.28
- **InstagramSection** : Sphère lazy via IntersectionObserver · minHeight 480 → 360px · Hint text 0.6rem → 0.72rem
- **TemoignagesSection** : Float shadow sur cards fond sombre · Col3 doublon supprimé · CTA avis Google ajouté
- **Footer** : Label accessible newsletter · Lien Confidentialité & Cookies ajouté



## v1.2.0 — "Cohérence visuelle & élévation photographique" (Mars 2026)

### 🎨 Améliorations visuelles majeures

**Élimination des doublons d'images**
- `app/evenements/client.tsx` — EVENT_IMAGES : suppression des 2 doublons (Pool Party ×2, Concert ×2). Chaque événement a désormais une image distincte. Événement #4 (Jazz) → piscine-hero.avif (magie nocturne), #5 (Méditerranéenne) → mariage-1.jpg, #6 (Pool Party Ibiza) → univers-espaces.avif, #8 (Electro) → mariage-5.jpg.

**Cohérence des images par type d'événement (Réceptions)**
- `app/receptions/client.tsx` — Anniversaire : pool-party.jpg (festif ≠ mariage). Baptême : terrasse.jpg (verdoyant, familial). Corporate : restaurant.jpg (professionnel, neutre). Autre : mariage-5.jpg (cocktail universel).
- PageHero Réceptions : mariage-3.jpg (560px, sous-dimensionné) → mariage-1.jpg (560px, meilleure composition).

**Différenciation des heroes de pages**
- `app/les-photos/client.tsx` — PageHero : terrasse.jpg (doublon avec Les Espaces) → hero-bg.jpg (1920×1080, unique, vue d'ensemble panoramique).
- `app/contact/client.tsx` — PageHero : variant "gradient" sans image → variant "compact" avec terrasse.jpg (chaleureux, invitant).

**Filtres CSS différenciés par univers (TroisUniversSection)**
- `components/sections/TroisUniversSection.tsx` — La Table : `brightness(1.15) saturate(1.3) sepia(0.08)` (chaud doré, appétissant). Les Espaces : `brightness(1.25) saturate(1.15) hue-rotate(5deg)` (vert frais). Les Événements : `brightness(1.05) contrast(1.08) saturate(0.9)` (dramatique, élégant).

**CarteSaisonsSection — fond photographique par saison**
- `components/sections/CarteSaisonsSection.tsx` — Ajout d'une image de fond à 7% d'opacité changeant selon la saison active : terrasse.jpg (printemps), pool-party.jpg (été), restaurant.jpg (automne), piscine-hero.avif (hiver). Texture visuelle sans nuire à la lisibilité.

**CtaFinalSection — fond plus festif**
- `components/sections/CtaFinalSection.tsx` — Fond : piscine-hero.avif (utilisé 11×) → pool-party.jpg (tons chauds, ambiance festive, image moins répétée). Opacité 12% → 15% pour plus de présence.

**Optimisation des galeries**
- `app/les-espaces/client.tsx` — ESPACES_IMAGES : visite → visite.jpg (image dédiée). ESPACES_GALLERY : rééquilibrage complet, chaque espace montre 3 angles cohérents sans doublon.
- `app/les-photos/client.tsx` — Galerie réorganisée : narration émotionnelle renforcée (domaine → piscine → pool parties → table → réceptions). mariage-5 en doublon remplacé par mariage-5 dans pool-party (logique cocktail).
- `components/sections/InstagramSection.tsx` — Sphère : hero-bg.jpg ajouté pour la vue panoramique du domaine.
- `components/sections/DernieresPhotosSection.tsx` — Fan polaroid : restaurant.jpg → univers-espaces.avif (vue domaine), mariage-3/5 → univers-table.avif + mariage-6.jpg (meilleure couverture des univers).
- `components/sections/AlbumSection.tsx` — terrasse.jpg → restaurant.jpg pour diversifier.

**Système de classes CSS photographiques**
- `app/globals.css` — Ajout classes `.img-gastro`, `.img-nature`, `.img-soiree` pour filtres cohérents sur les futures photos du client.

### 🔧 Corrections
- `package.json` — name: `web-hacienda-beta-v1.2`, version: `1.2.0`

---

## v02.2 — "Étape 3 — Polish, Performance & Signature finale" (Mars 2026)

### 🆕 Nouvelles fonctionnalités majeures

- **CarteSaisonsSection** (nouvelle section signature homepage) — Section interactive montrant les 4 saisons avec ingrédients phares, origines, et citations du Chef. La saison actuelle est pré-sélectionnée automatiquement. Changement de saison : animation GSAP (fade out contenu, stagger entrée ingrédients, fade in citation). Fond changeant par saison (vert forêt → terracotta → brun automne → nuit hiver). Positionnée entre ChefSection et TemoignagesSection.

- **ScrollProgress** (nouveau composant UI) — Fine barre de progression de lecture 2px en haut de page, dégradé rouge→or. `requestAnimationFrame` loop (0 événements scroll, 0 re-renders React). `scaleX` performant (transform, pas width). Ajoutée dans `lib/providers.tsx`. Respecte `prefers-reduced-motion`.

- **CustomCursor enrichi v02.0** — Nouveau mode contextuel via attributs HTML :
  - `data-cursor-text="X"` → affiche "X" dans l'anneau (RÉSERVER, VOIR, APPELER, DÉCOUVRIR, AGENDA, GALERIE)
  - `data-cursor-zoom` → icône loupe dans l'anneau (galeries photos)
  - `data-magnetic` → attraction magnétique (inchangé)
  - Anneau plus grand (scale 2.2) pour les labels texte, fond légèrement teinté

### 🔧 Corrections & améliorations

- **PageTransition** — Fix font incorrecte `--font-playfair` (inexistante) → `--font-fraunces` (Fraunces, la vraie font display du projet)

- **Attributs cursor enrichis** sur tous les CTA principaux :
  - HeroSection `Réserver une table` → `data-cursor-text="RÉSERVER"`
  - Navbar CTA `Réserver` → `data-cursor-text="RÉSERVER"`
  - CtaFinalSection → `data-cursor-text="RÉSERVER"` et `"APPELER"`
  - ChefSection CTA → `data-cursor-text="VOIR"`
  - TroisUniversSection desktop cards → `data-cursor-text="DÉCOUVRIR"`
  - EvenementsSection CTA → `data-cursor-text="AGENDA"`
  - AlbumSection CTA → `data-cursor-text="GALERIE"`
  - FloatingCTA toggle → `data-cursor-text` dynamique
  - Les Photos galerie viewer + masonry → `data-cursor-zoom`
  - Les Espaces mini-gallery thumbnails → `data-cursor-zoom`
  - Les Espaces CTA → `data-cursor-text="RÉSERVER"`

- **Transitions homepage** — CarteSaisonsSection insérée avec `SectionTransition from="#F5F0E8" to="#1E1008"`. TemoignagesSection enchaîne directement (fonds sombres compatibles).

- **Schema.org événements** — `/evenements/page.tsx` génère maintenant des schémas `Event`/`FoodEvent`/`MusicEvent`/`SocialEvent` individuels pour chaque événement non-sold-out, enveloppés dans un `ItemList`. Incluent `startDate`, `offers` avec `availability` (InStock/SoldOut), `remainingAttendeeCapacity`, `location`, `organizer`.

- **globals.css** — `@media (scripting: none)` pour CarteSaisonsSection, règle `prefers-reduced-motion` pour ScrollProgress.

### Architecture
- `components/ui/ScrollProgress.tsx` — nouveau composant
- `components/sections/CarteSaisonsSection.tsx` — nouveau composant signature
- `lib/providers.tsx` — ajout ScrollProgress
- `app/page.tsx` — import + insertion CarteSaisonsSection

---

## v02.1 — "Étape 2 — Élévation visuelle & UX" (Mars 2026)

### Nouvelles fonctionnalités

- **TroisUniversSection mobile** — Swipe horizontal avec scroll snap natif. Les 3 cards passent en format paysage 3/4 scrollables latéralement. Card active mise en avant (scale, opacity, box-shadow), cards adjacentes atténuées. Indicateur pagination dots cliquables avec couleur accentuée par univers. Hint "Glissez →" discret.
- **Contact — Sélecteur objet visuel** — Le `<select>` HTML classique est remplacé par une grille 2×3 de boutons visuels avec emoji, titre et sous-titre. Sélection animée (border rouge, fond teinté, dot indicator, translateY). Validation inline si oubli.
- **ChefSection — Ken Burns** — La photo portrait du Chef anime en Ken Burns (zoom 1→1.04 sur 12s) en attendant la vidéo `/public/videos/chef-cuisine.mp4`.
- **CtaFinalSection — Photo de fond** — Image piscine-hero à 12% d'opacité en arrière-plan pour une ambiance nocturne évocatrice. Gradient radial renforcé (0.75 → 0.95) pour maintenir la lisibilité.

### Améliorations

- **globals.css** — `scroll-padding-top: 96px` sur `html` pour que les ancres (#restaurant, #piscine, etc.) tiennent compte de la navbar sticky.
- **globals.css** — Keyframe `selectPop` pour micro-animation des boutons objet contact.
- **CtaFinalSection** — Correction complète des z-index (photo z-0, overlays z-1, cercles z-2, lignes z-3, contenu z-4).

### Notes
- Toutes les améliorations Étape 2 déjà présentes en v01.7 conservées intactes :
  TemoignagesSection (Google rating), Page Réceptions (timeline interactive),
  Événements (spots/countdown), Les Espaces (nav sticky + galerie + lightbox),
  Les Photos (lightbox + swipe + clavier), Formules La Table (cards premium).

---

## v02.0 — "Étape 1 — Fondations & Corrections" (Mars 2026)

### Nouvelles fonctionnalités
- **Plausible Analytics** — Intégration privacy-first sans cookie (RGPD natif). Script ajouté via `next/script` avec `strategy="afterInteractive"` dans `app/layout.tsx`. Aucune donnée personnelle transmise, pas de bannière cookie obligatoire pour cet outil.
- **PWA Manifest** — `public/manifest.json` créé avec nom, icônes, raccourcis (Réserver / Carte), theme_color #1E1008. Référencé dans les metadata Next.js.
- **Google Maps réel (RGPD)** — Les 3 cartes SVG simulées (Footer, LocalisationSection, Contact) sont remplacées par de vraies iframes Google Maps qui s'affichent uniquement après consentement cookie. Avant consentement : placeholder SVG haute fidélité + invitation. Après acceptation : iframe interactive avec badge Hacienda.
- **Bande stats sombre** — La bande des chiffres clés dans `AccrocheSection` passe d'un fond cream quasi-invisible (#EDE8DC) à un fond nuit (#1E1008) avec chiffres cream et suffixes dorés — contraste maximal et impact visuel fort.
- **Transitions de section cohérentes** — Les `SectionTransition` dans `page.tsx` sont recalculées pour tenir compte du nouveau fond sombre de la bande stats (#1E1008).

### Corrections
- **SECTION_IMAGES (`la-table`)** — Les images de contexte par onglet de carte sont maintenant cohérentes : Entrées → Terrasse, Plats → Table, Desserts → Restaurant, Suggestions → Chef, Boissons → Piscine.
- **CSP (`next.config.js`)** — Content Security Policy mise à jour pour autoriser les domaines Plausible et l'iframe Google Maps (`https://maps.googleapis.com`).
- **Mentions légales** — Section Cookies enrichie avec documentation Plausible Analytics (sans cookie, RGPD) et Google Maps (avec consentement).
- **CookieBanner** — Texte mis à jour pour mentionner Plausible et Google Maps de façon transparente.
- **`.env.example`** — Variable `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` documentée.

### Architecture
- `DernieresPhotosSection` conservée — utilisée sur `/les-photos` comme fan polaroid d'introduction (non orpheline).
- Hook `useCookieConsent` utilisé dans Footer, LocalisationSection et Contact pour le rendu conditionnel des cartes.

---

## v01.7 — "Finitions & polish" (Mars 2026)

### Nouvelles fonctionnalités
- **SectionReveal clip-path** sur tous les headers importants (Réceptions : Timeline, Témoignages, FAQ, Formulaire ; Événements : Privatisation)
- **Formulaire Contact** : bouton submit avec icône + spinner CSS pur ; state success refondu avec cercle doré animé (star-celebrate), titre Fraunces display, lien urgence, retour accueil
- **Widget "Combien de temps depuis chez vous ?"** dans LocalisationSection : 6 villes hardcodées, temps + route + lien GPS Maps
- **FloatingCTA stagger** : 3 boutons animés séquentiellement (stagger 0.06s, back.out(1.4)) à l'expansion et collapse inversé

### Améliorations
- Accordéon Occasions (Réceptions) : backdrop-filter blur(8px) sur item ouvert, shadow colorée catégorie, icône + titre scale à l'ouverture, CTA avec shadow colorée
- `GUIDE_CLIENT.md` enrichi : documentation complète pour autonomie client (événements, horaires, menu, photos, téléphones)

### Corrections
- `contact/client.tsx` : import `Link` manquant ajouté
- `Icons.tsx` : `style?: CSSProperties` ajouté à `IconProps` ; prop appliquée sur IconProducteurs, IconViande, IconSaison

---

## v01.6 — "Élever le niveau visuel" (Mars 2026)

### Nouvelles fonctionnalités
- **FeaturedEventCard** refondée en bannière cinématique pleine largeur (480px) : image en fond avec parallax hover, 3 couches d'overlays, titre Fraunces clamp(2.2→4.2rem), CTA couleur accent avec box-shadow coloré
- **Piscine — réfraction lumineuse** : SVG animé en overlay (3 vagues CSS, 5 éclats sparkle, radiance turquoise) ; 4 keyframes nouvelles dans globals.css

### Améliorations
- **TroisUniversSection** : cards portrait 2/3 pleine hauteur, image en fond, sous-titre révélé au hover (max-height transition), trait accent pleine largeur, translateY(-6px) scale(1.01) au hover
- **La Table mobile** : miniature ambiance circulaire avec border gold, badge "Live" pulsant vert, box-shadow renforcée
- **Témoignages Réceptions** : guillemets géants (clamp 7→10rem, opacité 6%), citation Fraunces italic clamp(1.05→1.3rem), line-height 1.65
- **Les Photos** : propriété `isPortrait` sur 6 photos portrait, viewer ratio adaptatif 3/4 ou 16/9, object-contain → object-cover ; DernieresPhotosSection repositionnée avant la galerie

---

## v01.5 — "Désencombrer & corriger" (Mars 2026)

### Corrections majeures
- **EventPageCard** : description `line-clamp-2`, hauteur fixe `minHeight: 2.8rem`, fond par catégorie (CATEGORY_BG), trait accent qui s'étire au hover, badge spots pulsant si ≤ 15 places
- **FeaturedCard** : cachée quand filtre actif → bandeau "Filtre actif : [Catégorie]" avec bouton "Effacer" ; FeaturedCard uniquement en vue "Tous"
- **MiniCalendar onClick** : index `dateStr → eventId` en useMemo ; scroll précis vers `#event-{id}` correspondant
- **Privatisation** : intégrée dans la sidebar calendrier (Appeler + Envoyer votre idée) visible sans scroller

### Page Réceptions allégée
- Section Espaces (6 cards) → encart compact 2 lignes avec badges
- Témoignages : 4 → 2 (mariage + corporate), fond sombre pour contraste
- FAQ : 5 → 3 questions prioritaires

### Page La Table
- Section Philosophie : fond `#1E1008` uniforme (suppression dégradé cream), chiffres display 15% opacité (au lieu de 8%), icônes w-6/h-6 dans cercles w-14/h-14, transition propre vers Formules

### Page Contact
- 3 colonnes → 2 colonnes (Appeler + Écrire) — suppression doublon numéro de téléphone
- `useSearchParams` lit `?objet=` → pré-sélection automatique du select formulaire

---

## v01.4 — "Expérience sensorielle & finitions" (Mars 2026)

### Page Les Photos — refonte complète
- Photos réordonnées : narration émotionnelle (domaine → terrasse → piscine → pool parties → restaurant → réceptions)
- Lightbox fullscreen dédiée (composant) avec navigation clavier ←/→/Échap
- Mode Masonry : clip-path reveal `inset(100%→0%)` par colonne avec GSAP ScrollTrigger
- Viewer : icône loupe + hint "Cliquer pour agrandir"
- Encart Instagram avec hashtags + bouton gradient

### Page Contact — 3 upgrades
- Horaires en grille 2×4 : cards individuelles, jour actuel badge vert pulsant
- WhatsApp → card dédiée verte au même niveau que les numéros
- Bloc "Comment venir" : Parking en gold, cards cliquables → itinéraire Maps

---

## v01.3 — "Pages commerciales" (Mars 2026)

### Page La Table
- Bandeau semaine vivant : point vert pulsant + date + mentions fraîcheur
- Section Philosophie : chiffres display 52/100/0, icônes colorées, fonds translucides
- Formules : badge "✦ Recommandé" sur dernière formule, taille et shadow amplifiées
- Barre contexte mobile sticky : miniature ambiance + nb plats + fourchette prix

### Page Les Espaces
- Badges infos pratiques (capacité, saison, équipements) avec icônes SVG custom
- MiniGallery → Carrousel horizontal scrollable (snap) avec lightbox inline et dots
- CTA final personnalisé avec mosaïque 3 photos

### Page Réceptions
- Timeline cliquable 5 étapes avec star-celebrate au clic
- Transition cream → sombre avant formulaire + watermark losange JH

### Page Événements
- FeaturedEventCard grand format 2 colonnes
- MiniCalendar sticky en sidebar desktop
- CountdownTimer flip CSS 3D si événement < 14 jours
- Boutons Agenda (.ics) et Partager (clipboard)

---

## v01.2 — "Fondations système" (Mars 2026)

### Nouveaux composants
- `PageHero` : 4 variantes (`editorial`, `fullscreen`, `compact`, `gradient`)
- `CountdownTimer` : flip CSS 3D, aria-live, reduced-motion
- `MiniCalendar` : navigation mois, indicateurs événements
- `SectionReveal` : wrapper universel GSAP ScrollTrigger
- `useReveal` hook : 4 types d'animation (fade-up, fade-left, clip-reveal, stagger)

### Améliorations globals
- Keyframes centralisées dans globals.css : kenBurns, digit-flip, star-celebrate, clip-reveal-up, glow-gold
- Navbar : underline expand depuis le centre (clip-path)
- Footer : liens translateX + flèche au hover

---

## v01.1 — "Corrections critiques" (Mars 2026)

### Corrections
- Framer Motion entièrement supprimé → GSAP uniquement (CardStack réécrit CSS transitions + Pointer Events)
- `<img>` natifs → `next/image` dans SphereImageGrid et AlbumSection
- Keyframes témoignages inline → globals.css
- Logo SVG losange (initiales JH) dans Navbar + Footer
- Parallax Hero au scroll (GSAP scrub)
- BackToTop component
- Note Google → lien cliquable

---

## v1.7 — Version initiale de référence

Projet Next.js complet avec Hero WebGL WaterRipple, custom cursor magnétique, PageLoader rideau bilatéral, sphère 3D interactive (Fibonacci), CardStack 3D, témoignages défilants CSS, carte SVG haute fidélité Moineville, FloatingCTA tri-actions.
