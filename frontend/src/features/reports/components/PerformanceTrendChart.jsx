import ChartCard from "./ChartCard";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PerformanceTrendChart({ data, isLoading }) {
  return (
    <ChartCard 
      title="Monthly Performance Trend" 
      subtitle="Calls, interested leads, and admissions across the last 6 months."
      isLoading={isLoading}
      skeletonHeight="320px"
    >
      {data && (
        <div className="w-full h-[320px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
              />
              <Legend 
                iconType="circle" 
                wrapperStyle={{ paddingTop: '20px', fontSize: '13px' }}
              />
              <Area 
                type="monotone" 
                dataKey="calls" 
                name="Calls" 
                stroke="#2563EB" 
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCalls)"
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="interested" 
                name="Interested" 
                stroke="#7C3AED" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="admissions" 
                name="Admissions" 
                stroke="#16A34A" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
