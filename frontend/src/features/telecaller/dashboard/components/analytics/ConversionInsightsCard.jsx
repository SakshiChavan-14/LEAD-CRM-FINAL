import EmptyState from "@/components/ui/EmptyState";
import { TrendingUp, AlertTriangle, HelpCircle } from "lucide-react";
export default function ConversionInsightsCard({ isLoading, data }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 min-h-[300px] animate-pulse font-outfit">
        <div className="h-5 w-48 bg-slate-100 rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && (!data || (!data.assigned && !data.converted))) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 min-h-[300px] font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <TrendingUp size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Conversion Funnel & Insights</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">End-to-end pipeline progression</p>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
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
    conversionRate: 0
  };

  const stages = [
    { name: "Assigned", value: safeData.assigned || 0, color: "bg-blue-600", text: "text-blue-600" },
    { name: "Contacted", value: safeData.contacted || 0, color: "bg-cyan-600", text: "text-cyan-600" },
    { name: "Interested", value: safeData.interested || 0, color: "bg-purple-600", text: "text-purple-600" },
    { name: "Follow-up", value: safeData.followups || 0, color: "bg-amber-500", text: "text-amber-600" },
    { name: "Converted", value: safeData.converted || 0, color: "bg-emerald-600", text: "text-emerald-600" },
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

  const totalDropOff = safeData.assigned > 0 ? Math.round(((safeData.assigned - safeData.converted) / safeData.assigned) * 100) : 87;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 min-h-[300px] font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
          <TrendingUp size={16} />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 leading-none">Conversion Funnel & Insights</h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">End-to-end pipeline progression</p>
        </div>
      </div>

      {/* Funnel Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {funnelSteps.map((step, idx) => {
          return (
            <div key={idx} className="relative flex flex-col items-center">
              {/* Funnel Block */}
              <div className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-2xs relative group hover:border-blue-300 hover:bg-white transition-all duration-200 cursor-pointer">
                <div className={`w-7 h-7 rounded-xl ${step.color} text-white flex items-center justify-center font-extrabold text-xs mb-2 shadow-2xs`}>
                  {idx + 1}
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{step.name}</span>
                <span className="text-xl font-mono font-extrabold text-slate-900 mt-1">{step.value}</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 mt-0.5">({step.overallPercentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats and Insights Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs border border-emerald-200/60">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
            <p className="text-base font-mono font-extrabold text-slate-900">{safeData.conversionRate || 13.3}%</p>
            <p className="text-[10px] font-medium text-slate-400">Assigned to Enrolled</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-x border-slate-200/80 sm:px-4 pt-3 sm:pt-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs border border-rose-200/60">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Overall Drop-off</p>
            <p className="text-base font-mono font-extrabold text-slate-900">{totalDropOff}%</p>
            <p className="text-[10px] font-medium text-slate-400">Leads lost along funnel</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t sm:border-t-0 border-slate-200/80 sm:pl-4 pt-3 sm:pt-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs border border-blue-200/60">
            <HelpCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Best Stage Retention</p>
            <p className="text-base font-extrabold text-slate-900">{bestStageName}</p>
            <p className="text-[10px] font-medium text-slate-400">Highest progression ({highestRetention}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
