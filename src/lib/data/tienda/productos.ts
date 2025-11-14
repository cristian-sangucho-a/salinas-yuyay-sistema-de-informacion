import { pb } from "@/lib/pocketbase";
import type { Producto } from "@/lib/types/productivo";
import type { ListResult } from "pocketbase";

/**
 * Obtiene todos los productos activos, ordenados por fecha de creación.
 */
export async function getProductos(): Promise<Producto[]> {
  try {
    const productos = await pb.collection("productos").getFullList<Producto>({
      filter: 'estado = "A"',
      sort: "-created",
      expand: "categoria,subcategoria",
    });
    return productos;
  } catch (error) {
    console.error("Error fetching productos:", error);
    throw new Error("No se pudieron cargar los productos");
  }
}

/**
 * Obtiene una lista paginada de productos activos.
 */
export async function getProductosPaginados(
  page: number = 1,
  perPage: number = 20
): Promise<ListResult<Producto>> {
  try {
    const productos = await pb
      .collection("productos")
      .getList<Producto>(page, perPage, {
        filter: 'estado = "A"',
        sort: "-created",
        expand: "categoria,subcategoria",
      });
    return productos;
  } catch (error) {
    console.error("Error fetching productos paginados:", error);
    return { page: 1, perPage: 0, totalItems: 0, totalPages: 1, items: [] };
  }
}

/**
 * Obtiene productos filtrados por categoría.
 */
export async function getProductosByCategoria(
  categoriaId: string,
  page: number = 1,
  perPage: number = 50
): Promise<ListResult<Producto>> {
  if (!categoriaId) {
    return { page: 1, perPage: 0, totalItems: 0, totalPages: 1, items: [] };
  }

  try {
    const productos = await pb
      .collection("productos")
      .getList<Producto>(page, perPage, {
        filter: `estado = "A" && categoria = "${categoriaId}"`,
        sort: "-created",
        expand: "categoria,subcategoria",
      });
    return productos;
  } catch (error) {
    console.error(
      `Error fetching productos by categoria ${categoriaId}:`,
      error
    );
    return { page: 1, perPage: 0, totalItems: 0, totalPages: 1, items: [] };
  }
}

/**
 * Obtiene productos filtrados por subcategoría.
 */
export async function getProductosBySubcategoria(
  subcategoriaId: string,
  page: number = 1,
  perPage: number = 50
): Promise<ListResult<Producto>> {
  if (!subcategoriaId) {
    return { page: 1, perPage: 0, totalItems: 0, totalPages: 1, items: [] };
  }

  try {
    const productos = await pb
      .collection("productos")
      .getList<Producto>(page, perPage, {
        filter: `estado = "A" && subcategoria = "${subcategoriaId}"`,
        sort: "-created",
        expand: "categoria,subcategoria",
      });
    return productos;
  } catch (error) {
    console.error(
      `Error fetching productos by subcategoria ${subcategoriaId}:`,
      error
    );
    return { page: 1, perPage: 0, totalItems: 0, totalPages: 1, items: [] };
  }
}

/**
 * Obtiene productos destacados (destacado = true).
 */
export async function getProductosDestacados(): Promise<Producto[]> {
  try {
    const productos = await pb.collection("productos").getFullList<Producto>({
      filter: '(estado = "A" || estado = "") && destacado = true',
      sort: "-created",
      expand: "categoria,subcategoria",
    });
    return productos;
  } catch (error) {
    console.error("Error fetching productos destacados:", error);
    return [];
  }
}

/**
 * Obtiene un producto específico por su ID.
 */
export async function getProductoById(id: string): Promise<Producto | null> {
  if (!id) return null;
  try {
    const producto = await pb.collection("productos").getOne<Producto>(id, {
      expand: "categoria,subcategoria",
    });
    // Verificar que esté activo
    if (producto.estado !== "A") return null;
    return producto;
  } catch (error) {
    console.error(`Error fetching producto ${id}:`, error);
    return null;
  }
}

/**
 * Obtiene un producto específico por su slug.
 */
export async function getProductoBySlug(
  slug: string
): Promise<Producto | null> {
  if (!slug) return null;
  try {
    const productos = await pb.collection("productos").getFullList<Producto>({
      filter: `slug = "${slug}" && estado = "A"`,
      expand: "categoria,subcategoria",
    });
    return productos.length > 0 ? productos[0] : null;
  } catch (error) {
    console.error(`Error fetching producto by slug ${slug}:`, error);
    return null;
  }
}
