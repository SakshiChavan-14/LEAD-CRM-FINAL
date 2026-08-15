"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { LogOut, AlertCircle } from "lucide-react";

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut = false,
}) {
  // ESC listener
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isOpen && !isLoggingOut) {
        onClose();
      }
    },
    [isOpen, isLoggingOut, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200 font-outfit"
      onClick={() => !isLoggingOut && onClose()}
      role="presentation"
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
          <LogOut size={26} className="translate-x-0.5" />
        </div>

        {/* Title & Description */}
        <h3 id="logout-dialog-title" className="text-lg font-extrabold text-slate-900 tracking-tight mb-1.5">
          Confirm Logout
        </h3>
        <p className="text-xs font-semibold text-slate-500 mb-6 leading-relaxed">
          Are you sure you want to log out of your session? You will need to sign back in to access the system.
        </p>

        {/* Actions */}
        <div className="flex gap-3 items-center">
          <button
            onClick={onClose}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer active:scale-95 shadow-2xs disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <LogOut size={13} />
            <span>{isLoggingOut ? "Logging out..." : "Yes, Logout"}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
