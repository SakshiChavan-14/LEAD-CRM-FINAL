"use client";

import React from "react";

const DTMF_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

export default function QuickCallKeypad({ onDigit }) {
  return (
    <div className="grid grid-cols-3 gap-2 font-outfit">
      {DTMF_KEYS.flat().map((key) => (
        <button
          key={key}
          onClick={() => onDigit(key)}
          aria-label={`Key ${key}`}
          className="h-11 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/80 text-slate-800 font-extrabold text-base transition-all shadow-2xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
        >
          {key}
        </button>
      ))}
    </div>
  );
}
