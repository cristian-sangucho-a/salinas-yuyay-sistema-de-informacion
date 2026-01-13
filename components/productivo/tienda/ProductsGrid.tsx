"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import Button from "@atoms/Button";
import Text from "@atoms/Text";
import type { Product } from "@/lib/types/productivo";

interface ProductsGridProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  showViewAllButton?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
}

export default function ProductsGrid({
  title = "Favoritos de la comunidad",
  subtitle,
  products,
  showViewAllButton = false,
  viewAllHref = "/productos",
  viewAllText = "VER TODOS LOS PRODUCTOS",
}: ProductsGridProps) {
  return (
    <section id="productos" className="py-16 md:py-20 bg-base-100">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
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
