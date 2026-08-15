import React from "react";
import { Phone, Mail, ExternalLink, UserCheck } from "lucide-react";
import { getInitials } from "@/features/telecaller/voice/utils/callMapper";

export default function CallHeader({ call }) {
  if (!call) return null;

  const leadName = call.leadName || call.name || "Student Lead";
  const initials = getInitials(leadName);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 font-outfit">
      <div className="flex items-center gap-4">
        {/* Avatar with pale blue - NO MAROON */}
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center text-xl font-black shrink-0 shadow-md border-2 border-white">
          {initials}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              {leadName}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              {call.leadStatus || "LEAD"}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
            <span className="font-mono font-bold text-slate-600">#{call.enquiryNo || call.leadId || "135"}</span>
            <span>•</span>
            <div className="flex items-center gap-1 text-slate-600">
              <Phone size={12} className="text-slate-400" />
              <span className="font-mono">{call.phone || call.leadPhone || "N/A"}</span>
            </div>
            {call.email && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1 text-slate-600">
                  <Mail size={12} className="text-slate-400" />
                  <span>{call.email}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* View Full Lead button */}
      <button
        onClick={() => {
          const leadId = call.enquiryNo || call.leadId || "135";
          const currentPath = window.location.pathname + window.location.search;
          const backUrl = encodeURIComponent(currentPath);
          if (window.location.pathname.startsWith("/dashboard")) {
            window.location.href = `/dashboard/management/leads/${leadId}?backUrl=${backUrl}`;
          } else {
            window.location.href = `/telecaller/leads/${leadId}?backUrl=${backUrl}`;
          }
        }}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
      >
        <span>View Full Lead</span>
        <ExternalLink size={13} />
      </button>
    </div>
  );
}
