'use client';

import React, { useState, useMemo } from 'react';
import ArchiveControls from './ArchiveControls';
import AssetCard from './AssetCard';
import AssetListItem from './AssetListItem';
import type { Categoria, Activo } from '@/lib/types';

interface ArchiveControlsSectionProps {
  categorias: Categoria[];
  initialActivos: Activo[];
  initialCategoryId?: string;
}

export default function ArchiveControlsSection({
  categorias,
  initialActivos,
  initialCategoryId = 'Todas',
}: ArchiveControlsSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId);

  const filteredActivos = useMemo(() => {
    if (selectedCategoryId === 'Todas') {
      return initialActivos;
    }
    return initialActivos.filter(activo => activo.categoria === selectedCategoryId);
  }, [initialActivos, selectedCategoryId]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === 'Todas') return 'Todas';
    const foundCategory = categorias.find(cat => cat.id === selectedCategoryId);
    return foundCategory?.nombre ?? 'Todas';
  }, [categorias, selectedCategoryId]);

  return (
    <section className="bg-base-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 space-y-8">
        <ArchiveControls
          assetCount={filteredActivos.length}
          categorias={categorias}
          selectedCategoryId={selectedCategoryId}
          selectedCategoryName={selectedCategoryName}
          onCategoryChange={setSelectedCategoryId}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredActivos.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivos.map((asset) => (
              <AssetListItem key={asset.id} asset={asset} />
            ))}
          </div>
        )}

        {filteredActivos.length === 0 && (
          <div className="text-center py-12 text-base-content/70">
            No se encontraron activos para la categoría seleccionada.
          </div>
        )}
      </div>
    </section>
  );
}
