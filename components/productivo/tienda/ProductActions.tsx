"use client";

import React from "react";
import { ShoppingCart, Plus, Minus, Loader2, XCircle } from "lucide-react";
import Button from "@atoms/Button";
import { useAddToCart } from "@/hooks/useAddToCart";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
    contificoId?: string;
  };
  variant?: "default" | "card";
}

export default function ProductActions({
  product,
  variant = "default",
}: ProductActionsProps) {
  const {
    quantity,
    isChecking,
    isOutOfStock,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
  } = useAddToCart({
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      contificoId: product.contificoId,
    },
    checkOnMount: variant === "default", // Check stock on mount only for detail view (default)
  });

  const isCard = variant === "card";
  const heightClass = isCard ? "h-10" : "h-12";
  const iconSizeClass = isCard ? "w-4 h-4" : "w-5 h-5";
  const buttonBaseClass = isCard
    ? "w-10 h-10 p-0! min-h-0"
    : "w-12 h-12 p-0! min-h-0";
  const textSizeClass = isCard ? "text-base" : "text-lg";
  const containerClass = isCard ? "w-full sm:w-auto" : "w-full sm:w-auto";

  // Unified Render Logic

  // 1. Quantity Controls (Item in Cart)
  if (quantity > 0) {
    return (
      <div
        className={`flex items-center gap-2 ${containerClass} animate-in fade-in zoom-in duration-200`}
      >
        <Button
          onClick={handleDecreaseQuantity}
          variant="error"
          className={`${buttonBaseClass} rounded-lg shadow-md shrink-0`}
        >
          <Minus className={iconSizeClass} />
        </Button>
        <div
          className={`${heightClass} flex-1 flex items-center justify-center bg-base-100 rounded-lg border border-base-200 min-w-3rem`}
        >
          <span
            className={`text-center font-bold text-base-content ${textSizeClass}`}
          >
            {quantity}
          </span>
        </div>
        <Button
          onClick={handleIncreaseQuantity}
          variant="success"
          className={`${buttonBaseClass} rounded-lg shadow-md shrink-0 disabled:opacity-70`}
          disabled={isChecking || isOutOfStock}
        >
          {isChecking ? (
            <Loader2 className={`${iconSizeClass} animate-spin`} />
          ) : (
            <Plus className={iconSizeClass} />
          )}
        </Button>
      </div>
    );
  }

  // 2. Add to Cart Button (Default State)
  // We use the "outline" style for OutOfStock across the board now, as requested.
  return (
    <Button
      onClick={handleAddToCart}
      variant={isOutOfStock ? "outline" : "primary"}
      className={`${heightClass} w-full min-h-0 disabled:bg-base-300 disabled:text-base-content/50 disabled:border-base-300 transition-all ${
        isChecking ? "cursor-wait" : ""
      }`}
      disabled={isChecking || isOutOfStock}
    >
      {isOutOfStock ? (
        <>
          <XCircle className={`${iconSizeClass} mr-2`} />
          <span className="font-medium">Agotado</span>
        </>
      ) : isChecking ? (
        <>
          <Loader2 className={`${iconSizeClass} mr-2 animate-spin`} />
          <span className="font-medium">Validando...</span>
        </>
      ) : (
        <>
          <ShoppingCart className={`${iconSizeClass} mr-2`} />
          <span className="font-medium">
            {isCard ? "Agregar" : "Agregar al carrito"}
          </span>
        </>
      )}
    </Button>
  );
}
