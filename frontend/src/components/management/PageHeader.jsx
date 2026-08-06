"use client";

import React from "react";

function PageHeaderActions({ children, className = "" }) {
  return <div className={`flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
}

export default function PageHeader({
  title,
  description,
  actions,
  children,
  className = "",
  titleClassName = "text-heading-1 font-bold font-sans text-slate-900",
  descriptionClassName = "mt-2 text-subtitle text-gray-500 font-sans",
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
        <PageHeaderActions>{actions}</PageHeaderActions>
      )}
    </div>
  );
}

PageHeader.Actions = PageHeaderActions;
