import ChartCard from "./ChartCard";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#A3D8F4", "#B388FF", "#F8C8DC", "#4A72C9", "#F8E79B"];

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
                tick={{ fill: '#1E293B', fontSize: 12 }} 
              />
              <YAxis 
                type="category"
                dataKey="source" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#1E293B', fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }}
                itemStyle={{ color: '#1E293B' }}
                labelStyle={{ color: '#1E293B', fontWeight: 600 }}
              />
              <Legend 
                iconType="circle" 
                iconSize={10}
                wrapperStyle={{ paddingTop: '15px', fontSize: '13px' }}
                formatter={(value) => (
                  <span style={{ color: '#1E293B', fontWeight: 500, marginRight: '15px' }}>
                    {value}
                  </span>
                )}
                payload={[
                  { value: 'Leads', type: 'circle', id: 'leads', color: '#B388FF' },
                  { value: 'Admissions', type: 'circle', id: 'admissions', color: '#F8C8DC' },
                  { value: 'Sources', type: 'circle', id: 'sources', color: '#F8E79B' }
                ]}
              />
              <Bar 
                dataKey="leads" 
                name="Leads" 
                barSize={22}
                radius={[0, 4, 4, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}

