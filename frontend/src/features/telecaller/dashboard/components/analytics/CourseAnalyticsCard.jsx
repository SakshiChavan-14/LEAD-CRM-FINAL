"use client";

import React, { useMemo } from "react";
import { GraduationCap, TrendingUp } from "lucide-react";

import EmptyState from "@/components/ui/EmptyState";

const COURSE_PALETTE = [
  { name: "B.Tech CSE", color: "from-blue-500 to-indigo-600", bar: "bg-blue-600", text: "text-blue-600" },
  { name: "Cybersecurity", color: "from-purple-500 to-indigo-500", bar: "bg-purple-600", text: "text-purple-600" },
  { name: "MBA Finance", color: "from-emerald-500 to-teal-600", bar: "bg-emerald-600", text: "text-emerald-600" },
  { name: "MCA", color: "from-amber-400 to-orange-500", bar: "bg-amber-500", text: "text-amber-600" },
  { name: "Data Science", color: "from-cyan-500 to-blue-500", bar: "bg-cyan-600", text: "text-cyan-600" },
];

export default function CourseAnalyticsCard({ isLoading, data = [] }) {
  const topCourses = useMemo(() => {
    const raw = Array.isArray(data) ? data : [];
    return [...raw].sort((a, b) => (b.total || 0) - (a.total || 0)).slice(0, 5);
  }, [data]);

  const maxTotal = topCourses.length > 0 ? topCourses[0].total || 1 : 1;
  const totalLeads = topCourses.reduce((sum, c) => sum + (c.total || 0), 0) || 1;

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col min-h-[340px] animate-pulse font-outfit">
        <div className="w-32 h-5 bg-slate-100 rounded mb-4" />
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && topCourses.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col min-h-[340px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <GraduationCap size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">Top Courses In-Demand</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Program interest breakdown</p>
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
          <EmptyState title="No course distribution data available" description="Course interest metrics will appear here." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col min-h-[340px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <GraduationCap size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Top Courses In-Demand</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Program interest breakdown</p>
          </div>
        </div>
        <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 border border-purple-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
          {topCourses.length} Programs
        </span>
      </div>

      {/* Modern Horizontal Tracks */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-center py-2">
        {topCourses.map((item, idx) => {
          const theme = COURSE_PALETTE[idx % COURSE_PALETTE.length];
          const widthPct = Math.max(12, ((item.total || 0) / maxTotal) * 100);
          const convRate = item.total > 0 ? Math.round(((item.converted || 0) / item.total) * 100) : 0;
          const sharePct = Math.round(((item.total || 0) / totalLeads) * 100);

          return (
            <div key={item.course || idx} className="group cursor-pointer">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:scale-125 transition-transform" style={{ backgroundColor: theme.bar.replace('bg-', '') }} />
                  <span className="text-slate-800 group-hover:text-slate-900 transition-colors">
                    {item.course}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500 text-[11px]">
                    <strong className="text-slate-900 font-extrabold text-xs">{item.total || 0}</strong> leads
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs font-mono">
                    {convRate}% conv
                  </span>
                </div>
              </div>

              {/* Gradient Track */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${theme.color} transition-all duration-1000 ease-out shadow-2xs group-hover:opacity-90`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
