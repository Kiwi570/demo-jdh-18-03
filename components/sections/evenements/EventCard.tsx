"use client";

/**
 * EventCard — une carte événement avec son tunnel de réservation intégré
 */

import Link from "next/link";
import {
  type BookingState,
  BOOKING_DEFAULT,
  CATEGORY_LABELS,
  EVENT_DETAILS,
  EVENT_THUMB,
  ACCENT,
} from "./types";
import {
  BookingDots,
  StepEventInfo,
  StepGuests,
  StepContact,
  StepConfirmation,
} from "./EventBookingSteps";

interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  price: number;
  spots: number;
  isSoldOut: boolean;
  desc: string;
}

interface EventCardProps {
  event: EventData;
  index: number;
  isOpen: boolean;
  booking: BookingState;
  onToggle: () => void;
  onPatch: (partial: Partial<BookingState>) => void;
  onConfirm: () => void;
}

export function EventCard({
  event,
  index,
  isOpen,
  booking,
  onToggle,
  onPatch,
  onConfirm,
}: EventCardProps) {
  const { id, title, category, date, time, price, spots, isSoldOut, desc } = event;

  const accent  = ACCENT[category]  ?? "#C9A96E";
  const details = EVENT_DETAILS[id];
  const imgSrc  = EVENT_THUMB[id]   ?? "/images/espaces/restaurant.jpg";
  const num     = String(index + 1).padStart(2, "0");
  const inFlow  = booking.step !== "idle";

  return (
    <div
      className="event-card opacity-0 overflow-hidden transition-all duration-500"
      style={{
        borderRadius: "12px",
        boxShadow: isOpen
          ? "0 20px 60px rgba(30,16,8,0.22), 0 4px 16px rgba(30,16,8,0.12)"
          : "0 4px 20px rgba(30,16,8,0.10)",
        transform: isOpen ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* ── En-tête photo cliquable ── */}
      <button
        onClick={onToggle}
        className="relative w-full text-left overflow-hidden focus:outline-none group block"
        style={{
          height: isOpen ? "200px" : "120px",
          transition: "height 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${imgSrc})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isOpen
              ? "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75))"
              : "linear-gradient(105deg, rgba(0,0,0,0.65), rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15))",
            transition: "background 0.5s ease",
          }}
        />
        {/* Trait de couleur à gauche */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: accent }} />
        {/* Numéro décoratif */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 font-display font-bold text-white/8 pointer-events-none select-none"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 1 }}
        >
          {num}
        </div>
        {/* Contenu texte */}
        <div className="relative z-10 h-full flex items-center px-6 md:px-8 gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span
                className="font-sans text-xs tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                style={{ background: `${accent}30`, color: "rgba(255,255,255,0.85)", border: `1px solid ${accent}60` }}
              >
                {CATEGORY_LABELS[category] ?? category}
              </span>
              {!isSoldOut && spots <= 15 && (
                <span className="font-sans text-xs text-white/70 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />{spots} places
                </span>
              )}
              {isSoldOut && <span className="font-sans text-xs text-white/50">Complet</span>}
            </div>
            <h3
              className="font-display font-bold text-white leading-tight tracking-tight"
              style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)" }}
            >
              {title}
            </h3>
            <div className="flex items-center gap-2.5 mt-1">
              <span className="font-sans text-sm text-white/65">{date}</span>
              <span className="text-white/25">·</span>
              <span className="font-sans text-sm text-white/65">{time}</span>
            </div>
          </div>
          {/* Prix + toggle */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="font-sans text-xs tracking-[0.1em] uppercase text-white/45 mb-0.5">Dès</p>
              <p className="font-display font-bold text-white leading-none" style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}>
                {price}<span className="text-lg">€</span>
              </p>
              <p className="font-sans text-xs text-white/40">/ pers.</p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-400"
              style={{
                background: isOpen ? accent : "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* ── Panneau déroulant ── */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isOpen ? "900px" : "0px" }}
      >
        <div className="bg-white px-6 pb-6 md:px-8 md:pb-7 pt-5">
          {!inFlow ? (
            /* Vue description + CTA de démarrage */
            <div>
              <p className="font-heading font-light text-stone/75 text-base leading-relaxed mb-5 max-w-2xl">{desc}</p>
              <div className="flex items-center gap-4 flex-wrap">
                {isSoldOut ? (
                  <Link href="/evenements" className="font-sans text-sm underline underline-offset-2" style={{ color: accent }}>
                    Liste d&apos;attente →
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => onPatch({ step: "s1" })}
                      className="inline-flex items-center gap-2.5 font-sans text-sm tracking-[0.1em] uppercase px-8 py-3.5 text-white rounded-xl transition-all duration-300 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
                      style={{ background: accent }}
                    >
                      Réserver ma place
                      <svg width="13" height="8" viewBox="0 0 16 8" fill="none"><path d="M0 4H14M10 1L14 4L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    </button>
                    <span className="font-sans text-xs text-stone/40">Paiement sécurisé · Réponse sous 24h</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Tunnel de réservation */
            <div>
              {booking.step !== "s4" && <BookingDots step={booking.step} accent={accent} />}

              {booking.step === "s1" && (
                <StepEventInfo
                  title={title} date={date} time={time} price={price}
                  spots={spots} accent={accent} details={details}
                  onNext={() => onPatch({ step: "s2" })}
                />
              )}
              {booking.step === "s2" && (
                <StepGuests
                  booking={booking} setBooking={onPatch} price={price} accent={accent}
                  onNext={() => onPatch({ step: "s3" })}
                  onBack={() => onPatch({ step: "s1" })}
                />
              )}
              {booking.step === "s3" && (
                <StepContact
                  booking={booking} setBooking={onPatch} price={price} accent={accent}
                  onConfirm={onConfirm}
                  onBack={() => onPatch({ step: "s2" })}
                />
              )}
              {booking.step === "s4" && (
                <StepConfirmation booking={booking} title={title} date={date} time={time} accent={accent} />
              )}

              {booking.step !== "s4" && (
                <button
                  onClick={() => onPatch({ ...BOOKING_DEFAULT })}
                  className="mt-4 w-full font-sans text-xs text-stone/30 hover:text-stone/55 transition-colors duration-300"
                >
                  ← Retour aux détails
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
