import ReportKPICard, { ReportKPISkeleton } from "./ReportKPICard";
import {
  ChartSquareBoldDuotoneIcon as ChartSquare,
  PhoneCallingRoundedBoldDuotoneIcon as PhoneCallingRounded,
  UsersGroupRoundedBoldDuotoneIcon as UsersGroupRounded,
  TargetBoldDuotoneIcon as Target,
  CalendarMarkBoldDuotoneIcon as CalendarMark,
  GraphUpBoldDuotoneIcon as GraphUp,
} from '@solar-icons/react';

export default function ReportKPIGrid({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <ReportKPISkeleton key={i} />)}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <ReportKPICard
        title="Calls Made"
        value={data.callsMade.value}
        icon={ChartSquare}
        color="blue"
      />
      <ReportKPICard
        title="Connected"
        value={data.connected.value}
        icon={PhoneCallingRounded}
        color="green"
      />
      <ReportKPICard
        title="Interested"
        value={data.interested.value}
        trend={data.interested.trend}
        icon={Target}
        color="purple"
      />
      <ReportKPICard
        title="Follow-ups"
        value={data.followups.value}
        trend={data.followups.trend}
        icon={CalendarMark}
        color="amber"
      />
      <ReportKPICard
        title="Admissions"
        value={data.admissions.value}
        trend={data.admissions.trend}
        icon={UsersGroupRounded}
        color="cyan"
      />
      <ReportKPICard
        title="Conversion"
        value={data.conversion.value}
        trend={data.conversion.trend}
        icon={GraphUp}
        color="emerald"
      />
    </div>
  );
}
