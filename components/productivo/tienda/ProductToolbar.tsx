"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  FaFilter,
  FaSortAmountDown,
  FaThLarge,
  FaList,
  FaChevronDown,
} from "react-icons/fa";
import Text from "@atoms/Text";
import ProductFiltersClient from "./ProductFiltersClient";

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

interface ProductToolbarProps {
  totalItems: number;
  startItem: number;
  endItem: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  categorias: FilterCategory[];
  currentCategoriaSlug?: string;
}

export default function ProductToolbar({
  totalItems,
  startItem,
  endItem,
  viewMode,
  onViewModeChange,
  categorias,
  currentCategoriaSlug,
}: ProductToolbarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortBy = searchParams.get("sort") || "relevancia";

  const sortOptions = [
    { value: "relevancia", label: "Relevancia" },
    { value: "precio-asc", label: "Precio: menor a mayor" },
    { value: "precio-desc", label: "Precio: mayor a menor" },
    { value: "nombre-asc", label: "Nombre: A-Z" },
  ];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "relevancia") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`);
    setIsSortOpen(false);
  };

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isSortClick = target.closest(".sort-dropdown");
      const isFilterClick = target.closest(".filter-dropdown");

      if (!isSortClick) setIsSortOpen(false);
      if (!isFilterClick) setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-base-100 border border-base-200 rounded-lg p-2 mb-4 shadow-sm relative z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* 1. Botón Filtros (Izquierda) */}
          <div className="relative filter-dropdown w-full md:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-full md:w-auto justify-center border ${
                isFilterOpen
                  ? "bg-primary text-primary-content! border-primary"
                  : "bg-base-100 border-base-300 hover:border-primary hover:bg-base-200 text-base-content"
              }`}
            >
              <FaFilter
                className={`w-3.5 h-3.5 ${
                  isFilterOpen
                    ? "text-primary-content!"
                    : "text-base-content/70"
                }`}
              />
              Filtros
              <FaChevronDown
                className={`w-3 h-3 transition-transform ${
                  isFilterOpen
                    ? "rotate-180 text-primary-content!"
                    : "text-base-content/70"
                }`}
              />
            </button>

            {/* Dropdown de Filtros */}
            {isFilterOpen && (
              <div className="absolute left-0 top-full mt-2 w-full md:w-72 bg-base-100 border border-base-200 rounded-lg shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <ProductFiltersClient
                    categorias={categorias}
                    currentCategoriaSlug={currentCategoriaSlug}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Contador (Centro) */}
          <div className="hidden md:block flex-1 text-center">
            <Text variant="small" className="text-base-content/70 text-xs">
              Mostrando {startItem}–{endItem} de {totalItems} resultados
            </Text>
          </div>

          {/* 3. Ordenar y Vista (Derecha) */}
          <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto">
            {/* Dropdown Ordenar */}
            <div className="relative sort-dropdown flex-1 md:flex-none">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors w-full md:w-48 border ${
                  isSortOpen
                    ? "bg-primary text-primary-content! border-primary"
                    : "bg-base-100 border-base-300 hover:border-primary hover:bg-base-200 text-base-content"
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <FaSortAmountDown
                    className={`w-3.5 h-3.5 ${
                      isSortOpen
                        ? "text-primary-content!"
                        : "text-base-content/50"
                    }`}
                  />
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                </span>
                <FaChevronDown
                  className={`w-3 h-3 transition-transform ${
                    isSortOpen
                      ? "rotate-180 text-primary-content!"
                      : "text-base-content/50"
                  }`}
                />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-2 w-full md:w-56 bg-base-100 border border-base-200 rounded-lg shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                  <div className="space-y-1">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                          sortBy === option.value
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-base-content hover:bg-base-200"
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selector de Vista */}
            <div className="flex items-center bg-base-200 rounded-md p-1 gap-1">
              <button
                onClick={() => onViewModeChange("grid")}
                className={`p-1 rounded transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-primary"
                    : "text-base-content/50 hover:text-base-content"
                }`}
                title="Vista Cuadrícula"
              >
                <FaThLarge className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={`p-1 rounded transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-primary"
                    : "text-base-content/50 hover:text-base-content"
                }`}
                title="Vista Lista"
              >
                <FaList className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
