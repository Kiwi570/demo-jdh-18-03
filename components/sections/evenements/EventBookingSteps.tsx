"use client";

/**
 * Tunnel de réservation événement — 4 étapes
 * Dots → S1 (infos) → S2 (participants) → S3 (coordonnées) → S4 (confirmation)
 */

import Link from "next/link";
import { type BookingState, type Step, EMAIL_REGEX } from "./types";

// ── Barre de progression ──────────────────────────────────────────────────────
export function BookingDots({ step, accent }: { step: Step; accent: string }) {
  const steps: Step[] = ["s1", "s2", "s3", "s4"];
  const cur = steps.indexOf(step);
  return (
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-1.5">
          <div
            className="transition-all duration-400 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              width: i === cur ? "26px" : "7px",
              height: "7px",
              background: i < cur ? accent : i === cur ? accent : "rgba(30,16,8,0.12)",
            }}
          >
            {i < cur && (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          {i < 3 && <div className="w-5 h-px" style={{ background: i < cur ? accent : "rgba(30,16,8,0.1)" }} />}
        </div>
      ))}
    </div>
  );
}

// ── Étape 1 : Récapitulatif de l'événement ────────────────────────────────────
export function StepEventInfo({
  title, date, time, price, spots, accent, onNext,
  details,
}: {
  title: string; date: string; time: string; price: number; spots: number;
  accent: string; onNext: () => void;
  details?: { lieu: string; duree: string; inclus: string; dress?: string };
}) {
  const rows = [
    { icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, label: "Heure",  val: time },
    { icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, label: "Date",   val: date.split(" ").slice(1).join(" ") },
    { icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>, label: "Lieu",   val: details?.lieu  ?? "—" },
    { icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, label: "Durée",  val: details?.duree ?? "—" },
  ];

  return (
    <div className="animate-fadeIn">
      <p className="font-sans text-xs tracking-[0.2em] uppercase mb-4" style={{ color: accent }}>Votre événement</p>
      <div className="rounded-2xl overflow-hidden mb-5 border border-terracotta/10">
        <div className="p-5" style={{ background: `${accent}10` }}>
          <h4 className="font-display font-bold text-terracotta text-xl tracking-tight mb-4">{title}</h4>
          <div className="grid grid-cols-2 gap-4">
            {rows.map(({ icon, label, val }) => (
              <div key={label} className="flex items-start gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" className="mt-0.5 shrink-0">{icon}</svg>
                <div>
                  <p className="font-sans text-xs text-stone/40 mb-0.5">{label}</p>
                  <p className="font-sans text-sm text-terracotta font-medium">{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white divide-y divide-terracotta/6">
          {details && [
            { label: "Inclus",     val: details.inclus },
            ...(details.dress ? [{ label: "Dress code", val: details.dress }] : []),
          ].map(({ label, val }) => (
            <div key={label} className="flex justify-between items-center px-4 py-2.5">
              <span className="font-sans text-xs text-stone/40">{label}</span>
              <span className="font-sans text-sm text-terracotta">{val}</span>
            </div>
          ))}
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="font-sans text-xs text-stone/40">Tarif</span>
            <span className="font-sans text-sm font-bold" style={{ color: accent }}>{price}€ / pers.</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="font-sans text-xs text-stone/40">Disponibilité</span>
            <span className="flex items-center gap-1.5 font-sans text-sm text-terracotta">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{spots} places restantes
            </span>
          </div>
        </div>
      </div>
      <button onClick={onNext}
        className="w-full py-4 text-white font-sans text-sm tracking-[0.1em] uppercase rounded-xl transition-all duration-300 hover:opacity-90 hover:shadow-lg flex items-center justify-center gap-3"
        style={{ background: accent }}>
        Je réserve
        <svg width="14" height="8" viewBox="0 0 16 8" fill="none"><path d="M0 4H14M10 1L14 4L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}

// ── Étape 2 : Nombre de participants ─────────────────────────────────────────
export function StepGuests({
  booking, setBooking, price, accent, onNext, onBack,
}: {
  booking: BookingState; setBooking: (p: Partial<BookingState>) => void;
  price: number; accent: string; onNext: () => void; onBack: () => void;
}) {
  const total = booking.guests * price;
  return (
    <div className="animate-fadeIn">
      <h4 className="font-display font-bold text-terracotta text-xl mb-1 tracking-tight">Combien serez-vous ?</h4>
      <p className="font-sans text-sm text-stone/50 mb-6">Prix calculé par personne</p>
      <div className="flex items-center justify-center gap-8 mb-6">
        <button onClick={() => setBooking({ guests: Math.max(1, booking.guests - 1) })}
          className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl font-light transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ borderColor: accent, color: accent }}>−</button>
        <div className="text-center">
          <div className="font-display font-bold text-terracotta" style={{ fontSize: "3.5rem", lineHeight: 1 }}>{booking.guests}</div>
          <div className="font-sans text-xs text-stone/45 mt-1">{booking.guests > 1 ? "personnes" : "personne"}</div>
        </div>
        <button onClick={() => setBooking({ guests: Math.min(20, booking.guests + 1) })}
          className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-2xl font-light transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ borderColor: accent, color: accent }}>+</button>
      </div>
      <div className="rounded-2xl p-4 mb-6 flex items-center justify-between"
        style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
        <div>
          <p className="font-sans text-xs text-stone/50">{booking.guests} × {price}€</p>
          <p className="font-sans text-xs text-stone/35 mt-0.5">Règlement sur place le soir de l&apos;événement</p>
        </div>
        <div className="text-right">
          <p className="font-sans text-xs text-stone/40 mb-0.5">Total</p>
          <p className="font-display font-bold text-2xl" style={{ color: accent }}>{total}€</p>
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="w-12 h-12 rounded-xl border flex items-center justify-center text-stone/50 hover:text-stone transition-all" style={{ borderColor: "rgba(30,16,8,0.15)" }}>←</button>
        <button onClick={onNext}
          className="flex-1 py-3.5 text-white font-sans text-sm tracking-[0.1em] uppercase rounded-xl transition-all duration-300 hover:opacity-90 hover:shadow-lg flex items-center justify-center gap-3"
          style={{ background: accent }}>
          Continuer
          <svg width="14" height="8" viewBox="0 0 16 8" fill="none"><path d="M0 4H14M10 1L14 4L10 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}

// ── Étape 3 : Coordonnées + récapitulatif ─────────────────────────────────────
export function StepContact({
  booking, setBooking, price, accent, onConfirm, onBack,
}: {
  booking: BookingState; setBooking: (p: Partial<BookingState>) => void;
  price: number; accent: string; onConfirm: () => void; onBack: () => void;
}) {
  const total     = booking.guests * price;
  const emailOk   = EMAIL_REGEX.test(booking.email);
  const infoValid = !!(booking.prenom && booking.nom && emailOk);

  const CheckMark = ({ ok }: { ok: boolean }) =>
    ok ? (
      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    ) : null;

  return (
    <div className="animate-fadeIn">
      {/* Bloc 1 : Coordonnées */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-sans text-xs font-bold shrink-0"
            style={{ background: infoValid ? accent : "rgba(30,16,8,0.15)", color: infoValid ? "white" : "rgba(30,16,8,0.4)" }}>
            {infoValid
              ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
              : "1"}
          </div>
          <h4 className="font-display font-bold text-terracotta text-lg tracking-tight">Vos coordonnées</h4>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {(["prenom", "nom"] as const).map(field => (
              <div key={field} className="relative">
                <input type="text" value={booking[field]}
                  onChange={e => setBooking({ [field]: e.target.value })}
                  placeholder={field === "prenom" ? "Prénom" : "Nom"}
                  className="w-full px-4 py-3.5 bg-cream border rounded-xl font-sans text-sm text-terracotta placeholder-stone/35 focus:outline-none transition-all"
                  style={{ borderColor: booking[field] ? accent : "rgba(30,16,8,0.15)" }} />
                <CheckMark ok={!!booking[field]} />
              </div>
            ))}
          </div>
          <div className="relative">
            <input type="email" value={booking.email}
              onChange={e => setBooking({ email: e.target.value })}
              placeholder="Votre adresse email"
              className="w-full px-4 py-3.5 bg-cream border rounded-xl font-sans text-sm text-terracotta placeholder-stone/35 focus:outline-none transition-all"
              style={{ borderColor: emailOk ? accent : "rgba(30,16,8,0.15)" }} />
            <CheckMark ok={emailOk} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: `${accent}40` }} />
        <div className="flex-1 h-px" style={{ background: `${accent}20` }} />
      </div>

      {/* Bloc 2 : Récapitulatif */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 rounded-full flex items-center justify-center font-sans text-xs font-bold shrink-0"
            style={{ background: "rgba(30,16,8,0.12)", color: "rgba(30,16,8,0.4)" }}>2</div>
          <h4 className="font-display font-bold text-terracotta text-lg tracking-tight">Récapitulatif</h4>
          <span className="ml-auto font-display font-bold text-xl" style={{ color: accent }}>{total}€</span>
        </div>
        <div className="rounded-2xl overflow-hidden mb-4 border border-terracotta/10">
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ background: `${accent}0A` }}>
            <p className="font-sans text-xs text-stone/55">{booking.guests} personne{booking.guests > 1 ? "s" : ""} × {price}€</p>
            <p className="font-display font-bold text-xl" style={{ color: accent }}>{total}€</p>
          </div>
          <div className="bg-white px-5 py-4 flex items-start gap-3 border-t border-terracotta/6">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${accent}15` }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
                <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-terracotta mb-0.5">Règlement sur place</p>
              <p className="font-sans text-xs text-stone/55 leading-relaxed">Aucun prépaiement requis. Le règlement s&apos;effectue le soir de l&apos;événement à l&apos;accueil.</p>
            </div>
          </div>
          <div className="px-5 py-3 flex items-center gap-2.5 border-t border-terracotta/6" style={{ background: "rgba(201,169,110,0.04)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <p className="font-sans text-xs text-stone/40">Confirmation envoyée par email sous 24h</p>
          </div>
        </div>
        <div className="flex items-center gap-5 mb-5 flex-wrap">
          {[
            { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,              label: "Réservation sécurisée" },
            { icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>, label: "Réponse sous 24h" },
            { icon: <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>, label: "Annulation gratuite" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">{icon}</svg>
              <span className="font-sans text-xs text-stone/45">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="w-12 h-12 rounded-xl border flex items-center justify-center text-stone/50 hover:text-stone transition-all" style={{ borderColor: "rgba(30,16,8,0.15)" }}>←</button>
        <button onClick={onConfirm} disabled={!infoValid || booking.loading}
          className="flex-1 py-4 text-white font-sans text-sm tracking-[0.1em] uppercase rounded-xl transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          style={{ background: accent }}>
          {booking.loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi en cours…</>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Confirmer ma réservation
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Étape 4 : Confirmation ────────────────────────────────────────────────────
export function StepConfirmation({
  booking, title, date, time, accent,
}: {
  booking: BookingState; title: string; date: string; time: string; accent: string;
}) {
  return (
    <div className="animate-fadeIn text-center">
      <div className="relative flex items-center justify-center mb-5" style={{ height: "80px" }}>
        {[64, 50, 38].map((size, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: size, height: size,
              border: `${i === 2 ? 2 : 1}px solid ${accent}${i === 0 ? "18" : i === 1 ? "30" : "60"}`,
              animation: `pulse-ring ${1.6 + i * 0.3}s ease-in-out infinite`,
            }} />
        ))}
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: accent }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <h4 className="font-display font-bold text-terracotta text-2xl mb-1">Merci {booking.prenom} !</h4>
      <p className="font-sans text-sm text-stone/55 mb-5">Votre réservation est enregistrée 🎉</p>

      <div className="rounded-2xl overflow-hidden mb-5 text-left border border-terracotta/10">
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: `${accent}10` }}>
          <div>
            <p className="font-display font-semibold text-terracotta">{title}</p>
            <p className="font-sans text-xs text-stone/50">{date} · {time}</p>
          </div>
          <span className="font-sans text-xs px-3 py-1.5 rounded-full text-white" style={{ background: accent }}>
            {booking.guests} pers.
          </span>
        </div>
        <div className="bg-white divide-y divide-terracotta/6">
          {[
            { label: "Réf. réservation",      val: <span className="font-mono font-bold tracking-widest">{booking.bookingRef}</span> },
            { label: "Règlement",              val: <span className="text-stone/60">Sur place le soir de l&apos;événement</span> },
            { label: "Confirmation envoyée à", val: booking.email },
          ].map(({ label, val }) => (
            <div key={label} className="flex justify-between items-center px-4 py-2.5">
              <span className="font-sans text-xs text-stone/40">{label}</span>
              <span className="font-sans text-sm text-terracotta">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <a
        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent("Les Jardins de l'Hacienda — Réf. " + booking.bookingRef)}`}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-sans text-sm text-stone/60 hover:text-stone transition-all duration-300 mb-3"
        style={{ borderColor: "rgba(30,16,8,0.15)" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Ajouter à mon calendrier
      </a>
      <p className="font-sans text-xs text-stone/30">À très bientôt aux Jardins de l&apos;Hacienda 🌿</p>
    </div>
  );
}
