"use client";

import React from "react";

export default function PageToolbar({ left, right, children, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 ${className}`}>
      {left && <div className="flex items-center gap-2 flex-wrap">{left}</div>}
      {children}
      {right && <div className="flex items-center gap-2 flex-wrap ml-auto">{right}</div>}
    </div>
  );
}
