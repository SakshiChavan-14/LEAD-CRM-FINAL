import React from "react";

const DTMF_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

export default function QuickCallKeypad({ onDigit }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {DTMF_KEYS.flat().map((key) => (
        <button
          key={key}
          onClick={() => onDigit(key)}
          aria-label={`Key ${key}`}
          className="h-12 rounded-xl bg-gray-50 border border-[#ECECEC] text-gray-900 font-[600] text-lg hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B1023]/30"
        >
          {key}
        </button>
      ))}
    </div>
  );
}
