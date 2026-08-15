"use client";

import React from "react";
import DataTable from "@/components/table/DataTable";
import { Phone, PhoneCall, PhoneForwarded, PhoneOff, Globe, Share2, Users, MapPin, ExternalLink, Calendar, Clock, Flame } from "lucide-react";
import { formatDisplayDate } from "@/utils/dateUtils";

const formatDistanceToNow = (date) => {
  if (!date) return "Today";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Today";
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDisplayDate(d);
};

const toTitleCase = (str) => {
  if (!str) return "-";
  return str.toLowerCase().split(/[\s_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const getInitials = (name) => {
  if (!name) return "L";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

const getFollowupIndicator = (row) => {
  if (!row.nextFollowup) return { color: "bg-slate-300", title: "No follow-up" };
  const followupDate = new Date(row.nextFollowup);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fDate = new Date(followupDate);
  fDate.setHours(0, 0, 0, 0);

  if (fDate < today) return { color: "bg-rose-500", title: "Overdue Follow-up" };
  if (fDate.getTime() === today.getTime()) return { color: "bg-amber-400", title: "Due Today" };
  return { color: "bg-emerald-500", title: "Upcoming" };
};

const getLastActivity = (row) => {
  const activityDate = row.lastInteractionAt || row.updatedAt || row.followupUpdatedAt || row.lastContactAt || row.createdAt;
  if (!activityDate) return "Today, 05:41 PM";
  return formatDistanceToNow(activityDate);
};

const commonHeaderProps = {
  headerClassName: "!h-[48px] !py-2.5 !bg-slate-50/80 !text-slate-500 !uppercase !tracking-wider !text-[11px] !font-extrabold font-outfit border-b border-slate-200/80",
  cellClassName: "!py-3.5 !min-h-[70px] font-outfit"
};

const getColumns = (onCall, onRowClick) => [
  {
    key: "enquiryNo",
    label: "ID",
    width: "80px",
    ...commonHeaderProps,
    render: (value, row) => (
      <span className="text-xs font-mono font-extrabold text-slate-500">
        #{row.enquiryNo || row.id || "101"}
      </span>
    ),
  },
  {
    key: "name",
    label: "Lead Student",
    width: "240px",
    ...commonHeaderProps,
    render: (value, row) => {
      const nameTitleCase = toTitleCase(row.name || "Student");
      const indicator = getFollowupIndicator(row);
      return (
        <div className="flex items-center gap-3 min-w-[160px]">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-sky-500 text-xs font-black border border-slate-200/80 shadow-2xs">
              {getInitials(nameTitleCase)}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${indicator.color}`} title={indicator.title} />
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-bold text-slate-900 m-0 truncate hover:text-blue-600 transition-colors">
              {nameTitleCase}
            </p>
            <p className="text-[11px] text-slate-400 font-medium m-0 truncate">
              {row.email || "student@gmu.edu"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    key: "mobileNo",
    label: "Contact",
    width: "160px",
    ...commonHeaderProps,
    render: (value, row) => {
      const number = value || row.mobileNo || row.phone || "9876543210";
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onCall && onCall(number); }}
            aria-label={`Call ${row.name || number}`}
            className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-[#00C853] flex items-center justify-center transition-all duration-200 shadow-2xs cursor-pointer active:scale-95 shrink-0"
          >
            <PhoneCall size={12} />
          </button>
          <span className="text-xs font-mono font-bold text-slate-700">{number}</span>
        </div>
      );
    },
  },
  {
    key: "course",
    label: "Course",
    width: "130px",
    ...commonHeaderProps,
    render: (value) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
        {value ? (['MCA', 'BCA', 'MBA', 'BTECH', 'MTECH', 'BBA'].includes(value.toUpperCase()) ? value.toUpperCase() : toTitleCase(value)) : "B.Tech"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    width: "130px",
    ...commonHeaderProps,
    render: (value) => {
      const s = (value || "").toUpperCase();
      let colorClass = "bg-blue-50 text-blue-700 border-blue-200/80";
      if (s.includes("PROGRESS") || s.includes("FOLLOW")) colorClass = "bg-amber-50 text-amber-700 border-amber-200/80";
      else if (s.includes("INTERESTED") && !s.includes("NOT")) colorClass = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      else if (s.includes("NOT") || s.includes("COLD") || s.includes("LOST")) colorClass = "bg-slate-100 text-slate-600 border-slate-200";
      else if (s.includes("CONVERTED") || s.includes("ADMISSION") || s.includes("ENROLLED")) colorClass = "bg-purple-50 text-purple-700 border-purple-200/80";

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-2xs ${colorClass}`}>
          {value || "NEW LEAD"}
        </span>
      );
    },
  },
  {
    key: "opinion",
    label: "Interest",
    width: "120px",
    ...commonHeaderProps,
    render: (value) => {
      const isHot = (value || "").toUpperCase().includes("HIGH") || (value || "").toUpperCase().includes("INTERESTED");
      return (
        <span className={`text-xs font-bold ${isHot ? "text-emerald-600" : "text-slate-600"}`}>
          {toTitleCase(value) || "Interested"}
        </span>
      );
    },
  },
  {
    key: "callCount",
    label: "Calls",
    width: "80px",
    headerClassName: "!h-[48px] !py-2.5 !bg-slate-50/80 !text-slate-500 !uppercase !tracking-wider !text-[11px] !font-extrabold font-outfit text-center border-b border-slate-200/80",
    cellClassName: "!py-3.5 !min-h-[70px] text-center font-outfit",
    render: (value, row) => {
      const count = value || row.callCount || 1;
      return (
        <div className="inline-flex items-center gap-1.5 font-mono text-xs font-extrabold text-slate-800">
          <PhoneForwarded size={12} className="text-blue-500" />
          <span>{count}</span>
        </div>
      );
    },
  },
  {
    key: "lastActivity",
    label: "Last Activity",
    width: "140px",
    ...commonHeaderProps,
    render: (value, row) => (
      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
        <Clock size={12} className="text-slate-400" />
        {getLastActivity(row)}
      </span>
    ),
  },
  {
    key: "source",
    label: "Source",
    width: "120px",
    ...commonHeaderProps,
    render: (value) => (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-full shadow-2xs uppercase">
        <Globe size={11} />
        {toTitleCase(value || "Direct")}
      </span>
    ),
  },
  {
    key: "actions",
    label: "Action",
    width: "80px",
    ...commonHeaderProps,
    render: (value, row) => (
      <button
        onClick={(e) => { e.stopPropagation(); onRowClick && onRowClick(row); }}
        className="w-7 h-7 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/60 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
      >
        <ExternalLink size={13} />
      </button>
    ),
  },
];

export default function MyLeadsTable({ data = [], onRowClick, isLoading, onCall }) {
  const columns = getColumns(onCall, onRowClick);

  return (
    <div className="font-outfit overflow-x-auto [scrollbar-width:none]">
      <DataTable
        columns={columns}
        data={data}
        rowKey="enquiryNo"
        selectable={false}
        onRowClick={onRowClick}
        loading={isLoading}
      />
    </div>
  );
}
