"use client";

import TelecallerHeader       from "@/features/reports/components/detail/TelecallerHeader";
import TelecallerKPIGrid      from "@/features/reports/components/detail/TelecallerKPIGrid";
import TelecallerAnalyticsGrid from "@/features/reports/components/detail/TelecallerAnalyticsGrid";
import TelecallerActivityGrid  from "@/features/reports/components/detail/TelecallerActivityGrid";
import TelecallerTimelineCard  from "@/features/reports/components/detail/TelecallerTimelineCard";

/**
 * TelecallerReportTemplate
 *
 * Print-only A4 composition wrapper.
 * Renders exactly the same sections as the dedicated telecaller page.
 * Layout is adjusted for 794px A4 width — components stack vertically,
 * side-by-side grids are disabled via exportMode=true on children.
 *
 * Backend (Playwright/Puppeteer) opens /reports/export/telecaller/[id],
 * captures this component, and streams the result as a PDF.
 */
export default function TelecallerReportTemplate({ data, id, range }) {
  if (!data) return null;

  return (
    <div
      style={{
        width: "794px",
        minHeight: "1123px",
        padding: "16mm",
        backgroundColor: "#ffffff",
        fontFamily: "'Outfit', 'Inter', sans-serif",
      }}
      className="space-y-6"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <TelecallerHeader
        telecaller={data.telecaller}
        id={id}
        range={range}
        exportMode
      />

      {/* ── KPI Cards ──────────────────────────────────────────────── */}
      <TelecallerKPIGrid kpi={data.kpi} exportMode />

      {/* Page break before analytics */}
      <div style={{ pageBreakBefore: "auto" }} />

      {/* ── Analytics Charts ───────────────────────────────────────── */}
      <TelecallerAnalyticsGrid
        monthlyTrend={data.monthlyTrend}
        funnel={data.funnel}
        sourcePerformance={data.sourcePerformance}
        courseDistribution={data.courseDistribution}
        exportMode
      />

      {/* Page break before activity */}
      <div style={{ pageBreakBefore: "always" }} />

      {/* ── Activity: Recent Calls + Follow-ups ────────────────────── */}
      <TelecallerActivityGrid
        recentCalls={data.recentCalls}
        followups={data.followups}
        exportMode
      />

      {/* ── Timeline ───────────────────────────────────────────────── */}
      <TelecallerTimelineCard timeline={data.timeline} exportMode />
    </div>
  );
}
