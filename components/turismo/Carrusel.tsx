"use client";
import React, { useEffect, useRef } from "react";
import CoverCard from "./CoverCard";
import { CarouselItem } from "@/lib/types";

interface CarruselProps {
  item: CarouselItem[];
}

export default function Carrusel({ item: events }: CarruselProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: -1 | 1) => {
    if (!ref.current) return;
    // intentar obtener el ancho del primer slide dentro del contenedor
    const first = ref.current.querySelector("article");
    const slideWidth = (first && (first as HTMLElement).clientWidth) || Math.round(window.innerWidth * 0.95);
    ref.current.scrollBy({ left: direction * slideWidth, behavior: "smooth" });
  };

  // Auto-scroll cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (!ref.current) return;
      const first = ref.current.querySelector("article");
      const slideWidth = (first && (first as HTMLElement).clientWidth) || Math.round(window.innerWidth * 0.95);
      const maxScroll = ref.current.scrollWidth - ref.current.clientWidth;
      
      // Si llegamos al final, volver al inicio
      if (ref.current.scrollLeft >= maxScroll - 10) {
        ref.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        ref.current.scrollBy({ left: slideWidth, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    // carrusel full-width y sin encabezado: solo el slide con flechas superpuestas
    <section className="w-full">
      {/* contenedor del carrusel a full width; altura igual a la de los slides */}
      <div className="w-full overflow-hidden relative h-[85vh]">
        {/* flechas superpuestas a todo el alto del carrusel (transparentes) */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Anterior evento"
          className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center w-14 md:w-20 lg:w-24 bg-transparent md:backdrop-blur opacity-60 hover:opacity-100 hover:bg-base-100/20"
        >
          <span className="text-4xl md:text-5xl text-primary font-bold">‹</span>
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Siguiente evento"
          className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center w-14 md:w-20 lg:w-24 bg-transparent md:backdrop-blur opacity-60 hover:opacity-100 hover:bg-base-100/20"
        >
          <span className="text-4xl md:text-5xl text-primary font-bold">›</span>
        </button>

        <div
          ref={ref}
          className="flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory w-full"
        >
          {events.map((item) => (
            <div key={item.id as string} className="shrink-0 w-screen snap-start">
              <CoverCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
