import { History, ChevronRight } from "lucide-react";

const ActivitySkeleton = () => (
  <div className="flex gap-4 group mt-2">
    <div className="w-[40px] text-right pt-1 shrink-0">
      <div className="w-8 h-3 bg-gray-100 animate-pulse rounded ml-auto"></div>
    </div>
    <div className="w-2.5 h-2.5 rounded-full bg-gray-100 animate-pulse shrink-0 mt-1"></div>
    <div className="flex-1 pb-4">
      <div className="w-3/4 h-4 bg-gray-100 animate-pulse rounded mb-2"></div>
      <div className="w-16 h-4 bg-gray-100 animate-pulse rounded"></div>
    </div>
  </div>
);

export default function RecentActivity({ isLoading, activities }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6 flex flex-col min-h-[260px]">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="flex-1 pl-2">
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <ActivitySkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const displayActivities = Array.isArray(activities) ? activities : [];

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6 flex flex-col min-h-[260px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-semibold text-gray-900">Recent Activity</h2>
        {displayActivities.length > 0 && (
          <button className="flex items-center text-xs font-semibold text-[#8B1538] hover:text-[#6F102D] transition-colors outline-none focus:ring-2 focus:ring-[#8B1538] rounded group">
            View All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      <div className="flex-1">
        {displayActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <History className="text-gray-300" size={24} />
            </div>
            <p className="font-semibold text-gray-900">No recent activity</p>
            <p className="text-xs mt-1">Actions you take will appear here.</p>
          </div>
        ) : (
          <div className="pl-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
            <div className="space-y-2">
              {displayActivities.map((item, index) => {
                return (
                  <div key={item.id || index} className="flex gap-4 group hover:bg-gray-50 p-2.5 rounded-xl transition-colors cursor-pointer">
                    <div className="w-[42px] text-right pt-0.5 shrink-0">
                      <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#8B1538] transition-colors">{item.time}</span>
                    </div>
                    
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#8B1538]/40 group-hover:bg-[#8B1538] transition-colors"></div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 truncate">
                        {item.action} <span className="font-normal text-gray-500">for</span> {item.leadName}
                      </p>
                      {item.status && (
                        <span className="inline-block px-1.5 py-0.5 mt-1 text-[10px] font-bold tracking-wide uppercase text-gray-500 bg-gray-100 rounded-sm">
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
