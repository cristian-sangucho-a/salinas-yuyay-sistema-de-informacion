import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { getCategorias, getActivos } from '@/lib/data';
import AssetGrid from '../../components/AssetGrid';

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  
  const categorias = await getCategorias();
  const categoria = categorias.find(c => c.id === id);

  if (!categoria) {
    notFound();
  }

  const activosData = await getActivos(id, 1, 100);

  return (
    <main className="min-h-screen bg-base-100">
      <div className="bg-base-200 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <Link 
            href="/visita/cultural"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a categorías</span>
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {categoria.nombre}
          </h1>
          <p className="text-base-content/70">
            {categoria.descripcion}
          </p>
        </div>
      </div>

      <AssetGrid activos={activosData.items} />
    </main>
  );
}
