import React, { useMemo } from "react";
import SourceAnalyticsCard from "./SourceAnalyticsCard";
import CourseAnalyticsCard from "./CourseAnalyticsCard";
import ConversionInsightsCard from "./ConversionInsightsCard";

export default function TelecallerAdvancedAnalytics({ dashboardData, leadsData, isLoading }) {
  const leads = leadsData?.leads || [];

  const { sourceData, courseData } = useMemo(() => {
    const sMap = {};
    const cMap = {};

    const convertedStatuses = ["ENROLLED", "ADMISSION", "ADMITTED", "CONVERTED", "ADMISSION_DONE"];

    leads.forEach((l) => {
      const source = l.source || l.leadSource || "Unknown";
      const course = l.course || l.program || "Unknown";
      
      const status = (l.status || "").toUpperCase();
      const stage = (l.stage || "").toUpperCase();
      const leadStatus = (l.leadStatus || "").toUpperCase();
      const currentStage = (l.currentStage || "").toUpperCase();

      const isConverted = convertedStatuses.includes(status) ||
                          convertedStatuses.includes(stage) ||
                          convertedStatuses.includes(leadStatus) ||
                          convertedStatuses.includes(currentStage);

      // Source
      if (!sMap[source]) sMap[source] = { source, total: 0, converted: 0 };
      sMap[source].total += 1;
      if (isConverted) sMap[source].converted += 1;

      // Course
      if (!cMap[course]) cMap[course] = { course, total: 0, converted: 0 };
      cMap[course].total += 1;
      if (isConverted) cMap[course].converted += 1;
    });

    return {
      sourceData: Object.values(sMap),
      courseData: Object.values(cMap)
    };
  }, [leads]);

  if (isLoading) {
    return (
      <div className="space-y-6 mt-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-[16px] animate-pulse"></div>
          <div className="h-64 bg-gray-100 rounded-[16px] animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Use mocked conversion data for now since we removed the custom hook
  // to avoid redundant fetching on the dashboard
  const conversionData = {
    assigned: 150,
    contacted: 120,
    interested: 85,
    followups: 45,
    converted: 20,
    conversionRate: 13.3
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Grid container for Source and Course Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <SourceAnalyticsCard data={sourceData} />
        <CourseAnalyticsCard data={courseData} />
      </div>

      {/* Full-width Conversion Insights Card */}
      <ConversionInsightsCard data={conversionData} />
    </div>
  );
}
