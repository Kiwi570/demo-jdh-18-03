"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { HORAIRES_FOOTER } from "@/lib/data/horaires";

export function CtaFinalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);
  const circle3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Cercles qui s'expand au scroll — partent de 0 scale
      gsap.fromTo([circle1Ref.current, circle2Ref.current, circle3Ref.current],
        { scale: 0.4, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.12,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Initialise les éléments à opacity 0 via GSAP (évite conflit Tailwind opacity-0)
      gsap.set(".cta-content > *", { opacity: 0, y: 30 });

      // Contenu texte
      gsap.fromTo(".cta-content > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // Rotation lente du cercle extérieur
      gsap.to(circle1Ref.current, {
        rotation: 360,
        duration: 60,
        ease: "none",
        repeat: -1,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-40"
      style={{ background: "#0f0805" }}
    >
      {/* ── FOND PHOTO — pool party nocturne, tons chauds et festifs ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/espaces/pool-party.jpg"
          alt=""
          fill
          quality={60}
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.38, filter: "saturate(0.7) brightness(0.50) hue-rotate(-10deg)" }}
          aria-hidden="true"
        />
      </div>
      {/* ── FOND : grain + lueur centrale ─────────────────────── */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(50,22,8,0.75) 0%, rgba(15,8,5,0.95) 65%)",
        }}
      />
      <div
        className="absolute inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── CERCLES DÉCORATIFS — très grands, bien en arrière ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">

        {/* Cercle 1 — le plus grand, pointillés */}
        <div
          ref={circle1Ref}
          className="absolute rounded-full opacity-0"
          style={{
            width: "min(900px, 130vw)",
            height: "min(900px, 130vw)",
            border: "1px dashed rgba(201,169,110,0.08)",
          }}
        />

        {/* Cercle 2 — trait fin */}
        <div
          ref={circle2Ref}
          className="absolute rounded-full opacity-0"
          style={{
            width: "min(660px, 95vw)",
            height: "min(660px, 95vw)",
            border: "1px solid rgba(201,169,110,0.10)",
          }}
        />

        {/* Cercle 3 — plus épais, plus proche du contenu */}
        <div
          ref={circle3Ref}
          className="absolute rounded-full opacity-0"
          style={{
            width: "min(420px, 60vw)",
            height: "min(420px, 60vw)",
            border: "1px solid rgba(201,169,110,0.14)",
          }}
        />

        {/* Lueur centrale */}
        <div
          className="absolute rounded-full"
          style={{
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(201,169,110,0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── LIGNE DORÉE HAUT ──────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-px z-[3]"
        style={{ background: "linear-gradient(to right, transparent, rgba(192,57,43,0.35), transparent)" }}
      />

      {/* ── CONTENU ───────────────────────────────────────────── */}
      <div className="relative z-[4] container-main">
        <div className="cta-content max-w-2xl mx-auto text-center">

          {/* Eyebrow */}
          <span className="eyebrow text-gold/50 mb-8 block">
            Réservation
          </span>

          {/* Titre */}
          <h2
            className="font-display font-bold text-cream mb-6 tracking-tight"
            style={{ fontSize: "clamp(3rem, 6.5vw, 6.5rem)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
          >
            Votre prochain souvenir<br />
            <em className="italic text-rouge-light">commence ici.</em>
          </h2>

          {/* Séparateur */}
          <div className="h-px mx-auto mb-8" style={{ width: "80px", background: "linear-gradient(to right, transparent, #C9A96E, transparent)" }} />

          {/* Texte */}
          <p className="font-heading font-light text-cream/60 text-xl mb-12 max-w-sm mx-auto leading-relaxed">
            Une table dressée, une cuisine vivante, un lieu hors du temps — ce soir ou bientôt.
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/contact" data-magnetic data-cursor-text="RÉSERVER" className="btn-primary px-10 py-4 text-sm">
              Réserver ma table
            </Link>
            <a href="tel:0609386764" data-cursor-text="APPELER" className="btn-ghost px-10 py-4 text-sm">
              06 09 38 67 64
            </a>
          </div>

          {/* Séparateur fin */}
          <div className="w-full h-px mb-10"
            style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.15), transparent)" }}
          />

          {/* Horaires */}
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {HORAIRES_FOOTER.filter(h => h.horaire !== "Fermé").map(({ jour, horaire }) => (
              <div key={jour} className="text-center">
                <p className="font-sans text-sm tracking-[0.15em] uppercase text-cream/55 mb-1">{jour}</p>
                <p className="font-sans text-base text-cream/70">{horaire}</p>
              </div>
            ))}
          </div>

          {/* Mention fermé lundi */}
          <p className="font-sans text-xs text-cream/40 mt-6 tracking-[0.3em]">
            Fermé le lundi
          </p>

        </div>
      </div>

      {/* ── LIGNE DORÉE BAS ───────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-px z-[3]"
        style={{ background: "linear-gradient(to right, transparent, rgba(201,169,110,0.15), transparent)" }}
      />
    </section>
  );
}
