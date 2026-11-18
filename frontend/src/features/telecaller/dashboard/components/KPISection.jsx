"use client";

import React from "react";
import Link from "next/link";
import { User, Phone, PhoneCall, Heart, GraduationCap, Target } from "lucide-react";

export default function KPISection({ isLoading, summary }) {
  if (isLoading) {
    return (
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 font-outfit">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200/80 rounded-[20px] p-4 h-[92px] flex items-center gap-3.5 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-6 w-12 bg-slate-100 rounded" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  const safeSummary = summary || {
    assigned: 0,
    callsToday: 0,
    connected: 0,
    interested: 0,
    admissions: 0,
    goal: 0,
  };

  const kpis = [
    {
      title: "Assigned",
      value: safeSummary.assigned ?? 0,
      icon: User,
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100/70",
      href: "/telecaller/leads?status=ALL",
    },
    {
      title: "Calls Today",
      value: safeSummary.callsToday ?? 0,
      icon: Phone,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100/70",
      href: "/telecaller/calls?date=today",
    },
    {
      title: "Connected",
      value: safeSummary.connected ?? 0,
      icon: PhoneCall,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100/70",
      href: "/telecaller/calls?status=CONNECTED",
    },
    {
      title: "Interested",
      value: safeSummary.interested ?? 0,
      icon: Heart,
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100/70",
      href: "/telecaller/leads?status=INTERESTED",
    },
    {
      title: "Admissions",
      value: safeSummary.admissions ?? 0,
      icon: GraduationCap,
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100/70",
      href: "/telecaller/leads?status=ADMISSION",
    },
    {
      title: "Goal %",
      value: `${safeSummary.goal ?? 0}%`,
      icon: Target,
      iconBg: "bg-pink-50 text-pink-600 border border-pink-100/70",
      href: null,
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 font-outfit">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        const CardInner = (
          <div className="bg-white border border-slate-200/80 rounded-[20px] p-4 flex items-center gap-3.5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 h-[92px] group w-full">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${kpi.iconBg}`}>
              <Icon size={20} className="stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex flex-col justify-center">
              <span className="text-2xl sm:text-[26px] font-bold text-slate-900 leading-none truncate">
                {kpi.value}
              </span>
              <span className="text-xs font-medium text-slate-500 mt-1 truncate group-hover:text-blue-600 transition-colors">
                {kpi.title}
              </span>
            </div>
          </div>
        );

        if (kpi.href) {
          return (
            <Link key={idx} href={kpi.href} className="block outline-none focus:ring-2 focus:ring-blue-500 rounded-[20px]">
              {CardInner}
            </Link>
          );
        }

        return <div key={idx}>{CardInner}</div>;
      })}
    </section>
  );
}
