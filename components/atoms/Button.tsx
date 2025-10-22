import type React from "react";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "neutral"
    | "success"
    | "warning"
    | "error"
    | "outline"
    | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles = "btn";

    const variants = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      accent: "btn-accent",
      neutral: "btn-neutral",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-error",
      outline: "btn-outline btn-primary",
      ghost: "btn-ghost",
    };

    const sizes = {
      sm: "btn-sm",
      md: "btn-md",
      lg: "btn-lg",
    };

    const classes =
      `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`.trim();

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
