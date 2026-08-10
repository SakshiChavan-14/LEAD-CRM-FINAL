import { FilterX } from "lucide-react";

const FUNNEL_COLORS = [
  "bg-[#2563EB]", // New
  "bg-[#0EA5E9]", // Contacted
  "bg-[#10B981]", // Interested
  "bg-[#F59E0B]", // Application
  "bg-[#8B5CF6]", // Admission
];

const cardClass = "rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 h-[420px] flex flex-col justify-between font-outfit";

export default function PipelineChart({ pipeline = [] }) {
  // Preserve existing fallback logic
  const displayPipeline = pipeline && pipeline.length > 0 ? pipeline : [
    { stage: 'New', count: 450 },
    { stage: 'Contacted', count: 320 },
    { stage: 'Interested', count: 180 },
    { stage: 'Application', count: 95 },
    { stage: 'Admission', count: 42 }
  ];

  const totalCount = displayPipeline.reduce((sum, stage) => sum + (stage.count || 0), 0);
  const firstStageCount = displayPipeline[0]?.count || 1;

  // Overall conversion: last / first
  const overallConversion = displayPipeline.length >= 2 && displayPipeline[0].count > 0
    ? ((displayPipeline[displayPipeline.length - 1].count / displayPipeline[0].count) * 100).toFixed(1)
    : "0.0";

  return (
    <div className={cardClass}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Admission Funnel</h2>
        <p className="text-xs text-slate-500 mt-1">Lead progression through pipeline stages</p>
      </div>

      {totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-500 py-6">
          <FilterX size={32} className="text-slate-300 mb-3" />
          <p className="font-semibold text-gray-900">Empty Pipeline</p>
          <p className="text-xs mt-1">No leads have entered the funnel yet.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between mt-6">
          
          {/* Funnel Rows */}
          <div className="space-y-4">
            {displayPipeline.map((stage, idx) => {
              const colorClass = FUNNEL_COLORS[idx % FUNNEL_COLORS.length];
              
              // Calculate width relative to first stage
              const percentWidth = Math.max(8, Math.round((stage.count / firstStageCount) * 100));

              return (
                <div key={stage.stage || idx} className="flex items-center gap-4 h-8">
                  {/* Left: Stage label (14px) */}
                  <span className="w-24 text-sm font-semibold text-slate-600 truncate">
                    {stage.stage}
                  </span>

                  {/* Center: Horizontal progress bar (12px rounded) */}
                  <div className="flex-grow bg-slate-50 h-5 rounded-[12px] relative overflow-hidden">
                    <div 
                      className={`h-full rounded-[12px] ${colorClass} transition-all duration-500`}
                      style={{ width: `${percentWidth}%` }}
                    />
                  </div>

                  {/* Right: Count (16px) */}
                  <div className="w-16 flex items-center justify-end text-right">
                    <span className="text-base font-bold text-slate-900">{stage.count}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Integrated Footer with Overall Conversion */}
          <div className="border-t border-slate-100 pt-5 mt-5">
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Conversion</span>
              <div className="text-2xl font-bold text-[#7F1D1D] mt-1">{overallConversion}%</div>
              <p className="text-xs text-slate-400 mt-0.5">Healthy pipeline conversion</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
