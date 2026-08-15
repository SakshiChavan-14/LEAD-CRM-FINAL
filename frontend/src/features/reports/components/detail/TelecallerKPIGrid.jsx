"use client";

import ReportKPICard, { ReportKPISkeleton } from "@/features/reports/components/ReportKPICard";
import {
  ChartSquareBoldDuotoneIcon as ChartSquare,
  PhoneCallingRoundedBoldDuotoneIcon as PhoneCallingRounded,
  UsersGroupRoundedBoldDuotoneIcon as UsersGroupRounded,
  TargetBoldDuotoneIcon as Target,
  CalendarMarkBoldDuotoneIcon as CalendarMark,
  GraphUpBoldDuotoneIcon as GraphUp,
} from "@solar-icons/react";

/**
 * 6 KPI cards for a single telecaller.
 * Reuses ReportKPICard — same colors, typography, and icons as the Reports dashboard.
 */
export default function TelecallerKPIGrid({ kpi, isLoading, exportMode = false }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <ReportKPISkeleton key={i} />)}
      </div>
    );
  }

  if (!kpi) return null;

  return (
    <div className={`grid gap-4 grid-cols-2 sm:grid-cols-3 ${exportMode ? "xl:grid-cols-6" : "xl:grid-cols-3 2xl:grid-cols-6"}`}>
      <ReportKPICard title="Calls Made"   value={kpi.callsMade?.value}  icon={ChartSquare}       color="blue"    />
      <ReportKPICard title="Connected"    value={kpi.connected?.value}   icon={PhoneCallingRounded} color="green"  />
      <ReportKPICard title="Interested"   value={kpi.interested?.value}  icon={Target}            color="purple"  />
      <ReportKPICard title="Follow-ups"   value={kpi.followups?.value}   icon={CalendarMark}      color="amber"   />
      <ReportKPICard title="Admissions"   value={kpi.admissions?.value}  icon={UsersGroupRounded} color="cyan"    />
      <ReportKPICard title="Conversion"   value={kpi.conversion?.value}  icon={GraphUp}           color="emerald" />
    </div>
  );
}
