import React from "react";
import { Phone, CheckCircle, PhoneOff, Clock, FileAudio, Percent, PhoneMissed, Timer } from "lucide-react";
import ManagementKPIGrid from "@/components/management/KPIGrid";
import DashboardKPICard from "@/components/dashboard-ui/KPICard";
import { calculateCallMetrics } from "../utils/callHistoryMetrics";

export default function RecentCallsKPIs({ calls }) {
  const metrics = calculateCallMetrics(calls);

  const kpiConfig = [
    {
      title: "Total Calls",
      value: metrics.totalCalls,
      icon: Phone,
      variant: "blue",
    },
    {
      title: "Connected",
      value: metrics.connectedCalls,
      icon: CheckCircle,
      variant: "success",
    },
    {
      title: "Missed",
      value: metrics.missedCalls,
      icon: PhoneMissed,
      variant: "danger",
    },
    {
      title: "Busy",
      value: metrics.busyCalls,
      icon: PhoneOff,
      variant: "orange",
    },
    {
      title: "Avg Duration",
      value: metrics.averageDuration,
      icon: Clock,
      variant: "purple",
    },
    {
      title: "Recordings",
      value: metrics.recordings,
      icon: FileAudio,
      variant: "cyan",
    },
    {
      title: "Connection Rate",
      value: metrics.connectionRate,
      icon: Percent,
      variant: "primary",
    },
    {
      title: "Longest Call",
      value: metrics.longestCall,
      icon: Timer,
      variant: "indigo",
    },
  ];

  return (
    <ManagementKPIGrid columns={4}>
      {kpiConfig.map((kpi, idx) => (
        <DashboardKPICard
          key={idx}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          variant={kpi.variant || "neutral"}
        />
      ))}
    </ManagementKPIGrid>
  );
}
