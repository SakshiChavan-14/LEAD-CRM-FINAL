"use client";

import React from "react";
import { User, CreditCard, AtSign, Phone, Mail, Building2, Briefcase, Calendar, ShieldCheck, MapPin } from "lucide-react";

export default function PersonalInformationCard({ profile }) {
  if (!profile) return null;

  const fields = [
    { 
      label: "Full Name", 
      value: profile.name || "Karun Poojari", 
      icon: User,
      color: "text-blue-600 bg-blue-50"
    },
    { 
      label: "Employee ID", 
      value: profile.empId || "EMP001", 
      icon: CreditCard,
      color: "text-indigo-600 bg-indigo-50",
      isMono: true
    },
    { 
      label: "Username", 
      value: profile.username && profile.username !== "N/A" ? `@${profile.username}` : "@karun_p", 
      icon: AtSign,
      color: "text-purple-600 bg-purple-50",
      isMono: true
    },
    { 
      label: "Mobile Number", 
      value: profile.mobile || profile.phone || "6360907325", 
      icon: Phone,
      color: "text-emerald-600 bg-emerald-50",
      isMono: true
    },
    { 
      label: "Email Address", 
      value: profile.email || "karunpoojari7@gmail.com", 
      icon: Mail,
      color: "text-blue-600 bg-blue-50"
    },
    { 
      label: "Department", 
      value: profile.department || "Admissions & Counseling", 
      icon: Building2,
      color: "text-amber-600 bg-amber-50"
    },
    { 
      label: "Designation / Role", 
      value: profile.role || "Senior Telecaller", 
      icon: Briefcase,
      color: "text-cyan-600 bg-cyan-50"
    },
    { 
      label: "Date Joined", 
      value: "20 July 2025", 
      icon: Calendar,
      color: "text-rose-600 bg-rose-50"
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col font-outfit">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
            <User size={18} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Personal Information</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Verified employee identity and contact records</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-extrabold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/80 shadow-2xs">
          Verified Profile
        </span>
      </div>
      
      {/* Fields List */}
      <div className="p-4 flex-1 flex flex-col justify-between divide-y divide-slate-100">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/40 hover:shadow-2xs transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-xl ${field.color} flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs group-hover:scale-110 transition-transform`}>
                  <Icon size={15} />
                </div>
                <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                  {field.label}
                </span>
              </div>
              <div className="text-right pl-4">
                <span className={`text-xs font-extrabold text-slate-900 ${field.isMono ? 'font-mono' : ''} group-hover:text-blue-600 transition-colors`}>
                  {field.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
