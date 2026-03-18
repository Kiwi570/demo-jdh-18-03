'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import NextImage from 'next/image';

// ==========================================
// TYPES & INTERFACES
// ==========================================

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface SphericalPosition {
  theta: number;
  phi: number;
  radius: number;
}

export interface WorldPosition extends Position3D {
  scale: number;
  zIndex: number;
  isVisible: boolean;
  fadeOpacity: number;
  originalIndex: number;
}

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface SphereImageGridProps {
  images?: ImageData[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseImageScale?: number;
  hoverScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
  // Legacy prop — ignoré (lightbox intégrée au composant)
  onImageClick?: (src: string) => void;
}

interface RotationState { x: number; y: number; z: number; }
interface VelocityState { x: number; y: number; }
interface MousePosition { x: number; y: number; }

// ==========================================
// MATH HELPERS
// ==========================================

const SPHERE_MATH = {
  degreesToRadians: (d: number) => d * (Math.PI / 180),
  normalizeAngle: (a: number) => {
    while (a > 180) a -= 360;
    while (a < -180) a += 360;
    return a;
  },
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const SphereImageGrid: React.FC<SphereImageGridProps> = ({
  images = [],
  containerSize = 400,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseImageScale = 0.18,
  perspective = 1000,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  className = '',
}) => {
  const [isMounted,      setIsMounted]      = useState(false);
  const [rotation,       setRotation]       = useState<RotationState>({ x: 15, y: 15, z: 0 });
  const [velocity,       setVelocity]       = useState<VelocityState>({ x: 0, y: 0 });
  const [isDragging,     setIsDragging]     = useState(false);
  const [selectedImage,  setSelectedImage]  = useState<ImageData | null>(null);
  const [imagePositions, setImagePositions] = useState<SphericalPosition[]>([]);
  const [hoveredIndex,   setHoveredIndex]   = useState<number | null>(null);

  const containerRef    = useRef<HTMLDivElement>(null);
  const lastMousePos    = useRef<MousePosition>({ x: 0, y: 0 });
  const animationFrame  = useRef<number | null>(null);
  const velocityRef     = useRef<VelocityState>({ x: 0, y: 0 }); // Ref pour éviter stale closure dans rAF

  // Sync velocityRef à chaque changement de velocity
  useEffect(() => { velocityRef.current = velocity; }, [velocity]);

  const actualRadius  = sphereRadius || containerSize * 0.5;
  const baseImageSize = containerSize * baseImageScale;

  // ── Fibonacci sphere distribution ──────────────────────────
  const generatePositions = useCallback((): SphericalPosition[] => {
    const goldenRatio     = (1 + Math.sqrt(5)) / 2;
    const angleIncrement  = 2 * Math.PI / goldenRatio;
    return images.map((_, i) => {
      const t           = i / images.length;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth     = angleIncrement * i;
      let phi           = inclination * (180 / Math.PI);
      let theta         = (azimuth * (180 / Math.PI)) % 360;
      const poleBonus   = Math.pow(Math.abs(phi - 90) / 90, 0.6) * 35;
      phi = phi < 90 ? Math.max(5, phi - poleBonus) : Math.min(175, phi + poleBonus);
      phi = 15 + (phi / 180) * 150;
      theta = (theta + (Math.random() - 0.5) * 20) % 360;
      phi   = Math.max(0, Math.min(180, phi + (Math.random() - 0.5) * 10));
      return { theta, phi, radius: actualRadius };
    });
  }, [images.length, actualRadius]);

  // ── 3D → 2D projection ─────────────────────────────────────
  const calculateWorldPositions = useCallback((): WorldPosition[] => {
    const rotXRad = SPHERE_MATH.degreesToRadians(rotation.x);
    const rotYRad = SPHERE_MATH.degreesToRadians(rotation.y);

    const positions = imagePositions.map((pos, index) => {
      const tRad = SPHERE_MATH.degreesToRadians(pos.theta);
      const pRad = SPHERE_MATH.degreesToRadians(pos.phi);

      let x = pos.radius * Math.sin(pRad) * Math.cos(tRad);
      let y = pos.radius * Math.cos(pRad);
      let z = pos.radius * Math.sin(pRad) * Math.sin(tRad);

      // Y-axis rotation
      const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
      const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
      x = x1; z = z1;

      // X-axis rotation
      const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad);
      const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad);
      y = y2; z = z2;

      const fadeZoneStart = -10;
      const fadeZoneEnd   = -30;
      const isVisible     = z > fadeZoneEnd;
      const fadeOpacity   = z <= fadeZoneStart
        ? Math.max(0, (z - fadeZoneEnd) / (fadeZoneStart - fadeZoneEnd))
        : 1;

      const distRatio  = Math.min(Math.sqrt(x*x + y*y) / actualRadius, 1);
      const isPole     = pos.phi < 30 || pos.phi > 150;
      const centerScale = Math.max(0.3, 1 - distRatio * (isPole ? 0.4 : 0.7));
      const depthScale  = (z + actualRadius) / (2 * actualRadius);
      const scale       = centerScale * Math.max(0.5, 0.8 + depthScale * 0.3);

      return { x, y, z, scale, zIndex: Math.round(1000 + z), isVisible, fadeOpacity, originalIndex: index };
    });

    // Collision reduction
    return positions.map((pos, i) => {
      if (!pos.isVisible) return pos;
      let adjustedScale = pos.scale;
      const imgSize = baseImageSize * adjustedScale;
      for (let j = 0; j < positions.length; j++) {
        if (i === j || !positions[j].isVisible) continue;
        const other   = positions[j];
        const dist    = Math.sqrt((pos.x-other.x)**2 + (pos.y-other.y)**2);
        const minDist = (imgSize + baseImageSize * other.scale) / 2 + 25;
        if (dist < minDist && dist > 0) {
          adjustedScale = Math.min(adjustedScale, adjustedScale * Math.max(0.4, 1 - ((minDist-dist)/minDist)*0.6));
        }
      }
      return { ...pos, scale: Math.max(0.25, adjustedScale) };
    });
  }, [imagePositions, rotation, actualRadius, baseImageSize]);

  const clamp = useCallback((v: number) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, v)), [maxRotationSpeed]);

  // ── Physics loop ────────────────────────────────────────────
  const updateMomentum = useCallback(() => {
    if (isDragging) return;
    setVelocity(prev => {
      const nv = { x: prev.x * momentumDecay, y: prev.y * momentumDecay };
      if (!autoRotate && Math.abs(nv.x) < 0.01 && Math.abs(nv.y) < 0.01) return { x: 0, y: 0 };
      return nv;
    });
    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clamp(velocityRef.current.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + (autoRotate ? autoRotateSpeed : 0) + clamp(velocityRef.current.y)),
      z: prev.z,
    }));
  }, [isDragging, momentumDecay, clamp, autoRotate, autoRotateSpeed]); // velocity via ref pour éviter recréation à chaque frame

  // ── Event handlers ──────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    const delta = { x: -dy * dragSensitivity, y: dx * dragSensitivity };
    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clamp(delta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clamp(delta.y)),
      z: prev.z,
    }));
    setVelocity({ x: clamp(delta.x), y: clamp(delta.y) });
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, dragSensitivity, clamp]);

  const handleMouseUp   = useCallback(() => setIsDragging(false), []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    setIsDragging(true);
    setVelocity({ x: 0, y: 0 });
    lastMousePos.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const t  = e.touches[0];
    const dx = t.clientX - lastMousePos.current.x;
    const dy = t.clientY - lastMousePos.current.y;
    const delta = { x: -dy * dragSensitivity, y: dx * dragSensitivity };
    setRotation(prev => ({
      x: SPHERE_MATH.normalizeAngle(prev.x + clamp(delta.x)),
      y: SPHERE_MATH.normalizeAngle(prev.y + clamp(delta.y)),
      z: prev.z,
    }));
    setVelocity({ x: clamp(delta.x), y: clamp(delta.y) });
    lastMousePos.current = { x: t.clientX, y: t.clientY };
  }, [isDragging, dragSensitivity, clamp]);

  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  // ── Lifecycle ───────────────────────────────────────────────
  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => { setImagePositions(generatePositions()); }, [generatePositions]);

  useEffect(() => {
    if (!isMounted) return;
    const animate = () => { updateMomentum(); animationFrame.current = requestAnimationFrame(animate); };
    animationFrame.current = requestAnimationFrame(animate);
    return () => { if (animationFrame.current) cancelAnimationFrame(animationFrame.current); };
  }, [isMounted, updateMomentum]);

  useEffect(() => {
    if (!isMounted) return;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup',   handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend',  handleTouchEnd);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup',   handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend',  handleTouchEnd);
    };
  }, [isMounted, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // ── Render ──────────────────────────────────────────────────
  // useMemo évite de recalculer les positions O(n²) à chaque render 60fps
  const worldPositions = useMemo(() => calculateWorldPositions(), [calculateWorldPositions]);

  const renderNode = useCallback((image: ImageData, index: number) => {
    const pos = worldPositions[index];
    if (!pos?.isVisible) return null;
    const imgSize    = baseImageSize * pos.scale;
    const isHovered  = hoveredIndex === index;
    const finalScale = isHovered ? Math.min(1.3, 1.3 / pos.scale) : 1;

    return (
      <div
        key={image.id}
        className="absolute cursor-pointer select-none"
        style={{
          width:     `${imgSize}px`,
          height:    `${imgSize}px`,
          left:      `${containerSize / 2 + pos.x}px`,
          top:       `${containerSize / 2 + pos.y}px`,
          opacity:   pos.fadeOpacity,
          transform: `translate(-50%, -50%) scale(${finalScale})`,
          zIndex:    pos.zIndex,
          transition: 'transform 0.2s ease-out',
        }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => setSelectedImage(image)}
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            borderRadius: '50%',
            boxShadow: isHovered
              ? '0 8px 32px rgba(15,8,5,0.45), 0 0 0 2px rgba(201,169,110,0.6)'
              : '0 4px 16px rgba(15,8,5,0.30), 0 0 0 1.5px rgba(255,255,255,0.15)',
          }}
        >
          {/* Next/Image optimisé */}
          <NextImage
            src={image.src}
            alt={image.alt}
            fill
            draggable={false}
            loading={index < 2 ? 'eager' : 'lazy'}
            sizes="160px"
            style={{ objectFit: 'cover', display: 'block',
              transform: isHovered ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.4s ease' }}
          />
        </div>
      </div>
    );
  }, [worldPositions, baseImageSize, containerSize, hoveredIndex]);

  // ── Lightbox ─────────────────────────────────────────────────
  const renderLightbox = () => {
    if (!selectedImage) return null;
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: 'rgba(15,8,5,0.93)', backdropFilter: 'blur(10px)' }}
        onClick={() => setSelectedImage(null)}
      >
        <button
          className="absolute top-6 right-6 w-11 h-11 flex items-center justify-center border border-white/20 text-white/50 hover:text-white hover:border-white/60 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
          aria-label="Fermer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div
          className="relative overflow-hidden"
          style={{ maxWidth: '78vw', maxHeight: '78vh', width: '900px', height: '600px', border: '1px solid rgba(201,169,110,0.2)' }}
          onClick={e => e.stopPropagation()}
        >
          <NextImage
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            quality={90}
            sizes="78vw"
            style={{ objectFit: 'contain' }}
          />
          {selectedImage.alt && (
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4"
              style={{ background: 'linear-gradient(to top, rgba(15,8,5,0.88), transparent)' }}>
              <p className="font-display font-light italic text-white/65 text-sm">{selectedImage.alt}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isMounted) return (
    <div style={{ width: containerSize, height: containerSize }}
      className="flex items-center justify-center text-white/20 text-xs tracking-widest uppercase">
      Chargement…
    </div>
  );

  if (!images.length) return null;

  return (
    <>
      <div
        ref={containerRef}
        className={`relative select-none cursor-grab active:cursor-grabbing ${className}`}
        style={{ width: containerSize, height: containerSize, perspective: `${perspective}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="relative w-full h-full" style={{ zIndex: 10 }}>
          {images.map((img, i) => renderNode(img, i))}
        </div>
      </div>
      {renderLightbox()}
    </>
  );
};

export default SphereImageGrid;
