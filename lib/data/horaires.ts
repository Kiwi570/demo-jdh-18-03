export const HORAIRES = [
  { jour: "Lundi",    midi: null,            soir: null,            ferme: true  },
  { jour: "Mardi",    midi: null,            soir: "19h00 – 22h00", ferme: false },
  { jour: "Mercredi", midi: null,            soir: "19h00 – 22h00", ferme: false },
  { jour: "Jeudi",    midi: "12h00 – 14h00", soir: "19h00 – 22h00", ferme: false },
  { jour: "Vendredi", midi: "12h00 – 14h00", soir: "19h00 – 22h30", ferme: false },
  { jour: "Samedi",   midi: "12h00 – 14h30", soir: "19h00 – 22h30", ferme: false },
  { jour: "Dimanche", midi: "12h00 – 15h00", soir: null,            ferme: false },
];

export const HORAIRES_FOOTER = HORAIRES.map(({ jour, midi, soir, ferme }) => ({
  jour,
  horaire: ferme
    ? "Fermé"
    : [midi, soir].filter(Boolean).join("  ·  "),
}));

export const DAY_MAP: Record<string, number> = {
  Dimanche: 0, Lundi: 1, Mardi: 2, Mercredi: 3,
  Jeudi: 4, Vendredi: 5, Samedi: 6,
};
