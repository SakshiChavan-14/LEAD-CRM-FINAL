import React, { useMemo } from "react";
import SourceAnalyticsCard from "./SourceAnalyticsCard";
import ConversionInsightsCard from "./ConversionInsightsCard";

export default function TelecallerAdvancedAnalytics({ dashboardData, leadsData, isLoading }) {
  const leads = leadsData?.leads || [];

  const sourceData = useMemo(() => {
    const sMap = {};
    const convertedStatuses = ["ENROLLED", "ADMISSION", "ADMITTED", "CONVERTED", "ADMISSION_DONE"];

    leads.forEach((l) => {
      const source = l.source || l.leadSource || "Unknown";
      const status = (l.status || "").toUpperCase();
      const stage = (l.stage || "").toUpperCase();
      const leadStatus = (l.leadStatus || "").toUpperCase();
      const currentStage = (l.currentStage || "").toUpperCase();

      const isConverted = convertedStatuses.includes(status) ||
                          convertedStatuses.includes(stage) ||
                          convertedStatuses.includes(leadStatus) ||
                          convertedStatuses.includes(currentStage);

      if (!sMap[source]) sMap[source] = { source, total: 0, converted: 0 };
      sMap[source].total += 1;
      if (isConverted) sMap[source].converted += 1;
    });

    return Object.values(sMap);
  }, [leads]);

  const conversionData = useMemo(() => {
    const summary = dashboardData?.summary;
    if (summary) {
      const assigned = summary.assigned || 0;
      const contacted = summary.connected || 0;
      const interested = summary.interested || 0;
      const converted = summary.admissions || 0;
      const followups = summary.followups || 0;
      const conversionRate = assigned > 0 ? Number(((converted / assigned) * 100).toFixed(1)) : 0.0;
      
      return {
        assigned,
        contacted,
        interested,
        followups,
        converted,
        conversionRate
      };
    }

    return {
      assigned: 0,
      contacted: 0,
      interested: 0,
      followups: 0,
      converted: 0,
      conversionRate: 0.0
    };
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="space-y-6 mt-6">
        <div className="h-64 bg-gray-100 rounded-[16px] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Source Analytics Card */}
      <SourceAnalyticsCard data={sourceData} />

      {/* Full-width Conversion Insights Card */}
      <ConversionInsightsCard data={conversionData} />
    </div>
  );
}
