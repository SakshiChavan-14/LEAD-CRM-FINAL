import { Target } from "lucide-react";
import Link from "next/link";

const GoalSkeleton = () => (
  <div className="flex flex-col gap-4 w-full h-[112px] p-5 justify-center">
    <div className="flex justify-between items-center">
      <div className="w-32 h-5 bg-gray-100 animate-pulse rounded"></div>
      <div className="w-16 h-5 bg-gray-100 animate-pulse rounded"></div>
    </div>
    <div className="w-full h-2 bg-gray-100 animate-pulse rounded-full"></div>
    <div className="w-48 h-4 bg-gray-100 animate-pulse rounded mt-2"></div>
  </div>
);

export default function TodayGoalGauge({ isLoading, summary }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm flex flex-col h-[112px] w-full">
        <GoalSkeleton />
      </div>
    );
  }

  const goal = summary?.goal || 100;
  const completed = summary?.callsToday || 0;
  const connected = summary?.connected || 0;
  const interested = summary?.interested || 0;

  const safeGoal = Math.max(1, goal);
  const percentage = Math.min(100, Math.round((completed / safeGoal) * 100));
  const remaining = Math.max(0, safeGoal - completed);

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-5 flex flex-col justify-between h-[112px]">
      
      {/* Top Header & Metrics */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Target size={16} className="text-[#8B1538]" strokeWidth={2.5} />
            <h2 className="text-[16px] font-semibold text-gray-900 leading-none">Today's Mission</h2>
          </div>
          <span className="text-[12px] font-medium text-gray-500">{safeGoal} target</span>
        </div>
        
        <div className="flex items-center gap-4 text-[13px] font-medium">
          <div className="flex items-center gap-1.5"><span className="text-gray-500">Done</span><span className="font-bold text-gray-900">{completed}</span></div>
          <div className="flex items-center gap-1.5"><span className="text-gray-500">Connected</span><span className="font-bold text-gray-900">{connected}</span></div>
          <div className="flex items-center gap-1.5"><span className="text-gray-500">Interested</span><span className="font-bold text-gray-900">{interested}</span></div>
        </div>
      </div>
      
      {/* Progress Bar Area */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#8B1538] rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-[13px] font-bold text-gray-900 w-10 text-right">{percentage}%</span>
      </div>

      {/* Bottom Status */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[12px] font-medium text-gray-700">{completed} / {safeGoal} completed</span>
        <span className="text-gray-300">•</span>
        <span className="text-[12px] font-medium text-gray-500">{remaining} calls remaining</span>
      </div>

    </div>
  );
}
