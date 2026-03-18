"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  "la-table": "La Table",
  "les-espaces": "Les Espaces",
  "receptions": "Réceptions & Mariages",
  "evenements": "Événements",
  "contact": "Contact",
  "mentions-legales": "Mentions légales",
};

export function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="absolute top-24 left-0 right-0 z-10 container-main"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link
            href="/"
            className="font-sans text-2xs tracking-[0.25em] uppercase text-cream/35 hover:text-gold/70 transition-colors duration-300"
          >
            Accueil
          </Link>
        </li>
        {segments.map((seg, i) => {
          const href = "/" + segments.slice(0, i + 1).join("/");
          const label = ROUTE_LABELS[seg] ?? seg;
          const isLast = i === segments.length - 1;
          return (
            <li key={href} className="flex items-center gap-2">
              <span className="text-cream/20 text-2xs">›</span>
              {isLast ? (
                <span
                  className="font-sans text-2xs tracking-[0.25em] uppercase text-gold/60"
                  aria-current="page"
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className="font-sans text-2xs tracking-[0.25em] uppercase text-cream/35 hover:text-gold/70 transition-colors duration-300"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
