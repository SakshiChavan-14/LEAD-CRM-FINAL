"use client";

import React from "react";

export default function PageToolbar({ left, right, children, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-[var(--spacing-content)] bg-white p-[var(--spacing-toolbar)] rounded-[var(--radius-control)] border border-gray-200 ${className}`}>
      {left && <div className="flex items-center gap-[var(--spacing-control)] flex-wrap">{left}</div>}
      {children}
      {right && <div className="flex items-center gap-[var(--spacing-control)] flex-wrap ml-auto">{right}</div>}
    </div>
  );
}
