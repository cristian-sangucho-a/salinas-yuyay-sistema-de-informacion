'use client';

import React, { useState } from 'react';
import { FaThLarge, FaList } from 'react-icons/fa';
import { Button } from '@components/atoms';
import AssetCard from './AssetCard';
import AssetListItem from './AssetListItem';
import type { Categoria, Activo } from '@/lib/types';

interface ArchiveDisplaySectionProps {
  categorias: Categoria[];
  initialActivos: Activo[];
  categoryId?: string;
}

export default function ArchiveDisplaySection({
  initialActivos,
}: ArchiveDisplaySectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <section className="bg-base-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-base-300">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Activos Históricos
            </h2>
            <p className="text-sm text-base-content/70 mt-1">
              {initialActivos.length} {initialActivos.length === 1 ? 'activo encontrado' : 'activos encontrados'}
            </p>
          </div>

          <div className="btn-group">
            <Button
              onClick={() => setViewMode('grid')}
              variant="outline"
              className={`border-base-300 ${viewMode === 'grid' ? 'btn-active bg-primary text-primary-content border-primary' : 'bg-base-100 text-base-content hover:bg-base-200'}`}
              aria-label="Vista de cuadrícula"
            >
              <FaThLarge />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant="outline"
              className={`border-base-300 ${viewMode === 'list' ? 'btn-active bg-primary text-primary-content border-primary' : 'bg-base-100 text-base-content hover:bg-base-200'}`}
              aria-label="Vista de lista"
            >
              <FaList />
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {initialActivos.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {initialActivos.map((asset) => (
              <AssetListItem key={asset.id} asset={asset} />
            ))}
          </div>
        )}

        {initialActivos.length === 0 && (
          <div className="text-center py-12 text-base-content/70">
            No se encontraron activos en esta categoría.
          </div>
        )}
      </div>
    </section>
  );
}

