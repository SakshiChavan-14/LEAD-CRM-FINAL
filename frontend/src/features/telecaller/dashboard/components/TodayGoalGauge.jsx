"use client";

import React from "react";
import { Target, CheckCircle2, PhoneOutgoing, Heart } from "lucide-react";

const GoalSkeleton = () => (
  <div className="flex flex-col gap-3 w-full p-4 justify-center animate-pulse">
    <div className="flex justify-between items-center">
      <div className="w-28 h-4 bg-slate-100 rounded"></div>
      <div className="w-16 h-4 bg-slate-100 rounded"></div>
    </div>
    <div className="w-full h-2 bg-slate-100 rounded-full"></div>
    <div className="w-40 h-3 bg-slate-100 rounded"></div>
  </div>
);

export default function TodayGoalGauge({ isLoading, summary }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col p-4 w-full">
        <GoalSkeleton />
      </div>
    );
  }

  const goal = summary?.goal || 0;
  const completed = summary?.callsToday || 0;
  const connected = summary?.connected || 0;
  const interested = summary?.interested || 0;

  const safeGoal = Math.max(1, goal);
  const percentage = Math.min(100, Math.round((completed / safeGoal) * 100));
  const remaining = Math.max(0, safeGoal - completed);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 sm:p-5 flex flex-col justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Target size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Today's Mission</h2>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">{safeGoal} Target Calls</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-lg">
            <span className="text-slate-400 font-medium">Done:</span>
            <span className="font-bold text-slate-900">{completed}</span>
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-2 py-0.5 rounded-lg">
            <span className="text-emerald-600 font-medium">Connected:</span>
            <span className="font-bold">{connected}</span>
          </div>
          <div className="flex items-center gap-1 bg-purple-50 border border-purple-200/60 text-purple-700 px-2 py-0.5 rounded-lg">
            <span className="text-purple-600 font-medium">Interested:</span>
            <span className="font-bold">{interested}</span>
          </div>
        </div>
      </div>
      
      {/* Progress Bar Area */}
      <div className="space-y-1.5 mt-1">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 text-[11px]">
            {completed} of {safeGoal} calls completed ({remaining} remaining)
          </span>
          <span className="text-blue-600 font-mono">{percentage}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-xs" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

    </div>
  );
}
