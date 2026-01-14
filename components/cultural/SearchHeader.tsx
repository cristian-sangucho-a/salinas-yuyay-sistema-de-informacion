'use client';

import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { Button } from '@components/atoms';

interface SearchHeaderProps {
  onSearch: (searchTerm: string) => void;
}

export default function SearchHeader({ onSearch }: SearchHeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <section id="archivo-historico-search" className="bg-base-200 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="relative">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A3B31]/40 w-5 h-5 pointer-events-none z-10" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleChange}
              placeholder="Buscar categorías..."
              className="input input-bordered w-full pl-12 pr-12 border-[#D9C3A3] bg-white focus:border-[#7C8B56] focus:outline-none text-[#4A3B31] h-14 text-base"
            />
            {searchTerm && (
              <Button
                type="button"
                onClick={handleClear}
                variant="ghost"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B63A1B] hover:text-[#B63A1B]/80 transition-colors z-10 p-2"
                aria-label="Limpiar búsqueda"
              >
                <FaTimes className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-[#4A3B31]/60 mt-3 text-center">
          Busca por nombre o descripción de categorías
        </p>
      </div>
    </section>
  );
}

