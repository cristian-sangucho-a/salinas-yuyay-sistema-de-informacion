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
      <section className="bg-primary py-8 overflow-hidden">
        <div className="relative">
          <div
            className={styles.scrollContainer}
            style={
              { "--rotation-speed": `${rotationSpeed}s` } as React.CSSProperties
            }
          >
            {/* Contenido original */}
            <div className="flex gap-8 lg:gap-12 px-6 md:px-12 lg:px-16 shrink-0">
              {features.map((feature, index) => (
                <div key={`original-${index}`} className="w-64 shrink-0">
                  <FeatureItem
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    variant={feature.variant}
                  />
                </div>
              ))}
            </div>
            {/* Contenido duplicado para loop infinito */}
            <div className="flex gap-8 lg:gap-12 px-6 md:px-12 lg:px-16 shrink-0">
              {features.map((feature, index) => (
                <div key={`duplicate-${index}`} className="w-64 shrink-0">
                  <FeatureItem
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    variant={feature.variant}
                  />
                </div>
              ))}
            </div>
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
