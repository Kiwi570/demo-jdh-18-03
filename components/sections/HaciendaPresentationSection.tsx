"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import SphereImageGrid, { type ImageData } from "@/components/ui/SphereImageGrid";

// ── Photos du domaine pour la sphère ──────────────────────────────────────────
const BASE_PHOTOS: Omit<ImageData, "id">[] = [
  { src: "/images/hero/hero-bg.jpg",              alt: "Les Jardins de l'Hacienda" },
  { src: "/images/espaces/terrasse.jpg",          alt: "La terrasse ombragée" },
  { src: "/images/espaces/restaurant.jpg",        alt: "La salle du restaurant" },
  { src: "/images/espaces/piscine.jpg",           alt: "Le domaine en été" },
  { src: "/images/espaces/pool-party.jpg",        alt: "Pool Party" },
  { src: "/images/espaces/visite.jpg",            alt: "Le domaine" },
  { src: "/images/receptions/mariage-1.jpg",      alt: "Mariage aux Jardins" },
  { src: "/images/receptions/mariage-2.jpg",      alt: "Réception" },
  { src: "/images/receptions/mariage-3.jpg",      alt: "Célébration" },
  { src: "/images/receptions/mariage-4.jpg",      alt: "Salle de réception" },
  { src: "/images/receptions/mariage-5.jpg",      alt: "Soirée privée" },
  { src: "/images/receptions/mariage-6.jpg",      alt: "Événement" },
  { src: "/images/chef/chef-portrait.avif",       alt: "Chef Régis Clauss" },
  { src: "/images/espaces/terrasse.jpg",          alt: "La grande terrasse" },
  { src: "/images/espaces/restaurant.jpg",        alt: "La Table" },
];

// Générer 45 images en répétant
const SPHERE_IMAGES: ImageData[] = Array.from({ length: 45 }, (_, i) => ({
  id: `sphere-${i}`,
  ...BASE_PHOTOS[i % BASE_PHOTOS.length],
}));

// ── Horaires résumés pour la fiche ─────────────────────────────────────────
const HORAIRES_COURTS = [
  { jour: "Lun",   heure: "Fermé" },
  { jour: "Mar",   heure: "19h – 22h" },
  { jour: "Mer",   heure: "19h – 22h" },
  { jour: "Jeu",   heure: "12h – 22h" },
  { jour: "Ven",   heure: "12h – 22h30" },
  { jour: "Sam",   heure: "12h – 22h30" },
  { jour: "Dim",   heure: "12h – 15h" },
];

