import React from "react";
import { PhoneCall, Clock, CheckCircle2, FileText, Calendar, History } from "lucide-react";
import { useLeadTimeline } from "@/features/leads/hooks/useLeadTimeline";
import { formatDisplayDate } from "@/utils/dateUtils";
import EmptyState from "@/components/ui/EmptyState";

export default function TimelineTab({ enquiryNo, call }) {
  const targetId = enquiryNo || call?.enquiryNo || call?.leadId || "";
  const { data: rawEvents, isLoading } = useLeadTimeline(targetId);

  const timelineEvents = Array.isArray(rawEvents) ? rawEvents : [];

  if (isLoading) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 font-medium animate-pulse">
        Loading timeline events...
      </div>
    );
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="py-2">
        <EmptyState 
          title="No Interaction Timeline Recorded" 
          description="No interaction timeline events have been recorded for this lead yet." 
        />
      </div>
    );
  }

  return (
    <div className="py-2 space-y-4 font-outfit">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <Clock size={14} className="text-blue-600" />
        <span>Interaction Timeline</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timelineEvents.map((evt, idx) => {
          const title = evt.title || evt.action || evt.type || "Interaction Event";
          const desc = evt.description || evt.remarks || evt.details || "";
          const dateStr = evt.timestamp || evt.createdAt || evt.date;
          const formattedDate = dateStr ? formatDisplayDate(dateStr) : "Recorded";
          const badgeText = evt.status || evt.type || "Logged";

          return (
            <div key={evt.id || idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-2xs group-hover:scale-110 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>

              {/* Event Card */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <History size={14} className="text-blue-600" />
                    <h5 className="text-xs font-bold text-slate-900">{title}</h5>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-200/80">
                    {badgeText}
                  </span>
                </div>
                {desc && <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>}
                <span className="text-[10px] font-medium text-slate-400 mt-2 block font-mono">
                  {formattedDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
