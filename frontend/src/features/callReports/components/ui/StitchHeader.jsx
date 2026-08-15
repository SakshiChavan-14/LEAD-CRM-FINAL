import React from "react";
import { ArrowLeft } from "lucide-react";

export default function StitchHeader({ title, subtitle, onBack }) {
  return (
    <div className="flex flex-col gap-3 font-outfit">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors w-fit cursor-pointer active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Back to Call Reports</span>
        </button>
      )}
      <header className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </header>
    </div>
  );
}
