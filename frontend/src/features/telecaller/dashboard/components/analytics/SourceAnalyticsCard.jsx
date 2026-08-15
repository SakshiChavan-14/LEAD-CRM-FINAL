"use client";

import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Compass, TrendingUp } from "lucide-react";

import EmptyState from "@/components/ui/EmptyState";

const SOURCE_COLORS = [
  { name: "Instagram", color: "#3B82F6", light: "bg-blue-50 text-blue-700 border-blue-200" },
  { name: "Referral", color: "#10B981", light: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { name: "Walk-in", color: "#F59E0B", light: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Website", color: "#8B5CF6", light: "bg-purple-50 text-purple-700 border-purple-200" },
  { name: "Google Ads", color: "#EC4899", light: "bg-pink-50 text-pink-700 border-pink-200" },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl border border-slate-700 text-xs shadow-xl font-outfit">
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
        light: SOURCE_COLORS[idx % SOURCE_COLORS.length].light
      };
    });
  }, [topSources]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col min-h-[340px] animate-pulse font-outfit">
        <div className="w-32 h-5 bg-slate-100 rounded mb-4" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-slate-50 border-4 border-slate-100" />
        </div>
      </div>
    );
  }

  if (!isLoading && topSources.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col min-h-[340px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Compass size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">Top Lead Sources</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Acquisition channel breakdown</p>
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
          <EmptyState title="No sources data available" description="Acquisition channel statistics will appear here." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col min-h-[340px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Compass size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Top Lead Sources</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Acquisition channel breakdown</p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
          {totalLeads} Total Leads
        </span>
      </div>

      {/* Chart & Legend Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center flex-1 py-2">
        {/* Animated Donut Chart */}
        <div className="h-44 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
                animationDuration={800}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#ffffff"
                    strokeWidth={activeIndex === index ? 3 : 1}
                    className="transition-all duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-mono font-extrabold text-slate-900 leading-none">{totalLeads}</span>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Leads</span>
          </div>
        </div>

        {/* Legend Cards */}
        <div className="space-y-2">
          {chartData.map((item, idx) => {
            const share = Math.round((item.value / totalLeads) * 100);
            return (
              <div 
                key={item.name}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                  activeIndex === idx 
                    ? "bg-blue-50/70 border-blue-300 shadow-2xs" 
                    : "bg-slate-50/60 border-slate-200/80 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shadow-2xs" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-extrabold text-slate-900">{item.value}</span>
                  <span className="text-[10px] text-slate-400 font-bold">({share}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
