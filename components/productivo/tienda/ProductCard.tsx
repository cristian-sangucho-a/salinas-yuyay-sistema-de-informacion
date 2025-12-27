"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@atoms/Button";
import Text from "@atoms/Text";
import Title from "@atoms/Title";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string | { name: string };
  slug?: string;
  variant?: "grid" | "list";
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  category,
  slug = "#",
  variant = "grid",
}: ProductCardProps) {
  const { addToCart, items, updateQuantity } = useCart();

  const categoryName = typeof category === "object" ? category?.name : category;
  const cartItem = items.find((item) => item.id === id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      image,
      category: categoryName,
    });
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(id, newQuantity);
  };

  if (variant === "list") {
    return (
      <div className="group relative flex flex-col sm:flex-row bg-base-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-base-200 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-base-content/20">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex justify-between items-start">
              <div>
                {categoryName && (
                  <Text
                    variant="caption"
                    className="font-bold tracking-wider text-primary uppercase mb-1 block"
                  >
                    {categoryName}
                  </Text>
                )}
                <div className="group-hover:text-primary transition-colors">
                  <Link href={`/productos/${slug}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    <Title variant="h4" className="font-bold">
                      {name}
                    </Title>
                  </Link>
                </div>
              </div>
              <Title variant="h3" className="font-bold">
                ${price.toFixed(2)}
              </Title>
            </div>
            <Text variant="small" color="muted" className="mt-2 line-clamp-2">
              {description}
            </Text>
          </div>

          <div className="mt-4 flex items-center gap-4">
            {quantity > 0 ? (
              <div className="flex items-center border border-primary/20 bg-base-100 h-10 z-20 relative animate-in fade-in zoom-in duration-200">
                <button
                  onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                  className="h-full px-3 hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium text-sm">
                  {quantity}
                </span>
                <button
                  onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                  className="h-full px-3 hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button onClick={handleAddToCart} variant="outline">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
            )}
            <Link href={`/productos/${slug}`} className="relative z-10">
              <Button variant="ghost" className="gap-2 rounded-none">
                <Eye className="w-4 h-4" />
                Ver detalles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-base-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link
        href={`/productos/${slug}`}
        className="relative aspect-square bg-base-200 overflow-hidden block"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-base-content/20">
            <span className="text-6xl">📦</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          {categoryName && (
            <Text
              variant="caption"
              className="font-bold tracking-wider text-primary uppercase mb-1 block"
            >
              {categoryName}
            </Text>
          )}
          <div className="group-hover:text-primary transition-colors">
            <Link href={`/productos/${slug}`}>
              <Text variant="large" className="font-bold leading-tight">
                {name}
              </Text>
            </Link>
          </div>
        </div>

        <Text
          variant="small"
          color="muted"
          className="line-clamp-2 mb-4 flex-1"
        >
          {description}
        </Text>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <Title variant="h4" className="font-bold">
            ${price.toFixed(2)}
          </Title>

          {quantity > 0 ? (
            <div className="flex items-center border border-primary/20 bg-base-100 h-10 z-20 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                className="h-full px-3 hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium text-sm">
                {quantity}
              </span>
              <button
                onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                className="h-full px-3 hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button onClick={handleAddToCart} variant="outline">
              <ShoppingCart className="w-6 h-6" />
              <Text variant="button" color="inherit" as="span">
                Agregar
              </Text>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
