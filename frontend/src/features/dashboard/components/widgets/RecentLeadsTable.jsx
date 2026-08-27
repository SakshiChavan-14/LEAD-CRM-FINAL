"use client";

import React from "react";
import { Users, ExternalLink, Sparkles, Phone } from "lucide-react";
import Link from "next/link";
import { useDetailNavigation } from "@/hooks/useDetailNavigation";

const STATUS_STYLES = {
  ENQUIRY: "bg-blue-50 text-blue-700 border-blue-200/80",
  NEW: "bg-purple-50 text-purple-700 border-purple-200/80",
  INTERESTED: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  CONTACTED: "bg-cyan-50 text-cyan-700 border-cyan-200/80",
  CONVERTED: "bg-teal-50 text-teal-800 border-teal-200/80",
  ADMITTED: "bg-emerald-100 text-emerald-800 border-emerald-300",
  CLOSED: "bg-slate-100 text-slate-600 border-slate-200",
  "NOT INTERESTED": "bg-rose-50 text-rose-600 border-rose-200/60",
  COLD: "bg-slate-100 text-slate-500 border-slate-200",
};

const SOURCE_COLORS = {
  Website: "bg-blue-500",
  Instagram: "bg-pink-500",
  Referral: "bg-emerald-500",
  "Walk-in": "bg-amber-500",
  Direct: "bg-indigo-500",
  Facebook: "bg-blue-600",
};

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 h-[420px] flex flex-col font-outfit justify-between overflow-hidden";

export default function RecentLeadsTable({ recentLeads }) {
  const { navigateToDetail } = useDetailNavigation();

  if (recentLeads?.error) {
    return (
      <div className="h-[420px] flex items-center justify-center">
        <EmptyState title="Failed to load leads" description="An error occurred while fetching recent leads." />
      </div>
    );
  }

  const data = recentLeads?.data || [];

  return (
    <div className={cardClass}>
      {/* Header */}
      <div className="flex justify-between items-center mb-1 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Leads</h2>
            <span className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200/60 flex items-center gap-1">
              <Sparkles size={11} className="text-purple-600" />
              {data.length} Leads
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Recently acquired leads entering the pipeline</p>
        </div>
        <Link
          href="/dashboard/management/leads"
          className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1 transition-colors hover:underline"
        >
          View All
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* Leads Table Container with zero horizontal scrolling & vertical scroll */}
      {data.length === 0 ? (
        <div className="flex-grow flex items-center justify-center py-10">
          <EmptyState title="No recent leads" description="There are no recent leads in your pipeline." icon={Users} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col mt-2 border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          {/* Fixed Header Table */}
          <div className="bg-slate-50/95 border-b border-slate-200/80 shrink-0">
            <table className="w-full table-fixed text-left align-middle border-collapse">
              <thead>
                <tr className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  <th className="py-3 px-3 w-[30%] text-left">Lead Info</th>
                  <th className="py-3 px-2 w-[17%] text-left">Source</th>
                  <th className="py-3 px-2 w-[18%] text-left">Status</th>
                  <th className="py-3 px-2 w-[20%] text-left">Assigned To</th>
                  <th className="py-3 px-3 w-[15%] text-right">Activity</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Body (displays 4 rows, smooth vertical infinite scroll without side scrollbar) */}
          <div className="overflow-y-auto max-h-[248px] divide-y divide-slate-100 bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full table-fixed text-left align-middle border-collapse">
              <tbody className="divide-y divide-slate-100">
                {data.map((lead, index) => {
                  const statusKey = (lead.status || "ENQUIRY").toUpperCase();
                  const statusClass = STATUS_STYLES[statusKey] || "bg-slate-100 text-slate-600 border-slate-200";
                  const dotColor = SOURCE_COLORS[lead.source] || "bg-slate-400";

                  return (
                    <tr 
                      key={lead.id || index}
                      onClick={() => lead.id && navigateToDetail(`/dashboard/management/leads/${lead.id}`)}
                      className="h-[60px] hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Lead Info */}
                      <td className="px-3 w-[30%]">
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-600 transition-colors">
                            {lead.student || "Unknown"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            <Phone size={9} className="text-slate-300" />
                            {lead.mobile || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-2 w-[17%]">
                        <span className="bg-slate-50 border border-slate-200/60 text-slate-700 font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 text-[10px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                          <span className="truncate">{lead.source || "Direct"}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-2 w-[18%]">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase inline-block border shadow-xs ${statusClass}`}>
                          {lead.status || "Enquiry"}
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="px-2 w-[20%]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-white text-pink-500 font-bold text-[9px] flex items-center justify-center border border-slate-200/80 shrink-0 shadow-2xs">
                            {(lead.assignedTo || "U").charAt(0).toUpperCase()}
                          </div>
                          <span className="text-slate-800 text-xs font-semibold truncate">
                            {lead.assignedTo || "Unassigned"}
                          </span>
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="px-3 w-[15%] text-right">
                        <span className="text-slate-500 text-[11px] font-medium block truncate">
                          {lead.lastActivity || "Just Now"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}