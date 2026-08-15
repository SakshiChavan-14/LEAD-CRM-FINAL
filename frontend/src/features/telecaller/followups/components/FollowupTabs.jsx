"use client";

import React from "react";

export default function FollowupTabs({ activeTab, onTabChange, tabCounts }) {
  const tabs = [
    { id: "all", label: "All Schedules" },
    { id: "today", label: "Today" },
    { id: "upcoming", label: "Upcoming" },
    { id: "overdue", label: "Missed" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="flex items-center gap-2 md:gap-3 border-b border-slate-100 pb-1 font-outfit">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = tabCounts?.[tab.id] || 0;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`group relative flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              isActive 
                ? "bg-blue-50 text-blue-700 shadow-2xs border border-blue-200/80" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>{tab.label}</span>
            
            <span className={`px-2 py-0.5 text-[10px] font-mono font-extrabold rounded-full transition-colors duration-200 ${
              isActive 
                ? "bg-blue-600 text-white shadow-2xs" 
                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
