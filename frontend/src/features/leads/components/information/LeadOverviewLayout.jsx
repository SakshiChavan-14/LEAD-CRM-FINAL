"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { 
  User, 
  GraduationCap, 
  PhoneCall, 
  CalendarClock, 
  UserCheck, 
  ChevronRight, 
  Play, 
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import { formatDisplayDate } from "@/utils/dateUtils";
import { useLeadCalls } from "@/features/telecaller/hooks/useLeadCalls";
import { useFollowups } from "@/features/telecaller/hooks/useFollowups";
import UpdateLeadStatusModule from "@/features/telecaller/leads/components/UpdateLeadStatusModule";
import CallDetailsModal from "@/features/telecaller/voice/components/details/CallDetailsModal";

const PRIORITY_STYLES = {
  HIGH: "bg-rose-50 text-rose-700 border-rose-200/80",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200/80",
  LOW: "bg-blue-50 text-blue-700 border-blue-200/80",
};

export default function LeadOverviewLayout({ data, rawData, isTelecaller = false }) {
  const [selectedCall, setSelectedCall] = useState(null);
  const enquiryNoRaw = rawData?.lead?.enquiryNo || rawData?.enquiryNo || rawData?.id;
  const enquiryNo = enquiryNoRaw ? String(enquiryNoRaw).replace(/[^\d]/g, "") : "";

  // Debug: log what data we actually receive
  console.log("[LeadOverviewLayout] rawData keys:", rawData ? Object.keys(rawData) : "null");
  console.log("[LeadOverviewLayout] rawData:", JSON.stringify(rawData, null, 2)?.substring(0, 1500));
  console.log("[LeadOverviewLayout] data (viewModel):", JSON.stringify(data, null, 2)?.substring(0, 1500));
  console.log("[LeadOverviewLayout] enquiryNo:", enquiryNo);

  const { data: callsData, isLoading: isCallsLoading } = useLeadCalls(enquiryNo);
  const calls = Array.isArray(callsData) && callsData.length > 0 ? callsData : (rawData?.calls || []);

  const { data: allFollowupsData } = useFollowups("all");
  const allFollowups = Array.isArray(allFollowupsData) ? allFollowupsData : [];
  const leadFollowups = allFollowups.length > 0 
    ? allFollowups.filter((f) => String(f.enquiryNo || f.leadId).replace(/[^\d]/g, "") === String(enquiryNo)) 
    : (rawData?.followups || []);

  const totalFollowups = leadFollowups.length;
  const completedFollowups = leadFollowups.filter(f => String(f.status).toLowerCase() === 'completed').length;
  const pendingFollowups = leadFollowups.filter(f => String(f.status).toLowerCase() === 'pending').length;
  const overdueFollowups = leadFollowups.filter(f => String(f.status).toLowerCase() === 'overdue').length;

  const totalCalls = calls.length;
  const connectedCalls = calls.filter((c) => {
    const statusVal = String(c.status || c.outcome || c.interactionStatus || c.callOutcome || "").toUpperCase();
    return statusVal === "CONNECTED" || statusVal === "COMPLETED";
  }).length;
  const missedCalls = totalCalls - connectedCalls;
  const connectionRate = totalCalls > 0 ? Math.round((connectedCalls / totalCalls) * 100) : 0;

  // ── Personal Info Mapping (handles both nested and flat API responses) ──
  const leadName = data?.header?.name || rawData?.student?.name || rawData?.studentName || rawData?.name || "Student";
  const dob = (rawData?.student?.dateOfBirth || rawData?.dateOfBirth) 
    ? formatDisplayDate(rawData?.student?.dateOfBirth || rawData?.dateOfBirth) : "N/A";
  const gender = rawData?.student?.gender || rawData?.gender || "N/A";
  const category = rawData?.student?.category || rawData?.category || "N/A";
  const nationality = rawData?.student?.nationality || rawData?.nationality || "N/A";
  const languages = (rawData?.student?.languages || rawData?.languages || []);
  const languagesStr = Array.isArray(languages) && languages.length > 0 ? languages.join(", ") : "N/A";
  const address = data?.contact?.locationStr 
    || [rawData?.location?.city, rawData?.location?.district, rawData?.location?.state].filter(Boolean).join(", ")
    || [rawData?.city, rawData?.district, rawData?.state].filter(Boolean).join(", ")
    || rawData?.location || "N/A";

  // ── Academic Interest Mapping ──
  const programme = rawData?.education?.programme || rawData?.lead?.programme || rawData?.programme || "N/A";
  const course = rawData?.education?.course || rawData?.lead?.course || rawData?.course || "N/A";
  const session = rawData?.lead?.session || rawData?.session || "N/A";
  const preferredCourse = rawData?.education?.preferredCourse || rawData?.lead?.preferredCourse || rawData?.preferredCourse || "N/A";
  const education = rawData?.education?.qualification || rawData?.lead?.education || rawData?.qualification || "N/A";
  const stream = rawData?.education?.stream || rawData?.lead?.stream || rawData?.stream || "N/A";
  const collegePreference = rawData?.education?.college || rawData?.lead?.collegePreference || rawData?.lead?.college || rawData?.collegeStudied || "N/A";

  // ── Assigned Telecaller Mapping ──
  const telecallerName = data?.assignment?.telecaller || rawData?.lead?.assignedTo?.name || rawData?.assignedTo?.name || rawData?.lead?.assignedToName || rawData?.assignedToName || rawData?.callerName || rawData?.telecallerName || "Unassigned";
  const telecallerRole = "Telecaller";
  const telecallerEmpId = rawData?.lead?.assignedTo?.empId || rawData?.assignedTo?.empId || rawData?.lead?.assignedTo?.employeeId || rawData?.assignedTo?.employeeId || rawData?.telecallerEmpId || rawData?.lead?.assignedTo?.id || rawData?.assignedTo?.id || "";

  // Next Follow-up logic
  const nextFollowup = useMemo(() => {
    const pending = leadFollowups.filter(f => String(f.status).toLowerCase() === 'pending' || String(f.status).toLowerCase() === 'scheduled' || String(f.status).toLowerCase() === 'overdue');
    if (pending.length === 0) return null;
    return [...pending].sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00:00'}`);
      const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00:00'}`);
      return dateA - dateB;
    })[0];
  }, [leadFollowups]);

  const latestCall = useMemo(() => {
    if (!calls || calls.length === 0) return null;
    return [...calls].sort((a, b) => new Date(b.callDateTime || b.createdAt || b.date || 0) - new Date(a.callDateTime || a.createdAt || a.date || 0))[0];
  }, [calls]);

  const lastActiveDate = latestCall 
    ? formatDisplayDate(latestCall.callDateTime || latestCall.createdAt || latestCall.date)
    : (rawData?.updatedAt || rawData?.lead?.updatedAt ? formatDisplayDate(rawData.updatedAt || rawData.lead.updatedAt) : "N/A");

  return (
    <div className="flex flex-col gap-6 w-full font-outfit">
      {/* SECTION A — UPDATE LEAD STATUS (rendered at top, full width, if telecaller) */}
      {isTelecaller && (
        <div className="w-full">
          <UpdateLeadStatusModule enquiryNo={enquiryNo} currentStatus={rawData?.status} isTelecaller={isTelecaller} />
        </div>
      )}

      {/* 3-Column Info/Activity Layout Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Panel 1: Personal Information */}
        <section className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-[450px]">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                <User size={16} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-none">Personal Information</h3>
            </div>

            <div className="divide-y divide-slate-100 text-xs mt-3 max-h-[330px] overflow-y-auto pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Full Name</span>
                <span className="font-bold text-slate-800">{leadName}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Date of Birth</span>
                <span className="font-medium text-slate-700">{dob}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Gender</span>
                <span className="font-medium text-slate-700">{gender}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Category</span>
                <span className="font-medium text-slate-700">{category}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Nationality</span>
                <span className="font-medium text-slate-700">{nationality}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Languages</span>
                <span className="font-medium text-slate-700 truncate max-w-[150px]">{languagesStr}</span>
              </div>
              <div className="flex justify-between items-start py-2.5">
                <span className="font-semibold text-slate-400">Address</span>
                <span className="font-medium text-slate-700 text-right max-w-[180px] break-words">{address}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Panel 2: Academic Interest */}
        <section className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-[450px]">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
                <GraduationCap size={16} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-none">Academic Interest</h3>
            </div>

            <div className="divide-y divide-slate-100 text-xs mt-3 max-h-[330px] overflow-y-auto pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Programme</span>
                <span className="font-bold text-slate-800">{programme}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Course</span>
                <span className="font-medium text-slate-700">{course}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Session</span>
                <span className="font-medium text-slate-700">{session}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Preferred Course</span>
                <span className="font-medium text-slate-700 truncate max-w-[150px]">{preferredCourse}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Education</span>
                <span className="font-medium text-slate-700">{education}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">Stream</span>
                <span className="font-medium text-slate-700">{stream}</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="font-semibold text-slate-400">College Preference</span>
                <span className="font-medium text-slate-700 truncate max-w-[150px]">{collegePreference}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Panel 3: Call Activity */}
        <section className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between h-[450px]">
          <div className="flex flex-col h-full justify-between">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                  <PhoneCall size={16} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-none">Call Activity</h3>
              </div>
              <Link 
                href={isTelecaller ? `/telecaller/calls` : `/dashboard/management/call-reports`}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                View All
                <ChevronRight size={12} />
              </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-1.5 py-2.5 px-3 bg-slate-50 border border-slate-100 rounded-2xl text-center mt-3 shrink-0">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Calls</span>
                <span className="text-xs font-black text-slate-800 mt-1 font-mono leading-none">{totalCalls}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Connect</span>
                <span className="text-xs font-black text-emerald-600 mt-1 font-mono leading-none">{connectedCalls}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Missed</span>
                <span className="text-xs font-black text-rose-600 mt-1 font-mono leading-none">{missedCalls}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Rate</span>
                <span className="text-xs font-black text-blue-600 mt-1 font-mono leading-none">{connectionRate}%</span>
              </div>
            </div>

            {/* Recent Calls List */}
            <div className="flex-grow mt-3 overflow-y-auto max-h-[220px] space-y-2 pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {calls.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-semibold text-xs leading-normal">
                  No call history logged yet
                </div>
              ) : (
                calls.slice(0, 3).map((call, idx) => {
                  const isConnected = String(call.status || call.outcome || "").toUpperCase().includes("CONNECT") || String(call.status || call.outcome || "").toUpperCase().includes("COMPLET");
                  return (
                    <div key={idx} className="p-2.5 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50/50 transition-all flex items-center justify-between text-[11px] font-semibold">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-slate-900 font-bold leading-tight">{formatDisplayDate(call.createdAt)}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">{call.callerName || telecallerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase shadow-3xs ${
                          isConnected 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" 
                            : "bg-rose-50 text-rose-700 border-rose-200/80"
                        }`}>
                          {isConnected ? "Connected" : "Missed"}
                        </span>
                        {call.recordingUrl || call.recording ? (
                          <button 
                            type="button" 
                            onClick={() => setSelectedCall(call)}
                            className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center border border-blue-200 shadow-3xs cursor-pointer"
                          >
                            <Play size={10} className="fill-blue-600 text-blue-600" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 2-Column Row: Follow-up Control & Assigned Telecaller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        
        {/* Panel 4: Follow-up Control */}
        <section className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-2xs">
                  <CalendarClock size={16} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-none">Follow-up Control</h3>
              </div>
              <Link 
                href={isTelecaller ? `/telecaller/follow-ups` : `/dashboard/management/leads`}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                View All
                <ChevronRight size={12} />
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center py-2.5 px-3 bg-slate-50 border border-slate-100 rounded-2xl mt-4 shrink-0">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Today</span>
                <span className="text-xs font-black text-slate-800 leading-none mt-1 font-mono">{leadFollowups.filter(f => f.status === "Today").length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Upcoming</span>
                <span className="text-xs font-black text-blue-600 leading-none mt-1 font-mono">{pendingFollowups}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Overdue</span>
                <span className="text-xs font-black text-rose-600 leading-none mt-1 font-mono">{overdueFollowups}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Completed</span>
                <span className="text-xs font-black text-emerald-600 leading-none mt-1 font-mono">{completedFollowups}</span>
              </div>
            </div>

            {/* Next Scheduled Action Box */}
            <div className="mt-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-center justify-between gap-4">
              {nextFollowup ? (
                <>
                  <div className="flex flex-col min-w-0 text-xs font-semibold">
                    <span className="text-[9px] text-slate-400 uppercase font-extrabold tracking-wider leading-none">Next Follow-up</span>
                    <span className="text-slate-900 font-bold mt-1.5 leading-tight">
                      {formatDisplayDate(nextFollowup.scheduledDate)} at {nextFollowup.scheduledTime || "10:30 AM"}
                    </span>
                    {nextFollowup.notes && (
                      <span className="text-[10px] text-slate-400 truncate mt-1 max-w-[200px]" title={nextFollowup.notes}>
                        {nextFollowup.notes}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider border uppercase shadow-3xs ${
                      PRIORITY_STYLES[String(nextFollowup.priority || "MEDIUM").toUpperCase()] || PRIORITY_STYLES.MEDIUM
                    }`}>
                      {nextFollowup.priority || "Medium"}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => alert(`Initiating callback for ${leadName}...`)}
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-3 py-1.5 rounded-lg transition-colors text-[10px] font-bold cursor-pointer"
                    >
                      <Phone size={11} /> Call
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-2 text-slate-400 font-semibold text-xs leading-normal flex-1">
                  No upcoming follow-ups scheduled
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Panel 5: Assigned Telecaller */}
        <section className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
                  <UserCheck size={16} />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-none">Assigned Telecaller</h3>
              </div>
              {!isTelecaller && (
                <Link 
                  href={`/dashboard/management/user-directory/${telecallerEmpId}`}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  View Profile
                  <ChevronRight size={12} />
                </Link>
              )}
            </div>

            {/* Profile Row */}
            <div className="flex items-center justify-between p-4 bg-slate-50/80 border border-slate-200/60 rounded-2xl mt-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  {telecallerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900 leading-tight">{telecallerName}</span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5 leading-none">{telecallerRole}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Calling telecaller ${telecallerName}...`)}
                className="w-8 h-8 rounded-xl bg-slate-950 hover:bg-slate-900 text-white flex items-center justify-center shadow-3xs cursor-pointer active:scale-95"
              >
                <Phone size={13} />
              </button>
            </div>

            {/* Assigned Metrics */}
            <div className="grid grid-cols-4 gap-2 text-center py-2.5 px-3 bg-slate-50 border border-slate-100 rounded-2xl mt-4 shrink-0 text-xs font-semibold">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Total</span>
                <span className="font-extrabold text-slate-800 mt-1 font-mono leading-none">{totalCalls}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Connect</span>
                <span className="font-extrabold text-emerald-600 mt-1 font-mono leading-none">{connectedCalls}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Tasks</span>
                <span className="font-extrabold text-slate-800 mt-1 font-mono leading-none">{totalFollowups}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-slate-400">Last Active</span>
                <span className="font-medium text-slate-700 mt-1 truncate max-w-[65px]" title={lastActiveDate}>
                  {lastActiveDate}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {selectedCall && (
        <CallDetailsModal
          callId={selectedCall.id || selectedCall.callId || selectedCall.interactionId}
          callData={selectedCall}
          open={!!selectedCall}
          onClose={() => setSelectedCall(null)}
          showRecording={true}
        />
      )}
    </div>
  );
}
