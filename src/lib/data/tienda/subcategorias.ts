import { pb } from '@/lib/pocketbase';
import type { SubcategoriaProducto } from '@/lib/types/productivo';

/**
 * Obtiene todas las subcategorías de productos, ordenadas por nombre.
 */
export async function getSubcategoriasProductos(): Promise<SubcategoriaProducto[]> {
  try {
    const subcategorias = await pb
      .collection('subcategoria_productos')
      .getFullList<SubcategoriaProducto>({
        sort: 'nombre',
        expand: 'categoria_producto,productos',
      });
    return subcategorias;
  } catch (error) {
    console.error('Error fetching subcategorias productos:', error);
    throw new Error('No se pudieron cargar las subcategorías de productos');
  }
}

/**
 * Obtiene subcategorías filtradas por categoría padre.
 */
export async function getSubcategoriasByCategoria(
  categoriaId: string
): Promise<SubcategoriaProducto[]> {
  if (!categoriaId) return [];
  try {
    const subcategorias = await pb
      .collection('subcategoria_productos')
      .getFullList<SubcategoriaProducto>({
        filter: `categoria_producto = "${categoriaId}"`,
        sort: 'nombre',
        expand: 'productos',
      });
    return subcategorias;
  } catch (error) {
    console.error(
      `Error fetching subcategorias for categoria ${categoriaId}:`,
      error
    );
    return [];
  }
}

/**
 * Obtiene una subcategoría específica por su ID.
 */
export async function getSubcategoriaProductoById(
  id: string
): Promise<SubcategoriaProducto | null> {
  if (!id) return null;
  try {
    const subcategoria = await pb
      .collection('subcategoria_productos')
      .getOne<SubcategoriaProducto>(id, {
        expand: 'categoria_producto,productos',
      });
    return subcategoria;
  } catch (error) {
    console.error(`Error fetching subcategoria producto ${id}:`, error);
    return null;
  }
}

/**
 * Obtiene una subcategoría específica por su slug.
 */
export async function getSubcategoriaProductoBySlug(
  slug: string
): Promise<SubcategoriaProducto | null> {
  if (!slug) return null;
  try {
    const subcategorias = await pb
      .collection('subcategoria_productos')
      .getFullList<SubcategoriaProducto>({
        filter: `slug = "${slug}"`,
        expand: 'categoria_producto,productos',
      });
    return subcategorias.length > 0 ? subcategorias[0] : null;
  } catch (error) {
    console.error(
      `Error fetching subcategoria producto by slug ${slug}:`,
      error
    );
    return null;
  }
}