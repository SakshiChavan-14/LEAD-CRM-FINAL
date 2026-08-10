import ChartCard from "./ChartCard";
import { ArrowDown } from "lucide-react";

export default function ConversionFunnel({ data, isLoading }) {
  const maxVal = data ? Math.max(...data.map(d => d.value)) : 100;

  // Find the largest drop-off index
  let largestDropIndex = -1;
  let largestDropValue = 0;
  if (data) {
    for (let i = 0; i < data.length - 1; i++) {
      const drop = data[i].value - data[i+1].value;
      if (drop > largestDropValue) {
        largestDropValue = drop;
        largestDropIndex = i;
      }
    }
  }

  return (
    <ChartCard 
      title="Conversion Funnel" 
      subtitle="Lead movement through the pipeline"
      isLoading={isLoading}
      skeletonHeight="320px"
    >
      {data && (
        <div className="flex flex-col h-full mt-4 justify-between">
          {data.map((stage, i) => {
            const width = `${(stage.value / maxVal) * 100}%`;
            
            return (
              <div key={stage.name} className="flex flex-col">
                <div className="flex justify-between items-center text-sm mb-1.5">
                  <span className="font-medium text-slate-500">{stage.name}</span>
                  <span className="font-bold text-slate-900">{stage.value.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#2563EB] transition-all duration-1000"
                    style={{ width }}
                  />
                </div>
                
                {/* Connector with percentage */}
                {i < data.length - 1 && data[i+1].rate && (
                  <div className="flex items-center gap-1.5 my-3 ml-2">
                    <ArrowDown size={14} className={i === largestDropIndex ? "text-amber-500" : "text-slate-400"} />
                    <span className={`text-[12px] font-bold ${i === largestDropIndex ? "text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded" : "text-slate-500"}`}>
                      {data[i+1].rate}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ChartCard>
  );
}
