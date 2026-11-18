"use client";

import React from "react";
import useAuthStore from "@/store/authStore";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { Headphones, Calendar, Phone, PhoneCall, Heart, CheckCircle2 } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardHeader({ isLoading, summary }) {
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();

  const rawName = profile?.name || profile?.fullName || user?.name || user?.username || user?.empName || "Karun";
  const firstName = rawName.trim().split(/\s+/)[0];
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const greeting = getGreeting();

  const safeSummary = summary || {
    callsToday: 0,
    connected: 0,
    interested: 0,
    admissions: 0,
  };

  const tasksDone = safeSummary.connected || safeSummary.callsToday || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 font-outfit">
        <div className="xl:col-span-7 h-[140px] bg-slate-100 animate-pulse rounded-[24px]" />
        <div className="xl:col-span-5 h-[140px] bg-slate-100 animate-pulse rounded-[24px]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 font-outfit items-stretch">
      {/* ── Left: Welcome Card ──────────────────────────────────────────────── */}
      <div className="xl:col-span-7 bg-gradient-to-r from-[#EEF2FF] via-[#F4F1FD] to-[#EDE9FE] border border-purple-100/80 rounded-[24px] p-6 shadow-xs relative overflow-hidden flex items-center justify-between min-h-[140px]">
        {/* Subtle Ambient Wave Background SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C150,160 350,40 500,110 C650,180 750,70 800,120 L800,200 L0,200 Z"
            fill="#DDD6FE"
            fillOpacity="0.4"
          />
          <path
            d="M0,130 C200,80 400,160 600,100 C700,70 780,140 800,120 L800,200 L0,200 Z"
            fill="#C7D2FE"
            fillOpacity="0.3"
          />
        </svg>

        <div className="relative z-10 space-y-1.5 max-w-[70%]">
          <h1 className="text-2xl sm:text-[32px] font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-2">
            <span>{greeting}, {capitalizedFirstName}</span>
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Here&apos;s your telecalling summary for today.
          </p>
        </div>

        {/* Headset Illustration Circle */}
        <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 shadow-md border border-purple-100/90 flex items-center justify-center text-purple-600 shrink-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
            <Headphones size={28} className="stroke-[2.2]" />
          </div>
        </div>
      </div>

      {/* ── Right: Today's Tasks Card ────────────────────────────────────────── */}
      <div className="xl:col-span-5 bg-white border border-slate-200/80 rounded-[24px] p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[140px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
            <Calendar size={15} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Today&apos;s Tasks</h3>
        </div>

        {/* 4 Metrics Horizontal Row */}
        <div className="grid grid-cols-4 gap-2 text-center pt-1">
          {/* 1. Calls */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 border border-blue-100/60">
              <Phone size={15} />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {safeSummary.callsToday}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Calls</span>
          </div>

          {/* 2. Connected */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 border border-emerald-100/60">
              <PhoneCall size={15} />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {safeSummary.connected}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Connected</span>
          </div>

          {/* 3. Interested */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1 border border-purple-100/60">
              <Heart size={15} />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {safeSummary.interested}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Interested</span>
          </div>

          {/* 4. Done */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 border border-emerald-100/60">
              <CheckCircle2 size={15} />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {tasksDone}
            </span>
            <span className="text-[11px] font-medium text-slate-500">Done</span>
          </div>
        </div>
      </div>
    </div>
  );
}
