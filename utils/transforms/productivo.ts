import { getFileUrl } from "@/lib/data";
import type {
  CategoriaProducto,
  Producto,
  Collection,
  Product,
} from "@/lib/types/productivo";

/**
 * Transforma una categoría de PocketBase al formato Collection esperado por el componente.
 */
export function transformCategoria(cat: CategoriaProducto): Collection {
  const imagen = cat.field ? getFileUrl(cat, "field") : null;

  return {
    id: cat.id,
    name: cat.nombre,
    description:
      cat.descripcion_categoria ||
      `Explora nuestros ${cat.nombre.toLowerCase()}`,
    icon: imagen || "📦", // Fallback emoji si no hay imagen
    href: `/tienda/categoria/${cat.slug}`,
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
    image: imagen || undefined,
    badge: producto.destacado ? "Destacado" : undefined,
  };
}
