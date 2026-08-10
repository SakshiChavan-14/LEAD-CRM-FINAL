import React from "react";
import DashboardOverviewGrid from "./DashboardOverviewGrid";
import { Users, UserCheck, UserPlus, Clock, Percent, Headphones, GraduationCap } from "lucide-react";

const kpiConfigMap = {
  "Total Leads": {
    icon: Users,
    bgClass: "bg-blue-50",
    textClass: "text-blue-600",
  },
  "Active Leads": {
    icon: UserCheck,
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-600",
  },
  "New Today": {
    icon: UserPlus,
    bgClass: "bg-purple-50",
    textClass: "text-purple-600",
  },
  "Pending Assign": {
    icon: Clock,
    bgClass: "bg-amber-50",
    textClass: "text-amber-600",
  },
  "Conversion Rate": {
    icon: Percent,
    bgClass: "bg-rose-50",
    textClass: "text-rose-600",
  },
  "Telecallers": {
    icon: Headphones,
    bgClass: "bg-cyan-50",
    textClass: "text-cyan-600",
  },
  "Admissions": {
    icon: GraduationCap,
    bgClass: "bg-teal-50",
    textClass: "text-teal-600",
  },
};

function CustomKPICard({ title, value, icon: Icon, bgClass, textClass }) {
  return (
    <div className="bg-white border border-[#EEF2F7] rounded-[24px] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] flex flex-col justify-between h-full min-h-[140px] font-outfit">
      {/* Top-Left Icon */}
      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${bgClass} ${textClass}`}>
        <Icon size={20} strokeWidth={2.2} />
      </div>

      {/* Value and Label */}
      <div className="flex flex-col">
        <span className="text-3xl md:text-4xl font-bold text-slate-900 leading-none tracking-tight">
          {value}
        </span>
        <span className="text-sm text-slate-500 mt-1.5 font-medium">{title}</span>
      </div>
    </div>
  );
}

export default function DashboardStats({ stats = [] }) {
  return (
    <DashboardOverviewGrid>
      {stats.map((item) => {
        const config = kpiConfigMap[item.title] || kpiConfigMap["Total Leads"];
        const Icon = config.icon;

        return (
          <CustomKPICard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={Icon}
            bgClass={config.bgClass}
            textClass={config.textClass}
          />
        );
      })}
    </DashboardOverviewGrid>
  );
}