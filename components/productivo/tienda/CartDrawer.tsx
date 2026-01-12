"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity"
        onClick={toggleCart}
      />
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out bg-base-100 shadow-xl flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-base-200">
            <h2 className="text-lg font-medium text-base-content flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Tu carrito
            </h2>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-error hover:underline mr-2"
                >
                  Vaciar
                </button>
              )}
              <button
                type="button"
                className="text-base-content/50 hover:text-base-content transition-colors"
                onClick={toggleCart}
              >
                <span className="sr-only">Cerrar panel</span>
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-base-content/30" />
                </div>
                <p className="text-lg font-medium text-base-content">
                  Tu carrito está vacío
                </p>
                <p className="text-sm text-base-content/60 max-w-xs">
                  ¡Parece que aún no has añadido ningún producto! Explora
                  nuestra tienda para encontrar lo que buscas.
                </p>
                <button
                  onClick={toggleCart}
                  className="btn btn-primary btn-sm mt-4"
                >
                  Continuar comprando
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-base-200">
                {items.map((item) => (
                  <li key={item.id} className="py-6 flex">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-base-200 bg-base-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-base-300 text-base-content/30">
                          <ShoppingBag className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-base-content">
                          <h3>
                            <Link
                              href={`/productos/${item.id}`}
                              onClick={toggleCart}
                              className="hover:underline"
                            >
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        {item.category && (
                          <p className="mt-1 text-sm text-base-content/60">
                            {item.category}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-base-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-base-200 rounded-l-lg transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-2 font-medium min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-base-200 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="font-medium text-error hover:text-error/80 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-base-200 px-4 py-6 sm:px-6 bg-base-100">
              <div className="flex justify-between text-base font-medium text-base-content mb-4">
                <p>Subtotal</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-base-content/60 mb-6">
                Impuestos y envío calculados al finalizar la compra.
              </p>
              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="btn btn-primary w-full"
                  onClick={toggleCart}
                >
                  Finalizar compra
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={toggleCart}
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
