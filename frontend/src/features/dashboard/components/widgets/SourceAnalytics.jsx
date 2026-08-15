"use client";

import React, { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FilterX, ExternalLink } from "lucide-react";
import Link from "next/link";

const SOURCE_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
];

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 min-h-[480px] h-full flex flex-col justify-between font-outfit overflow-hidden w-full";

export default function SourceAnalytics({ sourceAnalytics }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawData = sourceAnalytics || [];
  const total = useMemo(() => rawData.reduce((acc, curr) => acc + (curr.value || 0), 0), [rawData]);

  // Aggregate Top 5 sources, sorted descending
  const chartData = useMemo(() => {
    if (rawData.length === 0) return [];

    const sorted = [...rawData].sort((a, b) => (b.value || 0) - (a.value || 0));
    
    let result = [];
    if (sorted.length <= 5) {
      result = sorted.map((s, idx) => ({
        name: s.label || s.name || `Source ${idx + 1}`,
        value: s.value || 0,
        color: SOURCE_COLORS[idx % SOURCE_COLORS.length],
      }));
    } else {
      const top4 = sorted.slice(0, 4).map((s, idx) => ({
        name: s.label || s.name || `Source ${idx + 1}`,
        value: s.value || 0,
        color: SOURCE_COLORS[idx % SOURCE_COLORS.length],
      }));
      const othersValue = sorted.slice(4).reduce((sum, curr) => sum + (curr.value || 0), 0);
      top4.push({
        name: "Others",
        value: othersValue,
        color: "#64748B",
      });
      result = top4;
    }

    return result;
  }, [rawData]);

  return (
    <div className={cardClass}>
      {/* Header */}
      <div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Lead Sources</h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <Link
            href="/dashboard/management/leads"
            className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors hover:underline cursor-pointer"
          >
            View All
            <ExternalLink size={12} />
          </Link>
        </div>
        <p className="text-xs text-slate-500 mt-1">Lead acquisition by channel performance</p>
      </div>

      {rawData.length === 0 || total === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-500 py-6">
          <FilterX size={32} className="text-slate-300 mb-3" />
          <p className="font-semibold text-gray-900">No Data Available</p>
          <p className="text-xs mt-1">Lead sources are currently empty.</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-between mt-5 gap-4">
          {/* Vertical/Horizontal Bar Chart representing sources */}
          <div className="w-full h-[240px] flex-grow">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F1F5F9" />
                  
                  <XAxis 
                    type="number" 
                    stroke="#94A3B8" 
                    fontSize={10} 
                    fontWeight={600}
                    tickLine={false} 
                    axisLine={false} 
                  />
                  
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#475569" 
                    fontSize={10} 
                    fontWeight={700}
                    tickLine={false} 
                    axisLine={false}
                    width={90}
                  />

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

                  <Bar 
                    dataKey="value" 
                    radius={[0, 6, 6, 0]}
                    barSize={18}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Aggregated Total Footer */}
          <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center text-xs shrink-0">
            <span className="text-slate-500 font-medium">Aggregate Sources Count:</span>
            <span className="text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl">
              {total.toLocaleString()} Leads
            </span>
          </div>
        </div>
      )}
    </div>
  );
}