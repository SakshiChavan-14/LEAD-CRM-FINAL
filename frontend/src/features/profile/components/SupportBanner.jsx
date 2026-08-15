"use client";

import React from "react";
import { Info, Mail, Headphones, ChevronRight } from "lucide-react";

export default function SupportBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-100 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-outfit">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/60 shadow-2xs">
          <Headphones size={20} />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Need technical assistance?</h4>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
            If you need help configuring your telephony hardware or account settings, please contact the IT administration team.
          </p>
        </div>
      </div>
      
      <a 
        href="mailto:support@gmu.edu"
        className="bg-white border border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-800 text-xs font-bold py-2.5 px-5 rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0 w-full sm:w-auto cursor-pointer active:scale-95"
      >
        <Mail size={14} className="text-blue-600" />
        <span>Contact IT Support</span>
        <ChevronRight size={13} className="text-slate-400" />
      </a>
    </div>
  );
}
