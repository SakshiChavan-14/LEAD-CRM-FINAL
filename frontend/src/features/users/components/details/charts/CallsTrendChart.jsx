"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, PhoneCall } from "lucide-react";


export default function CallsTrendChart({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    if (Array.isArray(data) && data.length > 0) return data;
    return [];
  }, [data]);

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between font-outfit">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60">
            <PhoneCall size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Calls Performance Trend</h3>
            <p className="text-xs text-slate-400">Weekly call volume and connectivity</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>Calls Volume</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[220px] w-full mt-3 flex-grow">
        {mounted && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="telecallerCallsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94A3B8", fontWeight: 600 }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900/95 text-white px-3 py-2 rounded-xl text-xs font-outfit shadow-xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{label} Performance</span>
                        <div className="flex items-center justify-between gap-4 font-semibold text-blue-400">
                          <span>Total Calls:</span>
                          <span className="text-white font-extrabold">{payload[0]?.value}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="calls"
                stroke="#2563EB"
                strokeWidth={3}
                fill="url(#telecallerCallsGrad)"
                activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2, fill: "#2563EB" }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-slate-400 text-sm font-medium">No trend data available</span>
          </div>
        )}
      </div>
    </div>
  );
}
