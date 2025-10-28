'use client';

import React, { useState, useMemo } from 'react';
import { FaThLarge, FaList, FaChevronDown } from 'react-icons/fa';
import CategoryCard from './CategoryCard';
import CategoryListItem from './CategoryListItem';
import type { Categoria } from '@/lib/types';

interface CategoryDisplaySectionProps {
  categorias: Categoria[];
  assetCounts: Record<string, number>;
  searchTerm?: string;
}

export default function CategoryDisplaySection({
  categorias,
  assetCounts,
  searchTerm = '',
}: CategoryDisplaySectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('Todas');

  const filteredCategorias = useMemo(() => {
    let result = categorias;

    if (selectedCategoryId !== 'Todas') {
      result = result.filter(categoria => categoria.id === selectedCategoryId);
    }

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(categoria => 
        categoria.nombre.toLowerCase().includes(lowerSearch) ||
        categoria.descripcion.toLowerCase().includes(lowerSearch)
      );
    }

    return result;
  }, [categorias, selectedCategoryId, searchTerm]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === 'Todas') return 'Todas';
    const foundCategory = categorias.find(cat => cat.id === selectedCategoryId);
    return foundCategory?.nombre ?? 'Todas';
  }, [categorias, selectedCategoryId]);

  return (
    <section className="bg-base-200 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-base-300">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Categorías de Archivos
            </h2>
            <p className="text-base-content/70 mt-1">
              {searchTerm 
                ? `${filteredCategorias.length} ${filteredCategorias.length === 1 ? 'categoría encontrada' : 'categorías encontradas'} para "${searchTerm}"`
                : 'Explora los activos del archivo histórico'
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-outline border-base-300 bg-base-100 text-base-content hover:bg-base-200 hover:border-base-300 min-w-[150px] justify-between transition-all"
              >
                {selectedCategoryName}
                <FaChevronDown className="w-3 h-3 ml-2 opacity-50" />
              </div>
              <ul tabIndex={0} className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52 mt-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategoryId('Todas');
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                    className={`text-left w-full transition-colors ${selectedCategoryId === 'Todas' ? 'bg-base-300 font-semibold' : ''}`}
                  >
                    Todas
                  </button>
                </li>
                {categorias.map((categoria, index) => (
                  <li 
                    key={categoria.id}
                    className="animate-in fade-in slide-in-from-top-1 duration-200"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <button
                      onClick={() => {
                        setSelectedCategoryId(categoria.id);
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                      }}
                      className={`text-left w-full transition-colors ${selectedCategoryId === categoria.id ? 'bg-base-300 font-semibold' : ''}`}
                    >
                      {categoria.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="btn-group">
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-outline border-base-300 transition-all ${viewMode === 'grid' ? 'btn-active bg-primary text-primary-content border-primary' : 'bg-base-100 text-base-content hover:bg-base-200'}`}
                aria-label="Vista de cuadrícula"
              >
                <FaThLarge className={`transition-transform ${viewMode === 'grid' ? 'scale-110' : ''}`} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`btn btn-outline border-base-300 transition-all ${viewMode === 'list' ? 'btn-active bg-primary text-primary-content border-primary' : 'bg-base-100 text-base-content hover:bg-base-200'}`}
                aria-label="Vista de lista"
              >
                <FaList className={`transition-transform ${viewMode === 'list' ? 'scale-110' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {filteredCategorias.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCategorias.map((categoria, index) => (
                <div
                  key={categoria.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard 
                    categoria={categoria}
                    assetCount={assetCounts[categoria.id] ?? 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategorias.map((categoria, index) => (
                <div
                  key={categoria.id}
                  className="animate-in fade-in slide-in-from-left-4 duration-500"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CategoryListItem 
                    categoria={categoria}
                    assetCount={assetCounts[categoria.id] ?? 0}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
            <p className="text-lg text-base-content/60 mb-2">
              {searchTerm 
                ? `No se encontraron categorías que coincidan con "${searchTerm}"`
                : 'No hay categorías disponibles.'
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
