"use client";

import React from "react";

export default function PageHeader({
  title,
  description,
  actions,
  children,
  className = "",
  titleClassName = "text-4xl font-bold font-outfit text-slate-900",
  descriptionClassName = "mt-2 text-gray-500",
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ${className}`}>
      <div>
        {typeof title === "string" ? (
          <h1 className={titleClassName}>{title}</h1>
        ) : (
          title
        )}
        {typeof description === "string" ? (
          <p className={descriptionClassName}>{description}</p>
        ) : (
          description
        )}
        {children}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
