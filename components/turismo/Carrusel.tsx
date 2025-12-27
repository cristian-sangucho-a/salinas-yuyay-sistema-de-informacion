"use client";
import React, { useRef } from "react";
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

  return (
    // carrusel full-width y sin encabezado: solo el slide con flechas superpuestas
    <section className="w-full">
      {/* contenedor del carrusel a full width; altura igual a la de los slides */}
      <div className="w-full overflow-hidden relative h-[85vh]">
        {/* flechas superpuestas a todo el alto del carrusel (transparentes) */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Anterior evento"
          className="absolute left-0 top-0 bottom-0 z-20 flex items-center justify-center w-14 md:w-20 lg:w-24 bg-transparent backdrop-blur opacity-60 hover:opacity-100 hover:bg-base-100/20"
        >
          <span className="text-4xl md:text-5xl text-primary">‹</span>
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Siguiente evento"
          className="absolute right-0 top-0 bottom-0 z-20 flex items-center justify-center w-14 md:w-20 lg:w-24 bg-transparent backdrop-blur opacity-60 hover:opacity-100 hover:bg-base-100/20"
        >
          <span className="text-4xl md:text-5xl text-primary">›</span>
        </button>

        <div
          ref={ref}
          className="flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory w-full"
        >
          {events.map((item) => (
            <div key={item.id as string} className="flex-shrink-0 w-screen snap-start">
              <CoverCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
