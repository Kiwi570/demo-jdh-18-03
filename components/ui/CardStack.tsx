"use client";

/**
 * CardStack — v01.1
 * Réécriture complète sans Framer Motion.
 * Animations via CSS transitions (cubic-bezier spring) + drag via Pointer Events API.
 */

import * as React from "react";
import Image from "next/image";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  /** Ignoré (compat API) — spring via CSS cubic-bezier */
  springStiffness?: number;
  /** Ignoré (compat API) — spring via CSS cubic-bezier */
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 480,
  cardHeight = 300,
  overlap = 0.48,
  spreadDeg = 44,
  perspectivePx = 1100,
  depthPx = 130,
  tiltXDeg = 10,
  activeLiftPx = 20,
  activeScale = 1.03,
  inactiveScale = 0.93,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const len = items.length;

  const [active, setActive]         = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering]     = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState(0);

  const isDragging    = React.useRef(false);
  const dragStartX    = React.useRef(0);
  const dragStartTime = React.useRef(0);
  const didDrag       = React.useRef(false);

  const prefersReduced = React.useMemo(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  []);

  React.useEffect(() => { setActive(a => wrapIndex(a, len)); }, [len]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (!len) return; onChangeIndex?.(active, items[active]!); }, [active]);

  const maxOffset   = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg     = maxOffset > 0 ? spreadDeg / maxOffset : 0;
  const canGoPrev   = loop || active > 0;
  const canGoNext   = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive(a => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive(a => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  React.useEffect(() => {
    if (!autoAdvance || prefersReduced || !len) return;
    if (pauseOnHover && hovering) return;
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, prefersReduced, len, loop, active, next]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft")  prev();
    if (e.key === "ArrowRight") next();
  };

  const handlePointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    isDragging.current    = true;
    didDrag.current       = false;
    dragStartX.current    = e.clientX;
    dragStartTime.current = Date.now();
    setDragOffset(0);
  }, []);

  const handlePointerMove = React.useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 6) didDrag.current = true;
    setDragOffset(dx);
  }, []);

  const handlePointerUp = React.useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx       = e.clientX - dragStartX.current;
    const dt       = Math.max(1, Date.now() - dragStartTime.current);
    const velocity = dx / dt;
    const threshold = Math.min(160, cardWidth * 0.22);
    if      (dx >  threshold || velocity >  0.5) prev();
    else if (dx < -threshold || velocity < -0.5) next();
    setDragOffset(0);
  }, [cardWidth, prev, next]);

  if (!len) return null;

  const springTransition = prefersReduced
    ? "none"
    : "transform 0.55s cubic-bezier(0.34, 1.18, 0.64, 1), opacity 0.4s ease";

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="relative w-full"
        style={{ height: Math.max(360, cardHeight + 80) }}
        tabIndex={0}
        role="region"
        aria-label="Carrousel d'albums"
        onKeyDown={onKeyDown}
      >
        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{ perspective: `${perspectivePx}px` }}
        >
          {items.map((item, i) => {
            const off  = signedOffset(i, active, len, loop);
            const abs  = Math.abs(off);
            if (abs > maxOffset) return null;

            const isActive    = off === 0;
            const currentDrag = isActive ? dragOffset : 0;
            const draggingNow = isActive && isDragging.current && Math.abs(dragOffset) > 2;

            const x       = off * cardSpacing + currentDrag;
            const y       = abs * 10 - (isActive ? activeLiftPx : 0);
            const rotateZ = off * stepDeg;
            const rotateX = isActive ? 0 : tiltXDeg;
            const scale   = isActive ? activeScale : inactiveScale;
            const z       = -abs * depthPx;

            const transform = `translateX(${x}px) translateY(${y}px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) scale(${scale})`;

            return (
              <div
                key={item.id}
                className={cn(
                  "absolute bottom-0 rounded-2xl overflow-hidden shadow-2xl will-change-transform select-none",
                  isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                )}
                style={{
                  width:          cardWidth,
                  height:         cardHeight,
                  zIndex:         100 - abs,
                  transform,
                  transition:     draggingNow ? "none" : springTransition,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => { if (!didDrag.current) setActive(i); }}
                onPointerDown={isActive   ? handlePointerDown : undefined}
                onPointerMove={isActive   ? handlePointerMove : undefined}
                onPointerUp={isActive     ? handlePointerUp   : undefined}
                onPointerCancel={isActive ? handlePointerUp   : undefined}
              >
                <div
                  style={{
                    transform:      `translateZ(${z}px)`,
                    transformStyle: "preserve-3d",
                    height:         "100%",
                    width:          "100%",
                  }}
                >
                  {renderCard
                    ? renderCard(item, { active: isActive })
                    : (
                      <div className="relative h-full w-full">
                        {item.imageSrc
                          ? (
                            <Image
                              src={item.imageSrc}
                              alt={item.title}
                              fill
                              draggable={false}
                              loading="eager"
                              sizes="480px"
                              className="object-cover"
                            />
                          )
                          : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-800 text-sm text-gray-400">
                              No image
                            </div>
                          )
                        }
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="relative z-10 flex h-full flex-col justify-end p-5">
                          <div className="truncate text-lg font-semibold text-white">{item.title}</div>
                          {item.description && (
                            <div className="mt-1 line-clamp-2 text-sm text-white/80">{item.description}</div>
                          )}
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showDots && (
        <div className="mt-6 flex items-center justify-center gap-2" role="tablist">
          {items.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => setActive(idx)}
              role="tab"
              aria-selected={idx === active}
              aria-label={`Album ${idx + 1}`}
              className="rounded-full transition-all duration-300 focus:outline-none"
              style={{
                width:      idx === active ? "20px" : "6px",
                height:     "6px",
                background: idx === active ? "#C9A96E" : "rgba(201,169,110,0.25)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
