import ChartCard from "./ChartCard";

export default function MonthlyPerformanceTable({ data, isLoading }) {
  return (
    <ChartCard 
      title="Daily Productivity" 
      subtitle="Breakdown of key activities by day"
      isLoading={isLoading}
      skeletonHeight="340px"
    >
      {data && (
        <div className="mt-4 overflow-x-auto scrollbar-none">
          <table className="w-full text-left table-fixed">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wider w-[12%]">Day</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center w-[16%]">Calls</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center w-[18%]">Connected</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center w-[18%]">Interested</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-center w-[18%]">Admissions</th>
                <th className="pb-3 text-[12px] font-semibold text-slate-500 uppercase tracking-wider text-right w-[18%]">Conv. %</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium text-slate-700">
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0 even:bg-slate-50/50 hover:bg-slate-50 transition-colors h-[48px]">
                  <td className="py-2">{row.day}</td>
                  <td className="py-2 text-center text-slate-900 font-semibold">{row.calls}</td>
                  <td className="py-2 text-center text-slate-600">{row.connected}</td>
                  <td className="py-2 text-center text-slate-600">{row.interested}</td>
                  <td className="py-2 text-center text-[#10B981] font-bold">{row.admissions}</td>
                  <td className="py-2 text-right font-medium text-slate-600">{row.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  );
}
