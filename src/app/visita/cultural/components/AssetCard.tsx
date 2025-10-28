import React from 'react';
import Image from 'next/image'; // Usar Image de Next.js
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaFileArchive } from 'react-icons/fa';

// Define una interfaz para las props del asset
interface Asset {
  id: string;
  image: string; // URL de la imagen (del campo 'archivo' de Pocketbase, necesitará lógica)
  category: { name: string }; // Asume que la categoría tiene un nombre
  title: string;
  description: string;
  year?: string; // Opcional
  author?: string; // Opcional
  fileCount: number; // Del campo múltiple 'archivo'
}

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  return (
    // Card: Fondo Beige sal, Borde Arena
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <figure className="relative h-48 w-full"> {/* Altura fija para la imagen */}
        <Image
          src={asset.image}
          alt={`Imagen de ${asset.title}`}
          layout="fill" // Ocupa todo el espacio de figure
          objectFit="cover" // Cubre el espacio sin distorsionar
          unoptimized={asset.image.startsWith('https://placehold.co')} // Desactiva optimización para placeholders
        />
      </figure>
      <div className="card-body p-4 md:p-5"> {/* Padding ajustado */}
        {/* Badge Categoría: Marrón arcilla */}
        <div className="card-actions justify-start mb-2">
          <span className="badge badge-secondary text-secondary-content">{asset.category.name}</span>
        </div>

        {/* Título: Gris pizarra */}
        <h2 className="card-title text-base-content text-lg font-semibold leading-snug mb-1 hover:text-primary transition-colors">
          {/* Enlace al detalle del activo (cambiar ruta si es necesario) */}
          <Link href={`/cultural/activos/${asset.id}`}>
            {asset.title}
          </Link>
        </h2>

        {/* Descripción: Gris pizarra (más claro) */}
        <p className="text-sm text-base-content/70 mb-3 line-clamp-2"> {/* Limita a 2 líneas */}
          {asset.description}
        </p>

        {/* Metadatos: Año, Autor, Cantidad */}
        <div className="flex flex-col space-y-1 text-xs text-base-content/70">
          {asset.year && (
            <div className="flex items-center gap-1.5">
              <FaCalendarAlt className="w-3 h-3" />
              <span>{asset.year}</span>
            </div>
          )}
          {asset.author && (
            <div className="flex items-center gap-1.5">
              <FaUser className="w-3 h-3" />
              <span>{asset.author}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <FaFileArchive className="w-3 h-3" />
            <span>{asset.fileCount} {asset.fileCount === 1 ? 'archivo' : 'archivos'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
