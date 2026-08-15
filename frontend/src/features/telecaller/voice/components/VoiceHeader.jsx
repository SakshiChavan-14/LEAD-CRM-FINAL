"use client";

import React from "react";
import { PhoneCall, Volume2, ShieldCheck } from "lucide-react";

export default function VoiceHeader() {
  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-outfit">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#00C853]/10 text-[#00C853] flex items-center justify-center border border-[#00C853]/20 shadow-2xs">
          <PhoneCall size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Telecaller Voice Center</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Enterprise cloud browser telephony powered by Twilio WebRTC
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold shrink-0">
        <ShieldCheck size={14} />
        <span>VoIP Gateway Connected</span>
      </div>
    </div>
  );
}
