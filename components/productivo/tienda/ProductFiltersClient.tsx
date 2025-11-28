"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Text from "@atoms/Text";

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

interface ProductFiltersClientProps {
  categorias: FilterCategory[];
  currentCategoriaSlug?: string;
}

export default function ProductFiltersClient({
  categorias,
  currentCategoriaSlug,
}: ProductFiltersClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedSubcategorias = searchParams.getAll("subcategoria");
  const hasActiveFilters = selectedSubcategorias.length > 0;

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    const initialExpanded = new Set<string>();

    if (currentCategoriaSlug) {
      initialExpanded.add(currentCategoriaSlug);
    }

    // Expandir categorías con filtros activos
    categorias.forEach((c) => {
      if (c.subcategorias.some((s) => selectedSubcategorias.includes(s.slug))) {
        initialExpanded.add(c.slug);
      }
    });

    setExpandedCategories(Array.from(initialExpanded));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategoriaSlug, categorias]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubcategoriaChange = (slug: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) {
      params.append("subcategoria", slug);
    } else {
      params.delete("subcategoria");
      const newSelected = selectedSubcategorias.filter((s) => s !== slug);
      newSelected.forEach((s) => params.append("subcategoria", s));
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("subcategoria");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      {/* Header con Limpiar Filtros */}
      <div className="flex items-center justify-between px-1">
        <Text
          variant="small"
          className="font-semibold text-xs text-base-content/70 uppercase tracking-wider"
        >
          Categorías
        </Text>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:text-primary-focus font-medium hover:underline transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Ver todo */}
      <Link
        href="/productos"
        className="flex items-center gap-2 py-2 px-3 rounded-md bg-base-200/50 hover:bg-base-200 transition-colors"
      >
        <Text variant="small" className="font-medium text-sm text-base-content">
          Ver Todas las Categorías
        </Text>
      </Link>

      <div className="space-y-1">
        {categorias.map((categoria) => {
          const isCurrentCategoria = currentCategoriaSlug === categoria.slug;
          const isExpanded = expandedCategories.includes(categoria.slug);

          return (
            <div key={categoria.id} className="space-y-1">
              {/* Categoría principal */}
              <div className="flex items-center justify-between group">
                <Link
                  href={`/categorias/${categoria.slug}`}
                  className={`flex-1 py-2 px-3 rounded-md transition-colors ${
                    isCurrentCategoria
                      ? "bg-primary/5 text-primary font-semibold"
                      : "hover:bg-base-200 text-base-content font-medium"
                  }`}
                >
                  <span className="text-sm">{categoria.nombre}</span>
                </Link>

                {categoria.subcategorias.length > 0 && (
                  <button
                    onClick={() => toggleCategory(categoria.slug)}
                    className="p-2 rounded-md hover:bg-base-200 text-base-content/50 hover:text-base-content transition-colors"
                  >
                    {isExpanded ? (
                      <FaChevronDown className="w-3 h-3" />
                    ) : (
                      <FaChevronRight className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Subcategorías con Checkbox */}
              {isExpanded && categoria.subcategorias.length > 0 && (
                <div className="ml-3 pl-3 border-l border-base-200 space-y-1 py-1 animate-in slide-in-from-top-2 duration-200">
                  {categoria.subcategorias.map((subcategoria) => {
                    const isChecked = selectedSubcategorias.includes(
                      subcategoria.slug
                    );

                    return (
                      <label
                        key={subcategoria.id}
                        className="flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-base-100 cursor-pointer group transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs checkbox-primary rounded-sm"
                          checked={isChecked}
                          onChange={(e) =>
                            handleSubcategoriaChange(
                              subcategoria.slug,
                              e.target.checked
                            )
                          }
                        />
                        <span
                          className={`text-sm transition-colors ${
                            isChecked
                              ? "text-base-content font-medium"
                              : "text-base-content/70 group-hover:text-base-content"
                          }`}
                        >
                          {subcategoria.nombre}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
