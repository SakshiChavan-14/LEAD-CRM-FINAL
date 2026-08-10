import React from "react";
import { Users, Zap, Clock, CheckCircle2, XCircle, Star } from "lucide-react";
import { KPICard } from "@/components/dashboard-ui/KPICard";

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
    <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <KPICard
        title="Assigned"
        value={totalAssigned}
        icon={Users}
        iconClassName="text-red-600"
        iconBgClassName="bg-red-50"
      />
      <KPICard
        title="New Leads"
        value={newLeads}
        icon={Zap}
        iconClassName="text-orange-600"
        iconBgClassName="bg-orange-50"
      />
      <KPICard
        title="In Progress"
        value={inProgress}
        icon={Clock}
        iconClassName="text-amber-600"
        iconBgClassName="bg-amber-50"
      />
      <KPICard
        title="Interested"
        value={interested}
        icon={CheckCircle2}
        iconClassName="text-emerald-600"
        iconBgClassName="bg-emerald-50"
      />
      <KPICard
        title="Not Interested"
        value={notInterested}
        icon={XCircle}
        iconClassName="text-gray-500"
        iconBgClassName="bg-gray-100"
      />
      <KPICard
        title="Converted"
        value={converted}
        icon={Star}
        iconClassName="text-blue-600"
        iconBgClassName="bg-blue-50"
      />
    </div>
  );
}

