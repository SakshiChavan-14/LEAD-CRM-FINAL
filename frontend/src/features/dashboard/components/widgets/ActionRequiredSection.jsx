"use client";

import React from "react";
import Link from "next/link";
import { Clock, UserPlus, Calendar, ChevronRight } from "lucide-react";

export default function ActionRequiredSection({ overdueCount = 0, unassignedCount = 0, todayCount = 0 }) {
  const actions = [
    {
      title: "Overdue Follow-ups",
      value: overdueCount,
      label: "leads",
      linkText: "View Overdue",
      href: "/dashboard/management/leads?type=not-consulted", // Filter to not consulted
      icon: Clock,
      colorClass: "bg-rose-50/70 border-rose-200/80 hover:border-rose-300 hover:bg-rose-50 text-rose-900",
      iconClass: "bg-rose-100 text-rose-600 border-rose-200/60",
      linkClass: "text-rose-600 hover:text-rose-700 font-bold",
    },
    {
      title: "Unassigned Leads",
      value: unassignedCount,
      label: "leads",
      linkText: "Assign Leads",
      href: "/dashboard/management/leads?type=not-alloted", // Filter to not allotted
      icon: UserPlus,
      colorClass: "bg-amber-50/70 border-amber-200/80 hover:border-amber-300 hover:bg-amber-50 text-amber-900",
      iconClass: "bg-amber-100 text-amber-600 border-amber-200/60",
      linkClass: "text-amber-600 hover:text-amber-700 font-bold",
    },
    {
      title: "Today's Follow-ups",
      value: todayCount,
      label: "tasks",
      linkText: "View Today",
      href: "/dashboard/management/leads?type=alloted", // Filter to allotted/active
      icon: Calendar,
      colorClass: "bg-blue-50/70 border-blue-200/80 hover:border-blue-300 hover:bg-blue-50 text-blue-900",
      iconClass: "bg-blue-100 text-blue-600 border-blue-200/60",
      linkClass: "text-blue-600 hover:text-blue-700 font-bold",
    },
  ];

  return (
    <section className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 font-outfit space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-amber-500">warning</span>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Action Required</h2>
        </div>
        <Link 
          href="/dashboard/management/leads" 
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
        >
          View All
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Grid of Alert Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer group shadow-2xs ${item.colorClass}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-none">
                    {item.title}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-2.5">
                    <span className="text-3xl font-black font-mono leading-none tracking-tight">
                      {item.value}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {item.label}
                    </span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform ${item.iconClass}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className={`flex items-center gap-1 text-xs mt-5 leading-none ${item.linkClass}`}>
                <span>{item.linkText}</span>
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
