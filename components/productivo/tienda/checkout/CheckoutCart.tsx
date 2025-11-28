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
      <div className="p-6 border-b border-base-200">
        <Title variant="h3" className="font-bold">
          Tu Carrito ({items.length} productos)
        </Title>
      </div>

      <div className="divide-y divide-base-200">
        {items.map((item) => (
          <div key={item.id} className="p-6 flex gap-4 sm:gap-6">
            {/* Imagen */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-md overflow-hidden bg-base-200 border border-base-200">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🧀
                </div>
              )}
            </div>

            {/* Detalles */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <Link
                    href={`/productos/${item.id}`}
                    className="font-bold text-lg hover:text-primary transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  {item.category && (
                    <Text variant="small" color="muted" className="mt-1">
                      {item.category}
                    </Text>
                  )}
                </div>
                <Text className="font-bold text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </div>

              <div className="flex justify-between items-end mt-4">
                {/* Controles de Cantidad */}
                <div className="flex items-center border border-base-300 rounded-lg h-9">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-9 h-full flex items-center justify-center hover:bg-base-200 rounded-l-lg transition-colors disabled:opacity-50"
                    disabled={item.quantity <= 1}
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-medium text-sm">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-full flex items-center justify-center hover:bg-base-200 rounded-r-lg transition-colors"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Botón Eliminar */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-1.5 text-error/80 hover:text-error transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer del Carrito (Subtotal) */}
      <div className="bg-base-50 p-6 border-t border-base-200">
        <div className="flex justify-between items-center">
          <Text className="font-medium">Subtotal del carrito</Text>
          <Text className="font-bold text-xl">${totalPrice.toFixed(2)}</Text>
        </div>
      </div>
    </div>
  );
}
