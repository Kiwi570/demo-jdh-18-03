"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function NotFound() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".nf-el", { opacity: 0, y: 30 });
      gsap.fromTo(
        ".nf-el",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.9, ease: "power3.out", delay: 0.2 },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center justify-center overflow-hidden relative"
      style={{ background: "#0f0805" }}
    >
      {/* Lueur centrale */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)" }}
        />
      </div>

      {/* Ligne or haut */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.4), transparent)" }}
      />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

        {/* Eyebrow */}
        <span className="nf-el eyebrow text-gold/50 mb-6 block">
          Page introuvable
        </span>

        {/* Numéro 404 décoratif */}
        <div className="nf-el mb-4" aria-hidden="true">
          <span
            className="font-display font-extrabold select-none"
            style={{
              fontSize: "clamp(8rem, 20vw, 16rem)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
              color: "rgba(245,240,232,0.05)",
            }}
          >
            404
          </span>
        </div>

        {/* Séparateur */}
        <div className="nf-el w-16 h-px bg-gold/40 mx-auto mb-8" />

        {/* Titre principal */}
        <h1
          className="nf-el font-display font-bold text-cream mb-4"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
        >
          Cette page s&apos;est égarée<br />
          <em className="italic text-gold">quelque part en Lorraine</em>
        </h1>

        <p className="nf-el font-heading font-light text-cream/50 text-lg mb-10 leading-relaxed max-w-md mx-auto">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
          Laissez-nous vous guider vers les bonnes adresses.
        </p>

        {/* CTA principaux */}
        <div className="nf-el flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary px-8 py-3">
            Retour à l&apos;accueil
          </Link>
          <Link href="/contact" className="btn-ghost px-8 py-3">
            Nous contacter
          </Link>
        </div>

        {/* Navigation secondaire */}
        <nav className="nf-el mt-12" aria-label="Pages principales">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 list-none">
            {[
              { label: "La Table",    href: "/la-table" },
              { label: "Les Espaces", href: "/les-espaces" },
              { label: "Réceptions",  href: "/receptions" },
              { label: "Événements",  href: "/evenements" },
              { label: "Les Photos",  href: "/les-photos" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-sans text-xs tracking-[0.2em] uppercase text-cream/30 hover:text-gold transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Info contact discrète */}
        <div className="nf-el mt-10 flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gold/15" />
          <a
            href="tel:0609386764"
            className="font-sans text-xs tracking-[0.25em] text-cream/25 hover:text-gold/60 transition-colors duration-300"
          >
            06 09 38 67 64
          </a>
        </div>
      </div>

      {/* Ligne or bas */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.25), transparent)" }}
      />
    </div>
  );
}
