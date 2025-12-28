"use client";
import { BsDatabase } from "react-icons/bs";
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      className="relative flex items-center min-h-[calc(100vh-10rem)] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/salinas-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-base-100 opacity-80"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-16 md:py-24 lg:py-32">

        <div className="flex flex-col justify-center text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-primary">
            Saisal: <br className="hidden md:inline" /> Memoria Viva
          </h1>
          <p className="text-lg md:text-xl text-base-content mb-8 max-w-xl mx-auto lg:mx-0">
            Un repositorio digital dedicado a preservar y compartir la valiosa memoria histórica y cultural de Salinas de Guaranda, Ecuador.
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link
              href="/cultural#archivo-historico-search"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center btn btn-primary rounded-lg focus:ring-4 focus:ring-primary/30 w-full sm:w-auto"
            >
              Explorar Archivo
            </Link>
          </div>
        </div>

        <div className="flex justify-center items-center mt-12 lg:mt-0">
          <div className="w-full max-w-[200px] aspect-square rounded-lg overflow-hidden shadow-md border border-base-300 bg-white p-4 flex items-center justify-center">
            <BsDatabase className="text-primary" size={150} />
          </div>
        </div>
      </div>
    </section>
  );
}

