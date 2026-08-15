"use client";

import React, { useState, useEffect } from "react";
import { PhoneCall } from "lucide-react";
import { createPortal } from "react-dom";
import QuickCallSheet from "./QuickCallSheet";
import { usePathname } from "next/navigation";

export default function GlobalQuickCallWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  if (!mounted) return null;

  return (
    <>
      <button
        onClick={toggleOpen}
        aria-label="Quick Call"
        className="fixed bottom-6 right-6 z-[60] h-14 w-14 rounded-full bg-[#00C853] hover:bg-[#00b048] text-white shadow-xl shadow-[#00C853]/30 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-[#00C853]/30 cursor-pointer"
      >
        <PhoneCall className="h-6 w-6 animate-pulse" />
      </button>

      {isOpen &&
        createPortal(
          <div 
            className="fixed inset-0 z-[65] bg-black/20 backdrop-blur-xs sm:bg-transparent sm:backdrop-blur-none transition-all flex flex-col justify-end sm:justify-end pointer-events-auto sm:pointer-events-none font-outfit"
            onClick={() => setIsOpen(false)}
          >
            <div className="sm:fixed sm:bottom-24 sm:right-6 pointer-events-none w-full sm:w-auto mt-auto sm:mt-0 z-[70]">
              <QuickCallSheet onClose={() => setIsOpen(false)} isCallsPage={pathname === "/telecaller/calls"} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
