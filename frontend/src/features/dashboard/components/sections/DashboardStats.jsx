import React from "react";
import { KPICard } from "@/components/dashboard-ui/KPICard";
import { Users, UserCheck, UserPlus, Clock, Percent, Headphones, GraduationCap } from "lucide-react";

const kpiConfigMap = {
  "Total Leads": {
    icon: Users,
    iconBgClassName: "bg-blue-50",
    iconClassName: "text-blue-600",
  },
  "Active Leads": {
    icon: UserCheck,
    iconBgClassName: "bg-emerald-50",
    iconClassName: "text-emerald-600",
  },
  "New Today": {
    icon: UserPlus,
    iconBgClassName: "bg-purple-50",
    iconClassName: "text-purple-600",
  },
  "Pending Assign": {
    icon: Clock,
    iconBgClassName: "bg-amber-50",
    iconClassName: "text-amber-600",
  },
  "Conversion Rate": {
    icon: Percent,
    iconBgClassName: "bg-rose-50",
    iconClassName: "text-rose-600",
  },
  "Telecallers": {
    icon: Headphones,
    iconBgClassName: "bg-cyan-50",
    iconClassName: "text-cyan-600",
  },
  "Admissions": {
    icon: GraduationCap,
    iconBgClassName: "bg-teal-50",
    iconClassName: "text-teal-600",
  },
};

export default function DashboardStats({ stats = [] }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 font-outfit">
      {stats.map((item) => {
        const config = kpiConfigMap[item.title] || kpiConfigMap["Total Leads"];
        return (
          <KPICard
            key={item.id || item.title}
            title={item.title}
            value={item.value}
            icon={config.icon}
            iconBgClassName={config.iconBgClassName}
            iconClassName={config.iconClassName}
          />
        );
      })}
    </div>
  );
}