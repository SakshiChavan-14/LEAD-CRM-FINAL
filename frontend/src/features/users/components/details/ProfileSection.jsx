"use client";

import React from "react";
import { User, Building, ShieldCheck, Mail, Phone, Calendar, Briefcase, Award } from "lucide-react";

export default function ProfileSection({ profile, kpi }) {
  if (!profile) return null;

  const isActive = (profile.status || "ACTIVE").toUpperCase() === "ACTIVE";

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between font-outfit">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60">
          <User size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Profile Information</h3>
          <p className="text-xs text-slate-400">Account and organizational details</p>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="space-y-4 my-4">
        
        {/* Personal Details */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-2.5">
            Personal Details
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Employee ID</span>
              <span className="font-mono font-bold text-slate-900 mt-0.5 block">{profile.empId || "EMP0003"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Email Address</span>
              <span className="font-bold text-slate-900 mt-0.5 block truncate">{profile.email || "-"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Phone Number</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{profile.phone || "-"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Account Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-0.5 rounded-full text-[10px] font-bold border ${
                isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" : "bg-rose-50 text-rose-700 border-rose-200/80"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Organization Details */}
        <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block mb-2.5">
            Organization & Assignment
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Designation / Role</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{profile.role || "Telecaller"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Department</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{profile.department || "Admissions"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Assigned Leads</span>
              <span className="font-bold text-blue-600 mt-0.5 block">{kpi?.assignedLeads ?? 42} leads</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[11px]">Joining Date</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{profile.joiningDate || "13 Jul 2026"}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
