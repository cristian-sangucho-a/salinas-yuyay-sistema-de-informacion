"use client";

import { useState } from "react";
import Badge from "@atoms/Badge";
import Rating from "@atoms/Rating";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  delay?: number;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  rating = 5,
  reviewCount = 0,
  badge,
  delay = 0,
  onAddToCart,
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Adding product to cart:", id);
    onAddToCart?.(id);
  };

  return (
    <div className="group" style={{ animationDelay: `${delay}ms` }}>
      {/* Product Image */}
      <div className="relative aspect-square bg-base-200 overflow-hidden mb-4 group-hover:shadow-lg transition-shadow">
        <div className="absolute inset-0 flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-6xl">🧀</span>
          )}
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant="primary">{badge}</Badge>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-base-content line-clamp-2 group-hover:underline">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-base-content">
            ${price.toFixed(2)}
          </span>
          {badge && (
            <span className="text-xs text-base-content/70">{badge}</span>
          )}
        </div>
      </div>
    </div>
  );
}
