"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import React from "react";

interface Props {
  backHref?: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
}

export default function AdminHeader({
  backHref = "/admin/dashboard",
  backLabel = "Dashboard",
  title,
  subtitle,
}: Props) {
  return (
    <div className="bg-white border-b border-[#D9C3A3]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={backHref}
              className="flex items-center gap-2 text-[#5A1E02] hover:text-[#8B3C10] transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="font-medium">{backLabel}</span>
            </Link>
            <div className="border-l border-[#D9C3A3] h-6"></div>
            <div>
              <h1 className="text-lg font-bold text-[#5A1E02]">{title}</h1>
              {subtitle && (
                <p className="text-xs text-[#4A3B31]/60">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
