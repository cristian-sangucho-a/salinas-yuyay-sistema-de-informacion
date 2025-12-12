'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBoxOpen, FaTags, FaShoppingBag } from 'react-icons/fa';

export default function ProductivoNavTabs() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="bg-base-300/20 border-b border-base-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex overflow-x-auto">
          {/* Productos */}
          <Link
            href="/admin/productos"
            className={`flex items-center gap-2 px-5 py-3 font-medium border-r border-base-300 transition-colors whitespace-nowrap ${
              isActive("/admin/productos")
                ? "bg-white text-primary border-t-2 border-t-primary"
                : "bg-transparent text-base-content/70 hover:bg-base-300/20 hover:text-primary"
            }`}
          >
            <FaBoxOpen className="w-4 h-4" />
            Productos
          </Link>

          {/* Categorías */}
          <Link
            href="/admin/categorias-productos"
            className={`flex items-center gap-2 px-5 py-3 font-medium border-r border-base-300 transition-colors whitespace-nowrap ${
              isActive("/admin/categorias-productos")
                ? "bg-white text-primary border-t-2 border-t-primary"
                : "bg-transparent text-base-content/70 hover:bg-base-300/20 hover:text-primary"
            }`}
          >
            <FaTags className="w-4 h-4" />
            Categorías
          </Link>

          {/* SubCategorías */}
          <Link
            href="/admin/subcategorias-productos"
            className={`flex items-center gap-2 px-5 py-3 font-medium border-r border-base-300 transition-colors whitespace-nowrap ${
              isActive("/admin/subcategorias-productos")
                ? "bg-white text-primary border-t-2 border-t-primary"
                : "bg-transparent text-base-content/70 hover:bg-base-300/20 hover:text-primary"
            }`}
          >
            <FaShoppingBag className="w-4 h-4" />
            Subcategorías
          </Link>
        </div>
      </div>
    </div>
  );
}
