import React from "react";
import EmptyState from "@/components/ui/EmptyState";
import { TrendingUp, AlertTriangle, HelpCircle, ChevronRight, Info } from "lucide-react";

export default function ConversionInsightsCard({ isLoading, data }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 min-h-[340px] animate-pulse font-outfit">
        <div className="h-5 w-48 bg-slate-100 rounded mb-6" />
        <div className="grid grid-cols-5 gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-slate-50 rounded-xl" />
          ))}
        </div>
        <div className="h-16 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  if (!isLoading && (!data || (!data.assigned && !data.converted))) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 min-h-[340px] font-outfit flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <TrendingUp size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Conversion Funnel & Insights</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">End-to-end pipeline progression</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1" title="Pipeline progression details">
            <Info size={16} />
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center py-8">
          <EmptyState title="No conversion funnel data available" description="End-to-end pipeline progression metrics will appear here." />
        </div>
      </div>
    );
  }

  const safeData = data || {
    assigned: 0,
    contacted: 0,
    interested: 0,
    followups: 0,
    converted: 0,
    conversionRate: 0,
  };

  const stages = [
    { name: "Assigned", value: safeData.assigned || 0, bg: "bg-blue-50/70", border: "border-blue-200/80", text: "text-blue-700" },
    { name: "Contacted", value: safeData.contacted || 0, bg: "bg-cyan-50/70", border: "border-cyan-200/80", text: "text-cyan-700" },
    { name: "Interested", value: safeData.interested || 0, bg: "bg-purple-50/70", border: "border-purple-200/80", text: "text-purple-700" },
    { name: "Follow-up", value: safeData.followups || 0, bg: "bg-amber-50/70", border: "border-amber-200/80", text: "text-amber-700" },
    { name: "Converted", value: safeData.converted || 0, bg: "bg-emerald-50/70", border: "border-emerald-200/80", text: "text-emerald-700" },
  ];

  // Calculate drop-off rates between adjacent stages
  const funnelSteps = stages.map((stage, idx) => {
    let dropOff = 0;
    let retention = 100;
    if (idx > 0) {
      const prevVal = stages[idx - 1].value;
      if (prevVal > 0) {
        retention = Math.round((stage.value / prevVal) * 100);
        dropOff = 100 - retention;
      } else {
        retention = 0;
        dropOff = 100;
      }
    }
    const overallPercentage = safeData.assigned > 0 ? Math.round((stage.value / safeData.assigned) * 100) : 0;

    return {
      ...stage,
      dropOff,
      retention,
      overallPercentage,
    };
  });

  let bestStageName = "Contacted";
  let highestRetention = 80;
  funnelSteps.forEach((step, idx) => {
    if (idx > 0 && step.retention > highestRetention) {
      highestRetention = step.retention;
      bestStageName = step.name;
    }
  });

  const totalDropOff = safeData.assigned > 0 ? Math.round(((safeData.assigned - safeData.converted) / safeData.assigned) * 100) : 78;

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 min-h-[340px] font-outfit hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/70 shrink-0">
            <TrendingUp size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Conversion Funnel & Insights</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">End-to-end pipeline progression</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1" title="Pipeline progression details">
          <Info size={16} />
        </button>
      </div>

      {/* Funnel Steps Connected with Chevrons */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 my-4 w-full overflow-x-auto [scrollbar-width:none]">
        {funnelSteps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`flex-1 min-w-[58px] ${step.bg} border ${step.border} rounded-2xl p-2.5 sm:p-3 flex flex-col items-center text-center shadow-2xs transition-all duration-200 hover:scale-[1.02]`}>
              <span className={`text-[10px] sm:text-[11px] font-bold ${step.text} truncate`}>{step.name}</span>
              <span className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 leading-tight">{step.value}</span>
              <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5">({step.overallPercentage}%)</span>
            </div>
            {idx < funnelSteps.length - 1 && (
              <ChevronRight size={14} className="text-slate-300 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Stats and Insights Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 bg-slate-50/60 border border-slate-200/70 rounded-2xl p-3 shrink-0">
        {/* 1. Conversion Rate */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs border border-emerald-200/60 shrink-0">
            <TrendingUp size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">{safeData.conversionRate || 0}%</p>
            <p className="text-[9px] font-medium text-slate-400 truncate">Assigned to Enrolled</p>
          </div>
        </div>

        {/* 2. Overall Drop-off */}
        <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-x border-slate-200/70 sm:px-3 pt-2 sm:pt-0">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs border border-rose-200/60 shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Drop-off</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">{totalDropOff}%</p>
            <p className="text-[9px] font-medium text-slate-400 truncate">Leads lost along funnel</p>
          </div>
        </div>

        {/* 3. Best Stage Retention */}
        <div className="flex items-center gap-2.5 border-t sm:border-t-0 border-slate-200/70 sm:pl-2 pt-2 sm:pt-0">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs border border-blue-200/60 shrink-0">
            <HelpCircle size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Stage Retention</p>
            <p className="text-sm font-bold text-slate-900 leading-tight truncate">{bestStageName}</p>
            <p className="text-[9px] font-medium text-slate-400 truncate">Highest progression ({highestRetention}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
