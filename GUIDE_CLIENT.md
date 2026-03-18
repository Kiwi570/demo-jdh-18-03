# Guide Client — Les Jardins de l'Hacienda

## Comment mettre à jour le site sans développeur

Ce guide vous permet de modifier les informations essentielles du site sans toucher au code complexe.
Tous les fichiers mentionnés se trouvent dans le dossier du projet.

---

## 📅 Modifier les événements

**Fichier :** `lib/data/events.ts`

Chaque événement est un objet dans le tableau `EVENTS`. Exemple :

```
{ 
  id: "1", 
  title: "Soirée Libanaise",
  category: "soiree-theme",   // soiree-theme | pool-party | diner-special | concert
  date: "Vendredi 28 Mars 2026",
  dateShort: "28 Mar 26",
  time: "19h30",
  price: 45,
  spots: 12,        // nombre de places restantes
  isSoldOut: false, // true = affiche "Complet" + liste d'attente
  desc: "Description de l'événement…"
}
```

**Pour ajouter un événement** : copiez un objet existant, changez l'`id` (numéro unique), et remplissez les champs.

**Pour marquer complet** : passez `isSoldOut: true` et `spots: 0`.

---

## ⏰ Modifier les horaires

**Fichier :** `lib/data/horaires.ts`

```
{ jour: "Lundi",    midi: null,          soir: null,          ferme: true  },
{ jour: "Mardi",    midi: null,          soir: null,          ferme: true  },
{ jour: "Mercredi", midi: "12h00-14h00", soir: "19h00-21h30", ferme: false },
// etc.
```

- `midi` et `soir` : créneaux horaires en texte libre, ou `null` si fermé ce service
- `ferme: true` : jour entièrement fermé (barré dans la grille)

---

## 🍽️ Modifier le menu / la carte

**Fichier :** `lib/data/menu.ts`

Structure :
```
entrées: [ { name: "Nom du plat", price: 12, desc: "Description", tag?: "Nouveau" } ]
plats:   [ ... ]
desserts: [ ... ]
```

Les `tag` acceptent : `"Chef"`, `"Nouveau"`, `"Végé"`, `"Signature"`.

---

## 💬 Modifier les témoignages (page Accueil)

**Fichier :** `lib/data/testimonials.ts`

Chaque avis :
```
{
  name: "Prénom N.",
  note: 5,
  text: "Texte de l'avis…",
  date: "Décembre 2025",
  tag:  "Déjeuner en famille",
}
```

---

## 🖼️ Ajouter ou remplacer des photos

**Dossiers :**
- `public/images/espaces/` — Photos des espaces (restaurant, terrasse, piscine…)
- `public/images/receptions/` — Photos de mariages et réceptions
- `public/images/hero/` — Photos du Hero (page d'accueil)

**Format recommandé :** JPEG ou AVIF, minimum 1200px de large, poids < 500Ko.

**Pour remplacer une photo** : gardez le même nom de fichier (ex : `terrasse.jpg`). Le site utilisera automatiquement la nouvelle version.

**Pour ajouter une photo dans la galerie** : ajoutez-la dans `app/les-photos/client.tsx` dans le tableau `PHOTOS` :
```
{ src: "/images/espaces/ma-photo.jpg", caption: "Légende", category: "terrasse" }
```
Categories disponibles : `table`, `terrasse`, `piscine`, `pool-party`, `receptions`.

---

## 📞 Modifier les numéros de téléphone

**Fichier :** `.env.local` (créez-le s'il n'existe pas, à partir de `.env.example`)

```
NEXT_PUBLIC_PHONE=0609386764
NEXT_PUBLIC_PHONE_EVENTS=0618212810
```

Les numéros apparaîtront automatiquement partout sur le site (FloatingCTA, Contact, Réceptions).

---

## 🗓️ Modifier la semaine en cours (bandeau La Table)

Le bandeau "Semaine du…" se calcule automatiquement à partir de la date du jour. Aucune modification nécessaire.

---

## 🚀 Relancer le site en local (pour vérifier vos changements)

```bash
cd ~/Downloads/Hacienda-Demo-v01.7
npm run dev
```

Ouvrez ensuite `http://localhost:3000` dans votre navigateur.

---

## 📤 Mettre en ligne les modifications

1. Modifiez le fichier concerné
2. Vérifiez sur `localhost:3000`
3. Poussez sur Git ou uploadez sur Vercel
4. Le site se redéploie automatiquement en 1-2 minutes

---

*Pour toute modification plus complexe (structure des pages, nouveaux espaces, changement de design), contactez votre développeur.*
