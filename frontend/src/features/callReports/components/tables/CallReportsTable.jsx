"use client";

import React from "react";
import DataTable from "@/components/table/DataTable";
import TableCard from "@/components/table/TableCard";
import TablePagination from "@/components/table/TablePagination";
import { Mic, ChevronRight, Eye, Phone, CheckCircle2, XCircle } from "lucide-react";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500", 
  "bg-amber-500", "bg-cyan-500", "bg-rose-500", "bg-indigo-500"
];

const getInitials = (name) => {
  if (!name) return "T";
  return name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

const getAvatarColor = (name) => {
  if (!name) return AVATAR_COLORS[0];
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const formatDuration = (seconds) => {
  if (seconds == null) return "00m 00s";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
};

const formatDate = (dateString) => {
  if (!dateString) return "Today";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Today";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusBadge = (status) => {
  const s = (status || "Online").toLowerCase();
  if (s === "online") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Online
      </span>
    );
  }
  if (s === "in call") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        In Call
      </span>
    );
  }
  if (s === "idle") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Idle
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Offline
    </span>
  );
};

const getColumns = (onRowClick) => [
  {
    key: "name",
    label: "Telecaller",
    width: "240px",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-emerald-500 text-xs font-bold shrink-0 border border-slate-200/80 shadow-2xs">
          {getInitials(row.name)}
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{row.name || "Telecaller"}</p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{row.email || "tc@gmu.edu"}</p>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    width: "120px",
    render: (value) => getStatusBadge(value),
  },
  {
    key: "totalCalls",
    label: "Total Calls",
    width: "100px",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (value) => (
      <span className="text-xs font-bold text-slate-900">{value || 0}</span>
    ),
  },
  {
    key: "connectedCalls",
    label: "Connected",
    width: "120px",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (value, row) => {
      const totalCalls = row.totalCalls || 0;
      const connectedCalls = value || 0;
      const connectedRate = totalCalls > 0 ? Math.round((connectedCalls / totalCalls) * 100) : 75;
      return (
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-900">{connectedCalls}</span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-0.5">{connectedRate}% rate</span>
        </div>
      );
    },
  },
  {
    key: "missedBusy",
    label: "Missed",
    width: "90px",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (value, row) => {
      const missedCalls = value || Math.max(0, (row.totalCalls || 0) - (row.connectedCalls || 0));
      return (
        <span className="text-xs font-bold text-rose-600">{missedCalls}</span>
      );
    },
  },
  {
    key: "totalTalkTime",
    label: "Total Talk Time",
    width: "130px",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (value) => (
      <span className="text-xs font-mono font-bold text-slate-700">{formatDuration(value)}</span>
    ),
  },
  {
    key: "avgDuration",
    label: "Avg Duration",
    width: "120px",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (value) => (
      <span className="text-xs font-mono text-slate-600">{formatDuration(value || 180)}</span>
    ),
  },
  {
    key: "conversions",
    label: "Conversions",
    width: "120px",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (value, row) => {
      const conversions = value || Math.round((row.connectedCalls || 10) * 0.2);
      const totalCalls = row.totalCalls || 1;
      const conversionRate = Math.round((conversions / totalCalls) * 100);
      return (
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-blue-700">{conversions}</span>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded mt-0.5">{conversionRate}%</span>
        </div>
      );
    },
  },
  {
    key: "recordingsCount",
    label: "Recordings",
    width: "110px",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (value) => (
      <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200/80 px-2 py-0.5 rounded-full text-xs font-bold shadow-2xs">
        <Mic size={11} />
        <span>{value || 0}</span>
      </div>
    ),
  },
  {
    key: "lastActive",
    label: "Last Active",
    width: "130px",
    render: (value) => (
      <span className="text-xs font-medium text-slate-500">{formatDate(value)}</span>
    ),
  },
];

export default function CallReportsTable({
  data = [],
  onRowClick,
  paginationProps,
}) {
  const columns = getColumns(onRowClick);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs font-outfit">
      <DataTable
        columns={columns}
        data={data}
        rowKey="userId"
        selectable={false}
        onRowClick={onRowClick}
        tableClassName="w-full min-w-[1000px]"
        stickyActions={true}
        renderRowActions={(row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onRowClick) onRowClick(row);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-2xs cursor-pointer active:scale-95"
            title="View Logs"
          >
            <Eye size={13} />
            <span>Logs</span>
            <ChevronRight size={12} />
          </button>
        )}
        emptyState={
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            <span className="material-symbols-outlined text-4xl text-slate-300">phone_disabled</span>
            <span className="text-sm font-bold text-slate-800">No Call Reports Found</span>
          </div>
        }
      />

      <div className="p-4 border-t border-slate-100">
        <TablePagination
          mode="page"
          {...paginationProps}
        />
      </div>
    </div>
  );
}
