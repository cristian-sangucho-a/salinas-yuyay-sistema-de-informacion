import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoriaProductoBySlug } from "@/lib/data/tienda/categorias";
import { getSubcategoriasByCategoria } from "@/lib/data/tienda/subcategorias";
import { getProductosByCategoria } from "@/lib/data/tienda/productos";
import {
  transformProducto,
  transformSubcategoriaToFeature,
} from "@utils/transforms/productivo";
import { getCachedCategoriasConSubcategorias } from "@/lib/cache/categorias";
import { PageHeader, ProductCatalog } from "@components/productivo/tienda";
import ProductSearch from "@components/productivo/tienda/ProductSearch";
import FeaturesBar from "@components/molecules/FeaturesBar";
import type { Product, Feature } from "@/lib/types/productivo";

interface CategoriaPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    subcategoria?: string;
    sort?: string;
    q?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoriaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategoriaProductoBySlug(slug);

  if (!categoria) {
    return {
      title: "Categoría no encontrada | SAISAL",
    };
  }

  return {
    title: `${categoria.nombre} | Salinas Yuyay`,
    description:
      categoria.descripcion_categoria ||
      `Explora nuestros productos de ${categoria.nombre}`,
  };
}

export const revalidate = 0;

export default async function CategoriaPage({
  params,
  searchParams,
}: CategoriaPageProps) {
  const { slug } = await params;
  const { subcategoria: subcategoriaSlug, q: search } = await searchParams;

  const categoria = await getCategoriaProductoBySlug(slug);

  if (!categoria) {
    notFound();
  }

  // Obtener categorías cacheadas y subcategorías de la categoría actual
  const [categoriasConSubcategorias, subcategoriasData] = await Promise.all([
    getCachedCategoriasConSubcategorias(),
    getSubcategoriasByCategoria(categoria.id),
  ]);

  // Obtener productos de la categoría (traemos hasta 100 para filtrar en memoria si es necesario)
  // Nota: Para soportar múltiples subcategorías sin cambiar el backend, traemos todo y filtramos.
  const productosData = await getProductosByCategoria(categoria.id, 1, 100);

  // Transformar productos (el ordenamiento se hace en el cliente)
  let products: Product[] = productosData.items.map(transformProducto);

  // Filtrar por subcategorías si existen
  if (subcategoriaSlug) {
    const slugs = Array.isArray(subcategoriaSlug)
      ? subcategoriaSlug
      : [subcategoriaSlug];
    products = products.filter(
      (p) => p.subcategory?.slug && slugs.includes(p.subcategory.slug),
    );
  }

  // Filtrar por búsqueda
  if (search) {
    const searchLower = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower),
    );
  }

  // Transformar subcategorías para FeaturesBar
  const subcategoriasFeatures: Feature[] = subcategoriasData.map(
    transformSubcategoriaToFeature,
  );

  return (
    <main className="min-h-screen bg-base-100">
      {/* Header */}
      <PageHeader
        title={categoria.nombre}
        description={categoria.descripcion_categoria}
        breadcrumbs={[
          { label: "Categorías", href: "/categorias" },
          { label: categoria.nombre },
        ]}
        actions={<ProductSearch />}
      />

      {/* Subcategorías como Features Bar */}
      {subcategoriasFeatures.length > 0 && (
        <FeaturesBar features={subcategoriasFeatures} variant="slim" />
      )}

      {/* Productos con filtros */}
      <section className="py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-4">
            {/* Grid de productos */}
            <div className="w-full">
              <ProductCatalog
                products={products}
                itemsPerPage={12}
                categorias={categoriasConSubcategorias}
                currentCategoriaSlug={slug}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
