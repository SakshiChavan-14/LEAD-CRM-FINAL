import React from "react";
import { Phone, Clock, PhoneOutgoing, Calendar, CheckCircle2, User, Sparkles } from "lucide-react";
import { formatCallDate, formatDuration, getCallDirection } from "@/features/telecaller/voice/utils/callMapper";

export default function SummaryTab({ call }) {
  if (!call) return null;

  const outcome = call.outcome || call.callOutcome || "Connected";
  const duration = call.callDurationSeconds || call.callDuration || call.duration || 13;
  const direction = getCallDirection(call);
  const dateFormatted = formatCallDate(call.callDateTime || call.createdAt || call.date) || "Today, 05:41 PM";

  return (
    <div className="py-2 space-y-4 font-outfit">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <Phone size={14} className="text-blue-600" />
        <span>Call Summary Information</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* OUTCOME */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer group">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 group-hover:text-slate-600 transition-colors">
            Outcome
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {outcome.toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* DURATION */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer group">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 group-hover:text-slate-600 transition-colors">
            Duration
          </span>
          <span className="text-lg font-mono font-black text-slate-900">
            {formatDuration(duration)}
          </span>
        </div>
        
        {/* DIRECTION */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer group">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 group-hover:text-slate-600 transition-colors">
            Direction
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <PhoneOutgoing size={12} />
            {direction}
          </span>
        </div>
        
        {/* DATE & TIME */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer group">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 group-hover:text-slate-600 transition-colors">
            Date & Time
          </span>
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" />
            {dateFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}
