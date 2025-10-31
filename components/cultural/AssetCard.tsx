'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCalendar, FaUser, FaFile, FaPaperPlane, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { Activo } from '@/lib/types';
import SolicitudModal from './SolicitudModal';

interface AssetCardProps {
  asset: Activo;
}

export default function AssetCard({ asset }: AssetCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryName = asset.expand?.categoria?.nombre ?? 'Sin categoría';
  const fileCount = asset.archivos?.length ?? 0;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="block bg-white border border-[#D9C3A3] rounded-lg p-5 hover:shadow-md transition-shadow"
      >
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-[#8B3C10] text-white text-xs font-medium rounded">
            {categoryName}
          </span>
        </div>

        <Link href={`/cultural/activo/${asset.id}`}>
          <h3 className="text-lg font-bold text-[#5A1E02] mb-2 hover:text-[#8B3C10] transition-colors">
            {asset.titulo}
          </h3>
        </Link>

        <p className="text-sm text-[#4A3B31]/70 mb-4 line-clamp-2">
          {asset.descripcion}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#4A3B31]/60 mb-4">
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

        {fileCount > 0 && (
          <div className="border-t border-[#D9C3A3] pt-4 mt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex items-center justify-between w-full text-sm font-semibold text-[#5A1E02] hover:text-[#8B3C10] transition-colors mb-2"
            >
              <span>Archivos disponibles ({fileCount})</span>
              <FaChevronDown 
                className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-2 mt-3">
                {asset.archivos.map((archivo, index) => {
                  const extension = archivo.split('.').pop()?.toUpperCase() || 'FILE';
                  return (
                    <div 
                      key={index}
                      className="flex items-center gap-2 p-2 bg-[#F8F3ED] rounded border border-[#D9C3A3] text-xs animate-in fade-in slide-in-from-top-2 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <FaFile className="w-3 h-3 text-[#8B3C10] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#5A1E02] truncate">
                          {archivo}
                        </p>
                        <p className="text-[#4A3B31]/60">
                          {extension} • Archivo {index + 1} de {fileCount}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <p className="text-xs text-[#7C8B56] italic mt-2">
                  Para acceder a estos archivos, debe enviar una solicitud
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="btn btn-sm bg-[#5A1E02] hover:bg-[#8B3C10] text-white border-none gap-2 transition-all"
          >
            <FaPaperPlane className="w-3 h-3" />
            Solicitar activo
          </button>
        </div>
      </div>

      <SolicitudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activoId={asset.id}
        activoTitulo={asset.titulo}
      />
    </>
  );
}
