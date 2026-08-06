"use client";

import React from "react";

function SectionCardHeader({ children, className = "" }) {
  return <div className={`flex items-center justify-between gap-[var(--spacing-card)] mb-[var(--spacing-card)] ${className}`}>{children}</div>;
}

function SectionCardTitle({ children, className = "" }) {
  return <h3 className={`text-heading-3 font-semibold font-sans text-gray-900 ${className}`}>{children}</h3>;
}

function SectionCardDescription({ children, className = "" }) {
  return <p className={`text-body-sm text-gray-500 mt-0.5 font-sans ${className}`}>{children}</p>;
}

function SectionCardActions({ children, className = "" }) {
  return <div className={`flex items-center gap-[var(--spacing-control)] ${className}`}>{children}</div>;
}

function SectionCardBody({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function SectionCardFooter({ children, className = "" }) {
  return <div className={`mt-[var(--spacing-card)] pt-[var(--spacing-toolbar)] border-t border-gray-100 ${className}`}>{children}</div>;
}

export default function SectionCard({ title, subtitle, actions, children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-[var(--radius-surface)] p-5 shadow-[var(--shadow-sm)] ${className}`}>
      {(title || actions) && (
        <SectionCardHeader>
          <div>
            {title && <SectionCardTitle>{title}</SectionCardTitle>}
            {subtitle && <SectionCardDescription>{subtitle}</SectionCardDescription>}
          </div>
          {actions && <SectionCardActions>{actions}</SectionCardActions>}
        </SectionCardHeader>
      )}
      {children}
    </div>
  );
}

SectionCard.Header = SectionCardHeader;
SectionCard.Title = SectionCardTitle;
SectionCard.Description = SectionCardDescription;
SectionCard.Actions = SectionCardActions;
SectionCard.Body = SectionCardBody;
SectionCard.Footer = SectionCardFooter;
