"use client";

import React, { useState } from "react";
import { Filter, ChevronDown, TrendingUp } from "lucide-react";

const DEFAULT_PIPELINE = [
  { stage: "New Lead", count: 0, color: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
  { stage: "Contacted", count: 0, color: "bg-cyan-500", text: "text-cyan-600", light: "bg-cyan-50" },
  { stage: "Interested", count: 0, color: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50" },
  { stage: "Converted", count: 0, color: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
];

export default function PipelineSection({ isLoading, pipeline = [] }) {
  const [timeframe, setTimeframe] = useState("month");

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] animate-pulse font-outfit">
        <div className="flex justify-between items-center mb-4">
          <div className="w-32 h-5 bg-slate-100 rounded" />
          <div className="w-20 h-7 bg-slate-100 rounded-lg" />
        </div>
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const rawData = DEFAULT_PIPELINE.map(defaultStage => {
    const found = pipeline.find(p => p.stage?.toUpperCase() === defaultStage.stage.toUpperCase());
    return { ...defaultStage, count: found ? found.count : 0 };
  });

  const totalCount = rawData.reduce((sum, s) => sum + s.count, 0) || 1;
  const maxCount = Math.max(...rawData.map(s => s.count)) || 1;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <TrendingUp size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Pipeline Overview</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Stage conversion funnel</p>
          </div>
        </div>

        {/* Timeframe Filter Dropdown */}
        <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80 text-[11px] font-bold">
          <button
            onClick={() => setTimeframe("today")}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              timeframe === "today" ? "bg-white text-blue-600 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe("week")}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              timeframe === "week" ? "bg-white text-blue-600 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              timeframe === "month" ? "bg-white text-blue-600 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Funnel Bars & Metrics */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-center py-2">
        {rawData.map((stage, idx) => {
          const widthPct = Math.max(15, (stage.count / maxCount) * 100);
          const sharePct = Math.round((stage.count / totalCount) * 100);

          return (
            <div key={stage.stage} className="group cursor-pointer">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${stage.color} group-hover:scale-125 transition-transform`} />
                  <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
                    {stage.stage}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-900 font-extrabold">{stage.count}</span>
                  <span className="text-[10px] text-slate-400 font-bold">({sharePct}%)</span>
                </div>
              </div>

              {/* Animated Progress Track */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stage.color} rounded-full transition-all duration-700 ease-out shadow-2xs group-hover:opacity-90`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Summary Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
        <span>Total Active Leads:</span>
        <span className="text-slate-900 font-mono font-extrabold">{totalCount} Leads</span>
      </div>
    </div>
  );
}
