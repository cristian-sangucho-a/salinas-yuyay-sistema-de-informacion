import type React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full";

  const variants = {
    primary: "bg-primary text-primary-content",
    secondary: "bg-secondary text-secondary-content",
    accent: "bg-accent text-accent-content",
    neutral: "bg-neutral text-neutral-content",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
