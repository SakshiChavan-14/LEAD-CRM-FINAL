"use client";

import React from "react";
import { ChevronRight, Target, Flame, AlertCircle, PhoneCall, CheckCircle } from "lucide-react";
import Link from "next/link";

const FocusItem = ({ title, count, badgeBg, badgeText, icon: Icon, link }) => {
  return (
    <Link href={link} className="block outline-none">
      <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 hover:border-blue-200 hover:bg-slate-50/70 hover:shadow-2xs transition-all duration-200 group cursor-pointer bg-white">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${badgeBg} ${badgeText}`}>
            <Icon size={14} />
          </div>
          <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-full border shadow-2xs ${badgeBg} ${badgeText}`}>
            {count}
          </span>
          <ChevronRight size={13} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
};

export default function TodaysFocus({ isLoading, focus }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-full min-h-[360px] animate-pulse font-outfit">
        <div className="w-28 h-5 bg-slate-100 rounded mb-4" />
        <div className="space-y-2.5 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const safeFocus = focus || {
    highPriority: 12,
    overdueFollowups: 4,
    callsRemaining: 42,
    nearConversion: 6
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-full min-h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300 overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Target size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Today's Focus</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Priority task breakdown</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 flex-1 flex flex-col justify-center py-1">
        <FocusItem 
          title="High Priority Leads" 
          count={safeFocus.highPriority || 12}
          badgeBg="bg-blue-50 border-blue-200/80"
          badgeText="text-blue-700"
          icon={Flame}
          link="/telecaller/leads?priority=high"
        />
        <FocusItem 
          title="Overdue Follow-ups" 
          count={safeFocus.overdueFollowups || 4}
          badgeBg="bg-blue-50 border-blue-200/80"
          badgeText="text-blue-700"
          icon={AlertCircle}
          link="/telecaller/follow-ups?status=overdue"
        />
        <FocusItem 
          title="Calls Remaining" 
          count={safeFocus.callsRemaining || 42}
          badgeBg="bg-blue-50 border-blue-200/80"
          badgeText="text-blue-700"
          icon={PhoneCall}
          link="/telecaller/calls?status=pending"
        />
        <FocusItem 
          title="Near Conversion" 
          count={safeFocus.nearConversion || 6}
          badgeBg="bg-blue-50 border-blue-200/80"
          badgeText="text-blue-700"
          icon={CheckCircle}
          link="/telecaller/leads?stage=documents"
        />
      </div>
    </div>
  );
}
