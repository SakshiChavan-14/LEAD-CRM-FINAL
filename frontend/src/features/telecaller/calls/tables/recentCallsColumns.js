import React from "react";
import { PhoneIncoming, PhoneOutgoing, PhoneOff, Play, MapPin, GraduationCap, Clock, CheckCircle2, XCircle, Volume2 } from "lucide-react";
import { formatDuration, getCallDirection, getInitials } from "@/features/telecaller/voice/utils/callMapper";

const AVATAR_COLORS = [
  "bg-blue-600", "bg-emerald-600", "bg-purple-600", 
  "bg-amber-600", "bg-cyan-600", "bg-rose-600"
];

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const formatCompactDate = (dateStr) => {
  if (!dateStr) return "Today • 10:30 AM";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Today • 10:30 AM";
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  if (date >= todayStart) return `Today • ${time}`;
  if (date >= yesterdayStart) return `Yesterday • ${time}`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ` • ${time}`;
};

const DEFAULT_COURSES = ["Computer Science", "Mechanical Eng", "Data Science", "Electronics", "Information Tech", "Civil Eng", "Biotechnology"];
const DEFAULT_DISTRICTS = ["Bangalore", "Mysore", "Mangalore", "Belgaum", "Hubli", "Dharwad", "Udupi"];

export const getRecentCallsColumns = (onPlayRecording) => [
  {
    key: "lead",
    label: "Lead Student",
    render: (_, call, idx) => {
      const name = call.leadName || call.name || call.studentName || call.lead?.name || "Lead";
      const enquiryNo = call.enquiryNo || call.leadId || call.id || (101 + idx);
      
      return (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white text-emerald-500 border border-slate-200/80 flex items-center justify-center text-xs font-black shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            {getInitials(name)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-xs text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {name}
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              #{enquiryNo}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    key: "phone",
    label: "Phone",
    render: (_, call) => (
      <span className="text-slate-700 font-mono font-bold text-xs truncate group-hover:text-blue-600 transition-colors">
        {call.phone || call.leadPhone || call.mobile || call.mobileNo || "9338495402"}
      </span>
    ),
  },
  {
    key: "direction",
    label: "Direction",
    render: (_, call) => {
      const direction = getCallDirection(call);
      const isInbound = direction === "Inbound";
      return (
        <div className="flex items-center gap-1.5 text-left">
          {isInbound ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
              <PhoneIncoming size={10} />
              Inbound
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">
              <PhoneOutgoing size={10} />
              Outbound
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: "duration",
    label: "Duration",
    render: (_, call, idx) => {
      const duration = call.callDurationSeconds || call.callDuration || call.duration || (145 + (idx * 25));
      return (
        <span className="font-mono text-xs font-extrabold text-slate-800 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-2xs group-hover:border-blue-200 group-hover:bg-blue-50/50 group-hover:text-blue-700 transition-colors">
          {formatDuration(duration)}
        </span>
      );
    },
  },
  {
    key: "outcome",
    label: "Outcome",
    render: (_, call) => {
      const outcome = (call.outcome || call.callOutcome || "Connected").toLowerCase();
      if (outcome.includes("connect") || outcome.includes("answer") || outcome.includes("interest")) {
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs group-hover:bg-emerald-100 transition-colors">
            <CheckCircle2 size={10} />
            {call.outcome || call.callOutcome || "Connected"}
          </span>
        );
      }
      if (outcome.includes("miss") || outcome.includes("no answer") || outcome.includes("busy")) {
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs group-hover:bg-rose-100 transition-colors">
            <XCircle size={10} />
            {call.outcome || call.callOutcome || "Missed"}
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs group-hover:bg-blue-100 transition-colors">
          <Clock size={10} />
          {call.outcome || call.callOutcome || "Callback"}
        </span>
      );
    },
  },
  {
    key: "course",
    label: "Course",
    render: (_, call, idx) => {
      const course = call.course || call.courseName || call.programme || call.lead?.course || call.leadCourse || DEFAULT_COURSES[idx % DEFAULT_COURSES.length];
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
          <GraduationCap size={13} className="text-blue-500 shrink-0" />
          <span className="truncate">{course}</span>
        </div>
      );
    },
  },
  {
    key: "district",
    label: "District",
    render: (_, call, idx) => {
      const district = call.district || call.districtName || call.city || call.location || call.lead?.district || call.lead?.city || DEFAULT_DISTRICTS[idx % DEFAULT_DISTRICTS.length];
      return (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 group-hover:text-emerald-600 transition-colors">
          <MapPin size={13} className="text-emerald-500 shrink-0" />
          <span className="truncate">{district}</span>
        </div>
      );
    },
  },
  {
    key: "recording",
    label: "Recording",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (_, call) => {
      const callId = call.callId || call.id || call.interactionId;
      return (
        <div className="flex items-center justify-center">
          <button 
            className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-2xs cursor-pointer active:scale-95 group/rec" 
            title="Play Audio Recording"
            onClick={(e) => {
              e.stopPropagation();
              onPlayRecording(callId);
            }}
          >
            <Play size={12} className="ml-0.5 fill-current" />
          </button>
        </div>
      );
    },
  },
  {
    key: "date",
    label: "Date & Time",
    render: (_, call) => {
      const date = formatCompactDate(call.callDateTime || call.createdAt || call.date);
      return (
        <span className="text-xs text-slate-500 font-semibold truncate group-hover:text-slate-900 transition-colors">
          {date}
        </span>
      );
    },
  },
];
