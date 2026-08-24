"use client";

import React from "react";
import { CheckSquare, PhoneCall, PhoneIncoming, Heart, CheckCircle2 } from "lucide-react";

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

  const calls = Number(summary?.callsToday || summary?.calls || 0);
  const connected = Number(summary?.connected || 0);
  const interested = Number(summary?.interested || 0);
  const done = Number(summary?.done || summary?.callsToday || 0);
  const goal = Number(summary?.goal || 0);

  const safeGoal = Math.max(1, goal > 0 ? goal : 50);
  const percentage = Math.min(100, Math.round((done / safeGoal) * 100));

  const tasks = [
    {
      id: "calls",
      name: "Calls",
      count: calls,
      icon: PhoneCall,
      color: "bg-blue-50 text-blue-700 border-blue-200/60",
      iconColor: "text-blue-600",
    },
    {
      id: "connected",
      name: "Connected",
      count: connected,
      icon: PhoneIncoming,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      iconColor: "text-emerald-600",
    },
    {
      id: "interested",
      name: "Interested",
      count: interested,
      icon: Heart,
      color: "bg-purple-50 text-purple-700 border-purple-200/60",
      iconColor: "text-purple-600",
    },
    {
      id: "done",
      name: "Done",
      count: done,
      icon: CheckCircle2,
      color: "bg-amber-50 text-amber-700 border-amber-200/60",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-4 sm:p-5 flex flex-col justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <CheckSquare size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Today&apos;s Tasks</h2>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5 block">Daily task activity</span>
          </div>
        </div>
        
        {/* 4 Metrics: Calls, Connected, Interested, Done */}
        <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
          {tasks.map((task) => {
            const Icon = task.icon;
            return (
              <div 
                key={task.id} 
                className={`flex items-center gap-1.5 border px-2 py-0.5 rounded-lg ${task.color}`}
              >
                <Icon size={12} className={task.iconColor} />
                <span className="font-medium text-[11px]">{task.name}:</span>
                <span className="font-extrabold text-[12px]">{task.count}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress Bar Area */}
      <div className="space-y-1.5 mt-1">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 text-[11px]">
            {done} completed today
          </span>
          <span className="text-blue-600 font-mono">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-xs" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

    </div>
  );
}
