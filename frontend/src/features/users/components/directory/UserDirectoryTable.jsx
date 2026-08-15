"use client";

import React from "react";
import DataTable from "@/components/table/DataTable";
import { Phone, UserCheck, Shield, ChevronRight } from "lucide-react";

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

const getColumns = (onView) => [
  {
    key: "index",
    label: "#",
    width: "50px",
    render: (_, row) => (
      <span className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 text-[10px] text-slate-500 font-bold">
        {row._index}
      </span>
    ),
  },
  {
    key: "name",
    label: "Telecaller",
    width: "260px",
    render: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-sky-500 text-xs font-bold shrink-0 border border-slate-200/80 shadow-2xs">
          {getInitials(row.name)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
            {row.name || "Unknown"}
          </span>
          <span className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
            {row.email || "-"}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "empId",
    label: "EMP ID",
    width: "110px",
    render: (value) => (
      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
        {value || "-"}
      </span>
    ),
  },
  {
    key: "phoneNo",
    label: "Phone",
    width: "140px",
    render: (value, row) => (
      <div className="flex items-center gap-1.5 text-slate-600 text-xs font-mono">
        <Phone size={12} className="text-slate-400" />
        <span>{row.phoneNo || row.phone || "-"}</span>
      </div>
    ),
  },
  {
    key: "role",
    label: "Role",
    width: "130px",
    render: (value, row) => {
      const isAdmin = String(row.role || "").toUpperCase() === "ADMIN";
      const roleDisplay = row.role || "Telecaller";
      return isAdmin ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80">
          <Shield size={10} />
          {roleDisplay}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
          <UserCheck size={10} />
          {roleDisplay}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    width: "120px",
    render: (value, row) => {
      const isActive = String(row.status || "").toUpperCase() === "ACTIVE";
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs ${
          isActive 
            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" 
            : "bg-rose-50 text-rose-700 border-rose-200/80"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    key: "programme",
    label: "Programme",
    width: "120px",
    render: (value) => (
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
        {value || "ALL"}
      </span>
    ),
  },
];

export default function UserDirectoryTable({ users = [], onView }) {
  const indexedUsers = users.map((user, index) => ({ ...user, _index: index + 1 }));
  const columns = getColumns(onView);

  return (
    <DataTable
      columns={columns}
      data={indexedUsers}
      rowKey="empId"
      selectable={false}
      onRowClick={onView}
      tableClassName="w-full min-w-[900px]"
      stickyActions={true}
      renderRowActions={(row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onView) onView(row);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-admin-primary-subtle hover:border-admin-primary-border hover:text-admin-primary-text transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          <span>View</span>
          <ChevronRight size={13} />
        </button>
      )}
      emptyState={
        <div className="flex flex-col items-center gap-2 py-10">
          <span className="material-symbols-outlined text-4xl text-slate-300">people</span>
          <span className="text-sm font-bold text-slate-800">No Telecallers Found</span>
        </div>
      }
    />
  );
}
