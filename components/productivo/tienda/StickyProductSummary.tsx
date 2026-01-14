"use client";

import React, { useEffect, useState, useRef } from "react";
import Text from "@atoms/Text";
import ProductActions from "./ProductActions";

interface StickyProductSummaryProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
    contificoId?: string;
  };
}

export default function StickyProductSummary({
  product,
}: StickyProductSummaryProps) {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel is NOT intersecting (scrolled past top), we are sticky
        // The rootMargin top value should match the sticky top offset (4rem = 64px for top-16)
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: [1],
        rootMargin: "-80px 0px 0px 0px", // 64px (header) + 16px (offset) = 80px
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={sentinelRef}
        className="absolute -top-20 h-px w-full opacity-0 pointer-events-none"
      />
      <div
        className={`
          lg:sticky lg:top-16 lg:z-20 lg:bg-base-100/95 lg:backdrop-blur-sm w-full
          transition-all duration-500 ease-in-out
          ${
            isSticky
              ? "border-b border-base-200 shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1)]"
              : "border-b border-transparent"
          }
        `}
      >
        {/* Static Layout (Collapsible) */}
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-in-out"
          style={{ gridTemplateRows: isSticky ? "0fr" : "1fr" }}
        >
          <div className="overflow-hidden">
            <div
              className={`flex flex-col gap-6 pb-6 transition-opacity duration-300 ${
                isSticky ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="flex items-baseline gap-2 border-b border-base-200 pb-6 w-full">
                <Text className="font-bold text-primary text-4xl">
                  ${product.price.toFixed(2)}
                </Text>
                <Text variant="large" color="muted">
                  USD
                </Text>
              </div>
              <div className="hidden lg:block pt-2">
                <ProductActions product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Layout (Expandable) */}
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-in-out"
          style={{ gridTemplateRows: isSticky ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div
              className={`flex items-center justify-between gap-4 py-4 transition-opacity duration-300 ${
                isSticky ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <Text className="font-bold text-primary text-2xl">
                  ${product.price.toFixed(2)}
                </Text>
                <Text variant="small" color="muted">
                  USD
                </Text>
              </div>
              <div className="hidden lg:block">
                <ProductActions product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
