"use client";

import React, { useState } from 'react';
import ArchiveControls from './ArchiveControls'; // Componente para los controles
import AssetCard from './AssetCard';         // Componente para la vista Grid
import AssetListItem from './AssetListItem';   // Componente para la vista Lista

// Datos de ejemplo - Reemplazar con datos de Pocketbase más adelante
const mockAssets = [
  {
    id: '1',
    image: 'https://placehold.co/600x400/D6A77A/4A3B31?text=Imagen+Activo+1', // Placeholder Ocre/Gris
    category: { name: 'Administrativo' }, // Simula relación
    title: 'Acta de Fundación del Cantón Salinas',
    description: 'Documento oficial que establece la fundación del cantón Salinas de Guaranda...',
    year: '1884',
    author: 'Gobierno Provincial de Bolívar',
    fileCount: 3,
  },
  {
    id: '2',
    image: 'https://placehold.co/600x400/7C8B56/F8F3ED?text=Imagen+Activo+2', // Placeholder Verde/Beige
    category: { name: 'Fotografía' },
    title: 'Fotografías de la Plaza Central',
    description: 'Serie fotográfica que documenta la evolución de la plaza central de Salinas...',
    year: '1925',
    author: 'Archivo Municipal',
    fileCount: 12,
  },
    {
    id: '3',
    image: 'https://placehold.co/600x400/9DB8C0/4A3B31?text=Imagen+Activo+3', // Placeholder Azul/Gris
    category: { name: 'Económico' },
    title: 'Registro de Producción de Sal',
    description: 'Documentación detallada sobre la extracción y comercialización de sal...',
    year: '1910',
    author: 'Cooperativa de Mineros',
    fileCount: 8,
  },
  // Añadir más activos de ejemplo si es necesario
];

// Nombres de categorías de ejemplo para el filtro
const mockCategories = ['Todas', 'Administrativo', 'Fotografía', 'Económico', 'Cartografía', 'Prensa', 'Demográfico', 'Cultural'];


export default function ArchiveDisplaySection() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Estado para grid/list
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas'); // Estado para filtro

  // Lógica de filtrado (simple, solo filtra si no es "Todas")
  const filteredAssets = selectedCategory === 'Todas'
    ? mockAssets
    : mockAssets.filter(asset => asset.category.name === selectedCategory);

  return (
    // Fondo: Beige más oscuro (#f0e8dc o base-200)
    <section className="bg-base-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 space-y-8">
        <ArchiveControls
          assetCount={filteredAssets.length} // Pasa la cantidad de activos filtrados
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />

        {/* Contenedor condicional para Grid o Lista */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAssets.map((asset) => (
              <AssetListItem key={asset.id} asset={asset} />
            ))}
          </div>
        )}

        {/* Mensaje si no hay activos */}
        {filteredAssets.length === 0 && (
            <div className="text-center py-12 text-base-content/70">
                No se encontraron activos para la categoría seleccionada.
            </div>
        )}
      </div>
    </section>
  );
}
