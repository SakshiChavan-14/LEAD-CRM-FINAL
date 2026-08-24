"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PhoneCall, CheckCircle, ChevronRight, Sparkles, User, BookOpen } from "lucide-react";
import { useTodayCallQueue } from "../hooks/useTodayCallQueue";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeletons";
import StatusBadge from "@/components/table/StatusBadge";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";
import { useRouter, usePathname } from "next/navigation";

export default function TodayCallQueue() {
  const { summary, recommendedLead, queue, isLoading } = useTodayCallQueue();
  const { setSelectedLead } = useVoice();
  const router = useRouter();
  const pathname = usePathname();
  
  const scrollContainerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const allQueueItems = recommendedLead ? [recommendedLead, ...queue] : queue;
  const isEmpty = allQueueItems.length === 0;

  // Infinite Scroll Observer
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setVisibleCount((prev) => Math.min(prev + 6, allQueueItems.length));
    }
  }, [allQueueItems.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  if (isLoading) {
    return <CardSkeleton />;
  }

  const handleCall = (e, lead) => {
    e.stopPropagation();
    // Navigate to the dedicated Calling Page
    const returnTo = encodeURIComponent(pathname || "/telecaller");
    router.push(`/telecaller/calling/${lead.enquiryNo || lead.id}?returnTo=${returnTo}`);
  };

  const handleOpenLead = (id) => {
    router.push(`/telecaller/leads/${id}`);
  };

  const visibleItems = allQueueItems.slice(0, visibleCount);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col h-[560px] font-outfit overflow-hidden">
      {/* Header & Summary */}
      <div className="p-5 border-b border-slate-100 flex-shrink-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Priority Queue</h2>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
              {allQueueItems.length} Total
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-1">
            <span><strong className="text-slate-900 font-mono">{summary.assignedLeads}</strong> Active</span>
            <span className="text-slate-300">•</span>
            <span><strong className="text-amber-600 font-mono">{summary.pendingFollowups}</strong> Pending</span>
            <span className="text-slate-300">•</span>
            <span><strong className="text-rose-600 font-mono">{summary.overdueCalls}</strong> Overdue</span>
          </div>
        </div>
      </div>

      {/* Body with Infinite Scroll */}
      <div 
        ref={scrollContainerRef} 
        className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-2.5"
      >
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center py-8">
            <EmptyState 
              title="No Leads in Your Queue" 
              description="You're all caught up for now." 
              icon={CheckCircle} 
            />
          </div>
        ) : (
          <>
            {visibleItems.map((lead, idx) => {
              const initials = (lead.name || "Student")
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "ST";

              return (
                <div 
                  key={`${lead.id || lead.enquiryNo || 'lead'}-${idx}`}
                  onClick={() => handleOpenLead(lead.enquiryNo || lead.id)}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200/80 bg-white hover:bg-blue-50/30 hover:border-blue-200 hover:shadow-xs transition-all duration-200 cursor-pointer group"
                >
                  {/* Avatar & Student Name */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-800 border border-blue-100 flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                      {initials}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {lead.name}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-0.5">
                        <span className="font-mono">{lead.mobileNo || lead.phone || "N/A"}</span>
                        {lead.course && (
                          <>
                            <span>•</span>
                            <span className="truncate">{lead.course}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    <StatusBadge status={lead.status || "NEW"} />
                  </div>

                  {/* Call Icon-Only Button with #00C853 */}
                  <div className="shrink-0">
                    <button 
                      onClick={(e) => handleCall(e, lead)}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#00C853] flex items-center justify-center shadow-xs transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      title={`Call ${lead.name}`}
                      aria-label={`Call ${lead.name}`}
                    >
                      <PhoneCall size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {visibleCount < allQueueItems.length && (
              <div className="text-center py-2 text-[11px] font-semibold text-slate-400 animate-pulse">
                Scroll for more leads...
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex-shrink-0 flex items-center justify-between text-[11px] font-semibold text-slate-500">
        <span>Showing <strong className="text-slate-900 font-mono">{visibleItems.length}</strong> of <strong className="text-slate-900 font-mono">{allQueueItems.length}</strong> leads</span>
        <span className="text-blue-600 font-bold">Infinite Scroll Active</span>
      </div>
    </div>
  );
}
