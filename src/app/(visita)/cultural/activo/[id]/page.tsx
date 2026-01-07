import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaUser, FaFolder, FaFile } from 'react-icons/fa';
import { getActivoById } from '@/lib/data';
import AssetFileItem from '@cultural/AssetFileItem';

interface AssetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { id } = await params;
  const activo = await getActivoById(id);

  if (!activo) {
    notFound();
  }

  const categoryName = activo.expand?.categoria?.nombre ?? 'Sin categoría';
  const fileCount = activo.archivos?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#F8F3ED]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12">
        <Link 
          href={`/visita/cultural/categoria/${activo.categoria}`}
          className="inline-flex items-center gap-2 text-[#4A3B31] hover:text-[#5A1E02] transition-colors mb-6"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span className="text-sm">Volver a activos</span>
        </Link>

        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-[#8B3C10] text-white text-sm font-medium rounded">
            {categoryName}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#5A1E02] mb-4">
          {activo.titulo}
        </h1>

        <p className="text-[#4A3B31]/80 text-base leading-relaxed mb-8 max-w-4xl">
          {activo.descripcion}
        </p>

        <div className="flex flex-wrap items-center gap-6 mb-10 text-sm text-[#4A3B31]">
          {activo.anio && (
            <div className="flex items-center gap-2">
              <FaCalendar className="w-4 h-4" />
              <span>Año: <strong>{activo.anio}</strong></span>
            </div>
          )}
          {activo.autor && (
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4" />
              <span>{activo.autor}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <FaFolder className="w-4 h-4" />
            <span><strong>{fileCount}</strong> {fileCount === 1 ? 'archivo' : 'archivos'}</span>
          </div>
        </div>

        {fileCount > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-[#5A1E02] mb-6">
              Archivos disponibles
            </h2>

            <div className="space-y-4">
              {activo.archivos.map((archivo, index) => (
                <AssetFileItem 
                  key={index}
                  filename={archivo}
                  index={index}
                  totalFiles={fileCount}
                  activoId={activo.id}
                  activoTitulo={activo.titulo}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#D6A77A]/20 border border-[#D6A77A] rounded-lg p-6 text-center">
            <FaFile className="w-12 h-12 text-[#8B3C10]/50 mx-auto mb-3" />
            <p className="text-[#4A3B31]">
              Este activo no tiene archivos disponibles.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
