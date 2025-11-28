import type { Metadata } from "next";
import { getProductos } from "@/lib/data/tienda/productos";
import { transformProducto } from "@utils/transforms/productivo";
import { ProductCatalog, PageHeader } from "@components/productivo/tienda";
import ProductSearch from "@components/productivo/tienda/ProductSearch";
import { getCachedCategoriasConSubcategorias } from "@/lib/cache/categorias";
import type { Product } from "@/lib/types/productivo";

export const metadata: Metadata = {
  title: "Todos los Productos | SAISAL",
  description:
    "Descubre todos nuestros productos artesanales de Salinas de Guaranda.",
};

export const revalidate = 3600;

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const subcategoriaSlug = resolvedSearchParams.subcategoria;
  const sort = resolvedSearchParams.sort as string | undefined;
  const search = resolvedSearchParams.q as string | undefined;

  const [productosData, categoriasConSubcategorias] = await Promise.all([
    getProductos().catch(() => []),
    getCachedCategoriasConSubcategorias(),
  ]);

  let products: Product[] = productosData.map(transformProducto);

  // Filtrar por subcategoría si existe
  if (subcategoriaSlug) {
    const slugs = Array.isArray(subcategoriaSlug)
      ? subcategoriaSlug
      : [subcategoriaSlug];
    products = products.filter(
      (p) => p.subcategory?.slug && slugs.includes(p.subcategory.slug)
    );
  }

  // Filtrar por búsqueda
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    );
  }

  return (
    <main className="min-h-screen bg-base-100">
      {/* Header */}
      <PageHeader
        title="Todos los Productos"
        description="Explora nuestra colección completa de productos artesanales de Salinas de Guaranda."
        actions={<ProductSearch />}
        breadcrumbs={[{ label: "Productos" }]}
      />

      {/* Productos con filtros */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-4">
            {/* Catálogo de productos */}
            <div className="w-full">
              <ProductCatalog
                products={products}
                itemsPerPage={12}
                categorias={categoriasConSubcategorias}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
