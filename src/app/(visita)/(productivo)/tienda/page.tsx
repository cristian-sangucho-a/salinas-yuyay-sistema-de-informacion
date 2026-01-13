import type { Metadata } from "next";
import { SALINAS_YUYAY } from "@utils/empresa";
import { featureIconMap } from "@utils/maps/productivo";
import {
  transformCategoria,
  transformProducto,
} from "@utils/transforms/productivo";

// Data Layer
import { getCategoriasProductos } from "@/lib/data/tienda/categorias";
import { getProductosDestacados } from "@/lib/data/tienda/productos";

// Organisms
import {
  TiendaHero,
  FeaturesBar,
  CategoriasGrid,
  FeaturedProduct,
  ProductsGrid,
} from "@components/productivo/tienda";

// Types
import type { Feature, Categoria, Product } from "@/lib/types/productivo";

export const metadata: Metadata = {
  title: "Tienda | Salinas Yuyay",
  description:
    "Descubre la calidad excepcional de nuestros productos artesanales de Salinas de Guaranda. Quesos, chocolates, embutidos y textiles hechos con tradición.",
};

// Revalidar cada hora (3600 segundos)
export const revalidate = 3600;

export default async function TiendaPage() {
  // Obtener datos desde PocketBase
  const [categorias, productosDestacados] = await Promise.all([
    getCategoriasProductos().catch(() => []),
    getProductosDestacados().catch(() => []),
  ]);

  // Transformar datos al formato esperado por los componentes
  const categoriasTransformadas: Categoria[] =
    categorias.map(transformCategoria);
  const favoriteProducts: Product[] = productosDestacados
    .slice(0, 12) // Limitar a 12 productos destacados
    .map(transformProducto);

  // Configuración de features (estático desde empresa.ts)
  const { tienda } = SALINAS_YUYAY;
  const features: Feature[] = tienda.features.map((feature) => ({
    icon: featureIconMap[feature.icon],
    title: feature.titulo,
    description: feature.descripcion,
    variant: feature.variant,
  }));

  return (
    <main className="min-h-screen">
      {/* Hero Section & Features Bar Wrapper (Root Logic) */}
      <section className="relative w-full h-[calc(100vh-80px)] flex flex-col">
        {/* Hero Content - Occupies remaining space */}
        <div className="flex-1 w-full relative min-h-0">
          <TiendaHero
            title={tienda.textos.hero.titulo}
            titleHighlight={tienda.textos.hero.tituloDestacado}
            description={tienda.textos.hero.descripcion}
          />
        </div>

        {/* Features Bar - Fixed height at bottom */}
        <div className="shrink-0 w-full relative z-20">
          <FeaturesBar
            features={features}
            variant="default"
            autoRotate={true}
            rotationSpeed={40}
          />
        </div>
      </section>

      {/* Categorías de Productos Andinos */}
      <CategoriasGrid
        categorias={categoriasTransformadas}
        title={tienda.textos.categorias.titulo}
        subtitle={tienda.textos.categorias.descripcion}
      />

      {/* Featured Product */}
      <FeaturedProduct
        title={tienda.textos.featuredProduct.titulo}
        subtitle={tienda.textos.featuredProduct.nombre}
        description={tienda.textos.featuredProduct.descripcion}
        features={tienda.textos.featuredProduct.features}
        buttonText={tienda.textos.featuredProduct.buttonText}
        buttonHref={tienda.textos.featuredProduct.buttonHref}
        imageIcon={tienda.textos.featuredProduct.imageIcon}
        image={tienda.textos.featuredProduct.image}
      />

      {/* Productos Destacados */}
      {favoriteProducts.length > 0 && (
        <ProductsGrid
          title={tienda.textos.productosDestacados.titulo}
          subtitle={tienda.textos.productosDestacados.descripcion}
          products={favoriteProducts}
          showViewAllButton={true}
        />
      )}
    </main>
  );
}
