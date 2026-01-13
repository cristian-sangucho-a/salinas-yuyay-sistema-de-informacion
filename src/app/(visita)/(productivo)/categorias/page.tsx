import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategoriasProductos } from "@/lib/data/tienda/categorias";
import { transformCategoria } from "@utils/transforms/productivo";
import {
  PageHeader,
  CategoriasGrid,
  ProductSearch,
} from "@components/productivo/tienda";
import type { Categoria } from "@/lib/types/productivo";

export const metadata: Metadata = {
  title: "Categorías de Productos | Salinas Yuyay",
  description:
    "Explora todas nuestras categorías de productos artesanales de Salinas de Guaranda.",
};

export const revalidate = 3600;

export default async function CategoriasPage() {
  const categorias = await getCategoriasProductos().catch(() => []);
  const categoriasTransformadas: Categoria[] =
    categorias.map(transformCategoria);

  return (
    <main className="min-h-screen bg-base-100">
      {/* Header */}
      <PageHeader
        title="Categorías de Productos"
        description="Descubre nuestra amplia selección de productos artesanales organizados por categoría."
        breadcrumbs={[{ label: "Categorías" }]}
        actions={
          <Suspense>
            <ProductSearch />
          </Suspense>
        }
      />

      {/* Categorías Grid */}
      <CategoriasGrid
        categorias={categoriasTransformadas}
        showViewAllButton={false}
        title=""
      />
    </main>
  );
}
