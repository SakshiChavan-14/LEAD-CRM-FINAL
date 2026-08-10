"use client";

import React from "react";

/**
 * PageContainer - The standard structural primitive for all CRM pages.
 * Owns padding and max-width. Never owns scrolling.
 *
 * @param {string} size - "default" (max-w-7xl), "wide" (max-w-[1700px]), or "full" (max-w-none)
 * @param {string} className - Additional CSS classes
 */
export default function PageContainer({ children, size = "wide", className = "" }) {
  const sizes = {
    default: "max-w-7xl",
    wide: "max-w-[1700px]",
    full: "max-w-none",
  };

  const maxWidthClass = sizes[size] || sizes.wide;

  return (
    <div className={`w-full ${maxWidthClass} mx-auto px-4 sm:px-8 flex flex-col flex-1 min-h-0 ${className}`}>
      {children}
    </div>
  );
}
