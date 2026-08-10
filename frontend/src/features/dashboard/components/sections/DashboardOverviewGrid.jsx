import React from "react";

export default function DashboardOverviewGrid({ children, className = "" }) {
  return (
    <div 
      className={`grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 ${className}`}
    >
      {children}
    </div>
  );
}
