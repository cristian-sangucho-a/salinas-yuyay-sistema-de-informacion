import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductoBySlug } from "@/lib/data/tienda/productos";
import { getFileUrl } from "@/lib/data";
import {
  PageHeader,
  ProductGallery,
  StickyProductSummary,
  ProductInfo,
  MobileStickyBar,
  ProductSearch,
} from "@components/productivo/tienda";
import Badge from "@atoms/Badge";

interface ProductoPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);

  if (!producto) {
    return {
      title: "Producto no encontrado | Salinas Yuyay",
    };
  }

  return {
    title: `${producto.nombre} | Salinas Yuyay`,
    description:
      producto.descripcion || `Producto artesanal: ${producto.nombre}`,
  };
}

export const revalidate = 3600;

export default async function ProductoPage({ params }: ProductoPageProps) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);

  if (!producto) {
    notFound();
  }

  const precio = producto.pvp1 || 0;
  const imagenPrincipal = producto.imagenes?.[0]
    ? getFileUrl(producto, "imagenes")
    : null;

  // Prepare all images
  const allImages =
    producto.imagenes?.map((img) => getFileUrl(producto, "imagenes", img)) ||
    [];

  const categoriaNombre = producto.expand?.categoria?.nombre;
  const categoriaSlug = producto.expand?.categoria?.slug;
  const subcategoriaNombre = producto.expand?.subcategoria?.nombre;

  const breadcrumbs = [
    { label: "Productos", href: "/productos" },
    ...(categoriaNombre && categoriaSlug
      ? [{ label: categoriaNombre, href: `/categorias/${categoriaSlug}` }]
      : []),
    { label: producto.nombre || "Producto" },
  ];

  return (
    <main className="min-h-screen bg-base-100 pb-24 lg:pb-0">
      {/* Header */}
      <PageHeader
        title={producto.nombre || "Producto sin nombre"}
        breadcrumbs={breadcrumbs}
        actions={<ProductSearch />}
        badge={
          <div className="flex flex-wrap gap-2">
            {producto.destacado && <Badge variant="accent">Destacado</Badge>}
            {categoriaNombre && (
              <Badge variant="neutral">{categoriaNombre}</Badge>
            )}
            {subcategoriaNombre && (
              <Badge variant="secondary">{subcategoriaNombre}</Badge>
            )}
          </div>
        }
      />

      {/* Contenido del producto */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Imagen del producto */}
            <ProductGallery
              images={allImages.filter((img): img is string => !!img)}
              name={producto.nombre || "Producto"}
            />

            {/* Información del producto */}
            <div className="space-y-8 h-fit relative">
              {/* Precio y Botón Sticky */}
              <StickyProductSummary
                product={{
                  id: producto.id,
                  name: producto.nombre || "Producto",
                  price: precio,
                  image: imagenPrincipal || undefined,
                  category: categoriaNombre,
                }}
              />

              <ProductInfo
                description={producto.descripcion}
                ingredients={producto.ingredientes}
                storageConditions={producto.condicionesAlmacenamiento}
                creationDate={producto.fecha_creacion}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Barra fija inferior para Mobile */}
      <MobileStickyBar
        price={precio}
        product={{
          id: producto.id,
          name: producto.nombre || "Producto",
          price: precio,
          image: imagenPrincipal || undefined,
          category: categoriaNombre,
        }}
      />
    </main>
  );
}
