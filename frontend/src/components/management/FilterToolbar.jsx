"use client";

import React from "react";

export default function FilterToolbar({ children, chips, className = "" }) {
  return (
    <div className={`flex flex-col gap-[var(--spacing-toolbar)] ${className}`}>
      {children}
      {chips && <div>{chips}</div>}
    </div>
  );
}
