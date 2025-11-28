"use client";

import React from "react";
import Title from "@atoms/Title";
import Text from "@atoms/Text";
import { Snowflake, Sun, Thermometer } from "lucide-react";

interface ProductInfoProps {
  description?: string;
  ingredients?: string;
  storageConditions?: string;
  creationDate?: string;
}

export default function ProductInfo({
  description,
  ingredients,
  storageConditions,
  creationDate,
}: ProductInfoProps) {
  return (
    <>
      {/* Descripción */}
      {description && (
        <div className="space-y-3">
          <Title variant="h4" className="font-bold flex items-center gap-2">
            Descripción
          </Title>
          <div
            className="text-base text-base-content/80 leading-relaxed text-justify [&>p]:mb-4"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}

      {/* Ingredientes */}
      {ingredients && (
        <div className="space-y-3">
          <Title variant="h4" className="font-bold">
            Ingredientes
          </Title>
          <div
            className="text-base text-base-content/80 leading-relaxed text-justify [&>p]:mb-4"
            dangerouslySetInnerHTML={{ __html: ingredients }}
          />
        </div>
      )}

      {/* Condiciones de almacenamiento */}
      {storageConditions && (
        <div className="bg-base-200/50 p-4 rounded-lg">
          <Text
            variant="small"
            className="font-bold uppercase tracking-wider mb-2 text-base-content/60"
          >
            Condiciones de Almacenamiento
          </Text>
          <div className="flex items-center gap-2">
            {storageConditions.toLowerCase().includes("refrigeracion") ||
            storageConditions.toLowerCase().includes("congelación") ? (
              <Snowflake className="w-6 h-6 text-info" />
            ) : storageConditions.toLowerCase().includes("seco") ? (
              <Sun className="w-6 h-6 text-warning" />
            ) : (
              <Thermometer className="w-6 h-6 text-neutral" />
            )}
            <Text className="font-medium">{storageConditions}</Text>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="pt-6 border-t border-base-200 flex flex-col gap-2">
        {creationDate && (
          <Text variant="small" color="muted">
            Fecha de creación: {new Date(creationDate).toLocaleDateString()}
          </Text>
        )}
      </div>
    </>
  );
}
