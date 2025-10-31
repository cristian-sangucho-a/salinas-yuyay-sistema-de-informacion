'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaImage, FaCalendar, FaUser, FaFile } from 'react-icons/fa';
import type { Activo } from '@/lib/types';
import { getFileUrl } from '@/lib/data';

interface AssetListItemProps {
  asset: Activo;
}

export default function AssetListItem({ asset }: AssetListItemProps) {
  const imageUrl = getFileUrl(asset, 'archivos');
  const categoryName = asset.expand?.categoria?.nombre ?? 'Sin categoría';
  const fileCount = asset.archivos?.length ?? 0;

  return (
    <Link 
      href={`/cultural/activo/${asset.id}`} 
      className="card card-side bg-base-100 border-2 border-[#D9C3A3] shadow-sm hover:shadow-lg hover:border-secondary transition-all overflow-hidden"
    >
      <figure className="relative w-64 h-auto bg-base-300 shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={asset.titulo}
            width={256}
            height={200}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-[#D6A77A] to-[#D9C3A3]">
            <FaImage className="w-16 h-16 text-[#5A1E02]/30" />
          </div>
        )}
      </figure>
      <div className="card-body py-4 px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="badge badge-sm bg-secondary text-white border-none mb-2">
              {categoryName}
            </span>
            <h3 className="card-title text-xl text-primary font-bold mb-2">
              {asset.titulo}
            </h3>
            <p className="text-base-content/70 line-clamp-2 text-sm mb-3">
              {asset.descripcion}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60 mt-auto pt-3 border-t border-[#D9C3A3]">
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
              <span>{fileCount} {fileCount === 1 ? 'archivo' : 'archivos'}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
