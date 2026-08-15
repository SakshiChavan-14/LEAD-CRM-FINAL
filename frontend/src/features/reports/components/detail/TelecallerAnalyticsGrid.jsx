"use client";

import PerformanceTrendChart from "@/features/reports/components/PerformanceTrendChart";
import ConversionFunnel from "@/features/reports/components/ConversionFunnel";
import SourceAnalyticsChart from "@/features/reports/components/SourceAnalyticsChart";
import CourseAnalyticsChart from "@/features/reports/components/CourseAnalyticsChart";

/**
 * TelecallerAnalyticsGrid
 *
 * Composes all four analytics charts reusing existing report widgets directly.
 * No duplicate chart logic — zero new chart implementations.
 *
 * Visible sections:
 *   - Monthly Performance Trend
 *   - Conversion Funnel
 *   - Source Performance
 *   - Course Distribution
 */
export default function TelecallerAnalyticsGrid({
  monthlyTrend,
  funnel,
  sourcePerformance,
  courseDistribution,
  isLoading,
  exportMode = false,
}) {
  return (
    <div className="space-y-5">
      {/* Row 1: Trend + Funnel */}
      <div className={`grid grid-cols-1 gap-5 ${exportMode ? "" : "lg:grid-cols-2"}`}>
        <PerformanceTrendChart data={monthlyTrend} isLoading={isLoading} />
        <ConversionFunnel      data={funnel}        isLoading={isLoading} />
      </div>

      {/* Row 2: Source + Course */}
      <div className={`grid grid-cols-1 gap-5 ${exportMode ? "" : "lg:grid-cols-2"}`}>
        <SourceAnalyticsChart data={sourcePerformance}  isLoading={isLoading} />
        <CourseAnalyticsChart data={courseDistribution}  isLoading={isLoading} />
      </div>
    </div>
  );
}
