"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Headphones } from "lucide-react";
import { useCallReportsSummary } from "@/features/callReports/hooks/useCallReports";
import useUsers from "@/features/users/hooks/useUsers";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";

const AVATAR_STYLES = [
  "bg-blue-50 text-blue-700 border-blue-200/60",
  "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  "bg-purple-50 text-purple-700 border-purple-200/60",
  "bg-amber-50 text-amber-700 border-amber-200/60",
  "bg-cyan-50 text-cyan-700 border-cyan-200/60",
  "bg-rose-50 text-rose-700 border-rose-200/60",
];

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 h-[420px] flex flex-col font-outfit justify-between overflow-hidden";

export default function TelecallerPerformanceCard() {
  const router = useRouter();

  // Fetch telecallers from directory
  const { data: usersData, isLoading: isUsersLoading } = useUsers({ size: 50 });
  
  // Fetch performance report metrics
  const { data: callReportData, isLoading: isReportsLoading } = useCallReportsSummary({}, 0, 50);

  const isLoading = isUsersLoading || isReportsLoading;

  // Merge directory telecallers with performance stats
  const telecallersList = useMemo(() => {
    const rawUsers = usersData?.users || (Array.isArray(usersData) ? usersData : []);
    
    // Filter active telecallers from directory
    const directoryTelecallers = rawUsers.filter(
      (u) => (u.role || u.userGroup || "").toUpperCase() === "TELECALLER"
    );

    // Get call reports content map
    const reports = Array.isArray(callReportData?.content)
      ? callReportData.content
      : Array.isArray(callReportData?.users)
      ? callReportData.users
      : Array.isArray(callReportData)
      ? callReportData
      : [];

    const reportsMap = new Map();
    reports.forEach((r) => {
      if (r.userId) reportsMap.set(String(r.userId), r);
      if (r.name) reportsMap.set(r.name.toLowerCase(), r);
    });

    if (directoryTelecallers.length > 0) {
      return directoryTelecallers.map((user, idx) => {
        const report = reportsMap.get(String(user.id || user.userId || user.empId)) || reportsMap.get((user.name || "").toLowerCase()) || {};
        
        const totalCalls = report.totalCalls || report.calls || user.totalCalls || 0;
        const connectedCalls = report.connectedCalls || 0;
        const interested = report.interested || 0;
        const followupsCount = report.followupsCount || 0;
        const conversions = report.conversions || report.admissions || 0;

        return {
          id: user.id || user.empId || idx + 1,
          name: user.name || user.username || "Telecaller",
          empId: user.empId || `EMP${String(idx + 1).padStart(4, '0')}`,
          avatar: user.avatar,
          totalCalls,
          connectedCalls,
          interested,
          followupsCount,
          conversions,
        };
      });
    }

    // Fallback if users endpoint returned reports directly
    if (reports.length > 0) {
      return reports.map((r, idx) => ({
        id: r.userId || idx + 1,
        name: r.name || "Telecaller",
        empId: `EMP${String(r.userId || idx + 1).padStart(4, '0')}`,
        avatar: r.avatar,
        totalCalls: r.totalCalls || r.calls || 0,
        connectedCalls: r.connectedCalls || 0,
        interested: r.interested || 0,
        followupsCount: r.followupsCount || 0,
        conversions: r.conversions || r.admissions || 0,
      }));
    }

    return [];
  }, [usersData, callReportData]);

  const getInitial = (name) => {
    if (!name) return "T";
    return name.charAt(0).toUpperCase();
  };

  return (
    <section className={cardClass}>
      {/* Header */}
      <div className="flex justify-between items-center mb-1 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Telecaller Performance</h2>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              {telecallersList.length} Active Callers
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Operational team calling & conversion efficiency</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center min-h-[260px]">
          <div className="animate-pulse space-y-3 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 h-12 bg-slate-50/80 rounded-xl px-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-grow h-4 bg-slate-200 rounded" />
                <div className="w-16 h-4 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : telecallersList.length === 0 ? (
        <div className="flex-grow flex items-center justify-center min-h-[260px]">
          <EmptyState
            title="No Telecallers Found"
            description="No active telecallers registered in the directory."
            icon={Headphones}
          />
        </div>
      ) : (
        /* Performance Table Container with zero horizontal scrolling and 4-row vertical scroll */
        <div className="flex-1 flex flex-col mt-2 border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          {/* Fixed Header Table */}
          <div className="bg-slate-50/95 border-b border-slate-200/80 shrink-0">
            <table className="w-full table-fixed text-left align-middle border-collapse">
              <thead>
                <tr className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  <th className="py-3 px-3 w-[32%] text-left">Agent</th>
                  <th className="py-3 px-1.5 w-[11%] text-center">Calls</th>
                  <th className="py-3 px-1.5 w-[11%] text-center">Connected</th>
                  <th className="py-3 px-1.5 w-[11%] text-center">Interested</th>
                  <th className="py-3 px-1.5 w-[12%] text-center">Follow-ups</th>
                  <th className="py-3 px-1.5 w-[11%] text-center">Admissions</th>
                  <th className="py-3 px-2 w-[12%] text-center">Conversion</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Scrollable Body (displays exactly 4 rows, smooth vertical infinite scroll without side scrollbar) */}
          <div className="overflow-y-auto max-h-[248px] divide-y divide-slate-100 bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full table-fixed text-left align-middle border-collapse">
              <tbody className="divide-y divide-slate-100">
                {telecallersList.map((row, idx) => {
                  const avatarStyle = AVATAR_STYLES[idx % AVATAR_STYLES.length];

                  const calls = row.totalCalls || 0;
                  const connected = row.connectedCalls || 0;
                  const interested = row.interested || 0;
                  const followups = row.followupsCount || 0;
                  const admissions = row.conversions || 0;
                  const convRate = calls > 0 ? Math.round((admissions / calls) * 100) : 0;

                  // Conversion Pill color logic
                  let badgeClass = "bg-slate-100 text-slate-700 border-slate-200";
                  if (convRate >= 12) {
                    badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
                  } else if (convRate >= 6) {
                    badgeClass = "bg-amber-50 text-amber-700 border-amber-200/80";
                  }

                  return (
                    <tr
                      key={row.id || idx}
                      onClick={() => router.push(`/dashboard/management/user-directory/${encodeURIComponent(row.empId || row.id)}`)}
                      className="h-[60px] hover:bg-slate-50/90 transition-colors group cursor-pointer"
                    >
                      {/* Agent Cell */}
                      <td className="px-3 w-[32%]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${avatarStyle} shadow-xs group-hover:scale-105 transition-transform`}>
                            {getInitial(row.name)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-900 text-xs truncate leading-tight group-hover:text-blue-600 transition-colors">
                              {row.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono mt-0.5 leading-none">
                              {row.empId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Calls */}
                      <td className="px-1.5 w-[11%] text-center text-slate-700 text-xs font-semibold">
                        {calls}
                      </td>

                      {/* Connected */}
                      <td className="px-1.5 w-[11%] text-center text-slate-700 text-xs font-semibold">
                        {connected}
                      </td>

                      {/* Interested */}
                      <td className="px-1.5 w-[11%] text-center text-emerald-700 text-xs font-bold">
                        {interested}
                      </td>

                      {/* Follow-ups */}
                      <td className="px-1.5 w-[12%] text-center text-slate-700 text-xs font-semibold">
                        {followups}
                      </td>

                      {/* Admissions */}
                      <td className="px-1.5 w-[11%] text-center">
                        <span className="text-slate-900 text-xs font-bold bg-blue-50/70 px-1.5 py-0.5 rounded">
                          {admissions}
                        </span>
                      </td>

                      {/* Conversion badge */}
                      <td className="px-2 w-[12%] text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide border shadow-xs inline-block ${badgeClass}`}>
                          {convRate}%
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
    </section>
  );
}
