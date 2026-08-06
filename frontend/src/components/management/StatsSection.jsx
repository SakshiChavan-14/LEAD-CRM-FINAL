"use client";

import React from "react";

export default function StatsSection({ children, className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
}
