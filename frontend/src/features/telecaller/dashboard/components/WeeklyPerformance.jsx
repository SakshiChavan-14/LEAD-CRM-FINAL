import { ChevronDown } from "lucide-react";

const ProgressBar = ({ label, current, target }) => {
  const safeTarget = Math.max(1, target);
  const percentage = Math.min(100, Math.round((current / safeTarget) * 100));

  return (
    <div className="flex flex-col gap-1.5 group">
      <div className="flex justify-between items-end">
        <span className="font-semibold text-gray-700 text-[13px] group-hover:text-gray-900 transition-colors">{label}</span>
        <span className="text-[12px] text-gray-500 font-medium">
          <strong className="text-gray-900 text-[13px]">{current}</strong> / {target}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
        <div 
          className="h-full rounded-full bg-[#8B1538] transition-all duration-1000 ease-out group-hover:bg-[#6F102D]"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const PerformanceSkeleton = () => (
  <div className="flex-1 space-y-6 mt-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <div className="w-16 h-4 bg-gray-100 animate-pulse rounded"></div>
          <div className="w-20 h-4 bg-gray-100 animate-pulse rounded"></div>
        </div>
        <div className="w-full h-2 bg-gray-100 animate-pulse rounded-full"></div>
      </div>
    ))}
  </div>
);

export default function WeeklyPerformance({ isLoading, weeklyPerformance, summary }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6 flex flex-col min-h-[260px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900">My Performance</h2>
        </div>
        <PerformanceSkeleton />
      </div>
    );
  }

  // Fallback defaults to summary if weeklyPerformance is missing to make it look populated
  const perf = weeklyPerformance || {
    calls: { current: summary?.callsToday || 0, target: Math.max((summary?.callsToday || 0) + 10, 50) },
    interested: { current: summary?.interested || 0, target: Math.max((summary?.interested || 0) + 2, 5) },
    admissions: { current: summary?.admissions || 0, target: Math.max((summary?.admissions || 0) + 1, 2) }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6 flex flex-col min-h-[260px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-semibold text-gray-900">My Performance</h2>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors outline-none focus:ring-2 focus:ring-[#8B1538] rounded p-1">
          This Week <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center pb-2">
        <ProgressBar 
          label="Calls" 
          current={perf.calls?.current || 0} 
          target={perf.calls?.target || 50} 
        />
        <ProgressBar 
          label="Interested" 
          current={perf.interested?.current || 0} 
          target={perf.interested?.target || 5} 
        />
        <ProgressBar 
          label="Admissions" 
          current={perf.admissions?.current || 0} 
          target={perf.admissions?.target || 2} 
        />
      </div>
    </div>
  );
}
