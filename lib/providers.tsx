"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Lenis from "lenis";
import { PageLoader }      from "@/components/ui/PageLoader";
import { CustomCursor }    from "@/components/ui/CustomCursor";
import { CookieBanner }    from "@/components/ui/CookieBanner";
import { FloatingCTA }     from "@/components/ui/FloatingCTA";
import { PageTransition }  from "@/components/ui/PageTransition";
import { ScrollProgress }  from "@/components/ui/ScrollProgress";


export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    (window as any).__lenis = lenis;

    return () => { lenis.destroy(); };
  }, []);

  return (
    <>
      <ScrollProgress />
      <PageLoader />
      <CustomCursor />
      <CookieBanner />
      <FloatingCTA />
      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}
