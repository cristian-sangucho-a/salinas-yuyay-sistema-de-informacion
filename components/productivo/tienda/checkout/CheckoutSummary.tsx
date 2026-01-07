"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Text from "@atoms/Text";
import Title from "@atoms/Title";

export default function CheckoutSummary() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-base-100 p-6 rounded-lg border border-base-200 text-center">
        <Text>No hay productos en el carrito.</Text>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-4 rounded-lg border border-base-200 shadow-sm h-fit">
      <Title variant="h4" className="mb-4 font-bold">
        Resumen del pedido
      </Title>

      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 py-3 border-b border-base-200 last:border-0 items-center"
          >
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-base-200 shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">
                  🧀
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="truncate pr-2" title={item.name}>
                  <Text className="font-medium text-sm truncate">
                    {item.name}
                  </Text>
                </div>
                <Text className="font-bold text-sm whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </div>
              <div className="flex justify-between items-center mt-1">
                <Text variant="small" color="muted" className="text-xs">
                  Cant: {item.quantity}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-3 border-t border-base-200 text-sm">
        <div className="flex justify-between text-base-content/70">
          <Text>Subtotal</Text>
          <Text>${totalPrice.toFixed(2)}</Text>
        </div>
        <div className="flex justify-between text-base-content/70">
          <Text>Envío</Text>
          <Text>Por calcular</Text>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-base-200">
          <Text className="font-bold text-base">Total</Text>
          <Text className="font-bold text-lg text-primary">
            ${totalPrice.toFixed(2)}
          </Text>
        </div>
      </div>
    </div>
  );
}
