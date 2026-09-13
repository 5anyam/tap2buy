'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type GalleryImage = { src: string; alt?: string };

export default function ImageGallery({
  images,
  focusSrc,
  alt = 'Product image',
}: {
  images: GalleryImage[];
  /** When this changes to a src in `images`, the gallery jumps to it (e.g. after a colour change). */
  focusSrc?: string;
  alt?: string;
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!focusSrc) return;
    const index = images.findIndex((img) => img.src === focusSrc);
    if (index >= 0) setActive(index);
  }, [focusSrc, images]);

  useEffect(() => {
    if (active >= images.length) setActive(0);
  }, [active, images.length]);

  if (!images.length) return <div className="aspect-[4/5] bg-parchment" />;

  const go = (delta: number) => {
    setZoom(null);
    setActive((i) => (i + delta + images.length) % images.length);
  };

  const pointToPercent = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 };
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide lg:max-h-[min(84vh,820px)] lg:w-[72px] lg:shrink-0 lg:flex-col lg:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => {
                setActive(i);
                setZoom(null);
              }}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-parchment transition-opacity duration-300 lg:w-full ${
                i === active ? 'opacity-100 outline-1 outline-offset-2 outline-espresso' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div
        className="group relative aspect-[4/5] flex-1 select-none overflow-hidden bg-parchment lg:aspect-auto lg:h-[min(84vh,820px)]"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
        onMouseMove={(e) => zoom && setZoom(pointToPercent(e))}
        onMouseLeave={() => setZoom(null)}
      >
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={i === 0 ? alt : `${alt} — view ${i + 1}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            draggable={false}
            onClick={(e) => {
              if (window.matchMedia('(hover: none)').matches) return;
              setZoom(zoom ? null : pointToPercent(e));
            }}
            style={i === active && zoom ? { transform: 'scale(2)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
            } ${zoom ? 'cursor-zoom-out' : 'lg:cursor-zoom-in'}`}
          />
        ))}

        {images.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-ivory/90 text-espresso opacity-0 transition-opacity duration-300 hover:bg-ivory group-hover:opacity-100 lg:flex"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center bg-ivory/90 text-espresso opacity-0 transition-opacity duration-300 hover:bg-ivory group-hover:opacity-100 lg:flex"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="pointer-events-none absolute bottom-4 left-4 bg-ivory/90 px-2.5 py-1 text-[10px] tracking-[0.2em] text-espresso">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
