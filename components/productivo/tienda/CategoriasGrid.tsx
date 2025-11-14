import Link from "next/link";
import CategoriaCard from "./CategoriasCard";
import Button from "@atoms/Button";
import Text from "@atoms/Text";
import type { Collection } from "@/lib/types/productivo";

interface CategoriaGridProps {
  title?: string;
  subtitle?: string;
  collections: Collection[];
  showViewAllButton?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
}

export default function CategoriasGrid({
  title = "Categorías de Productos",
  subtitle,
  collections,
  showViewAllButton = true,
  viewAllHref = "/categorias",
  viewAllText = "VER TODAS LAS CATEGORÍAS",
}: CategoriaGridProps) {
  return (
    <section id="categorias" className="py-16 md:py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-normal text-base-content mb-3">
            {title}
          </h2>
          {subtitle && (
            <Text variant="body" color="muted" className="max-w-2xl mx-auto">
              {subtitle}
            </Text>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <CategoriaCard
              key={collection.id}
              {...collection}
              delay={index * 100 + 100}
            />
          ))}
        </div>

        {showViewAllButton && (
          <div className="text-center mt-12">
            <Link href={viewAllHref}>
              <Button variant="primary" size="md">
                {viewAllText}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
