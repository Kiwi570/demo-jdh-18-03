"use client";

/**
 * CountdownTimer — Compte à rebours avec animation flip CSS 3D
 *
 * Usage :
 *   <CountdownTimer targetDate="2026-07-18T20:00:00" label="Soirée Libanaise" />
 *
 * - Chaque chiffre fait un flip 3D quand il change
 * - S'arrête gracieusement à "00 · 00 · 00 · 00" une fois la date passée
 * - Respecte prefers-reduced-motion (flip désactivé, chiffres mis à jour directement)
 * - Accessible : aria-live="polite" pour les lecteurs d'écran
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface TimeLeft {
  days:    number;
  hours:   number;
  minutes: number;
  seconds: number;
}

interface FlipDigitProps {
  value:        string;
  prevValue:    string;
  isFlipping:   boolean;
  reduceMotion: boolean;
}

function FlipDigit({ value, prevValue, isFlipping, reduceMotion }: FlipDigitProps) {
  return (
    <div
      className="relative inline-block font-display font-bold text-cream leading-none"
      style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)", minWidth: "2ch", textAlign: "center" }}
      aria-hidden="true"
    >
      {/* Face statique — valeur courante */}
      <span
        style={{
          display: "block",
          transition: reduceMotion ? "none" : "opacity 0.15s ease",
          opacity: isFlipping && !reduceMotion ? 0 : 1,
        }}
      >
        {value}
      </span>

      {/* Face flip — valeur précédente qui s'en va */}
      {!reduceMotion && isFlipping && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "digit-flip-out 0.3s ease forwards",
            transformOrigin: "50% 0%",
          }}
        >
          {prevValue}
        </span>
      )}
    </div>
  );
}

interface UnitProps {
  value:        number;
  label:        string;
  prevValue:    number;
  isFlipping:   boolean;
  reduceMotion: boolean;
}

function CountUnit({ value, label, prevValue, isFlipping, reduceMotion }: UnitProps) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex items-center justify-center px-3 py-2"
        style={{
          background: "rgba(201,169,110,0.08)",
          border:     "1px solid rgba(201,169,110,0.2)",
          borderRadius: "6px",
          minWidth:   "56px",
        }}
      >
        <FlipDigit
          value={pad(value)}
          prevValue={pad(prevValue)}
          isFlipping={isFlipping}
          reduceMotion={reduceMotion}
        />
      </div>
      <span
        className="font-sans uppercase tracking-[0.2em] text-gold/50"
        style={{ fontSize: "0.55rem" }}
      >
        {label}
      </span>
    </div>
  );
}

interface CountdownTimerProps {
  targetDate:  string;  // ISO string : "2026-07-18T20:00:00"
  label?:      string;  // Libellé accessible
  className?:  string;
  compact?:    boolean; // Affichage condensé (sans labels)
}

export function CountdownTimer({
  targetDate,
  label     = "Compte à rebours",
  className = "",
  compact   = false,
}: CountdownTimerProps) {
  const computeTimeLeft = useCallback((): TimeLeft => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  }, [targetDate]);

  const [time,     setTime]     = useState<TimeLeft>(computeTimeLeft);
  const [prevTime, setPrevTime] = useState<TimeLeft>(computeTimeLeft);
  const [flipping, setFlipping] = useState({ days: false, hours: false, minutes: false, seconds: false });
  const reduceMotion = useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  ).current;

  useEffect(() => {
    const tick = () => {
      const next = computeTimeLeft();
      setPrevTime(time);
      setFlipping({
        days:    next.days    !== time.days,
        hours:   next.hours   !== time.hours,
        minutes: next.minutes !== time.minutes,
        seconds: next.seconds !== time.seconds,
      });
      setTime(next);
      // Reset flip après animation
      setTimeout(() => setFlipping({ days: false, hours: false, minutes: false, seconds: false }), 350);
    };

    // Stop si date passée
    if (new Date(targetDate).getTime() <= Date.now()) return;

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [computeTimeLeft, targetDate, time]);

  const units = [
    { key: "days",    value: time.days,    prev: prevTime.days,    label: "Jours"   },
    { key: "hours",   value: time.hours,   prev: prevTime.hours,   label: "Heures"  },
    { key: "minutes", value: time.minutes, prev: prevTime.minutes, label: "Min"     },
    { key: "seconds", value: time.seconds, prev: prevTime.seconds, label: "Sec"     },
  ] as const;

  // Mode compact — affichage inline minimaliste
  if (compact) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      <div className="flex items-center gap-1" aria-hidden="true">
        {units.map(({ key, value }, i) => (
          <span key={key} className="flex items-center gap-1">
            <span className="font-display font-bold text-cream" style={{ fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
              {pad(value)}
            </span>
            {i < units.length - 1 && (
              <span className="text-gold/40 text-xs">·</span>
            )}
          </span>
        ))}
        <span className="font-sans text-xs text-gold/50 ml-1 tracking-wide">j · h · m · s</span>
      </div>
    );
  }

  // Accessible live region
  const ariaText = `${time.days} jours, ${time.hours} heures, ${time.minutes} minutes, ${time.seconds} secondes`;

  return (
    <div className={`inline-flex flex-col items-center gap-3 ${className}`}>
      {/* Texte pour lecteurs d'écran */}
      <span className="sr-only" aria-live="polite" aria-label={label}>
        {ariaText}
      </span>

      {/* Affichage visuel */}
      <div className="flex items-start gap-2" aria-hidden="true">
        {units.map(({ key, value, prev, label: unitLabel }, i) => (
          <div key={key} className="flex items-start gap-2">
            <CountUnit
              value={value}
              label={compact ? "" : unitLabel}
              prevValue={prev}
              isFlipping={flipping[key]}
              reduceMotion={reduceMotion}
            />
            {i < units.length - 1 && (
              <span
                className="font-display font-bold text-gold/30 self-start pt-2"
                style={{ fontSize: "1.2rem", lineHeight: 1 }}
              >
                ·
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
