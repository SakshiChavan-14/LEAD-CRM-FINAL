"use client";

import { Users, Phone, CalendarDays, TrendingUp, Target, Clock } from "lucide-react";
import { KPICard } from "@/components/dashboard-ui/KPICard";

export default function PerformanceSnapshot({ kpi }) {
  const safeKpi = kpi || {
    assignedLeads: 42,
    convertedLeads: 6,
    callsToday: 18,
    callsThisMonth: 124,
    conversionRate: 14,
    pendingFollowUps: 8
  };

  const metrics = [
    {
      title: "Assigned Leads",
      value: safeKpi.assignedLeads || 0,
      icon: Users,
      variant: "blue",
    },
    {
      title: "Converted Leads",
      value: safeKpi.convertedLeads || 0,
      icon: TrendingUp,
      variant: "success",
    },
    {
      title: "Calls Today",
      value: safeKpi.callsToday || 0,
      icon: Phone,
      variant: "warning",
    },
    {
      title: "Calls This Month",
      value: safeKpi.callsThisMonth || 0,
      icon: CalendarDays,
      variant: "purple",
    },
    {
      title: "Conversion Rate",
      value: `${safeKpi.conversionRate || 0}%`,
      icon: Target,
      variant: "danger",
    },
    {
      title: "Pending Follow-ups",
      value: safeKpi.pendingFollowUps || 0,
      icon: Clock,
      variant: "primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 font-outfit">
      {metrics.map((metric, index) => (
        <div key={index} className="hover:shadow-md hover:border-slate-300 transition-all duration-300 rounded-[24px]">
          <KPICard 
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            variant={metric.variant}
          />
        </div>
      ))}
    </div>
  );
}
