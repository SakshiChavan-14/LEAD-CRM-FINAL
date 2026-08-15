import React, { useMemo } from "react";
import { KPICard } from "@/components/dashboard-ui/KPICard";
import { Users, UserCheck, UserPlus, Percent, Headphones, UserRoundPlus } from "lucide-react";

const kpiConfigMap = {
  "Total Leads": {
    icon: Users,
    iconBgClassName: "bg-blue-50",
    iconClassName: "text-blue-600",
    href: "/dashboard/management/leads?filter=all",
    displayTitle: "Total Leads",
  },
  "Active Leads": {
    icon: UserCheck,
    iconBgClassName: "bg-emerald-50",
    iconClassName: "text-emerald-600",
    href: "/dashboard/management/leads?filter=active",
    displayTitle: "Active Leads",
  },
  "New Today": {
    icon: UserPlus,
    iconBgClassName: "bg-purple-50",
    iconClassName: "text-purple-600",
    href: "/dashboard/management/leads?filter=today",
    displayTitle: "New Today",
  },
  "Pending Assign": {
    icon: UserRoundPlus,
    iconBgClassName: "bg-amber-50",
    iconClassName: "text-amber-600",
    href: "/dashboard/management/leads?filter=unassigned",
    displayTitle: "Pending Assignment",
  },
  "Conversion Rate": {
    icon: Percent,
    iconBgClassName: "bg-rose-50",
    iconClassName: "text-rose-600",
    onClick: () => {
      const el = document.getElementById("lead-funnel");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    displayTitle: "Conversion Rate",
  },
  "Telecallers": {
    icon: Headphones,
    iconBgClassName: "bg-cyan-50",
    iconClassName: "text-cyan-600",
    href: "/dashboard/management/user-directory",
    displayTitle: "Active Telecallers",
  },
};

export default function DashboardStats({ stats = [] }) {
  // Order exactly: Total Leads, Active Leads, New Today, Pending Assign, Conversion Rate, Telecallers
  const orderedKeys = ["Total Leads", "Active Leads", "New Today", "Pending Assign", "Conversion Rate", "Telecallers"];
  
  const statsMap = useMemo(() => {
    const map = new Map();
    stats.forEach(s => map.set(s.title, s));
    return map;
  }, [stats]);

  const filteredStats = useMemo(() => {
    return orderedKeys.map(key => {
      const item = statsMap.get(key);
      const config = kpiConfigMap[key];
      if (!item) return null;
      return {
        ...item,
        title: config.displayTitle,
        config
      };
    }).filter(Boolean);
  }, [statsMap]);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 font-outfit">
      {filteredStats.map((item) => {
        return (
          <KPICard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.config.icon}
            iconBgClassName={item.config.iconBgClassName}
            iconClassName={item.config.iconClassName}
            href={item.config.href}
            onClick={item.config.onClick}
          />
        );
      })}
    </div>
  );
}