"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

export function ChefSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Photo — slide depuis la gauche
      gsap.fromTo(photoRef.current,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none none" } }
      );

      // Parallax léger sur la photo du Chef
      gsap.to(photoRef.current?.querySelector(".chef-photo-inner") ?? null, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Card — slide depuis la droite avec délai
      gsap.fromTo(cardRef.current?.querySelectorAll(".card-reveal") ?? [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.85, ease: "power3.out", delay: 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" } }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 overflow-hidden" style={{ background: "#EDE8DC" }}>
      <div className="container-main">

        {/* Layout : photo gauche + card superposée à droite */}
        <div className="relative flex flex-col lg:flex-row items-center lg:items-end gap-0">

          {/* ── PHOTO CHEF (gauche, grande) ── */}
          <div
            ref={photoRef}
            className="relative w-full lg:w-[55%] shrink-0"
            style={{ aspectRatio: "3/4", maxHeight: "680px" }}
          >
            {/* Ombre portée */}
            <div className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "0 32px 80px rgba(15,8,5,0.28), 0 8px 24px rgba(15,8,5,0.15)", zIndex: 1 }} />

            {/* Photo avec coins arrondis */}
            <div className="chef-photo-inner absolute inset-0 rounded-2xl overflow-hidden" style={{ zIndex: 2 }}>
              {/* Vidéo en boucle + fallback photo */}
              {/*
                INTÉGRATION VIDÉO :
                Déposer le fichier dans /public/videos/chef-cuisine.mp4
                (+ .webm pour compatibilité maximale)
                Format : portrait 4:5 (ex: 1080×1350px), H.264, 5-20s, muet
                Si le fichier est absent, la photo poster s'affiche seule.
              */}
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/images/chef/chef-portrait.avif"
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden="true"
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.display = "none";
                }}
              >
                <source src="/videos/chef-cuisine.webm" type="video/webm"/>
                <source src="/videos/chef-cuisine.mp4"  type="video/mp4"/>
              </video>
              {/* Photo fallback — visible pendant le chargement ou si pas de vidéo */}
              <Image
                src="/images/chef/chef-portrait.avif"
                alt="Chef Régis Clauss — Les Jardins de l'Hacienda"
                fill
                quality={90}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
                style={{
                  objectPosition: "50% 15%",
                  animation: "kenBurns 12s ease-in-out infinite alternate",
                  zIndex: -1,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-terracotta/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* ── Élément décoratif coin bas-droit — losange avec icône cuisine ── */}
            <div className="absolute z-10 hidden sm:block" style={{ bottom: "-16px", right: "-16px" }}>
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div
                  className="absolute inset-0 rotate-45 rounded-sm"
                  style={{ background: "#C0392B", opacity: 0.92, animation: "kenBurns 8s ease-in-out infinite alternate" }}
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="relative z-10 opacity-80">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/>
                  <path d="M18 15v7"/>
                </svg>
              </div>
            </div>

            {/* ── Élément décoratif coin haut-gauche — frame gold en L ── */}
            <div className="absolute z-10 hidden sm:block" style={{ top: "-16px", left: "-16px" }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M40 2 L2 2 L2 40" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
                <circle cx="2" cy="2" r="2.5" fill="#C9A96E" opacity="0.9"/>
              </svg>
            </div>

          </div>

          {/* ── CARD TEXTE (droite, superposée) ── */}
          <div
            ref={cardRef}
            className="relative xl:absolute xl:right-0 w-full lg:w-[55%] xl:w-[52%] rounded-2xl p-8 md:p-10 lg:p-12"
            style={{
              background: "#1E1008",
              boxShadow: "0 32px 80px rgba(15,8,5,0.35), 0 8px 24px rgba(15,8,5,0.2)",
              bottom: "0",
            }}
          >
            {/* Eyebrow */}
            <span className="card-reveal eyebrow text-gold/60 mb-3 block opacity-0">
              À la tête de notre cuisine
            </span>

            {/* Nom du Chef — très grand */}
            <h2
              className="card-reveal font-display font-bold text-cream tracking-tight leading-none mb-1 opacity-0"
              style={{ fontSize: "clamp(2.4rem, 4vw, 3.8rem)" }}
            >
              Régis Clauss
            </h2>

            {/* Titre */}
            <p className="card-reveal font-heading font-light text-gold/70 text-base mb-6 opacity-0">
              Chef de cuisine · Les Jardins de l&apos;Hacienda
            </p>

            {/* Séparateur */}
            <div className="card-reveal w-10 h-px bg-rouge mb-6 opacity-0" />

            {/* Description */}
            <p className="card-reveal font-heading font-light text-cream/65 text-base leading-relaxed mb-6 opacity-0">
              Passionné et créatif, Régis Clauss sublime les produits de saison pour offrir
              une cuisine authentique et pleine de caractère. Chaque semaine, il réinvente
              sa carte en s&apos;inspirant du terroir lorrain — et chaque plat est une invitation.
            </p>

            {/* Citation */}
            <blockquote
              className="card-reveal font-display font-medium italic text-cream/90 leading-snug mb-8 pl-6 border-l-4 border-rouge/80 opacity-0"
              style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)" }}
            >
              &ldquo;Le meilleur ingrédient que je connaisse,<br />c&apos;est le respect du produit.&rdquo;
            </blockquote>

            {/* Actions bas */}
            <div className="card-reveal flex items-center gap-4 flex-wrap opacity-0">
              {/* CTA principal */}
              <Link
                href="/la-table"
                data-cursor-text="VOIR"
                className="btn-primary px-7 py-3.5 text-sm"
              >
                Découvrir la carte
                <svg width="13" height="7" viewBox="0 0 16 8" fill="none" className="ml-2">
                  <path d="M0 4H14M10 1L14 4L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>

              {/* Séparateur */}
              <span className="text-cream/15 hidden sm:block">·</span>

              {/* Réseaux */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/lesjardinsdelhacienda54"
                  target="_blank" rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/50 transition-all duration-300 hover:bg-gold/5"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/lesjardinsdel.hacienda/"
                  target="_blank" rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/50 transition-all duration-300 hover:bg-gold/5"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a
                  href="https://www.tripadvisor.fr/Restaurant_Review-Les_Jardins_de_l_Hacienda-Moineville"
                  target="_blank" rel="noopener noreferrer"
                  aria-label="TripAdvisor"
                  className="w-9 h-9 rounded-full border border-cream/15 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/50 transition-all duration-300 hover:bg-gold/5"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 17c-1.49 0-2.75-.55-3.76-1.44l1.34-1.34C10.28 16.71 11.1 17 12 17s1.72-.29 2.42-.78l1.34 1.34C14.75 18.45 13.49 19 12 19zm5.5-5.5c0 1.38-.57 2.63-1.49 3.54l-1.33-1.33c.52-.6.82-1.38.82-2.21 0-1.93-1.57-3.5-3.5-3.5S8.5 11.57 8.5 13.5c0 .83.3 1.61.82 2.21l-1.33 1.33C7.07 16.13 6.5 14.88 6.5 13.5 6.5 10.46 8.96 8 12 8s5.5 2.46 5.5 5.5zM12 15.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>


      </div>
    </section>
  );
}

