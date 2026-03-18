"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const PHOTOS_DESKTOP = [
  // 7 polaroids — du plus en retrait au plus au premier plan (z: 0 → 3)
  // Sélection pour couvrir tous les univers sans doublon visuel
  { src: "/images/espaces/visite.jpg",       caption: "Le domaine",        rotate: -13, y: 18, z: 0 },
  { src: "/images/espaces/piscine.jpg",     caption: "La piscine",        rotate: -8,  y: 10, z: 1 },
  { src: "/images/receptions/mariage-1.jpg",   caption: "Réceptions",        rotate: -4,  y: 4,  z: 2 },
  { src: "/images/espaces/terrasse.jpg",        caption: "La terrasse",       rotate: -1,  y: 0,  z: 3 },
  { src: "/images/espaces/pool-party.jpg",      caption: "Pool Party",        rotate: 3,   y: 3,  z: 2 },
  { src: "/images/espaces/restaurant.jpg",          caption: "La Table",          rotate: 7,   y: 8,  z: 1 },
  { src: "/images/receptions/mariage-6.jpg",    caption: "Soirées",           rotate: 12,  y: 16, z: 0 },
];

// Mobile : 5 cartes seulement, sans les extrêmes z:0
const PHOTOS_MOBILE = PHOTOS_DESKTOP.slice(1, 6);

export function DernieresPhotosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hovered,  setHovered]  = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".fan-header > *",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".fan-card",
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const photos    = isMobile ? PHOTOS_MOBILE  : PHOTOS_DESKTOP;
  const centerIdx = isMobile ? 2              : 3;
  const SPACING   = isMobile ? 80             : 148;
  const HEIGHT    = isMobile ? 260            : 460;

  const cardSize = (i: number) => {
    const dist = Math.abs(i - centerIdx);
    if (isMobile) {
      if (dist === 0) return { w: 130, h: 180 };
      if (dist === 1) return { w: 108, h: 152 };
      return             { w:  88, h: 124 };
    }
    if (dist === 0) return { w: 220, h: 300 };
    if (dist === 1) return { w: 195, h: 270 };
    return               { w: 170, h: 240 };
  };

  return (
    <section ref={sectionRef} className="overflow-hidden pb-16 md:pb-20 pt-4" style={{ background: "#E8E2D6" }}>

      {/* Header */}
      <div className="fan-header container-main text-center mb-10 md:mb-14">
        <span className="eyebrow text-gold/70 mb-4 block">Galerie</span>
        <h2 className="font-display font-bold text-terracotta tracking-tight mb-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}>
          Dernières photos
        </h2>
        <p className="font-heading font-light text-terracotta/60 text-base md:text-lg max-w-sm mx-auto">
          Le domaine au fil des saisons — terrasse, piscine, cuisine et réceptions.
        </p>
      </div>

      {/* Éventail */}
      <div
        className="relative w-full flex items-end justify-center overflow-hidden"
        style={{ height: `${HEIGHT}px` }}
      >
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div style={{
            width: "500px", height: "260px",
            background: "radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 65%)",
          }} />
        </div>

        {photos.map((photo, i) => {
          const isHovered = hovered === i;
          const dist      = Math.abs(i - centerIdx);
          const isCenter  = dist === 0;
          const isCentral = dist <= (isMobile ? 1 : 2);
          const { w, h }  = cardSize(i);

          return (
            <div
              key={photo.src}
              className="fan-card absolute"
              style={{
                bottom:     "0px",
                left:       "50%",
                marginLeft: `${(i - centerIdx) * SPACING}px`,
                zIndex:     photo.z * 10 + (isHovered ? 50 : 0),
                transform:  `translateX(-50%) translateY(${isHovered ? -20 : photo.y}px) rotate(${isHovered ? photo.rotate * 0.25 : photo.rotate}deg) scale(${isHovered ? 1.06 : 1})`,
                transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s ease",
                opacity:    !isCentral ? 0.45 : isCenter ? 1 : 0.85,
                cursor:     "pointer",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                width: `${w}px`, height: `${h}px`,
                borderRadius: "12px", overflow: "hidden", position: "relative",
                boxShadow: isHovered
                  ? "0 24px 55px rgba(0,0,0,0.75), 0 0 0 1.5px rgba(201,169,110,0.5)"
                  : `0 ${8 + photo.z * 4}px ${28 + photo.z * 10}px rgba(0,0,0,0.6)`,
                transition: "box-shadow 0.4s ease",
              }}>
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  draggable={false}
                  sizes="(max-width: 768px) 130px, 220px"
                  className="object-cover"
                  style={{
                    transition: "transform 0.5s ease",
                    transform: isHovered ? "scale(1.08)" : "scale(1)",
                  }}
                />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(to top, rgba(15,8,5,0.70) 0%, transparent 55%)" }} />
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 z-10">
                  <p className="font-sans text-xs tracking-[0.18em] uppercase transition-all duration-300"
                    style={{ color: isHovered ? "rgba(201,169,110,0.95)" : "rgba(255,255,255,0.55)" }}>
                    {photo.caption}
                  </p>
                </div>
                <div className="absolute inset-0 pointer-events-none transition-all duration-300"
                  style={{ borderRadius: "12px", border: `1.5px solid ${isHovered ? "rgba(201,169,110,0.5)" : "transparent"}` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center mt-10 md:mt-12">
        <Link href="/les-espaces"
          className="inline-flex items-center gap-3 font-sans text-sm tracking-[0.18em] uppercase text-terracotta/60 hover:text-rouge border border-terracotta/20 hover:border-rouge/40 px-8 py-4 transition-all duration-300 hover:bg-rouge/5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
          Voir toutes les photos
          <svg width="14" height="7" viewBox="0 0 16 8" fill="none">
            <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </Link>
      </div>

    </section>
  );
}
