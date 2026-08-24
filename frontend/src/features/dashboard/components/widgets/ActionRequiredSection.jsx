"use client";

import React from "react";
import Link from "next/link";
import { Flame, Sun, Snowflake, ChevronRight } from "lucide-react";

export default function ActionRequiredSection({ 
  hotCount = 0, 
  warmCount = 0, 
  coldCount = 0,
  isLoading = false 
}) {
  const cards = [
    {
      id: "hot",
      title: "Hot Leads",
      value: hotCount,
      label: "leads",
      linkText: "View Hot Leads",
      href: "/dashboard/management/leads?type=hot",
      icon: Flame,
      colorClass: "bg-rose-50/70 border-rose-200/80 hover:border-rose-300 hover:bg-rose-50/90 text-rose-950",
      iconClass: "bg-rose-100 text-rose-600 border-rose-200/70",
      linkClass: "text-rose-600 hover:text-rose-700 font-bold",
    },
    {
      id: "warm",
      title: "Warm Leads",
      value: warmCount,
      label: "leads",
      linkText: "View Warm Leads",
      href: "/dashboard/management/leads?type=warm",
      icon: Sun,
      colorClass: "bg-amber-50/70 border-amber-200/80 hover:border-amber-300 hover:bg-amber-50/90 text-amber-950",
      iconClass: "bg-amber-100 text-amber-600 border-amber-200/70",
      linkClass: "text-amber-600 hover:text-amber-700 font-bold",
    },
    {
      id: "cold",
      title: "Cold Leads",
      value: coldCount,
      label: "leads",
      linkText: "View Cold Leads",
      href: "/dashboard/management/leads?type=cold",
      icon: Snowflake,
      colorClass: "bg-blue-50/70 border-blue-200/80 hover:border-blue-300 hover:bg-blue-50/90 text-blue-950",
      iconClass: "bg-blue-100 text-blue-600 border-blue-200/70",
      linkClass: "text-blue-600 hover:text-blue-700 font-bold",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-outfit">
      {cards.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col justify-between p-6 rounded-[24px] border transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-md ${item.colorClass}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider leading-none text-slate-500">
                  {item.title}
                </h3>
                <div className="flex items-baseline gap-2 mt-3">
                  {isLoading ? (
                    <div className="h-8 w-16 bg-slate-200/60 rounded-lg animate-pulse" />
                  ) : (
                    <>
                      <span className="text-3xl font-black font-mono leading-none tracking-tight">
                        {Number(item.value || 0).toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {item.label}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform ${item.iconClass}`}>
                <Icon size={20} />
              </div>
            </div>

            <div className={`flex items-center gap-1.5 text-xs mt-6 leading-none ${item.linkClass}`}>
              <span>{item.linkText}</span>
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
