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
      <div className="group relative flex flex-col sm:flex-row bg-white border border-base-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300">
        <Link
          href={`/productos/${slug}`}
          className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-base-200 overflow-hidden block"
        >
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover object-center transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-base-content/20">
              <span className="text-4xl">📦</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-base-100/90 backdrop-blur-sm text-base-content px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 shadow-sm flex items-center gap-1 z-10">
            <Eye className="w-3 h-3" />
            <span className="text-[10px] font-bold">Ver detalles</span>
          </div>
        </Link>

        <div className="flex flex-1 flex-col justify-between p-6">
          <div>
            <div className="flex justify-between items-start">
              <div>
                {categoryName && (
                  <Text
                    variant="caption"
                    color="info"
                    className="font-bold tracking-wider uppercase mb-1 block"
                  >
                    {categoryName}
                  </Text>
                )}
                <div className="group-hover:text-primary transition-colors">
                  <Link href={`/productos/${slug}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    <Title variant="h4" className="font-bold text-base-content">
                      {name}
                    </Title>
                  </Link>
                </div>
              </div>
              <Title variant="h3" className="font-bold text-accent">
                ${price.toFixed(2)}
              </Title>
            </div>
            <Text variant="small" color="muted" className="mt-2 line-clamp-2">
              {description}
            </Text>
          </div>

          <div className="mt-4 grid grid-cols-1 grid-rows-1 w-full sm:w-auto overflow-hidden">
            <div
              className={`col-start-1 row-start-1 transition-all duration-300 ease-in-out transform ${
                quantity > 0
                  ? "-translate-y-full opacity-0 invisible"
                  : "translate-y-0 opacity-100 visible"
              }`}
            >
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="h-12 w-full"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
            </div>

            <div
              className={`col-start-1 row-start-1 transition-all duration-300 ease-in-out transform ${
                quantity > 0
                  ? "translate-y-0 opacity-100 visible"
                  : "translate-y-full opacity-0 invisible"
              }`}
            >
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                  variant="error"
                  className="w-12 h-12 p-0! rounded-lg shadow-md min-h-0"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="h-12 min-w-12 px-2 flex items-center justify-center bg-base-100 rounded-lg border border-base-200">
                  <span className="text-center font-bold text-base-content text-lg">
                    {quantity}
                  </span>
                </div>
                <Button
                  onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                  variant="success"
                  className="w-12 h-12 p-0! rounded-lg shadow-md min-h-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Link
              href={`/productos/${slug}`}
              className="relative z-10 w-full block"
            >
              <Button variant="ghost" className="gap-2 rounded-none w-full">
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
    <div className="group relative bg-white border border-base-200 rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex flex-col h-full">
      <Link
        href={`/productos/${slug}`}
        className="relative aspect-square bg-base-200 overflow-hidden block"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover object-center transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full text-base-content/20">
            <span className="text-6xl">📦</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-base-100/95 backdrop-blur-md text-base-content px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 shadow-lg flex items-center gap-2 z-10">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-bold">Ver detalles</span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          {categoryName && (
            <Text
              variant="caption"
              color="info"
              className="font-bold tracking-wider uppercase mb-1 block"
            >
              {categoryName}
            </Text>
          )}
          <div className="group-hover:text-primary transition-colors">
            <Link href={`/productos/${slug}`}>
              <Text
                variant="large"
                color="default"
                className="font-bold leading-tight"
              >
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
          <Title variant="h4" className="font-bold text-accent">
            ${price.toFixed(2)}
          </Title>

          <div className="grid grid-cols-1 grid-rows-1 w-auto overflow-hidden relative z-20">
            <div
              className={`col-start-1 row-start-1 transition-all duration-300 ease-in-out transform ${
                quantity > 0
                  ? "-translate-y-full opacity-0 invisible"
                  : "translate-y-0 opacity-100 visible"
              }`}
            >
              <Button
                onClick={handleAddToCart}
                variant="primary"
                className="h-12 w-full"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                <Text variant="button" color="inherit" as="span">
                  Agregar
                </Text>
              </Button>
            </div>

            <div
              className={`col-start-1 row-start-1 transition-all duration-300 ease-in-out transform ${
                quantity > 0
                  ? "translate-y-0 opacity-100 visible"
                  : "translate-y-full opacity-0 invisible"
              }`}
            >
              <div className="flex items-center gap-2">
                <Button
                  onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
                  variant="error"
                  className="w-12 h-12 p-0! rounded-lg shadow-md min-h-0"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="h-12 w-12 flex items-center justify-center bg-base-100 rounded-lg border border-base-200">
                  <span className="text-center font-bold text-base-content text-lg">
                    {quantity}
                  </span>
                </div>
                <Button
                  onClick={(e) => handleUpdateQuantity(e, quantity + 1)}
                  variant="success"
                  className="w-12 h-12 p-0! rounded-lg shadow-md min-h-0"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
