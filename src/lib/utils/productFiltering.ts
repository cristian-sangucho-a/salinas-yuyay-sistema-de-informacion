import type { Product } from "@/lib/types/productivo";

export type SortOption = "relevancia" | "precio-asc" | "precio-desc" | "nombre-asc";

/**
 * Ordena un array de productos según el criterio especificado
 */
export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sortedProducts = [...products];

  switch (sortBy) {
    case "precio-asc":
      return sortedProducts.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return sortedProducts.sort((a, b) => b.price - a.price);
    case "nombre-asc":
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case "relevancia":
    default:
      return sortedProducts;
  }
}

/**
 * Pagina un array de productos
 */
export function paginateProducts(
  products: Product[],
  page: number,
  itemsPerPage: number
): {
  items: Product[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
} {
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const items = products.slice(startIndex, endIndex);

  return {
    items,
    totalItems,
    totalPages,
    currentPage,
  };
}
