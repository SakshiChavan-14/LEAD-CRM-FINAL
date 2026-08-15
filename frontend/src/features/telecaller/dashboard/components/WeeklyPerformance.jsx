"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Award, TrendingUp } from "lucide-react";

import EmptyState from "@/components/ui/EmptyState";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700 text-xs shadow-xl font-outfit">
        <p className="font-extrabold text-blue-300 mb-1">{label}</p>
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Target: <strong>{data.target}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Achieved: <strong>{data.achieved}</strong></span>
        </div>
        <p className="text-amber-400 font-mono font-bold mt-1 text-[11px]">Pacing: {data.rate || `${Math.round((data.achieved / (data.target || 1)) * 100)}%`}</p>
      </div>
    );
  }
  return null;
};

export default function WeeklyPerformance({ isLoading, performance, summary }) {
  const [timeframe, setTimeframe] = useState("week");

  const chartData = useMemo(() => {
    if (!performance) return [];
    if (timeframe === "today") return performance.daily || [];
    if (timeframe === "month") return performance.monthly || [];
    return performance.weekly || [];
  }, [performance, timeframe]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] animate-pulse font-outfit">
        <div className="flex justify-between items-center mb-4">
          <div className="w-32 h-5 bg-slate-100 rounded" />
          <div className="w-20 h-7 bg-slate-100 rounded-lg" />
        </div>
        <div className="flex-1 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  if (!isLoading && chartData.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Award size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">My Performance</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Target vs Achieved analytics</p>
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
          <EmptyState title="No performance data available" description="Data will appear once records are available." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Award size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">My Performance</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Target vs Achieved analytics</p>
          </div>
        </div>

        {/* Timeframe Filter Dropdown */}
        <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/80 text-[11px] font-bold">
          <button
            onClick={() => setTimeframe("today")}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              timeframe === "today" ? "bg-white text-emerald-600 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeframe("week")}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              timeframe === "week" ? "bg-white text-emerald-600 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
              timeframe === "month" ? "bg-white text-emerald-600 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Modern Target vs Achieved Dual Bar Chart */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#64748B", fontSize: 11, fontWeight: 700 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94A3B8", fontSize: 10, fontFamily: "monospace" }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
            <Bar 
              dataKey="target" 
              name="Target" 
              fill="#CBD5E1" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={22}
            />
            <Bar 
              dataKey="achieved" 
              name="Achieved" 
              fill="#10B981" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Legend Footer */}
      <div className="flex items-center justify-center gap-6 pt-1 border-t border-slate-100 text-[11px] font-bold">
        <div className="flex items-center gap-1.5 text-slate-500">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span>Assigned Target</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Achieved Calls</span>
        </div>
      </div>
    </div>
  );
}
