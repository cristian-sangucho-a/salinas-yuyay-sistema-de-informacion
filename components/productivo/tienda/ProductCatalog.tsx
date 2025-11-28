"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import Text from "@atoms/Text";
import type { Product } from "@/lib/types/productivo";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { sortProducts, type SortOption } from "@/lib/utils/productFiltering";

import ProductToolbar from "./ProductToolbar";

interface FilterCategory {
  id: string;
  nombre: string;
  slug: string;
  subcategorias: {
    id: string;
    nombre: string;
    slug: string;
  }[];
}

interface ProductCatalogProps {
  products: Product[];
  totalItems?: number;
  itemsPerPage?: number;
  categorias?: FilterCategory[];
  currentCategoriaSlug?: string;
}

export default function ProductCatalog({
  products: allProducts,
  itemsPerPage = 12,
  categorias = [],
  currentCategoriaSlug,
}: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener parámetros de filtrado desde URL
  const sortBy = (searchParams.get("sort") || "relevancia") as SortOption;
  // const subcategoriaSlug = searchParams.get("subcategoria"); // Ya filtrado en servidor

  // Filtrar y ordenar productos en el cliente
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts;

    // Aplicar filtro de subcategoría si existe
    // (El filtro ya viene aplicado desde el servidor en este caso,
    // pero mantenemos la estructura para futuras mejoras)

    // Aplicar ordenamiento
    const sorted = sortProducts(filtered, sortBy);

    return sorted;
  }, [allProducts, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    endIndex
  );

  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, filteredAndSortedProducts.length);
  const totalItems = filteredAndSortedProducts.length;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar Superior */}
      <ProductToolbar
        totalItems={totalItems}
        startItem={startItem}
        endItem={endItem}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categorias={categorias}
        currentCategoriaSlug={currentCategoriaSlug}
      />

      {/* Grid de productos */}
      {paginatedProducts.length > 0 ? (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {paginatedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                {...product}
                delay={index * 100}
                variant={viewMode}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {/* Botón anterior */}
              <button
                onClick={() => handlePageChange(validCurrentPage - 1)}
                disabled={validCurrentPage === 1}
                className="p-2 rounded border border-base-300 hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Página anterior"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>

              {/* Números de página */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) => (
                  <div key={idx}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-base-content/50">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePageChange(page as number)}
                        className={`px-3 py-2 rounded transition-colors ${
                          validCurrentPage === page
                            ? "bg-primary text-primary-content font-medium"
                            : "hover:bg-base-200"
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Botón siguiente */}
              <button
                onClick={() => handlePageChange(validCurrentPage + 1)}
                disabled={validCurrentPage === totalPages}
                className="p-2 rounded border border-base-300 hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Página siguiente"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <Text color="muted" variant="large">
            No hay productos disponibles en esta categoría.
          </Text>
        </div>
      )}
    </div>
  );
}
