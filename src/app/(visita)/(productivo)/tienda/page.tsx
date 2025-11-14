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
import type { Feature, Collection, Product } from "@/lib/types/productivo";

export const metadata: Metadata = {
  title: "Tienda - Productos Artesanales | SAISAL",
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
  const collections: Collection[] = categorias.map(transformCategoria);
  const favoriteProducts: Product[] = productosDestacados
    .slice(0, 8) // Limitar a 8 productos destacados
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
      {/* Hero Section */}
      <TiendaHero
        title={tienda.textos.hero.titulo}
        titleHighlight={tienda.textos.hero.tituloDestacado}
        description={tienda.textos.hero.descripcion}
      />

      {/* Features Bar */}
      <FeaturesBar features={features} />

      {/* Categorías de Productos Andinos */}
      <CategoriasGrid
        collections={collections}
        title={tienda.textos.categorias.titulo}
      />

      {/* Featured Product */}
      <FeaturedProduct
        title="Queso Maduro Premium"
        description="Nuestro queso más emblemático, elaborado siguiendo recetas ancestrales transmitidas de generación en generación. Cada pieza es cuidadosamente seleccionada y madurada en condiciones óptimas para lograr su sabor único e inconfundible."
        features={[
          "Elaborado con leche fresca de la región",
          "Proceso de maduración controlado de 6 meses",
          "Sin conservantes ni aditivos artificiales",
          "Reconocido internacionalmente por su calidad",
        ]}
        buttonText="Explorar Más"
        buttonHref="/productos"
        imageIcon="🧀"
      />

      {/* Productos Destacados */}
      {favoriteProducts.length > 0 && (
        <ProductsGrid
          title={tienda.textos.productosDestacados.titulo}
          products={favoriteProducts}
        />
      )}
    </main>
  );
}
