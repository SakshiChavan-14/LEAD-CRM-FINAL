import React from "react";
import { KPICard } from "@/components/dashboard-ui/KPICard";
import { KPIGrid } from "@/components/management";
import { Users, UserCheck, UserPlus, Clock, Percent, Headphones, GraduationCap } from "lucide-react";

const getIconForTitle = (title) => {
  switch (title) {
    case "Total Leads": return Users;
    case "Active Leads": return UserCheck;
    case "New Today": return UserPlus;
    case "Pending Assign": return Clock;
    case "Conversion Rate": return Percent;
    case "Telecallers": return Headphones;
    case "Admissions": return GraduationCap;
    default: return Users;
  }
};

export default function DashboardStats({ stats = [] }) {
  return (
    <KPIGrid className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {stats.map((item) => {
        const Icon = getIconForTitle(item.title);
        
        return (
          <KPICard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={Icon}
            variant={item.type || "primary"}
            trend={item.title === "New Today" ? "+12%" : undefined} // Mock trend for presentation
            trendDirection="up"
          />
        );
      })}
    </KPIGrid>
  );
}