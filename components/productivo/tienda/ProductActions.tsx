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
      <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
        <Button
          onClick={() => handleUpdateQuantity(quantity - 1)}
          variant="error"
          className="w-12 h-12 !p-0 rounded-lg shadow-md min-h-0"
        >
          <Minus className="w-5 h-5" />
        </Button>
        <div className="h-12 flex items-center justify-center bg-base-100 rounded-lg border border-base-200 min-w-[3rem]">
          <span className="text-center font-bold text-base-content text-lg">
            {quantity}
          </span>
        </div>
        <Button
          onClick={() => handleUpdateQuantity(quantity + 1)}
          variant="success"
          className="w-12 h-12 !p-0 rounded-lg shadow-md min-h-0"
        >
          <Plus className="w-5 h-5" />
        </Button>
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
