'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaImage, FaFolder } from 'react-icons/fa';
import type { Categoria } from '@/lib/types';
import { getFileUrl } from '@/lib/data';

interface CategoryCardProps {
  categoria: Categoria;
  assetCount: number;
}

export default function CategoryCard({ categoria, assetCount }: CategoryCardProps) {
  const imageUrl = getFileUrl(categoria, 'imagen');

  return (
    <Link 
      href={`/cultural/categoria/${categoria.id}`} 
      className="card bg-base-100 border-2 border-[#D9C3A3] shadow-md hover:shadow-xl hover:border-secondary transition-all hover:-translate-y-1 overflow-hidden h-full flex flex-col"
    >
      <figure className="relative h-48 w-full bg-base-300 flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={categoria.nombre}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-linear-to-br from-[#D6A77A] to-[#D9C3A3]">
            <FaImage className="w-20 h-20 text-[#5A1E02]/30" />
          </div>
        )}
      </figure>
      <div className="card-body p-5 flex-1 flex flex-col">
        <h3 className="card-title text-lg text-primary font-bold line-clamp-2">
          {categoria.nombre}
        </h3>
        <p className="text-base-content/70 line-clamp-2 text-sm flex-1">
          {categoria.descripcion}
        </p>
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
