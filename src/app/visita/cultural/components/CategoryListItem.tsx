'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaImage, FaFolder } from 'react-icons/fa';
import type { Categoria } from '@/lib/types';
import { getFileUrl } from '@/lib/data';

interface CategoryListItemProps {
  categoria: Categoria;
  assetCount: number;
}

export default function CategoryListItem({ categoria, assetCount }: CategoryListItemProps) {
  const imageUrl = getFileUrl(categoria, 'imagen');

  return (
    <Link 
      href={`/visita/cultural/categoria/${categoria.id}`} 
      className="card card-side bg-base-100 border-2 border-[#D9C3A3] shadow-sm hover:shadow-lg hover:border-secondary transition-all overflow-hidden"
    >
      <figure className="relative w-64 h-auto bg-base-300 shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={categoria.nombre}
            width={256}
            height={200}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#D6A77A] to-[#D9C3A3]">
            <FaImage className="w-16 h-16 text-[#5A1E02]/30" />
          </div>
        )}
      </figure>
      <div className="card-body py-4 px-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="card-title text-xl text-primary font-bold mb-2">
              {categoria.nombre}
            </h3>
            <p className="text-base-content/70 line-clamp-3 text-sm">
              {categoria.descripcion}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[#D9C3A3]">
          <FaFolder className="text-secondary w-4 h-4" />
          <span className="text-sm font-medium text-base-content/80">
            {assetCount} {assetCount === 1 ? 'activo' : 'activos'}
          </span>
        </div>
      </div>
    </Link>
  );
}
