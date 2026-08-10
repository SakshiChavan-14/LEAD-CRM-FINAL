import ChartCard from "./ChartCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function SourceAnalyticsChart({ data, isLoading }) {
  return (
    <ChartCard 
      title="Source Performance" 
      subtitle="Lead volume and conversions by source"
      isLoading={isLoading}
      skeletonHeight="280px"
    >
      {data && (
        <div className="w-full h-[280px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis 
                type="number"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <YAxis 
                type="category"
                dataKey="source" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
              />
              <Legend 
                iconType="circle" 
                wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }}
              />
              <Bar 
                dataKey="leads" 
                name="Leads" 
                fill="#2563EB" 
                radius={[0, 0, 0, 0]} 
                barSize={22}
                stackId="a"
              />
              <Bar 
                dataKey="admissions" 
                name="Admissions" 
                fill="#10B981" 
                radius={[0, 4, 4, 0]} 
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