export function HaciendaPresentationSection() {
  const sectionRef   = useRef<HTMLElement>(null);
  const [sphereSize, setSphereSize] = useState(660);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480)       setSphereSize(400);
      else if (w < 768)  setSphereSize(500);
      else if (w < 1024) setSphereSize(560);
      else               setSphereSize(660);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // gsap.set évite le flash d'éléments visibles avant l'animation
      gsap.set(".pres-reveal", { opacity: 0, y: 30 });
      gsap.fromTo(".pres-reveal",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const today = new Date().getDay(); // 0=dim, 1=lun...

  return (
    <section ref={sectionRef} className="py-section overflow-hidden" style={{ background: "#F5F0E8" }}>
      <div className="container-main">

        {/* Eyebrow centré */}
        <div className="pres-reveal opacity-0 text-center mb-14">
          <span className="eyebrow text-gold/70 mb-4 block">Le domaine</span>
          <h2 className="font-display font-bold text-terracotta tracking-tight"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)" }}>
            Les Jardins de <em className="italic text-rouge">l'Hacienda</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── GAUCHE : Carte de visite terracotta — order-2 sur mobile (sphère passe avant) ── */}
          <div className="pres-reveal opacity-0 flex justify-center lg:justify-start order-2 lg:order-1">
            <div
              className="relative flex flex-col justify-between overflow-hidden"
              style={{
                width: "clamp(300px, 90%, 420px)",
                minHeight: "520px",
                borderRadius: "20px",
                background: "linear-gradient(160deg, #2A1208 0%, #1E1008 50%, #150C06 100%)",
                boxShadow: "0 32px 80px rgba(15,8,5,0.35), 0 8px 24px rgba(15,8,5,0.2)",
                border: "1px solid rgba(201,169,110,0.15)",
              }}
            >
              {/* Décoration fond — cercles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute rounded-full"
                  style={{ width: "280px", height: "280px", top: "-80px", right: "-80px",
                    background: "radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)" }} />
                <div className="absolute rounded-full"
                  style={{ width: "200px", height: "200px", bottom: "-40px", left: "-60px",
                    background: "radial-gradient(circle, rgba(192,57,43,0.08) 0%, transparent 70%)" }} />
              </div>

              {/* Header */}
              <div className="relative z-10 px-8 pt-9">
                {/* Logo losange */}
                <div className="mb-7">
                  <div className="w-11 h-11 border border-gold/50 rotate-45 flex items-center justify-center mb-6">
                    <div className="w-2.5 h-2.5 bg-gold/70 rounded-full -rotate-45" />
                  </div>
                  <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold/50 mb-1.5">
                    Restaurant & Réceptions
                  </p>
                  <h3 className="font-display font-bold text-cream leading-tight"
                    style={{ fontSize: "1.6rem", letterSpacing: "-0.01em" }}>
                    Les Jardins<br />
                    <span className="text-gold" style={{ fontSize: "1.25rem" }}>de l'Hacienda</span>
                  </h3>
                </div>

                {/* Séparateur */}
                <div className="h-px mb-6" style={{ background: "linear-gradient(to right, rgba(201,169,110,0.35), transparent)" }} />

                {/* Infos adresse */}
                <div className="flex flex-col gap-4 mb-7">
                  {[
                    {
                      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                      text: "6 Vathier Haye · Moineville"
                    },
                    {
                      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.48 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.5 5.5l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                      text: "06 09 38 67 64"
                    },
                    {
                      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                      text: "Parking gratuit · Metz 20 min"
                    },
                  ].map(({ icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-gold/55 shrink-0">{icon}</span>
                      <span className="font-sans text-sm text-cream/65 tracking-wide">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Séparateur */}
                <div className="h-px mb-5" style={{ background: "linear-gradient(to right, rgba(201,169,110,0.2), transparent)" }} />

                {/* Horaires */}
                <div className="mb-2">
                  <p className="font-sans text-xs tracking-[0.2em] uppercase text-gold/45 mb-3">Horaires</p>
                  <div className="flex flex-col gap-1.5">
                    {HORAIRES_COURTS.map(({ jour, heure }, i) => {
                      const jourIndex = i;
                      const todayIndex = today === 0 ? 6 : today - 1;
                      const isToday = jourIndex === todayIndex;
                      const isFerme = heure === "Fermé";
                      return (
                        <div key={jour} className="flex items-center justify-between">
                          <span className="font-sans text-xs uppercase tracking-[0.14em]"
                            style={{ color: isToday ? "#C9A96E" : "rgba(245,240,232,0.35)", fontWeight: isToday ? "600" : "400" }}>
                            {jour}
                          </span>
                          <span className="font-sans text-xs"
                            style={{ color: isFerme ? "rgba(245,240,232,0.22)" : isToday ? "rgba(245,240,232,0.90)" : "rgba(245,240,232,0.55)" }}>
                            {heure}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 px-8 pb-8 pt-5" style={{ borderTop: "1px solid rgba(201,169,110,0.1)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} width="13" height="13" viewBox="0 0 24 24"
                          fill={s <= 4 ? "#C9A96E" : "none"} stroke="#C9A96E" strokeWidth="1.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      ))}
                    </div>
                    <p className="font-sans text-xs" style={{ color: "rgba(201,169,110,0.55)", letterSpacing: "0.08em" }}>
                      4,7 · 300+ avis Google
                    </p>
                  </div>
                  <Link href="/contact"
                    className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 transition-all duration-300 hover:opacity-80"
                    style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", borderRadius: "6px", color: "#C9A96E" }}>
                    Réserver
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── DROITE : Sphère photos — order-1 sur mobile (apparaît en premier) ── */}
          <div className="pres-reveal opacity-0 flex items-center justify-center order-1 lg:order-2" style={{ minHeight: "520px" }}>
            <div className="overflow-hidden w-full flex items-center justify-center">
            <div className="relative">
              {/* Label flottant */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="font-sans text-2xs tracking-[0.25em] uppercase text-terracotta/40">
                  · Faites tourner ·
                </span>
              </div>
              <SphereImageGrid
                images={SPHERE_IMAGES}
                containerSize={sphereSize}
                sphereRadius={Math.round(sphereSize * 0.41)}
                dragSensitivity={0.7}
                momentumDecay={0.96}
                maxRotationSpeed={5}
                baseImageScale={0.15}
                hoverScale={1.2}
                perspective={1000}
                autoRotate={true}
                autoRotateSpeed={0.18}
              />
            </div>
          </div>
          </div>

        </div>

        {/* ── CTA conclusion ── */}
        <div className="pres-reveal opacity-0 text-center mt-16 pt-12" style={{ borderTop: "1px solid rgba(30,16,8,0.1)" }}>
          <p className="font-heading font-light text-terracotta/55 text-lg mb-8 italic">
            Une table vous attend — ce soir ou bientôt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary px-10 py-4">
              Réserver une table
            </Link>
            <Link href="/les-espaces" className="btn-outline-terracotta px-10 py-4">
              Découvrir les espaces
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
