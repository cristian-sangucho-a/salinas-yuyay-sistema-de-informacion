import { unstable_cache } from "next/cache";
import { getCategoriasProductos } from "@/lib/data/tienda/categorias";
import { getSubcategoriasByCategoria } from "@/lib/data/tienda/subcategorias";

/**
 * Cache de todas las categorías con sus subcategorías.
 * Se revalida cada hora (3600 segundos).
 */
export const getCachedCategoriasConSubcategorias = unstable_cache(
  async () => {
    const categorias = await getCategoriasProductos();

    const categoriasConSubs = await Promise.all(
      categorias.map(async (cat) => {
        const subs = await getSubcategoriasByCategoria(cat.id);
        return {
          id: cat.id,
          nombre: cat.nombre,
          slug: cat.slug,
          subcategorias: subs.map((sub) => ({
            id: sub.id,
            nombre: sub.nombre,
            slug: sub.slug,
          })),
        };
      })
    );

    return categoriasConSubs;
  },
  ["categorias-con-subcategorias"],
  {
    revalidate: 3600, // 1 hora
    tags: ["categorias"],
  }
);
