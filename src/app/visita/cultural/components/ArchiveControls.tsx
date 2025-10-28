"use client";

import React from 'react';
import { FaThLarge, FaList, FaChevronDown } from 'react-icons/fa';
import type { Categoria } from '@/lib/types';

interface ArchiveControlsProps {
  assetCount: number;
  categorias: Categoria[];
  selectedCategoryId: string;
  selectedCategoryName: string;
  onCategoryChange: (categoryId: string) => void;
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
}

export default function ArchiveControls({
  assetCount,
  categorias,
  selectedCategoryId,
  selectedCategoryName,
  onCategoryChange,
  viewMode,
  onViewChange,
}: ArchiveControlsProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-base-300">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          Activos Históricos
        </h2>
        <p className="text-sm text-base-content/70 mt-1">
          {assetCount} {assetCount === 1 ? 'activo encontrado' : 'activos encontrados'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline border-base-300 bg-base-100 text-base-content hover:bg-base-200 hover:border-base-300 min-w-[150px] justify-between">
            {selectedCategoryName}
            <FaChevronDown className="w-3 h-3 ml-2 opacity-50" />
          </div>
          <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 max-h-60 overflow-y-auto">
             <li>
               <button
                 onClick={() => {
                   onCategoryChange('Todas');
                   if (document.activeElement instanceof HTMLElement) {
                     document.activeElement.blur();
                   }
                 }}
                 className={`text-left w-full ${selectedCategoryId === 'Todas' ? 'bg-base-300 font-semibold' : ''}`}
               >
                 Todas
               </button>
             </li>
            {categorias.map((category) => (
              <li key={category.id}>
                <button
                    onClick={() => {
                        onCategoryChange(category.id);
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }
                    }}
                    className={`text-left w-full ${selectedCategoryId === category.id ? 'bg-base-300 font-semibold' : ''}`}
                >
                    {category.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>

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

