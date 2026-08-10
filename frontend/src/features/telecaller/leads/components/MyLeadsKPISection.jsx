import React from "react";
import { Users, Zap, Clock, CheckCircle2, XCircle, Star } from "lucide-react";
import KPIGrid from "@/components/management/KPIGrid";

const CustomKPICard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between h-[112px]">
    <div className="flex justify-between items-start">
      <h3 className="text-[13px] font-medium text-gray-500">{title}</h3>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgClass}`}>
        <Icon size={16} className={colorClass} strokeWidth={2.5} />
      </div>
    </div>
    <div className="flex items-baseline gap-2 mt-auto">
      <span className="text-[30px] font-bold text-gray-900 leading-none">{value}</span>
    </div>
  </div>
);

export default function MyLeadsKPISection({ kpiData }) {
  const {
    totalAssigned = 0,
    newLeads = 0,
    inProgress = 0,
    interested = 0,
    notInterested = 0,
    converted = 0,
  } = kpiData || {};

  return (
    <div className="mb-6">
      <KPIGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <CustomKPICard
          title="Assigned"
          value={totalAssigned}
          icon={Users}
          colorClass="text-red-600"
          bgClass="bg-red-50"
        />
        <CustomKPICard
          title="New Leads"
          value={newLeads}
          icon={Zap}
          colorClass="text-orange-600"
          bgClass="bg-orange-50"
        />
        <CustomKPICard
          title="In Progress"
          value={inProgress}
          icon={Clock}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
        />
        <CustomKPICard
          title="Interested"
          value={interested}
          icon={CheckCircle2}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <CustomKPICard
          title="Not Interested"
          value={notInterested}
          icon={XCircle}
          colorClass="text-gray-500"
          bgClass="bg-gray-100"
        />
        <CustomKPICard
          title="Converted"
          value={converted}
          icon={Star}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
      </KPIGrid>
    </div>
  );
}
