"use client";

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function HeroSection() {
  return (
    // Contenedor principal con imagen de fondo
    <section
      className="relative flex items-center min-h-[calc(100vh-10rem)] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/salinas-background.jpg')" }} // Ruta a tu imagen
    >
      {/* Capa de superposición con color y opacidad para mejorar la legibilidad del texto */}
      <div className="absolute inset-0 bg-base-100 opacity-80"></div>

      {/* Contenido de la Hero Section (ahora sobre la capa de superposición) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-16 md:py-24 lg:py-32">

        {/* --- Contenido de Texto a la Izquierda --- */}
        <div className="flex flex-col justify-center text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-primary">
            Saisal: <br className="hidden md:inline" /> Memoria Viva
          </h1>
          <p className="text-lg md:text-xl text-base-content mb-8 max-w-xl mx-auto lg:mx-0">
            Un repositorio digital dedicado a preservar y compartir la valiosa memoria histórica y cultural de Salinas de Guaranda, Ecuador.
          </p>
          <div className="flex justify-center lg:justify-start">
            <a
              href="/cultural/categorias"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center btn btn-primary rounded-lg focus:ring-4 focus:ring-primary/30 w-full sm:w-auto"
            >
              Explorar Archivo
            </a>
          </div>
        </div>

        {/* --- Animación Lottie a la Derecha (Aún más pequeña y cuadrada) --- */}
        <div className="flex justify-center items-center mt-12 lg:mt-0">
          {/* Cambiado max-w-xs a max-w-[12rem] */}
          <div className="w-full max-w-48 aspect-square rounded-lg overflow-hidden shadow-md border border-base-300 bg-white p-4 flex items-center justify-center">
            <DotLottieReact
              src="/scan_document.lottie"
              loop
              autoplay
              style={{ maxWidth: '100%', maxHeight: '100%' }} // Asegura que Lottie no exceda el contenedor cuadrado
            />
          </div>
        </div>
      </div>
    </section>
  );
}

