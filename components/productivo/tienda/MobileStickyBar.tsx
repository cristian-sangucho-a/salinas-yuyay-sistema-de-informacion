"use client";

import React from "react";
import ProductActions from "./ProductActions";

interface MobileStickyBarProps {
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
    contificoId?: string;
  };
}

export default function MobileStickyBar({
  price,
  product,
}: MobileStickyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-100 border-t border-base-200 p-4 z-50 lg:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] safe-area-bottom">
      <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-xs text-base-content/60 font-medium uppercase">
            Total
          </span>
          <span className="text-xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>
        </div>
        <div className="flex-1 flex justify-end">
          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}
