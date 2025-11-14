import { pb } from "@/lib/pocketbase";
import type { CategoriaProducto } from "@/lib/types/productivo";

/**
 * Obtiene todas las categorías de productos, ordenadas por nombre.
 */
export async function getCategoriasProductos(): Promise<CategoriaProducto[]> {
  try {
    const categorias = await pb
      .collection("categoria_productos")
      .getFullList<CategoriaProducto>({
        sort: "nombre",
        expand: "subcategorias,productos",
      });
    return categorias;
  } catch (error) {
    console.error("Error fetching categorias productos:", error);
    throw new Error("No se pudieron cargar las categorías de productos");
  }
}

/**
 * Obtiene una categoría específica por su ID.
 */
export async function getCategoriaProductoById(
  id: string
): Promise<CategoriaProducto | null> {
  if (!id) return null;
  try {
    const categoria = await pb
      .collection("categoria_productos")
      .getOne<CategoriaProducto>(id, {
        expand: "subcategorias,productos",
      });
    return categoria;
  } catch (error) {
    console.error(`Error fetching categoria producto ${id}:`, error);
    return null;
  }
}

/**
 * Obtiene una categoría específica por su slug.
 */
export async function getCategoriaProductoBySlug(
  slug: string
): Promise<CategoriaProducto | null> {
  if (!slug) return null;
  try {
    const categorias = await pb
      .collection("categoria_productos")
      .getFullList<CategoriaProducto>({
        filter: `slug = "${slug}"`,
        expand: "subcategorias,productos",
      });
    return categorias.length > 0 ? categorias[0] : null;
  } catch (error) {
    console.error(`Error fetching categoria producto by slug ${slug}:`, error);
    return null;
  }
}

/**
 * Obtiene el conteo de productos por categoría.
 */
export async function getProductCountsByCategoria(): Promise<
  Record<string, number>
> {
  try {
    const categorias = await pb
      .collection("categoria_productos")
      .getFullList<CategoriaProducto>({
        fields: "id,productos",
      });

    const counts: Record<string, number> = {};
    categorias.forEach((cat) => {
      counts[cat.id] = cat.productos?.length || 0;
    });

    return counts;
  } catch (error) {
    console.error("Error fetching product counts by categoria:", error);
    return {};
  }
}
