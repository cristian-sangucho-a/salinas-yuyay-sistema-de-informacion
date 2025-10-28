import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaFileArchive } from 'react-icons/fa';

// Reutiliza la misma interfaz Asset
interface Asset {
  id: string;
  image: string;
  category: { name: string };
  title: string;
  description: string;
  year?: string;
  author?: string;
  fileCount: number;
}

interface AssetListItemProps {
  asset: Asset;
}

export default function AssetListItem({ asset }: AssetListItemProps) {
  return (
    // Contenedor: Fondo Beige sal, Borde Arena
    <div className="flex flex-col sm:flex-row gap-4 bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden p-4">
      {/* Imagen */}
      <div className="relative w-full sm:w-32 h-32 sm:h-auto shrink-0 rounded overflow-hidden"> {/* Tamaño fijo y redondeado */}
        <Image
          src={asset.image}
          alt={`Imagen de ${asset.title}`}
          layout="fill"
          objectFit="cover"
           unoptimized={asset.image.startsWith('https://placehold.co')}
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col grow">
         {/* Badge Categoría: Marrón arcilla */}
         <span className="badge badge-secondary text-secondary-content mb-1 self-start">{asset.category.name}</span>

        {/* Título: Gris pizarra */}
        <h2 className="text-base-content text-lg font-semibold leading-snug mb-1 hover:text-primary transition-colors">
           <Link href={`/cultural/activos/${asset.id}`}>
            {asset.title}
          </Link>
        </h2>

        {/* Descripción: Gris pizarra (más claro) */}
        <p className="text-sm text-base-content/70 mb-2 line-clamp-2">
          {asset.description}
        </p>

        {/* Metadatos en línea */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-base-content/70 mt-auto pt-1"> {/* mt-auto empuja hacia abajo */}
          {asset.year && (
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{asset.year}</span>
            </div>
          )}
          {asset.author && (
            <div className="flex items-center gap-1">
              <FaUser className="w-3 h-3" />
              <span>{asset.author}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <FaFileArchive className="w-3 h-3" />
            <span>{asset.fileCount} {asset.fileCount === 1 ? 'archivo' : 'archivos'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
