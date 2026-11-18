"use client";

import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Layers } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

const SOURCE_COLORS = [
  { name: "Education Fair", color: "#2563EB" },
  { name: "Facebook Ads", color: "#06B6D4" },
  { name: "N/A", color: "#F59E0B" },
  { name: "YouTube Ads", color: "#8B5CF6" },
  { name: "Walk-in", color: "#EC4899" },
  { name: "Google Ads", color: "#10B981" },
  { name: "Instagram", color: "#6366F1" },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-xl border border-slate-700 text-xs shadow-xl font-outfit">
        <p className="font-extrabold text-blue-300">{data.name}</p>
        <p className="text-slate-300 font-mono mt-0.5">Leads: {data.value}</p>
        <p className="text-emerald-400 font-mono">Conversion: {data.convRate}%</p>
      </div>
    );
  }
  return null;
};

export default function SourceAnalyticsCard({ isLoading, data = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const topSources = useMemo(() => {
    const raw = Array.isArray(data) ? data : [];
    return [...raw].sort((a, b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
  }, [data]);

  const totalLeads = topSources.reduce((sum, s) => sum + (s.total || 0), 0) || 1;

  const chartData = useMemo(() => {
    return topSources.map((item, idx) => {
      const convRate = item.total > 0 ? Math.round(((item.converted || 0) / item.total) * 100) : 0;
      return {
        name: item.source || "Other",
        value: item.total || 0,
        convRate,
        color: SOURCE_COLORS[idx % SOURCE_COLORS.length].color,
      };
    });
  }, [topSources]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] animate-pulse font-outfit">
        <div className="w-32 h-5 bg-slate-100 rounded mb-4" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-slate-50 border-4 border-slate-100" />
        </div>
      </div>
    );
  }

  if (!isLoading && topSources.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] justify-between font-outfit">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/70">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Lead Sources</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Acquisition channel breakdown</p>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center py-8">
          <EmptyState title="No sources data available" description="Acquisition channel statistics will appear here." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col min-h-[340px] justify-between font-outfit hover:shadow-md transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/70 shrink-0">
            <Layers size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Lead Sources</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Acquisition channel breakdown</p>
          </div>
        </div>
      </div>

      {/* Chart & Legend Grid */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-1 py-3">
        {/* Animated Donut Chart */}
        <div className="h-40 w-40 relative flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={66}
                paddingAngle={3}
                dataKey="value"
                animationDuration={900}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#ffffff"
                    strokeWidth={activeIndex === index ? 3 : 1.5}
                    className="transition-all duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-900 leading-none">{totalLeads}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">LEADS</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2 flex-1 w-full min-w-0">
          {chartData.map((item, idx) => {
            const share = Math.round((item.value / totalLeads) * 100);
            return (
              <div 
                key={item.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between p-1.5 px-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeIndex === idx ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold text-slate-700 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs shrink-0">
                  <span className="font-bold text-slate-900">{item.value}</span>
                  <span className="text-[11px] text-slate-400">({share}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
