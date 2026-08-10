import React, { useMemo } from "react";
import { FilterX, TrendingUp } from "lucide-react";

export default function SourceAnalyticsCard({ isLoading, data = [] }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6 flex flex-col min-h-[300px]">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-36 bg-gray-100 animate-pulse rounded"></div>
        </div>
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
              <div className="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const topSources = useMemo(() => {
    return [...data].sort((a, b) => b.total - a.total).slice(0, 5);
  }, [data]);
  
  const maxTotal = topSources.length > 0 ? topSources[0].total : 1;

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-6 flex flex-col min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-semibold text-gray-900">Top Sources</h2>
        <TrendingUp size={16} className="text-[#8B1538]" />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {topSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 py-6">
            <FilterX size={32} className="mb-3 opacity-50 text-gray-300" />
            <p className="font-semibold text-gray-500">No Sources Found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topSources.map((item, idx) => {
              const width = Math.max(5, (item.total / maxTotal) * 100);
              const convRate = item.total > 0 ? Math.round((item.converted / item.total) * 100) : 0;
              
              return (
                <div key={item.source || idx} className="group">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{item.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-gray-500 font-medium">
                        <strong className="text-gray-900 text-[13px]">{item.total}</strong> leads
                      </span>
                      <span className="text-[10px] bg-[#8B1538]/10 text-[#8B1538] px-1.5 py-0.5 rounded font-bold">{convRate}% conv</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 group-hover:bg-blue-600 transition-all rounded-full" style={{ width: `${width}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
