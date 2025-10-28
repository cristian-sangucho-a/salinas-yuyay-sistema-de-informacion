'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCalendar, FaUser, FaFile, FaPaperPlane } from 'react-icons/fa';
import type { Activo } from '@/lib/types';
import SolicitudModal from './SolicitudModal';

interface AssetCardProps {
  asset: Activo;
}

export default function AssetCard({ asset }: AssetCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const categoryName = asset.expand?.categoria?.nombre ?? 'Sin categoría';
  const fileCount = asset.archivos?.length ?? 0;

  const handleCardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Link 
        href={`/visita/cultural/activo/${asset.id}`}
        onClick={handleCardClick}
        className="block bg-white border border-[#D9C3A3] rounded-lg p-5 hover:shadow-md transition-shadow relative"
      >
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-[#8B3C10] text-white text-xs font-medium rounded">
            {categoryName}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#5A1E02] mb-2">
          {asset.titulo}
        </h3>

        <p className="text-sm text-[#4A3B31]/70 mb-4 line-clamp-2">
          {asset.descripcion}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#4A3B31]/60">
            {asset.anio && (
              <div className="flex items-center gap-1.5">
                <FaCalendar className="w-3.5 h-3.5" />
                <span>{asset.anio}</span>
              </div>
            )}
            {asset.autor && (
              <div className="flex items-center gap-1.5">
                <FaUser className="w-3.5 h-3.5" />
                <span>{asset.autor}</span>
              </div>
            )}
            {fileCount > 0 && (
              <div className="flex items-center gap-1.5">
                <FaFile className="w-3.5 h-3.5" />
                <span>{fileCount}</span>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="btn btn-sm bg-[#5A1E02] hover:bg-[#8B3C10] text-white border-none gap-2"
          >
            <FaPaperPlane className="w-3 h-3" />
            Solicitar
          </button>
        </div>
      </Link>

      <SolicitudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activoId={asset.id}
        activoTitulo={asset.titulo}
      />
    </>
  );
}
