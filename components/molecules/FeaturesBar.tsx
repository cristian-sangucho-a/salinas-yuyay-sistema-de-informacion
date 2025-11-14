import type React from "react";
import FeatureItem from "@molecules/FeatureItem";
import type { Feature } from "@/lib/types/productivo";

interface FeaturesBarProps {
  features: Feature[];
}

export default function FeaturesBar({ features }: FeaturesBarProps) {
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
