import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Sparkles, Percent } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

const STAGE_THEMES = [
  {
    bar: "bg-blue-500",
    shadow: "shadow-blue-500/20",
    badge: "bg-blue-50 text-blue-700 border-blue-200/60",
    dot: "bg-blue-500",
    color: "#3B82F6"
  },
  {
    bar: "bg-sky-400",
    shadow: "shadow-sky-400/20",
    badge: "bg-sky-50 text-sky-700 border-sky-200/60",
    dot: "bg-sky-400",
    color: "#38BDF8"
  },
  {
    bar: "bg-emerald-500",
    shadow: "shadow-emerald-500/20",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    dot: "bg-emerald-500",
    color: "#10B981"
  },
  {
    bar: "bg-amber-400",
    shadow: "shadow-amber-400/20",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
    dot: "bg-amber-400",
    color: "#FBBF24"
  },
  {
    bar: "bg-violet-500",
    shadow: "shadow-violet-500/20",
    badge: "bg-violet-50 text-violet-700 border-violet-200/60",
    dot: "bg-violet-500",
    color: "#8B5CF6"
  },
];

const STATUS_LABEL_MAP = {
  ENQUIRY: "Enquiry",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  INTERESTED: "Interested",
  APPLICATION: "Application",
  ADMISSION: "Admission",
  COMPLETED: "Completed",
  FOLLOW_UP: "Follow-up",
  NOT_INTERESTED: "Not Interested",
  HOT: "Hot Lead",
  WARM: "Warm Lead",
  COLD: "Cold Lead",
};

const DEFAULT_STATUS_ORDER = ["ENQUIRY", "CONTACTED", "QUALIFIED", "APPLICATION", "ADMISSION", "COMPLETED", "NOT_INTERESTED"];

const getHumanReadableStatus = (rawStatus) => {
  if (!rawStatus) return "Enquiry";
  const upper = String(rawStatus).toUpperCase().trim();
  if (STATUS_LABEL_MAP[upper]) return STATUS_LABEL_MAP[upper];
  return upper.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
};

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 min-h-[480px] h-auto flex flex-col justify-between font-outfit overflow-hidden scroll-mt-24";

export default function PipelineChart({ pipeline = [] }) {
  const router = useRouter();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Trigger smooth entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sortedPipeline = React.useMemo(() => {
    const countsMap = {};
    pipeline.forEach(item => {
      const stageKey = String(item.stage || item.rawStatus || "").toUpperCase().trim().replace(/ /g, "_");
      countsMap[stageKey] = (countsMap[stageKey] || 0) + (item.count || 0);
    });

    // Map and aggregate raw statuses into 5 core stages
    const enquiry = countsMap["ENQUIRY"] || 0;
    // If contacted is 0 but we have follow-ups, map follow-ups to contacted
    const contacted = (countsMap["CONTACTED"] || 0) + (countsMap["FOLLOW_UP"] || 0) + (countsMap["FOLLOWUP"] || 0);
    const qualified = countsMap["QUALIFIED"] || countsMap["INTERESTED"] || 0;
    const application = countsMap["APPLICATION"] || 0;
    const admission = (countsMap["ADMISSION"] || 0) + (countsMap["COMPLETED"] || 0) + (countsMap["ENROLLED"] || 0) + (countsMap["ADMITTED"] || 0);

    return [
      { stage: "ENQUIRY", count: enquiry },
      { stage: "CONTACTED", count: contacted },
      { stage: "QUALIFIED", count: qualified },
      { stage: "APPLICATION", count: application },
      { stage: "ADMISSION", count: admission },
    ];
  }, [pipeline]);

  const totalCount = sortedPipeline.reduce((sum, stage) => sum + (stage.count || 0), 0);
  const firstStageCount = sortedPipeline[0]?.count || 1;

  // Overall conversion: last / first
  const lastStageCount = sortedPipeline[sortedPipeline.length - 1]?.count || 0;
  const overallConversion = sortedPipeline.length >= 2 && firstStageCount > 0
    ? ((lastStageCount / firstStageCount) * 100).toFixed(1)
    : "0.0";

  const handleStageClick = (stageItem) => {
    const statusCode = stageItem.rawStatus || stageItem.stage || "";
    router.push(`/dashboard/management/leads?status=${encodeURIComponent(statusCode)}`);
  };

  return (
    <div id="lead-funnel" className={cardClass}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Lead Pipeline</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <Sparkles size={12} className="text-emerald-600" />
              Live Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Lead progression through conversion stages</p>
        </div>

        <div className="text-right">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Total Leads</span>
          <p className="text-lg font-extrabold text-slate-900 leading-none mt-0.5">{totalCount.toLocaleString()}</p>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="flex-1 flex items-center justify-center mt-5">
          <EmptyState title="No pipeline data available" description="No leads have entered the funnel yet." />
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between mt-5">
          {/* Funnel Rows */}
          <div className="space-y-1.5">
            {sortedPipeline.map((stage, idx) => {
              const theme = STAGE_THEMES[idx % STAGE_THEMES.length];
              const isHovered = hoveredIdx === idx;
              const label = getHumanReadableStatus(stage.stage || stage.rawStatus);
              
              // Calculate percent of initial stage
              const percentOfInitial = firstStageCount > 0 
                ? Math.round((stage.count / firstStageCount) * 100)
                : 0;

              const percentWidth = Math.max(10, percentOfInitial);

              return (
                <div
                  key={stage.stage || idx}
                  onClick={() => handleStageClick(stage)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className={`group relative flex items-center gap-3 p-1 rounded-xl transition-all duration-300 cursor-pointer ${
                    isHovered ? "bg-slate-50/90 scale-[1.01]" : "hover:bg-slate-50/50"
                  }`}
                >
                  {/* Stage Step & Name */}
                  <div className="w-32 flex items-center gap-2 shrink-0">
                    <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border ${theme.badge} shrink-0`}>
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 truncate group-hover:text-blue-600 transition-colors">
                      {label}
                    </span>
                  </div>

                  {/* Center: Clean Flat Progress Bar */}
                  <div className="flex-grow bg-slate-100/80 h-6 rounded-full relative overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className={`h-full rounded-full ${theme.bar} transition-all duration-1000 ease-out shadow-sm ${theme.shadow} relative overflow-hidden`}
                      style={{ 
                        width: isAnimated ? `${percentWidth}%` : '0%',
                        transitionDelay: `${idx * 120}ms`
                      }}
                    >
                      {/* Subtle top-shine */}
                      <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Stage Conversion Rate Tag (Hover/Active) */}
                  <div className="w-14 text-right shrink-0 hidden sm:block">
                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-700 transition-colors">
                      {percentOfInitial}%
                    </span>
                  </div>

                  {/* Right: Stage Count */}
                  <div className="w-16 flex items-center justify-end text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900 group-hover:scale-105 transition-transform">
                      {stage.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Footer with Conversion Metric & Efficiency Summary */}
          <div className="border-t border-slate-100 pt-3 mt-2">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                  <Percent size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block leading-none">
                    Total Conversion
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    Lead to Admission
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xl font-extrabold text-blue-600 leading-none">
                    {overallConversion}%
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block flex items-center justify-end gap-0.5">
                    <TrendingUp size={10} /> Optimal Flow
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
