import React from 'react';
import HeroSection from './components/HeroSection';
import SearchHeader from './components/SearchHeader';
import CategoryDisplaySection from './components/CategoryDisplaySection';
import { getCategorias, getAssetCountsByCategory } from '@/lib/data';

export default async function CulturalPage() {
  const categorias = await getCategorias();
  const assetCounts = await getAssetCountsByCategory();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <SearchHeader />
      <CategoryDisplaySection categorias={categorias} assetCounts={assetCounts} />
    </main>
  );
}

