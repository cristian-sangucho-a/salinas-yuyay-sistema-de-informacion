"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Text from "@atoms/Text";
import Title from "@atoms/Title";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CheckoutCart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-base-100 p-8 rounded-lg border border-base-200 text-center space-y-4">
        <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-base-content/30" />
        </div>
        <Title variant="h3">Tu carrito está vacío</Title>
        <Text color="muted">Parece que aún no has añadido productos.</Text>
        <Link href="/tienda" className="btn btn-primary mt-4">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg border border-base-200 shadow-sm overflow-hidden">
      <div className="p-3 md:p-4 border-b border-base-200">
        <Title variant="h4" className="font-bold text-lg md:text-xl">
          Tu Carrito ({items.length} productos)
        </Title>
      </div>

      <div className="divide-y divide-base-200">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 md:p-4 flex gap-3 md:gap-4 items-center"
          >
            {/* Imagen */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-md overflow-hidden bg-base-200 border border-base-200">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">
                  🧀
                </div>
              )}
            </div>

            {/* Detalles */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="truncate">
                  <Link
                    href={`/productos/${item.id}`}
                    className="font-bold text-sm md:text-base hover:text-primary transition-colors truncate block"
                  >
                    {item.name}
                  </Link>
                  {item.category && (
                    <Text variant="small" color="muted" className="text-xs">
                      {item.category}
                    </Text>
                  )}
                </div>
                <Text className="font-bold text-sm md:text-base whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </div>

              <div className="flex justify-between items-center mt-2">
                {/* Controles de Cantidad */}
                <div className="flex items-center border border-base-300 rounded-md h-7">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-full flex items-center justify-center hover:bg-base-200 rounded-l-md transition-colors disabled:opacity-50"
                    disabled={item.quantity <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-medium text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-full flex items-center justify-center hover:bg-base-200 rounded-r-md transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Botón Eliminar */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-error/70 hover:text-error transition-colors p-1"
                  aria-label="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 md:p-4 bg-base-50 border-t border-base-200 flex justify-between items-center">
        <Text className="font-medium text-sm md:text-base">
          Total Estimado:
        </Text>
        <Text className="font-bold text-lg md:text-xl text-primary">
          ${totalPrice.toFixed(2)}
        </Text>
      </div>
    </div>
  );
}
