'use client';

import React from 'react';
import AssetCard from './AssetCard';
import type { Activo } from '@/lib/types';

interface AssetGridProps {
  activos: Activo[];
}

export default function AssetGrid({ activos }: AssetGridProps) {
  return (
    <section className="bg-[#F8F3ED] py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#5A1E02] mb-2">
            Activos Disponibles
          </h2>
          <p className="text-[#4A3B31]/70">
            {activos.length} {activos.length === 1 ? 'activo encontrado' : 'activos encontrados'}
          </p>
        </div>

        {activos.length > 0 ? (
          <div className="space-y-4">
            {activos.map((activo) => (
              <AssetCard key={activo.id} asset={activo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-[#4A3B31]/60">
              No hay activos disponibles en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
