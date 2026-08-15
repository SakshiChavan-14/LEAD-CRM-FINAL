"use client";

import React, { useMemo, useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PhoneCall, Snowflake } from "lucide-react";
import { useDatewiseSummary } from "@/features/reports/hooks/useReportsQueries";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 h-[420px] flex flex-col font-outfit justify-between overflow-hidden w-full";

export default function CallActivityCard() {
  const [mounted, setMounted] = useState(false);
  const { data: rawData, isLoading, isError } = useDatewiseSummary();

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];
    
    // Parse backend call activity trend
    const parsed = rawData.map((item) => {
      const rawDate = item.date || item.callDate || item.dateTime || "";
      const dateLabel = rawDate ? new Date(rawDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "N/A";
      
      const total = Number(item.totalCalls || item.calls || item.total || 0);
      const connected = Number(item.connectedCalls || item.connected || 0);
      const missed = Number(item.missedCalls || item.missed || Math.max(0, total - connected));
      
      return {
        date: dateLabel,
        total,
        connected,
        missed,
      };
    });

    // Return chronological order
    return parsed;
  }, [rawData]);

  const latestStats = useMemo(() => {
    if (chartData.length === 0) {
      return { total: 0, connected: 0, missed: 0, rate: 0 };
    }
    // Use the latest day's call activity to populate the summary stats
    const latest = chartData[chartData.length - 1];
    const rate = latest.total > 0 ? Math.round((latest.connected / latest.total) * 100) : 0;
    return {
      total: latest.total,
      connected: latest.connected,
      missed: latest.missed,
      rate,
    };
  }, [chartData]);

  return (
    <article className={cardClass}>
      {/* Header & Meta */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Today&apos;s Call Activity</h2>
          <p className="text-xs text-slate-500 mt-1">Live call counts and connection efficiency trend</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/60">
          <PhoneCall size={12} className="text-blue-600" />
          Live Summary
        </div>
      </div>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center min-h-[260px]">
          <div className="animate-pulse w-full h-full bg-slate-100 rounded-xl"></div>
        </div>
      ) : isError || chartData.length === 0 ? (
        <div className="flex-grow flex items-center justify-center min-h-[260px]">
          <EmptyState
            title="No Call Activity Record"
            description="Call metrics will appear here once telecallers log calls today."
            icon={Snowflake}
          />
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-between mt-3">
          {/* Executive Stats Row */}
          <div className="grid grid-cols-4 gap-2 text-center py-2 bg-slate-50/70 border border-slate-100 rounded-2xl shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
              <span className="text-base font-extrabold text-slate-800 leading-none mt-1 font-mono">{latestStats.total}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Connected</span>
              <span className="text-base font-extrabold text-emerald-600 leading-none mt-1 font-mono">{latestStats.connected}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Missed</span>
              <span className="text-base font-extrabold text-rose-600 leading-none mt-1 font-mono">{latestStats.missed}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-slate-400">Connection</span>
              <span className="text-base font-extrabold text-blue-600 leading-none mt-1 font-mono">{latestStats.rate}%</span>
            </div>
          </div>

          {/* Call Trend Chart */}
          <div className="h-[180px] w-full flex-grow mt-4">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="connectedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.20} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  
                  <XAxis 
                    dataKey="date" 
                    stroke="#94A3B8" 
                    fontSize={9} 
                    fontWeight={600}
                    tickLine={false} 
                    axisLine={false} 
                    dy={5}
                  />
                  
                  <YAxis 
                    stroke="#94A3B8" 
                    fontSize={9} 
                    fontWeight={600}
                    tickLine={false} 
                    axisLine={false} 
                    dx={-5}
                  />

                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const tot = payload.find(p => p.dataKey === "total")?.value || 0;
                        const con = payload.find(p => p.dataKey === "connected")?.value || 0;
                        return (
                          <div className="bg-slate-900/95 backdrop-blur-sm text-white p-2.5 rounded-xl shadow-xl border border-slate-800 font-outfit text-[11px] space-y-1 min-w-[120px]">
                            <p className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">{label}</p>
                            <div className="flex justify-between">
                              <span className="text-blue-400 font-semibold">Total Calls:</span>
                              <span className="font-bold text-white">{tot}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-emerald-400 font-semibold">Connected:</span>
                              <span className="font-bold text-white">{con}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Area for Total Calls */}
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#totalGradient)"
                    activeDot={{ r: 4 }}
                  />

                  {/* Area for Connected Calls */}
                  <Area
                    type="monotone"
                    dataKey="connected"
                    stroke="#10B981"
                    strokeWidth={2}
                    fill="url(#connectedGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
