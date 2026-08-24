"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#10B981", "#3B82F6", "#8B5CF6", "#F43F5E", "#F59E0B", "#6366F1"];


export default function CallOutcomeChart({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item, idx) => ({
        ...item,
        color: item.color || COLORS[idx % COLORS.length],
      }));
    }
    return [];
  }, [data]);

  const total = chartData.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between font-outfit">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/60">
            <PieChartIcon size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Call Outcome Breakdown</h3>
            <p className="text-xs text-slate-400">Response distribution across calls</p>
          </div>
        </div>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-3 flex-grow w-full">
        {mounted && chartData.length > 0 ? (
          <>
            {/* Donut */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={62}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        const itemVal = Number(d.value || 0);
                        const pct = total > 0 ? ((itemVal / total) * 100).toFixed(1) : "0.0";
                        return (
                          <div className="bg-slate-900/95 text-white px-3 py-1.5 rounded-xl text-xs font-outfit shadow-xl border border-slate-800">
                            <span className="font-bold">{d.name}: </span>
                            <span className="font-mono text-emerald-400">{pct}% ({itemVal} calls)</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm font-extrabold text-slate-900 leading-tight">100%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Calls</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2.5 w-full">
              {chartData.map((item, idx) => {
                const itemVal = Number(item.value || 0);
                const pct = total > 0 ? ((itemVal / total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={idx} className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-100/80 transition-colors">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-bold text-slate-800 truncate">{item.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">{pct}% ({itemVal})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <span className="text-slate-400 text-sm font-medium">No outcome data available</span>
          </div>
        )}
      </div>
    </div>
  );
}
