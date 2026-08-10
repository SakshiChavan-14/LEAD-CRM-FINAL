import React from "react";
import { TrendingUp, ArrowDown, HelpCircle, AlertTriangle } from "lucide-react";

export default function ConversionInsightsCard({ isLoading, data }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#ECECEC] rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 min-h-[300px]">
        <div className="h-6 w-48 bg-gray-100 animate-pulse rounded mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const stages = [
    { name: "Assigned", value: data.assigned, color: "bg-[#8B1538]", text: "text-[#8B1538]" },
    { name: "Contacted", value: data.contacted, color: "bg-[#3B82F6]", text: "text-[#3B82F6]" },
    { name: "Interested", value: data.interested, color: "bg-[#8B5CF6]", text: "text-[#8B5CF6]" },
    { name: "Follow-up", value: data.followups, color: "bg-[#F59E0B]", text: "text-[#F59E0B]" },
    { name: "Converted", value: data.converted, color: "bg-[#10B981]", text: "text-[#10B981]" },
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
    const overallPercentage = data.assigned > 0 ? Math.round((stage.value / data.assigned) * 100) : 0;

    return {
      ...stage,
      dropOff,
      retention,
      overallPercentage,
    };
  });

  // Calculate Best Stage and Overall Drop-off
  let bestStageName = "N/A";
  let highestRetention = 0;
  funnelSteps.forEach((step, idx) => {
    if (idx > 0 && step.retention > highestRetention) {
      highestRetention = step.retention;
      bestStageName = step.name;
    }
  });

  const totalDropOff = data.assigned > 0 ? Math.round(((data.assigned - data.converted) / data.assigned) * 100) : 0;

  return (
    <div className="bg-white border border-[#ECECEC] rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 min-h-[300px]">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={18} className="text-[#8B1538]" />
        <h2 className="text-lg font-semibold text-gray-900">Conversion Funnel & Insights</h2>
      </div>

      {/* Funnel Steps */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {funnelSteps.map((step, idx) => {
          const isLast = idx === funnelSteps.length - 1;

          return (
            <div key={idx} className="relative flex flex-col items-center">
              {/* Funnel Block */}
              <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm relative group hover:border-[#8B1538]/20 transition-all">
                <div className={`w-8 h-8 rounded-lg ${step.color} text-white flex items-center justify-center font-bold text-sm mb-3`}>
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{step.name}</span>
                <span className="text-2xl font-bold text-gray-900 mt-1">{step.value}</span>
                <span className="text-[11px] font-bold text-[#8B1538] mt-1">({step.overallPercentage}%)</span>
              </div>

              {/* Arrow and Drop-off Indicator between stages */}
              {!isLast && (
                <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10 flex-col items-center bg-white px-1.5 py-0.5 rounded-full border border-gray-150 shadow-sm text-[10px] font-bold text-red-500">
                  <ArrowDown size={12} className="rotate-270 text-gray-400 mb-0.5" />
                  <span>-{funnelSteps[idx + 1].dropOff}%</span>
                </div>
              )}

              {/* Mobile drop-off indicator */}
              {!isLast && (
                <div className="flex md:hidden items-center gap-1 my-2 text-xs font-semibold text-red-500">
                  <ArrowDown size={14} />
                  <span>Stage drop-off: -{funnelSteps[idx + 1].dropOff}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats and Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/50 border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Conversion Rate</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{data.conversionRate}%</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Assigned to Enrolled leads</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-gray-200/50 md:border-t-0 md:border-x md:px-6">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Overall Drop-off</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{totalDropOff}%</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Leads lost along the funnel</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-gray-200/50 md:border-t-0 md:pl-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <HelpCircle size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Best Stage Retention</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{bestStageName}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Highest progression ({highestRetention}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
