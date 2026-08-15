"use client";

import React from "react";
import ChartCard from "./ChartCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#2563EB", "#3B82F6", "#06B6D4", "#10B981", "#8B5CF6"];

export default function ConversionFunnel({ data = [], isLoading }) {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <ChartCard 
      title="Conversion Funnel" 
      subtitle="Lead movement through the pipeline"
      isLoading={isLoading}
      skeletonHeight="320px"
    >
      {chartData.length > 0 && (
        <div className="w-full h-[320px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#334155", fontSize: 12, fontWeight: 700 }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "13px" }}
              />
              <Bar 
                dataKey="value" 
                name="Leads"
                radius={[0, 10, 10, 0]}
                barSize={20}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
