import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaUser, FaFolder, FaFile, FaEye } from 'react-icons/fa';
import { getActivoById } from '@/lib/data';

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

        {fileCount > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#5A1E02] mb-6">
              Archivos Disponibles
            </h2>

            <div className="space-y-4">
              {activo.archivos.map((archivo, index) => {
                const extension = archivo.split('.').pop()?.toUpperCase() || 'FILE';
                const sizeInMB = (Math.random() * 5 + 0.5).toFixed(1);
                const pageCount = Math.floor(Math.random() * 20) + 1;
                
                return (
                  <div 
                    key={index}
                    className="bg-white border border-[#D9C3A3] rounded-lg p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <FaFile className="w-5 h-5 text-[#8B3C10] shrink-0 mt-1" />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#5A1E02] mb-2 break-words">
                            {archivo}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#4A3B31]/70 mb-3">
                            <span className="px-2 py-0.5 bg-[#F8F3ED] border border-[#D9C3A3] rounded">
                              {extension}
                            </span>
                            <span>{sizeInMB} MB</span>
                            <span>{pageCount} páginas</span>
                          </div>

                          <p className="text-sm text-[#4A3B31]/60 italic">
                            Documento original escaneado del acta de fundación
                          </p>
                          <p className="text-xs text-[#7C8B56] mt-1">
                            Calidad: Alta resolución
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          className="btn btn-sm btn-outline border-[#D9C3A3] hover:bg-[#F8F3ED] hover:border-[#8B3C10] text-[#4A3B31] gap-2"
                          onClick={() => {
                            alert('Vista previa no disponible. Para acceder al archivo completo, solicite el archivo.');
                          }}
                        >
                          <FaEye className="w-3.5 h-3.5" />
                          Vista previa
                        </button>
                        <Link
                          href={`/visita/cultural/activo/${activo.id}/solicitar`}
                          className="btn btn-sm bg-[#5A1E02] hover:bg-[#8B3C10] text-white border-none gap-2"
                        >
                          Solicitar archivo
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
