"use client";

import React from "react";
import { PhoneCall, CalendarPlus, UploadCloud, Users } from "lucide-react";
import Link from "next/link";

const ActionSkeleton = () => (
  <div className="h-12 w-36 rounded-2xl bg-slate-100 animate-pulse border border-slate-200 shrink-0" />
);

const PrimaryActionCard = ({ icon: Icon, title, onClick }) => (
  <button 
    onClick={onClick} 
    className="flex items-center gap-2.5 px-4 py-2.5 bg-[#00C853] hover:bg-[#00b048] text-white rounded-xl shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 font-bold text-xs cursor-pointer font-outfit"
  >
    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
      <Icon size={14} className="text-white" />
    </div>
    <span className="whitespace-nowrap">{title}</span>
  </button>
);

const SecondaryActionCard = ({ icon: Icon, title, link, onClick, iconColor, bgHover }) => {
  const CardContent = (
    <div className={`flex items-center gap-2.5 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-700 rounded-xl shadow-2xs hover:shadow-sm hover:border-slate-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group cursor-pointer font-outfit text-xs font-bold ${bgHover}`}>
      <div className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconColor}`}>
        <Icon size={14} />
      </div>
      <span className="whitespace-nowrap group-hover:text-slate-900 transition-colors">{title}</span>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block outline-none">
        {CardContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="block outline-none">
      {CardContent}
    </button>
  );
};

export default function QuickActions({ isLoading, onCallNextLead, onAddFollowup, onUploadDocs }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col gap-3 font-outfit">
        <div className="h-5 w-28 bg-slate-100 rounded" />
        <div className="flex flex-wrap gap-3 items-center">
          {[1, 2, 3, 4].map((i) => <ActionSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col gap-3 font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-slate-900 leading-none">Quick Actions</h2>
        <span className="text-[11px] font-semibold text-slate-400">One-click workflow shortcuts</span>
      </div>
      <div className="flex flex-wrap gap-3 items-center pt-1">
        <PrimaryActionCard 
          icon={PhoneCall} 
          title="Call Next" 
          onClick={onCallNextLead}
        />
        <SecondaryActionCard 
          icon={CalendarPlus} 
          title="Add Followup" 
          onClick={onAddFollowup}
          iconColor="text-blue-600"
          bgHover="hover:border-blue-200"
        />
        <SecondaryActionCard 
          icon={UploadCloud} 
          title="Upload Docs" 
          onClick={onUploadDocs}
          iconColor="text-purple-600"
          bgHover="hover:border-purple-200"
        />
        <SecondaryActionCard 
          icon={Users} 
          title="My Leads" 
          link="/telecaller/leads" 
          iconColor="text-indigo-600"
          bgHover="hover:border-indigo-200"
        />
      </div>
    </div>
  );
}
