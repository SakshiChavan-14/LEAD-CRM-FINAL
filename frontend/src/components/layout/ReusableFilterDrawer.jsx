"use client";

import { useEffect, useRef, useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";

export default function ReusableFilterDrawer({ 
  isOpen, 
  onClose, 
  onApply, 
  onReset,
  title = "Refine Results",
  primaryButtonClass = "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20",
  children 
}) {
  const drawerRef = useRef(null);

  // Focus trap & ESC listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      
      // Basic focus trap
      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      // set focus to the close button on open
      setTimeout(() => {
        const closeBtn = drawerRef.current?.querySelector('button[aria-label="Close filters"]');
        closeBtn?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-xs z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter Results"
        className={`fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col font-outfit ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base tracking-tight">
            <SlidersHorizontal size={18} className="text-blue-600" />
            <h2>{title}</h2>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {children}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/70 flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs cursor-pointer active:scale-95"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className={`flex-1 px-4 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-all focus:outline-none focus:ring-2 cursor-pointer active:scale-95 ${primaryButtonClass}`}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
