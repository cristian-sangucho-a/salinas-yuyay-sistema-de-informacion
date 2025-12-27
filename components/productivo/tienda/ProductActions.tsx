"use client";

import React from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@atoms/Button";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart, items, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  if (quantity > 0) {
    return (
      <div className="flex items-center border border-primary/20 bg-base-100 h-10 md:h-12 w-full sm:w-auto min-w-[140px] md:min-w-40 animate-in fade-in zoom-in duration-200 transition-all">
        <button
          onClick={() => handleUpdateQuantity(quantity - 1)}
          className="h-full px-3 md:px-4 hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
        >
          <Minus className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <span className="flex-1 text-center font-bold text-base md:text-lg">
          {quantity}
        </span>
        <button
          onClick={() => handleUpdateQuantity(quantity + 1)}
          className="h-full px-3 md:px-4 hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant="primary"
      size="lg"
      className="w-full sm:w-auto gap-2 h-10 md:h-12 min-h-0 px-4"
    >
      <ShoppingCart className="w-3.5 h-3.5 md:w-5 md:h-5" />
      <span className="text-sm md:text-base font-medium">
        Agregar al carrito
      </span>
    </Button>
  );
}
