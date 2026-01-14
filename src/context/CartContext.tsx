"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Alert from "@molecules/Alert";
import { CartItem } from "@/lib/types/productivo";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<boolean>;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => Promise<boolean>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  toggleCart: () => void;
  isLoading: boolean;
  checkStock: (
    contificoId: string,
    requestedQuantity: number
  ) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  // Clear error after 3 seconds
  useEffect(() => {
    if (stockError) {
      const timer = setTimeout(() => {
        setStockError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stockError]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("saisal_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("saisal_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const checkStock = async (
    contificoId: string,
    requestedQuantity: number
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/contifico/productos/${contificoId}`);
      if (!res.ok) return true;

      const data = await res.json();
      const stock = parseFloat(data.cantidad_stock || "0");

      return stock >= requestedQuantity;
    } catch (error) {
      console.error("Error verificando stock:", error);
      return true;
    }
  };

  const addToCart = async (
    newItem: Omit<CartItem, "quantity">
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const existingItem = items.find((item) => item.id === newItem.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
      const contificoId = newItem.contificoId || existingItem?.contificoId;

      if (contificoId) {
        const hasStock = await checkStock(contificoId, newQuantity);
        if (!hasStock) {
          setStockError(
            "Lo sentimos, no disponemos de suficiente stock para agregar este producto. Estamos trabajando para reponer nuestro inventario."
          );
          return false;
        }
      }

      setItems((prevItems) => {
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevItems, { ...newItem, quantity: 1 }];
      });
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = async (
    id: string,
    quantity: number
  ): Promise<boolean> => {
    if (quantity < 1) {
      removeFromCart(id);
      return true;
    }

    const item = items.find((i) => i.id === id);
    if (item && item.contificoId && quantity > item.quantity) {
      // Solo verificamos si estamos AUMENTANDO la cantidad
      setIsLoading(true);
      try {
        const hasStock = await checkStock(item.contificoId, quantity);
        if (!hasStock) {
          setStockError(
            "Lo sentimos, has alcanzado el límite de existencias disponibles. Estamos trabajando para reponer nuestro inventario."
          );
          return false;
        }
      } finally {
        setIsLoading(false);
      }
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    return true;
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        toggleCart,
        isLoading,
        checkStock,
      }}
    >
      {stockError && (
        <div className="fixed top-24 left-1/2 z-100 w-full max-w-md px-4 animate-fade-in-down">
          <Alert
            type="error"
            title="Stock Insuficiente"
            showIcon={true}
            className="shadow-2xl"
          >
            {stockError}
          </Alert>
        </div>
      )}
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
