"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Text from "@atoms/Text";
import Title from "@atoms/Title";
import { Trash2 } from "lucide-react";

export default function CheckoutSummary() {
  const { items, totalPrice, removeFromCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-base-100 p-6 rounded-lg border border-base-200 text-center">
        <Text>No hay productos en el carrito.</Text>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-6 rounded-lg border border-base-200 shadow-sm h-fit sticky top-24">
      <Title variant="h3" className="mb-6 font-bold">
        Resumen del Pedido
      </Title>

      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 py-4 border-b border-base-200 last:border-0"
          >
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-base-200 shrink-0">
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
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="truncate pr-2" title={item.name}>
                  <Text className="font-medium truncate">{item.name}</Text>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-error/70 hover:text-error transition-colors"
                  aria-label="Eliminar producto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between items-end mt-1">
                <Text variant="small" color="muted">
                  Cant: {item.quantity}
                </Text>
                <Text className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-base-200">
        <div className="flex justify-between text-base-content/70">
          <Text>Subtotal</Text>
          <Text>${totalPrice.toFixed(2)}</Text>
        </div>
        <div className="flex justify-between text-base-content/70">
          <Text>Envío</Text>
          <Text>Por calcular</Text>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-base-200">
          <Text className="font-bold text-lg">Total</Text>
          <Text className="font-bold text-xl text-primary">
            ${totalPrice.toFixed(2)}
          </Text>
        </div>
      </div>
    </div>
  );
}
