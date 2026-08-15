import React, { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import EmptyState from "@/components/ui/EmptyState";
import { useMonthlyTrend } from "@/features/reports/hooks/useReportsQueries";

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col justify-between h-[420px] font-outfit overflow-hidden";

export default function MonthlyAdmissionTrendCard({ months = 6 }) {
  const [mounted, setMounted] = useState(false);
  const { data: rawData, isLoading } = useMonthlyTrend(months);

  const chartData = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];
    return rawData;
  }, [rawData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <section className={cardClass}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Monthly Admission Trend</h2>
            <p className="text-xs text-slate-500 mt-0.5">Monthly enrollment vs set target progress</p>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
          <div className="animate-pulse w-full h-full bg-slate-100 rounded-xl"></div>
        </div>
      </section>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <section className={cardClass}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Monthly Admission Trend</h2>
            <p className="text-xs text-slate-500 mt-0.5">Monthly enrollment vs set target progress</p>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
          <EmptyState title="No trend data available" description="Data will appear here once records are available." />
        </div>
      </section>
    );
  }

  return (
    <section className={cardClass}>
      {/* Header (Clean & Simple) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-1 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Monthly Admission Trend</h2>
          <p className="text-xs text-slate-500 mt-0.5">Monthly enrollment vs set target progress</p>
        </div>

        {/* Simple Legend */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Admissions</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500"></span>
            <span>Target</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[270px] w-full flex-grow mt-2">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Admissions Modern Blue Gradient */}
                <linearGradient id="admissionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
                  <stop offset="60%" stopColor="#3B82F6" stopOpacity={0.10} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
                </linearGradient>
                {/* Target Soft Emerald Gradient */}
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              
              <XAxis 
                dataKey="month" 
                stroke="#94A3B8" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
                dy={8}
              />
              
              <YAxis 
                stroke="#94A3B8" 
                fontSize={11} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false} 
                dx={-5}
              />

              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const adm = payload.find(p => p.dataKey === "admissions")?.value || 0;
                    const tgt = payload.find(p => p.dataKey === "target")?.value || 0;
                    const diff = adm - tgt;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-sm text-white p-3 rounded-2xl shadow-xl border border-slate-800 font-outfit text-xs space-y-1.5 min-w-[150px]">
                        <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">{label} Performance</p>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-blue-400" /> Admissions:
                          </span>
                          <span className="font-bold text-sm text-white">{adm}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Target:
                          </span>
                          <span className="font-bold text-sm text-white">{tgt}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-800 text-[10px] font-semibold text-slate-400 flex items-center justify-between">
                          <span>Status:</span>
                          <span className={diff >= 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                            {diff >= 0 ? `+${diff} above target` : `${diff} below target`}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Target Line */}
              <Area
                type="monotone"
                dataKey="target"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="url(#targetGradient)"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-out"
              />

              {/* Admissions Solid Gradient Area */}
              <Area 
                type="monotone" 
                dataKey="admissions" 
                stroke="#2563EB" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#admissionsGradient)"
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#2563EB' }}
                isAnimationActive={true}
                animationDuration={1400}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
