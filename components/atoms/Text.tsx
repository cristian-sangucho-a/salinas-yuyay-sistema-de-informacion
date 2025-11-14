import type React from "react";

interface TextProps {
  children: React.ReactNode;
  variant?: "body" | "small" | "large" | "caption";
  color?: "default" | "muted" | "light";
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
    body: "text-base",
    small: "text-sm",
    large: "text-lg",
    caption: "text-xs",
  };

  const colors = {
    default: "text-base-content",
    muted: "text-base-content/70",
    light: "text-base-content/50",
  };

  return (
    <Component className={`${variants[variant]} ${colors[color]} ${className}`}>
      {children}
    </Component>
  );
}
