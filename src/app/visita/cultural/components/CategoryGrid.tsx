'use client';

import React from 'react';
import CategoryCard from './CategoryCard';
import type { Categoria } from '@/lib/types';

interface CategoryGridProps {
  categorias: Categoria[];
  assetCounts: Record<string, number>;
}

export default function CategoryGrid({ categorias, assetCounts }: CategoryGridProps) {
  return (
    <section className="bg-base-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Explorar Categorías
          </h2>
          <p className="text-base-content/70">
            Descubre nuestra colección de {categorias.length} {categorias.length === 1 ? 'categoría' : 'categorías'} de archivo histórico
          </p>
        </div>

        {categorias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {categorias.map((categoria) => (
              <CategoryCard 
                key={categoria.id} 
                categoria={categoria}
                assetCount={assetCounts[categoria.id] ?? 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-base-content/60">
              No hay categorías disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
