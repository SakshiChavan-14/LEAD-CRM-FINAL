"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Sparkles, ExternalLink, Calendar, Flame, Snowflake, Sun } from "lucide-react";
import useTelecallerAssignedLeads from "@/features/users/hooks/useTelecallerAssignedLeads";
import { formatDisplayDate } from "@/utils/dateUtils";

const STATUS_STYLES = {
  ENQUIRY: "bg-blue-50 text-blue-700 border-blue-200/80",
  NEW: "bg-purple-50 text-purple-700 border-purple-200/80",
  INTERESTED: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  CONTACTED: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
  CONVERTED: "bg-teal-50 text-teal-800 border-teal-200/80",
  ADMITTED: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

const TEMP_STYLES = {
  HOT: { bg: "bg-rose-50 border-rose-200 text-rose-700", icon: Flame, color: "text-rose-500" },
  WARM: { bg: "bg-amber-50 border-amber-200 text-amber-700", icon: Sun, color: "text-amber-500" },
  COLD: { bg: "bg-blue-50 border-blue-200 text-blue-700", icon: Snowflake, color: "text-blue-500" },
};

import { useDetailNavigation } from "@/hooks/useDetailNavigation";

export default function AssignedLeadsSection({ leads, userId }) {
  const { navigateToDetail } = useDetailNavigation();
  const [filters] = useState({ page: 0, size: 50 });

  const { data, isError } = useTelecallerAssignedLeads(userId, filters);

  const displayLeads = (data?.data?.length > 0 ? data.data : leads?.length > 0 ? leads : []).map((l, i) => ({
    ...l,
    assignedDate: l.assignedDate ? formatDisplayDate(l.assignedDate) : `1${i + 1} Jul 2026`,
  }));

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs font-outfit">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assigned Leads</h2>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              {displayLeads.length} Leads
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Leads assigned to this telecaller pipeline</p>
        </div>
      </div>

      {/* Table with smooth vertical scroll & zero horizontal scroll */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        {/* Table Header */}
        <div className="bg-slate-50/95 border-b border-slate-200/80 shrink-0">
          <table className="w-full table-fixed text-left align-middle border-collapse">
            <thead>
              <tr className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                <th className="py-3 px-3 w-[10%] text-center">Enquiry No</th>
                <th className="py-3 px-3 w-[22%] text-left">Student Name</th>
                <th className="py-3 px-2 w-[14%] text-left">Mobile</th>
                <th className="py-3 px-2 w-[12%] text-left">Source</th>
                <th className="py-3 px-2 w-[12%] text-center">Status</th>
                <th className="py-3 px-2 w-[12%] text-center">Temperature</th>
                <th className="py-3 px-2 w-[10%] text-center">Stage</th>
                <th className="py-3 px-3 w-[12%] text-right">Assigned Date</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className="overflow-y-auto max-h-[256px] divide-y divide-slate-100 bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full table-fixed text-left align-middle border-collapse">
            <tbody className="divide-y divide-slate-100 text-xs">
              {displayLeads.map((lead, idx) => {
                const statusKey = (lead.status || "ENQUIRY").toUpperCase();
                const statusClass = STATUS_STYLES[statusKey] || "bg-slate-100 text-slate-600 border-slate-200";
                const tempKey = (lead.temperature || "WARM").toUpperCase();
                const tempConfig = TEMP_STYLES[tempKey] || TEMP_STYLES.WARM;
                const TempIcon = tempConfig.icon;

                return (
                  <tr
                    key={lead.enquiryNo || idx}
                    onClick={() => navigateToDetail(`/dashboard/management/leads/${lead.enquiryNo}?from=telecaller&userId=${userId}`)}
                    className="h-[56px] hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Enquiry No */}
                    <td className="px-3 w-[10%] text-center font-mono font-bold text-blue-600">
                      #{lead.enquiryNo}
                    </td>

                    {/* Student Name */}
                    <td className="px-3 w-[22%]">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center border border-blue-200/60 shrink-0 group-hover:scale-105 transition-transform">
                          {(lead.studentName || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {lead.studentName || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Mobile */}
                    <td className="px-2 w-[14%] font-mono text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Phone size={10} className="text-slate-400" />
                        <span className="truncate">{lead.mobile || "-"}</span>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-2 w-[12%]">
                      <span className="bg-slate-50 border border-slate-200/60 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-semibold truncate inline-block">
                        {lead.source || "Direct"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-2 w-[12%] text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-2xs inline-block ${statusClass}`}>
                        {lead.status || "Enquiry"}
                      </span>
                    </td>

                    {/* Temperature */}
                    <td className="px-2 w-[12%] text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border shadow-2xs ${tempConfig.bg}`}>
                        <TempIcon size={9} className={tempConfig.color} />
                        {tempKey}
                      </span>
                    </td>

                    {/* Stage */}
                    <td className="px-2 w-[10%] text-center font-semibold text-slate-600 text-[11px] truncate">
                      {lead.stage || "New"}
                    </td>

                    {/* Assigned Date */}
                    <td className="px-3 w-[12%] text-right font-medium text-slate-500 text-[11px] truncate">
                      {lead.assignedDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
