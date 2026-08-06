"use client";

import React from "react";

export default function ContentSection({ children, className = "" }) {
  return (
    <div className={`flex flex-col gap-[var(--spacing-section)] flex-1 min-h-0 ${className}`}>
      {children}
    </div>
  );
}
