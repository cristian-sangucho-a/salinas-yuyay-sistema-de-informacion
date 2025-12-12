"use client";

import React from "react";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: "warning" | "error" | "success";
  isActive: boolean;
  onClick: () => void;
}

const colorClasses = {
  warning: {
    border: "border-warning",
    bg: "bg-warning/10",
    text: "text-warning",
    shadow: "shadow-md",
  },
  error: {
    border: "border-error",
    bg: "bg-error/10",
    text: "text-error",
    shadow: "shadow-md",
  },
  success: {
    border: "border-success",
    bg: "bg-success/10",
    text: "text-success",
    shadow: "shadow-md",
  },
};

export default function StatCard({
  title,
  count,
  icon,
  color,
  isActive,
  onClick,
}: StatCardProps) {
  const styles = colorClasses[color];

  return (
    <div
      className={`card bg-white border-2 cursor-pointer transition-all ${
        isActive
          ? `${styles.border} ${styles.shadow}`
          : "border-base-200 hover:border-base-300"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className="card-body p-4 flex flex-row items-center gap-4">
        <div className={`p-3 rounded-full ${styles.bg} ${styles.text}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-2xl">{count}</h3>
          <p className="text-sm text-base-content/60">{title}</p>
        </div>
      </div>
    </div>
  );
}
