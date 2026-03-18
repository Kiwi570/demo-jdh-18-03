/**
 * Point d'entrée GSAP centralisé
 * Tous les composants importent depuis ici — garantit que registerPlugin
 * est appelé UNE seule fois, avant tout mount de composant.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
