"use client";

import React, { useState } from "react";
import { Phone, PhoneCall, PhoneOff, PhoneForwarded, PhoneMissed, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useTelecallerCallLogs } from "@/features/callReports/hooks/useCallReports";
import { formatDisplayDate } from "@/utils/dateUtils";


export default function RecentCallLogsSection({ userId }) {
  const [filters] = useState({ page: 0, size: 10 });
  const { data, isError, isLoading } = useTelecallerCallLogs(userId, filters);

  const rawLogs = data?.data?.length > 0 ? data.data : data?.content?.length > 0 ? data.content : Array.isArray(data) ? data : [];
  
  const normalizeLog = (log) => {
    const studentName = log.name || log.studentName || log.leadName || log.contactName || "Student Lead";
    const phone = log.phone || log.mobileNo || log.leadPhone || log.mobile || "—";
    
    // Call time formatting
    const rawTime = log.createdAt || log.callDate || log.date || log.time || log.callDateTime;
    const callTime = rawTime ? formatDisplayDate(rawTime) : "Today";
    
    // Duration formatting
    const durRaw = log.callDurationSeconds !== undefined && log.callDurationSeconds !== null 
      ? log.callDurationSeconds 
      : (log.callDuration || log.duration || log.talkTime);
    let duration = "00:00";
    if (typeof durRaw === "number") {
      const m = Math.floor(durRaw / 60);
      const s = durRaw % 60;
      duration = `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    } else if (typeof durRaw === "string" && durRaw) {
      duration = durRaw;
    }

    // Outcome & Connected status
    const rawOutcome = log.callOutcome || log.outcome || log.status || log.interactionStatus || "Connected";
    const outcomeUpper = String(rawOutcome).toUpperCase();
    const isConnected = outcomeUpper === "CONNECTED" || outcomeUpper === "ANSWERED" || outcomeUpper === "COMPLETED";

    // Next follow-up
    const rawFollowup = log.scheduledDate || log.nextFollowUp || log.nextFollowup || log.followupDate;
    const nextFollowUp = rawFollowup ? formatDisplayDate(rawFollowup) : "—";

    return {
      id: log.id || log.callId || log.interactionId,
      studentName,
      phone,
      callTime,
      duration,
      outcome: rawOutcome,
      isConnected,
      nextFollowUp,
    };
  };

  const displayLogs = rawLogs.map(normalizeLog);

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs font-outfit">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60">
            <Phone size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Call Logs</h2>
            <p className="text-xs text-slate-500 mt-0.5">Direct communication history logged by this telecaller</p>
          </div>
        </div>
        <span className="text-[11px] font-bold bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full border border-purple-200/60">
          {displayLogs.length} Calls
        </span>
      </div>

      {/* Table Container */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <div className="bg-slate-50/95 border-b border-slate-200/80 shrink-0">
          <table className="w-full table-fixed text-left align-middle border-collapse">
            <thead>
              <tr className="text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                <th className="py-3 px-4 w-[24%] text-left">Lead Name</th>
                <th className="py-3 px-3 w-[16%] text-left">Mobile Number</th>
                <th className="py-3 px-3 w-[16%] text-left">Call Time</th>
                <th className="py-3 px-2 w-[12%] text-center">Duration</th>
                <th className="py-3 px-3 w-[16%] text-center">Call Outcome</th>
                <th className="py-3 px-3 w-[16%] text-right">Next Follow-Up</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="overflow-y-auto max-h-[256px] divide-y divide-slate-100 bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full table-fixed text-left align-middle border-collapse">
            <tbody className="divide-y divide-slate-100 text-xs">
                {displayLogs.length > 0 ? (
                  displayLogs.map((log, idx) => {
                    return (
                      <tr key={log.id || idx} className="h-[56px] hover:bg-slate-50/80 transition-colors">
                        {/* Lead Name */}
                        <td className="px-4 w-[24%]">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-200 shrink-0">
                              {log.studentName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-slate-900 truncate">
                              {log.studentName}
                            </span>
                          </div>
                        </td>

                        {/* Mobile */}
                        <td className="px-3 w-[16%] font-mono text-slate-600 font-medium">
                          <div className="flex items-center gap-1">
                            <Phone size={10} className="text-slate-400" />
                            <span className="truncate">{log.phone}</span>
                          </div>
                        </td>

                        {/* Call Time */}
                        <td className="px-3 w-[16%] text-slate-600 font-medium">
                          {log.callTime}
                        </td>

                        {/* Duration */}
                        <td className="px-2 w-[12%] text-center font-mono font-bold text-slate-800">
                          {log.duration}
                        </td>

                        {/* Outcome */}
                        <td className="px-3 w-[16%] text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
                            log.isConnected 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" 
                              : "bg-rose-50 text-rose-700 border-rose-200/80"
                          }`}>
                            {log.isConnected ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                            {log.outcome}
                          </span>
                        </td>

                        {/* Next Follow-up */}
                        <td className="px-3 w-[16%] text-right font-medium text-slate-500 text-[11px] truncate">
                          {log.nextFollowUp}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                      No recent call logs available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
