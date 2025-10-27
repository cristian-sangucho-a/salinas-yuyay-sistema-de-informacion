import React from 'react';
import HeroSection from './components/HeroSection';
export default function CulturalPage() {
  return (
    // La página principal ahora solo renderiza la sección SAISAL.
    // Puedes añadir más componentes de sección aquí en el futuro si es necesario.
    <main className="min-h-screen"> 
        <HeroSection />
    </main>
  );
}
