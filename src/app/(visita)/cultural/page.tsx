'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from '@cultural/HeroSection';
import CategoryDisplaySection from '@cultural/CategoryDisplaySection';
import { getCategorias, getAssetCountsByCategory } from '@/lib/data';
import type { Categoria } from '@/lib/types';

export default function CulturalPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [assetCounts, setAssetCounts] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      const cats = await getCategorias();
      const counts = await getAssetCountsByCategory();
      setCategorias(cats);
      setAssetCounts(counts);
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen">
      <HeroSection onSearch={setSearchTerm} />
      <CategoryDisplaySection 
        categorias={categorias} 
        assetCounts={assetCounts}
        searchTerm={searchTerm}
      />
    </main>
  );
}

