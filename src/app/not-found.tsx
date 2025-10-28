'use client';

import React from 'react';
import Link from 'next/link';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-16 text-center bg-base-100">

      <div className="w-64 h-64 md:w-80 md:h-80 mb-8">
        <DotLottieReact
          src="https://lottie.host/dc07d4ff-1e11-44a6-9a88-96be1c82c98c/bRlptSH8ON.lottie"
          loop
          autoplay
        />
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
        ¡Oops! Página No Encontrada
      </h1>

      <p className="text-lg text-base-content/80 mb-8 max-w-md">
        Parece que la página que buscas no existe o ha sido movida.
      </p>

      <Link
        href="/"
        className="btn btn-error rounded-lg px-6 py-3 text-base font-medium focus:ring-4 focus:ring-primary/30"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}
