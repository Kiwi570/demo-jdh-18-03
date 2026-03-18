"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { WaterRipple } from "@/components/ui/WaterRipple";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef  = useRef<HTMLSpanElement>(null);
  const buttonsRef  = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const overlayRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("hacienda-loaded");
    const heroDelay = hasLoaded ? 0.15 : 2.1;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: heroDelay });

      tl.fromTo(overlayRef.current,
        { opacity: 0.85 },
        { opacity: 0.45, duration: 2.5, ease: "power2.out" }
      );

      tl.fromTo(eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=1.5"
      );

      if (titleRef.current) {
        const words = titleRef.current.querySelectorAll(".word");
        tl.fromTo(words,
          { y: "110%", opacity: 0 },
          { y: "0%", opacity: 1, stagger: 0.08, duration: 1, ease: "power4.out" },
          "-=0.4"
        );
      }

      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );

      tl.fromTo(buttonsRef.current?.children ?? [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      );

      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2"
      );

      // ── Parallax texte Hero au scroll ──
      gsap.to(".hero-content", {
        y: 80,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // ── Parallax léger sur le canvas/image ──
      gsap.to(".hero-image-layer", {
        y: 50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleWords = ["Une", "parenthèse", "hors", "du", "temps"];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* ── FALLBACK statique (si WebGL KO) ── */}
      <div className="absolute inset-0 hero-image-layer">
        <Image
          src="/images/hero/piscine-hero.avif"
          alt="La piscine des Jardins de l'Hacienda à Moineville"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* ── EFFET EAU WebGL — plein écran sur le conteneur ── */}
      <div className="hero-image-layer absolute inset-0">
        <WaterRipple
          src="/images/hero/piscine-hero.avif"
          blueish={0.35}
          scale={5}
          illumination={0.18}
          surfaceDistortion={0.03}
          waterDistortion={0.015}
        />
      </div>

      {/* ── OVERLAY unifié — un seul overlay combiné pour éviter l'empilement ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to top, rgba(15,8,5,0.95) 0%, rgba(15,8,5,0.65) 35%, rgba(15,8,5,0.45) 60%, rgba(15,8,5,0.30) 100%),
            radial-gradient(ellipse at 50% 60%, rgba(15,8,5,0.55) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── CONTENU ── */}
      <div className="hero-content relative z-10 text-center px-6 max-w-5xl mx-auto">
        <span ref={eyebrowRef} className="eyebrow text-terracotta mb-6 block opacity-0" style={{ color: "#1E1008" }}>
          Restaurant gastronomique · Moineville, Lorraine
        </span>

        <h1
          ref={titleRef}
          className="font-display font-extrabold text-cream leading-none mb-6 tracking-tight"
          style={{ fontSize: "clamp(3.2rem, 7.5vw, 8.5rem)", letterSpacing: "-0.01em" }}
        >
          {titleWords.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em] last:mr-0">
              <span className={`word inline-block opacity-0 ${i === titleWords.length - 1 ? "italic text-rouge-light" : ""}`}>
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div className="divider-gold opacity-70" />

        <p ref={subtitleRef} className="font-heading font-light text-cream/70 text-lg md:text-xl mb-10 opacity-0 tracking-wider italic">
          Une parenthèse lorraine où chaque repas laisse une trace.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn-primary px-10 py-4" data-magnetic data-cursor-text="RÉSERVER">
            Réserver une table
          </Link>
          <button
            className="group flex items-center gap-3 font-sans text-xs tracking-[0.28em] uppercase text-cream/50 hover:text-cream/80 transition-colors duration-400"
            data-cursor-hover
            onClick={() => document.getElementById("accroche")?.scrollIntoView({ behavior: "smooth" })}
          >
            Découvrir
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="group-hover:translate-y-1 transition-transform duration-400">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
        role="presentation"
        aria-hidden="true"
      >
        <span className="font-sans text-2xs tracking-[0.35em] uppercase text-cream/40">Les Jardins</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent animate-bounce-scroll" />
      </div>
    </section>
  );
}
