"use client";

import React, { useState } from "react";
import { Shield, Lock, CheckCircle2, History, Clock, KeyRound, Smartphone, ShieldCheck, Laptop } from "lucide-react";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function SecurityCard() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const securityTips = [
    "Use at least 8 characters with upper & lowercase letters",
    "Include numeric numbers and special symbols (@, #, $)",
    "Avoid using personal birthdates or common words",
    "Do not reuse passwords across multiple systems"
  ];

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col font-outfit">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 shadow-2xs">
              <Shield size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Security & Authentication</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Password management, 2FA, and login history</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/80 shadow-2xs">
            <ShieldCheck size={12} />
            2FA Active
          </span>
        </div>
        
        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          {/* Password Section */}
          <div className="bg-gradient-to-r from-blue-50/60 to-purple-50/40 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-blue-600 shrink-0">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Account Password</h4>
                <p className="text-lg font-extrabold text-slate-900 tracking-[0.25em] leading-tight font-mono mt-0.5">••••••••••••</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Last changed: 20 July 2025</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl border border-blue-200/80 shadow-xs transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
            >
              <KeyRound size={14} />
              <span>Change Password</span>
            </button>
          </div>

          {/* Interactive Security Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 hover:bg-white hover:border-blue-200 hover:shadow-2xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs">
                <History size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Last Login Session</span>
                <span className="text-xs font-extrabold text-slate-900 truncate mt-0.5">Today, 09:41 AM</span>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 hover:bg-white hover:border-emerald-200 hover:shadow-2xs transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
                <Laptop size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Active Device</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <span className="text-xs font-extrabold text-emerald-700 truncate mt-0.5">Windows 11 • Chrome</span>
              </div>
            </div>
          </div>

          {/* Password Best Practice Checklist */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-5">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Password Security Guidelines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {securityTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordDialog 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </>
  );
}
