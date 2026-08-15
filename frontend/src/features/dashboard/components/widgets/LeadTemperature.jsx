"use client";

import React, { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";
import { Snowflake } from "lucide-react";

const TEMP_COLORS = {
  "HOT": "#EF4444",
  "WARM": "#F59E0B",
  "COLD": "#3B82F6",
  "INTERESTED": "#10B981",
  "NOT INTERESTED": "#8B5CF6",
};

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 min-h-[480px] h-auto flex flex-col justify-between font-outfit overflow-hidden";

export default function LeadTemperature({ temperatureBreakdown = [] }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = useMemo(() => {
    return temperatureBreakdown.reduce((sum, item) => sum + (item.value || 0), 0);
  }, [temperatureBreakdown]);

  const chartData = useMemo(() => {
    return temperatureBreakdown.map((item) => {
      const name = String(item.label || item.name || "").toUpperCase();
      const color = TEMP_COLORS[name] || "#64748B";
      return {
        name: item.label || item.name || "Unknown",
        value: item.value || 0,
        color,
      };
    });
  }, [temperatureBreakdown]);

  const activeItem = activeIndex !== null && chartData[activeIndex] ? chartData[activeIndex] : null;

  return (
    <div className={cardClass}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Lead Temperature</h2>
        <p className="text-xs text-slate-500 mt-1">Lead segmentation by student interest level</p>
      </div>

      {chartData.length === 0 || total === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-500 py-6">
          <EmptyState
            title="No Temperature Data"
            description="Leads with interest records will appear here."
            icon={Snowflake}
          />
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-between mt-3 gap-2">
          {/* Animated Donut Chart Container */}
          <div className="relative w-full h-[155px] flex items-center justify-center shrink-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={4}
                    cornerRadius={4}
                    dataKey="value"
                    nameKey="name"
                    activeIndex={activeIndex}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    isAnimationActive={true}
                    animationBegin={100}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="cursor-pointer transition-opacity duration-200"
                        style={{
                          opacity: activeIndex === null || activeIndex === index ? 1 : 0.45,
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                        return (
                          <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.color }} />
                            <span className="font-medium">{item.name}:</span>
                            <span className="font-bold">{item.value.toLocaleString()} ({pct}%)</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* Dynamic Center Donut Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              {activeItem ? (
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <span className="text-xl font-extrabold text-slate-900 leading-none block">
                    {activeItem.value.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block mt-0.5 truncate max-w-[95px]">
                    {activeItem.name}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-2xl font-extrabold text-slate-900 leading-none block">
                    {total.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                    Total Leads
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Aligned Legend List with Micro Progress Bars */}
          <div className="space-y-1.5 flex-1 flex flex-col justify-end overflow-y-auto max-h-[190px] pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {chartData.map((entry, index) => {
              const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
              const isHovered = activeIndex === index;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`flex flex-col gap-1 p-1 rounded-lg transition-all duration-200 cursor-pointer ${
                    isHovered ? "bg-slate-50 scale-[1.01]" : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    {/* Bullet + Temperature Name */}
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                        style={{
                          backgroundColor: entry.color,
                          transform: isHovered ? "scale(1.25)" : "scale(1)",
                        }}
                      />
                      <span className={`font-semibold truncate max-w-[140px] transition-colors ${
                        isHovered ? "text-slate-900" : "text-slate-700"
                      }`}>
                        {entry.name}
                      </span>
                    </div>

                    {/* Percentage and Count */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-800">
                        {entry.value.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 w-8 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: entry.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}