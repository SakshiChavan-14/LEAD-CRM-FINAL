import { FilterX } from "lucide-react";

// Progressive color palette matching design guidelines (no maroon)
const COLORS = [
  "#2563EB", // Blue
  "#0EA5E9", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
];

const cardClass = "rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 h-[420px] flex flex-col justify-between font-outfit";

export default function SourceAnalytics({ sourceAnalytics }) {
  const data = sourceAnalytics || [];
  const total = data.reduce((acc, curr) => acc + (curr.value || 0), 0);

  // Get Top 4 sources sorted by value
  const displayData = [...data]
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 4);

  // Build conic-gradient segments for the donut chart
  const buildConicGradient = () => {
    if (total === 0) return "conic-gradient(#E5E7EB 0% 100%)";
    let segments = [];
    let cumulative = 0;
    
    // Calculate percentages for top 4 and sum of others
    const totalTop4 = displayData.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const othersValue = Math.max(0, total - totalTop4);
    const chartData = [...displayData];
    if (othersValue > 0) {
      chartData.push({ label: "Others", value: othersValue });
    }

    const chartColors = [...COLORS, "#8B5CF6"]; // Add violet for others

    chartData.forEach((entry, idx) => {
      const percent = ((entry.value || 0) / total) * 100;
      const color = chartColors[idx % chartColors.length];
      segments.push(`${color} ${cumulative}% ${cumulative + percent}%`);
      cumulative += percent;
    });
    return `conic-gradient(${segments.join(", ")})`;
  };

  return (
    <div className={cardClass}>
      {/* Header */}
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-900">Lead Sources</h2>
          <a
            className="text-[#7F1D1D] text-xs font-semibold hover:underline"
            href="/dashboard/management/leads"
          >
            View All
          </a>
        </div>
        <p className="text-xs text-slate-500 mt-1">Lead acquisition by channel performance</p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-500 py-6">
          <FilterX size={32} className="text-slate-300 mb-3" />
          <p className="font-semibold text-gray-900">No Data Available</p>
          <p className="text-xs mt-1">Lead sources are currently empty.</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col justify-between mt-6 gap-4">
          
          {/* Top: Donut Chart Centered (140px size, 14px stroke) */}
          <div className="flex justify-center shrink-0">
            <div
              className="flex items-center justify-center rounded-full shadow-inner"
              style={{
                width: "140px",
                height: "140px",
                background: buildConicGradient(),
              }}
            >
              {/* Inner white circle for donut hole (112px for 14px stroke width) */}
              <div className="w-[112px] h-[112px] bg-white rounded-full flex flex-col items-center justify-center z-10 shadow-sm">
                <div className="text-2xl font-bold text-slate-900 leading-none">
                  {total.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">Total Leads</div>
              </div>
            </div>
          </div>

          {/* Bottom: Aligned Legend Rows with mini horizontal progress lines */}
          <div className="space-y-3 flex-1 flex flex-col justify-end">
            {displayData.map((entry, index) => {
              const percentage = total > 0 ? Math.round(((entry.value || 0) / total) * 100) : 0;
              const color = COLORS[index % COLORS.length];
              const leads = entry.value || 0;

              return (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    {/* Aligned Legend row: Bullet + Name */}
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-slate-700 font-semibold truncate max-w-[120px]">{entry.label}</span>
                    </div>

                    {/* Leads count */}
                    <div className="text-slate-500 font-medium text-right">
                      <span className="text-slate-800 font-bold">{leads}</span> <span className="text-[10px]">leads</span>
                    </div>
                  </div>

                  {/* Small progress line */}
                  <div className="w-full bg-slate-50 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}