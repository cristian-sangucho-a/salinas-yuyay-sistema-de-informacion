import type React from "react";

interface TextProps {
  children: React.ReactNode;
  variant?: "body" | "small" | "large" | "caption" | "button";
  color?: "default" | "muted" | "light" | "inherit";
  className?: string;
  as?: "p" | "span" | "div";
}

export default function Text({
  children,
  variant = "body",
  color = "default",
  className = "",
  as: Component = "p",
}: TextProps) {
  const variants = {
    body: "text-sm md:text-base",
    small: "text-xs md:text-sm",
    large: "text-base md:text-lg",
    caption: "text-[10px] md:text-xs",
    button: "text-lg md:text-xl font-bold",
  };

  const colors = {
    default: "text-base-content",
    muted: "text-base-content/70",
    light: "text-base-content/50",
    inherit: "text-current",
  };

  return (
    <Component
      className={`${variants[variant]} ${colors[color]} transition-all duration-300 ${className}`}
    >
      {children}
    </Component>
  );
}
