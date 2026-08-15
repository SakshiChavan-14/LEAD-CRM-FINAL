"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/ui/Button";
import { PhoneCall } from "lucide-react";

export default function CallDialog({ open, isOpen, onClose, onConfirm, name, phone }) {
  const visible = open ?? isOpen;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && visible) {
        onClose?.();
      }
    },
    [visible, onClose]
  );

  useEffect(() => {
    if (!visible) return;

    // Prevent scrolling background body content while call dialog is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, handleKeyDown]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200 p-4 font-outfit"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-dialog-title"
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#00C853]/10 text-[#00C853] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00C853]/20 shadow-xs">
            <PhoneCall size={32} />
          </div>
          <h3 id="call-dialog-title" className="text-lg font-extrabold text-slate-900 mb-1">
            {name || "Lead Contact"}
          </h3>
          <p className="text-slate-500 font-mono font-bold mb-6 text-sm">{phone || "No phone number"}</p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 justify-center py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              type="button"
              className="flex-1 justify-center py-2.5 px-4 rounded-xl bg-[#00C853] hover:bg-[#00b048] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <PhoneCall size={14} />
              <span>Start Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
