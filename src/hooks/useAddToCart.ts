import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/lib/types/productivo";

interface UseAddToCartProps {
  product: Omit<CartItem, "quantity">;
  checkOnMount?: boolean;
}

export function useAddToCart({
  product,
  checkOnMount = false,
}: UseAddToCartProps) {
  const { addToCart, updateQuantity, items, checkStock } = useCart();
  const [isChecking, setIsChecking] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  // Refs para dependencias que no deben disparar el efecto (evita bucles y re-renders innecesarios)
  const stateRef = useRef({ quantity, isOutOfStock, checkStock });

  useEffect(() => {
    stateRef.current = { quantity, isOutOfStock, checkStock };
  }, [quantity, isOutOfStock, checkStock]);

  useEffect(() => {
    const verifyInitialStock = async () => {
      // Leemos los valores actuales desde la referencia sin suscribirnos a sus cambios
      const current = stateRef.current;

      if (checkOnMount && product.contificoId && !current.isOutOfStock) {
        setIsChecking(true);
        try {
          const quantityToCheck =
            current.quantity > 0 ? current.quantity + 1 : 1;
          const hasStock = await current.checkStock(
            product.contificoId,
            quantityToCheck,
          );
          if (!hasStock) {
            setIsOutOfStock(true);
          }
        } finally {
          setIsChecking(false);
        }
      }
    };

    verifyInitialStock();
  }, [checkOnMount, product.contificoId]);

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isOutOfStock || isChecking) return;

    setIsChecking(true);
    try {
      const success = await addToCart(product);
      if (!success) {
        setIsOutOfStock(true);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleIncreaseQuantity = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isOutOfStock || isChecking) return;

    setIsChecking(true);
    try {
      // Calling updateQuantity with current + 1
      const success = await updateQuantity(product.id, quantity + 1);
      if (!success) {
        setIsOutOfStock(true);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleDecreaseQuantity = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    updateQuantity(product.id, quantity - 1);
    setIsOutOfStock(false);
  };

  return {
    quantity,
    isChecking,
    isOutOfStock,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
  };
}
