import { getFileUrl } from "@/lib/data";
import type {
  CategoriaProducto,
  SubcategoriaProducto,
  Producto,
  Categoria,
  Product,
  Feature,
} from "@/lib/types/productivo";
import { FaLayerGroup } from "react-icons/fa";
import { createElement } from "react";

/**
 * Transforma una categoría de PocketBase al formato Collection esperado por el componente.
 */
export function transformCategoria(cat: CategoriaProducto): Categoria {
  const imagen = cat.field ? getFileUrl(cat, "field") : null;

  return {
    id: cat.id,
    name: cat.nombre,
    description:
      cat.descripcion_categoria ||
      `Explora nuestros ${cat.nombre.toLowerCase()}`,
    icon: imagen || "📦", // Fallback emoji si no hay imagen
    href: `/categorias/${cat.slug}`,
  };
}

/**
 * Transforma un producto de PocketBase al formato Product esperado por el componente.
 */
export function transformProducto(producto: Producto): Product {
  const precio = producto.pvp1 || producto.precioBase || 0;
  const imagen = producto.imagenes?.[0]
    ? getFileUrl(producto, "imagenes")
    : undefined;

  return {
    id: producto.id,
    name: producto.nombre || "Producto sin nombre",
    description: producto.descripcion || "",
    price: precio,
    contificoId: producto.contifico_id,
    image: imagen || undefined,
    slug: producto.slug,
    badge: producto.destacado ? "Destacado" : undefined,
    category: producto.expand?.categoria
      ? {
          id: producto.expand.categoria.id,
          name: producto.expand.categoria.nombre,
          slug: producto.expand.categoria.slug,
        }
      : undefined,
    subcategory: producto.expand?.subcategoria
      ? {
          id: producto.expand.subcategoria.id,
          name: producto.expand.subcategoria.nombre,
          slug: producto.expand.subcategoria.slug,
        }
      : undefined,
  };
}

/**
 * Transforma una subcategoría de PocketBase al formato Feature para FeaturesBar.
 */
export function transformSubcategoriaToFeature(
  subcategoria: SubcategoriaProducto
): Feature {
  return {
    icon: createElement(FaLayerGroup, { className: "w-6 h-6" }),
    title: subcategoria.nombre,
    description: subcategoria.descripcion_subcategoria || "",
    variant: "primary" as const,
  };
}
