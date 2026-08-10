import { Users } from "lucide-react";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";

const STATUS_STYLES = {
  ENQUIRY: "bg-blue-50 text-blue-700 border border-blue-100",
  NEW: "bg-blue-50 text-blue-700 border border-blue-100",
  INTERESTED: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  CONTACTED: "bg-amber-50 text-amber-700 border border-amber-100",
  CONVERTED: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  CLOSED: "bg-slate-100 text-slate-600 border border-slate-200",
  "NOT INTERESTED": "bg-slate-100 text-slate-600 border border-slate-200",
  COMPLETED: "bg-slate-800 text-white border border-slate-900",
};

const SOURCE_COLORS = {
  Website: "bg-[#2563EB]", // Blue dot
  Instagram: "bg-[#0EA5E9]", // Cyan dot
  Referral: "bg-[#10B981]", // Emerald dot
  "Walk-in": "bg-[#F59E0B]", // Amber dot
};

const cardClass = "rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 h-full flex flex-col font-outfit justify-between";

export default function RecentLeadsTable({ recentLeads }) {
  if (recentLeads?.error) {
    return (
      <div className="h-full min-h-[300px]">
        <EmptyState title="Failed to load leads" description="An error occurred while fetching recent leads." />
      </div>
    );
  }

  const data = recentLeads?.data || [];

  return (
    <div className={cardClass}>
      {/* Header */}
      <header className="flex justify-between items-center mb-6 px-1">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Recent Leads</h2>
          <p className="text-xs text-slate-500 mt-1">Recently acquired leads entering the pipeline</p>
        </div>
        <a
          className="text-[#7F1D1D] text-xs font-semibold hover:underline"
          href="/dashboard/management/leads"
        >
          View All
        </a>
      </header>

      {/* Leads Table Container with overflow-x-auto */}
      <div className="overflow-x-auto flex-grow border border-slate-100 rounded-xl">
        {data.length === 0 ? (
          <div className="py-8">
            <EmptyState title="No recent leads" description="There are no recent leads in your pipeline." icon={Users} />
          </div>
        ) : (
          <table className="w-full text-left align-middle border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] tracking-wider text-slate-500 font-bold uppercase border-b border-slate-200">
                <th className="py-3 px-4 text-left">Lead</th>
                <th className="py-3 px-4 text-left hidden lg:table-cell">Mobile</th>
                <th className="py-3 px-4 text-left">Source</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Assigned To</th>
                <th className="py-3 px-4 text-left">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.map((lead, index) => {
                const statusKey = (lead.status || "ENQUIRY").toUpperCase();
                const statusClass = STATUS_STYLES[statusKey] || "bg-slate-100 text-slate-600 border border-slate-200";
                
                // Dot color mapping for source
                const dotColor = SOURCE_COLORS[lead.source] || "bg-slate-400";

                return (
                  <tr key={lead.id || index} className="h-[68px] hover:bg-slate-50/50 transition-colors">
                    {/* Lead Cell: Stacked Name & Mobile (Mobile hidden on lg screen) */}
                    <td className="px-4">
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-800 text-sm truncate">
                          {lead.student || "Unknown"}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono mt-0.5 leading-none lg:hidden">
                          {lead.mobile || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Mobile Column (shown only on screens >= lg) */}
                    <td className="px-4 text-slate-600 text-sm font-mono hidden lg:table-cell">
                      {lead.mobile || "—"}
                    </td>

                    {/* Source Pill: Neutral with colored dot */}
                    <td className="px-4">
                      <span className="bg-slate-50 border border-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        {lead.source || "Direct"}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase inline-block ${statusClass}`}>
                        {lead.status || "Enquiry"}
                      </span>
                    </td>

                    {/* Assigned Telecaller */}
                    <td className="px-4 text-slate-700 text-sm font-semibold truncate max-w-[120px]">
                      {lead.assignedTo || "Unassigned"}
                    </td>

                    {/* Last Activity */}
                    <td className="px-4 text-slate-500 text-xs font-semibold">
                      {lead.lastActivity || "Just Now"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}