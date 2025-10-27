"use client";

import React from 'react';
import { FaThLarge, FaList, FaChevronDown } from 'react-icons/fa';

interface ArchiveControlsProps {
  assetCount: number;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
}

export default function ArchiveControls({
  assetCount,
  categories,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewChange,
}: ArchiveControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-base-300"> {/* Borde inferior Arena */}
      {/* Título y Subtítulo */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary"> {/* Título: Marrón tierra */}
          Activos Históricos
        </h2>
        <p className="text-sm text-base-content/70 mt-1"> {/* Subtítulo: Gris pizarra */}
          Explora {assetCount} activos del archivo histórico
        </p>
      </div>

      {/* Controles: Filtro y Vistas */}
      <div className="flex items-center gap-2">
        {/* Dropdown de Categorías */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline border-base-300 bg-base-100 text-base-content hover:bg-base-200 hover:border-base-300 min-w-[150px] justify-between">
            {selectedCategory}
            <FaChevronDown className="w-3 h-3 ml-2 opacity-50" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52 mt-1">
            {categories.map((category) => (
              <li key={category}>
                {/* Usamos un botón para manejar el click y cerrar el dropdown */}
                <button
                    onClick={() => {
                        onCategoryChange(category);
                        // Cierra el dropdown manualmente si es necesario (DaisyUI a veces lo maneja solo)
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                    }}
                    className={`text-left w-full ${selectedCategory === category ? 'bg-base-300 font-semibold' : ''}`} // Estilo para seleccionado
                >
                    {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Botones de Vista (Grid/List) */}
        <div className="btn-group">
          <button
            onClick={() => onViewChange('grid')}
            className={`btn btn-outline border-base-300 ${viewMode === 'grid' ? 'btn-active bg-primary text-primary-content border-primary' : 'bg-base-100 text-base-content hover:bg-base-200'}`}
            aria-label="Vista de cuadrícula"
          >
            <FaThLarge />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`btn btn-outline border-base-300 ${viewMode === 'list' ? 'btn-active bg-primary text-primary-content border-primary' : 'bg-base-100 text-base-content hover:bg-base-200'}`}
            aria-label="Vista de lista"
          >
            <FaList />
          </button>
        </div>
      </div>
    </div>
  );
}
