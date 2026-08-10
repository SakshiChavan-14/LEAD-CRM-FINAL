import { ChevronDown } from "lucide-react";

const PipelineSkeleton = () => (
  <div className="flex-1 flex gap-6 mt-4">
    <div className="w-1/2 flex flex-col items-center justify-center space-y-1">
      <div className="w-[100%] h-10 bg-gray-100 animate-pulse rounded-t-lg"></div>
      <div className="w-[85%] h-10 bg-gray-100 animate-pulse"></div>
      <div className="w-[70%] h-10 bg-gray-100 animate-pulse"></div>
      <div className="w-[50%] h-10 bg-gray-100 animate-pulse rounded-b-lg"></div>
    </div>
    <div className="w-1/2 flex flex-col justify-center space-y-4">
      <div className="w-full h-4 bg-gray-100 animate-pulse rounded"></div>
      <div className="w-3/4 h-4 bg-gray-100 animate-pulse rounded"></div>
      <div className="w-full h-4 bg-gray-100 animate-pulse rounded"></div>
      <div className="w-2/3 h-4 bg-gray-100 animate-pulse rounded"></div>
    </div>
  </div>
);

export default function PipelineSection({ isLoading, pipeline = [] }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#ECECEC] rounded-[16px] shadow-sm p-6 flex flex-col min-h-[260px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900">Pipeline Overview</h2>
        </div>
        <PipelineSkeleton />
      </div>
    );
  }

  const isEmpty = !Array.isArray(pipeline) || pipeline.length === 0 || pipeline.reduce((sum, stage) => sum + (stage.count || 0), 0) === 0;
  
  // Use a default structure if empty to show the faded funnel
  const displayPipeline = isEmpty ? [
    { stage: "New Lead", count: 0 },
    { stage: "Contacted", count: 0 },
    { stage: "Interested", count: 0 },
    { stage: "Converted", count: 0 },
  ] : pipeline;

  const totalCount = displayPipeline.reduce((sum, stage) => sum + (stage.count || 0), 0);
  
  const colors = [
    { bg: "bg-[#8B1538]", text: "text-[#8B1538]" }, // Primary
    { bg: "bg-[#EC4899]", text: "text-[#EC4899]" }, // Pink (fallback)
    { bg: "bg-[#F59E0B]", text: "text-[#F59E0B]" }, // Warning
    { bg: "bg-[#3B82F6]", text: "text-[#3B82F6]" }, // Blue
    { bg: "bg-[#8B5CF6]", text: "text-[#8B5CF6]" }, // Purple
    { bg: "bg-[#16A34A]", text: "text-[#16A34A]" }, // Success
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6 flex flex-col min-h-[260px] relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-semibold text-gray-900">Pipeline Overview</h2>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors outline-none focus:ring-2 focus:ring-[#8B1538] rounded p-1">
          This Month <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>

      <div className={`flex-1 flex flex-col justify-center ${isEmpty ? 'opacity-40 grayscale' : ''}`}>
        <div className="flex items-center gap-6">
          {/* Funnel Visual */}
          <div className="w-1/2 flex flex-col items-center gap-0.5">
            {displayPipeline.map((stage, idx) => {
              const visualWidth = Math.max(30, 100 - (idx * (70 / (displayPipeline.length || 1))));
              const color = colors[idx % colors.length].bg;
              const isFirst = idx === 0;
              const isLast = idx === displayPipeline.length - 1;
              
              return (
                <div key={`visual-${stage.stage || idx}`} className="w-full flex justify-center group">
                  <div 
                    className={`${color} h-[34px] w-full transition-all duration-500 hover:opacity-80 cursor-pointer ${isFirst ? 'rounded-t-md' : ''} ${isLast ? 'rounded-b-md' : ''}`}
                    style={{ width: `${visualWidth}%` }}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* Funnel Legend */}
          <div className="w-1/2 flex flex-col gap-3.5">
            {displayPipeline.map((stage, idx) => {
              const percentage = totalCount > 0 ? Math.round((stage.count / totalCount) * 100) : 0;
              const colorTheme = colors[idx % colors.length];
              
              return (
                <div key={`legend-${stage.stage || idx}`} className="flex items-center justify-between text-sm group cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colorTheme.bg} group-hover:scale-125 transition-transform`}></div>
                    <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-right">
                    <span className="font-bold text-gray-900">{stage.count}</span>
                    <span className="text-[10px] font-bold text-gray-400 w-8 inline-block">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-8">
           <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[12px] font-bold text-gray-500 shadow-sm border border-gray-100">No leads in pipeline yet</span>
        </div>
      )}
    </div>
  );
}
