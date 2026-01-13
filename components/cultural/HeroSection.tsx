"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Button } from '@components/atoms';

interface HeroSectionProps {
  onSearch?: (searchTerm: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Aplicar scroll suave en el documento
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      const target = document.querySelector('#archivo-historico-search');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch?.('');
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-[#F8F3ED] bg-cover bg-center bg-no-repeat overflow-hidden">
      <Image
        src="/salinas-background.webp"
        alt="Paisaje de Salinas"
        fill
        priority
        placeholder="empty"
        onLoad={() => setImageLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover brightness-40"
        sizes="100vw"
      />

      {/* Contenido */}
      {imageLoaded && (
        <div className="relative z-20 max-w-4xl mx-auto px-4 md:px-8 text-center -translate-y-6 md:-translate-y-10 animate-in fade-in duration-700">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 text-white text-shadow-lg">
            Descubre el patrimonio cultural digital de Salinas
          </h1>
          
          <p className="text-lg md:text-xl text-gray-100 mb-12 max-w-2xl mx-auto text-shadow-md">
            Busca y comparte arte, documentos, fotografías y más de la valiosa memoria histórica y cultural de Salinas de Guaranda, Ecuador.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Buscar en la colección..."
                className="input input-bordered w-full pl-12 pr-12 border-gray-300 bg-white focus:border-primary focus:outline-none text-[#4A3B31] h-16 text-base rounded-lg shadow-lg"
              />
              {searchTerm && (
                <Button
                  type="button"
                  onClick={handleClear}
                  variant="ghost"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80 transition-colors z-10 p-2"
                  aria-label="Limpiar búsqueda"
                >
                  <FaTimes className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

