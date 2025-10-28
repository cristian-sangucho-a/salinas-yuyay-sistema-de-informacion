"use client";

import React, { useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';

export default function SearchHeader() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Buscando:', searchTerm);
  };

  return (
    <section id="archivo-historico-search" className="bg-base-100 py-8 md:py-12 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 space-y-6">

        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-md flex items-center justify-center">
            <FaBookOpen className="w-6 h-6 md:w-8 md:h-8 text-base-100" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary">
              Archivo Histórico
            </h2>
            <p className="text-xs md:text-sm text-base-content/70">
              Salinas de Guaranda
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center">
          <div className="relative grow">
            <input
              type="text"
              placeholder="Buscar en el archivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-4 pr-4 py-2 bg-base-100 border-base-300 text-base-content focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary ml-1"
          >
            Buscar
          </button>
        </form>

      </div>
    </section>
  );
}

