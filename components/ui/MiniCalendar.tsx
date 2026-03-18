"use client";

import { useState, useMemo } from "react";

const DAY_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const MONTH_NAMES = [
  "Janvier","Fevrier","Mars","Avril","Mai","Juin",
  "Juillet","Aout","Septembre","Octobre","Novembre","Decembre",
];

interface MiniCalendarProps {
  eventDates: string[];
  eventColors?: Record<string, string>;
  onDayClick?: (dateStr: string) => void;
  className?: string;
}

export function MiniCalendar({ eventDates, eventColors = {}, onDayClick, className = "" }: MiniCalendarProps) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const eventSet = useMemo(() => new Set(eventDates), [eventDates]);

  const firstDay    = new Date(year, month, 1);
  const lastDay     = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const fmt = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const goPrev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const goNext = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className={`block w-full select-none ${className}`}
      style={{ background: "rgba(30,16,8,0.04)", border: "1px solid rgba(30,16,8,0.1)", borderRadius: "12px", padding: "18px" }}>

      <div className="flex items-center justify-between mb-4">
        <button onClick={goPrev} aria-label="prev"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-terracotta/8 text-terracotta/40 hover:text-terracotta transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <p className="font-heading font-semibold text-terracotta" style={{ fontSize: "0.95rem" }}>
          {MONTH_NAMES[month]} {year}
        </p>
        <button onClick={goNext} aria-label="next"
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-terracotta/8 text-terracotta/40 hover:text-terracotta transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center font-sans font-medium text-terracotta/35"
            style={{ fontSize: "0.65rem", letterSpacing: "0.08em", padding: "3px 0" }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const dateStr     = fmt(day);
          const hasEvent    = eventSet.has(dateStr);
          const accentColor = eventColors[dateStr] ?? "#C0392B";
          const isToday     = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          const isPast      = new Date(dateStr) < today && !isToday;
          return (
            <button key={dateStr}
              onClick={() => {
                if (hasEvent) {
                  setSelectedDate(dateStr);
                  onDayClick?.(dateStr);
                }
              }}
              disabled={!hasEvent}
              aria-label={`${day}`}
              className="relative flex flex-col items-center justify-center rounded-lg transition-all duration-200"
              style={{
                height: "36px",
                cursor: hasEvent ? "pointer" : "default",
                background: selectedDate === dateStr ? accentColor : hasEvent ? `${accentColor}20` : isToday ? "rgba(192,57,43,0.12)" : "transparent",
                border: selectedDate === dateStr ? `1.5px solid ${accentColor}` : hasEvent ? `1.5px solid ${accentColor}50` : isToday ? "1.5px solid rgba(192,57,43,0.35)" : "1.5px solid transparent",
                boxShadow: selectedDate === dateStr ? `0 2px 12px ${accentColor}40` : hasEvent ? `0 2px 8px ${accentColor}20` : "none",
                transform: selectedDate === dateStr ? "scale(1.1)" : "scale(1)",
              }}>
              <span style={{
                fontSize: "0.8rem",
                fontWeight: hasEvent ? "700" : isToday ? "600" : "400",
                color: selectedDate === dateStr ? "white" : hasEvent ? accentColor : isToday ? "#C0392B" : isPast ? "rgba(30,16,8,0.2)" : "rgba(30,16,8,0.6)",
              }}>{day}</span>
              {hasEvent && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full"
                  style={{ width: "4px", height: "4px", background: accentColor, opacity: isPast ? 0.4 : 1 }} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3" style={{ borderTop: "1px solid rgba(30,16,8,0.08)" }}>
        <span className="w-2.5 h-2.5 rounded-full bg-rouge/70 shrink-0" />
        <span className="font-sans text-terracotta/50" style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Cliquer sur une date pour y aller
        </span>
      </div>
    </div>
  );
}
