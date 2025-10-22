import type React from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "bordered" | "compact";
}

export default function Card({
  title,
  description,
  children,
  className = "",
  variant = "default",
}: CardProps) {
  const variantStyles = {
    default: "card bg-base-200 shadow-xl",
    bordered: "card bg-base-100 border border-base-300",
    compact: "card bg-base-200 shadow-md",
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      <div className="card-body">
        {title && <h2 className="card-title text-base-content">{title}</h2>}
        {description && <p className="text-base-content/70">{description}</p>}
        {children}
      </div>
    </div>
  );
}
