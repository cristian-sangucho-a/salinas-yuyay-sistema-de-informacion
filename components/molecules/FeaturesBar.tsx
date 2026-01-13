"use client";

import type React from "react";
import FeatureItem from "@molecules/FeatureItem";
import type { Feature } from "@/lib/types/productivo";
import styles from "./FeaturesBar.module.css";

interface FeaturesBarProps {
  features: Feature[];
  variant?: "default" | "slim";
  autoRotate?: boolean;
  rotationSpeed?: number; // segundos por ciclo completo
}

export default function FeaturesBar({
  features,
  variant = "default",
  autoRotate = false,
  rotationSpeed = 30,
}: FeaturesBarProps) {
  // Variante default con carrusel
  if (variant === "default" && autoRotate) {
    return (
      <section className="bg-primary py-3 overflow-hidden border-t border-white/10 relative z-20">
        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee items-center gap-12 lg:gap-24">
            {/* Contenido triplicado para efecto infinito suave */}
            {[...features, ...features, ...features].map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="shrink-0 flex items-center"
              >
                <div className="flex items-center gap-3 group opacity-80 hover:opacity-100 transition-opacity">
                  <div className="text-primary-content text-xl">
                    {feature.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-primary-content text-sm whitespace-nowrap">
                      {feature.title}
                    </span>
                    <span className="text-primary-content/70 text-xs whitespace-nowrap hidden sm:block">
                      {feature.description}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "slim") {
    if (autoRotate) {
      return (
        <section className="bg-primary relative overflow-hidden">
          <div className="w-full">
            <div
              className={styles.scrollContainerSlim}
              style={
                {
                  "--rotation-speed": `${rotationSpeed}s`,
                } as React.CSSProperties
              }
            >
              {/* Contenido original */}
              {features.map((feature, index) => (
                <FeatureItem
                  key={`original-${index}`}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variant={feature.variant}
                  layout="slim"
                />
              ))}
              {/* Contenido duplicado para efecto infinito */}
              {features.map((feature, index) => (
                <FeatureItem
                  key={`duplicate-${index}`}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variant={feature.variant}
                  layout="slim"
                />
              ))}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="bg-primary relative overflow-hidden">
        <div className="w-full">
          <div className="flex items-stretch">
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant={feature.variant}
                layout="slim"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Variante default estática
  return (
    <section className="bg-primary py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              variant={feature.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
