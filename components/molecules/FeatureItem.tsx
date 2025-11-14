import type React from "react";
import Text from "@atoms/Text";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: "primary" | "secondary" | "accent" | "neutral";
}

export default function FeatureItem({
  icon,
  title,
  description,
  variant = "primary",
}: FeatureItemProps) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-content/10 flex items-center justify-center text-primary-content">
        {icon}
      </div>
      <div className="flex-1 pt-1">
        <h3 className="font-semibold text-primary-content text-sm mb-1">
          {title}
        </h3>
        <Text
          variant="caption"
          as="span"
          className="text-primary-content/70 leading-relaxed"
        >
          {description}
        </Text>
      </div>
    </div>
  );
}
