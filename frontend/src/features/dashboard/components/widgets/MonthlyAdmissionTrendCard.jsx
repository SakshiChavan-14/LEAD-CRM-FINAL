import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Jan", admissions: 12, target: 15 },
  { month: "Feb", admissions: 19, target: 15 },
  { month: "Mar", admissions: 15, target: 20 },
  { month: "Apr", admissions: 28, target: 20 },
  { month: "May", admissions: 22, target: 25 },
  { month: "Jun", admissions: 30, target: 25 },
  { month: "Jul", admissions: 42, target: 30 },
];

const cardClass = "rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 flex flex-col justify-between h-full font-outfit";

export default function MonthlyAdmissionTrendCard() {
  return (
    <section className={cardClass}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Monthly Admission Trend</h2>
          <p className="text-xs text-slate-500 mt-1">Monthly enrollment vs set target progress</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
            <span className="text-xs text-slate-500 font-semibold">Admissions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 border-t-2 border-dashed border-[#10B981]"></span>
            <span className="text-xs text-slate-500 font-semibold">Target</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full flex-grow mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis 
              dataKey="month" 
              stroke="#94A3B8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#94A3B8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dx={-5}
            />
            <Tooltip 
              contentStyle={{ 
                fontFamily: "var(--font-outfit), sans-serif", 
                borderRadius: "12px", 
                borderColor: "#E2E8F0",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="admissions" 
              stroke="#2563EB" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorAdmissions)" 
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke="#10B981"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
