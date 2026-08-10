import ChartCard from "./ChartCard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Label } from "recharts";

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#7C3AED', '#64748B'];

export default function CourseAnalyticsChart({ data, isLoading }) {
  // Aggregate data: top 4 + Others
  let chartData = [];
  let total = 0;

  if (data) {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    total = sorted.reduce((sum, item) => sum + item.count, 0);

    if (sorted.length > 4) {
      const top4 = sorted.slice(0, 4);
      const othersCount = sorted.slice(4).reduce((sum, item) => sum + item.count, 0);
      chartData = [...top4, { course: "Others", count: othersCount }];
    } else {
      chartData = sorted;
    }
  }

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] pt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-600 truncate" title={entry.value}>{entry.value}</span>
            <span className="text-slate-900 font-medium ml-auto">{entry.payload.count}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ChartCard 
      title="Course Distribution" 
      subtitle="Total leads by target program"
      isLoading={isLoading}
      skeletonHeight="280px"
    >
      {chartData.length > 0 && (
        <div className="w-full h-[280px] mt-4 flex flex-col relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
                nameKey="course"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Label 
                  value={total.toLocaleString()} 
                  position="center"
                  dy={-10}
                  className="text-2xl font-bold fill-slate-900"
                />
                <Label 
                  value="Leads" 
                  position="center"
                  dy={12}
                  className="text-xs font-medium fill-slate-500"
                />
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
              />
              <Legend content={renderLegend} verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
