import React from "react";
import { KPICard, KPICardSkeleton } from "@/components/dashboard-ui/KPICard";

const colorMap = {
  // Semantic mappings
  calls: { bg: "bg-blue-50", text: "text-blue-600" },
  connected: { bg: "bg-cyan-50", text: "text-cyan-600" },
  interested: { bg: "bg-violet-50", text: "text-violet-600" },
  followups: { bg: "bg-amber-50", text: "text-amber-600" },
  admissions: { bg: "bg-emerald-50", text: "text-emerald-600" },
  conversion: { bg: "bg-teal-50", text: "text-teal-600" },

  // Direct color mappings
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" }
};

export const ReportKPISkeleton = KPICardSkeleton;

const ReportKPICard = React.memo(function ReportKPICard({
  title,
  value,
  trend,
  color = "calls",
  icon: Icon
}) {
  const theme = colorMap[color] || colorMap.calls;

  // Preserve existing formatting logic
  const displayValue = typeof value === "number" && color !== "conversion"
    ? value.toLocaleString("en-IN")
    : value;

  return (
    <KPICard
      title={title}
      value={displayValue}
      icon={Icon}

      iconClassName={theme.text}
      iconBgClassName={theme.bg}
      className="shadow-sm hover:shadow-md"
    />
  );
});

export default ReportKPICard;
