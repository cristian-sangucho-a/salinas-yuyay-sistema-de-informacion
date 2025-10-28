'use client';

import React, { useState } from 'react';
import { FaFile } from 'react-icons/fa';
import SolicitudModal from './SolicitudModal';

interface AssetFileItemProps {
  filename: string;
  index: number;
  totalFiles: number;
  activoId: string;
  activoTitulo: string;
}

export default function AssetFileItem({
  filename,
  index,
  totalFiles,
  activoId,
  activoTitulo,
}: AssetFileItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const extension = filename.split('.').pop()?.toUpperCase() || 'FILE';

  return (
    <>
      <div className="bg-white border border-[#D9C3A3] rounded-lg p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <FaFile className="w-5 h-5 text-[#8B3C10] shrink-0 mt-1" />
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#5A1E02] mb-2 wrap-break-word">
                {filename}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#4A3B31]/70 mb-2">
                <span className="px-2 py-0.5 bg-[#F8F3ED] border border-[#D9C3A3] rounded">
                  {extension}
                </span>
                <span>Archivo {index + 1} de {totalFiles}</span>
              </div>

              <p className="text-xs text-[#7C8B56] mt-1">
                Para acceder a este archivo, debe enviar una solicitud
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-sm bg-[#5A1E02] hover:bg-[#8B3C10] text-white border-none gap-2"
            >
              Solicitar
            </button>
          </div>
        </div>
      </div>

      <SolicitudModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activoId={activoId}
        activoTitulo={`${activoTitulo} - ${filename}`}
      />
    </>
  );
}
