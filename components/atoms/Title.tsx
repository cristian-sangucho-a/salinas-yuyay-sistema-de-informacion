import type React from "react";

interface TitleProps {
  children: React.ReactNode;
  variant?: "h1" | "h2" | "h3" | "h4";
  serif?: boolean;
  italic?: boolean;
  className?: string;
}

export default function Title({
  children,
  variant = "h1",
  serif = false,
  italic = false,
  className = "",
}: TitleProps) {
  const baseStyles = "font-normal leading-tight text-base-content";

  const variants = {
    h1: "text-4xl md:text-5xl lg:text-6xl",
    h2: "text-3xl md:text-4xl lg:text-5xl",
    h3: "text-2xl md:text-3xl lg:text-4xl",
    h4: "text-xl md:text-2xl lg:text-3xl",
  };

  const fontFamily = serif ? "font-serif" : "font-sans";
  const fontStyle = italic ? "italic" : "";

  const Component = variant as keyof JSX.IntrinsicElements;

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${fontFamily} ${fontStyle} transition-all duration-300 ${className}`}
    >
      {children}
    </Component>
  );
}
