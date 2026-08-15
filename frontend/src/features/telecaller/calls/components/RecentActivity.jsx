"use client";

import React, { useState, useEffect, useRef } from "react";
import { History, ChevronRight, PhoneCall, PhoneOutgoing, PhoneMissed, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

import { useCalls } from "@/features/telecaller/hooks/useCalls";
import EmptyState from "@/components/ui/EmptyState";

export default function RecentActivity({ isLoading: parentLoading, activities }) {
  const [page, setPage] = useState(0);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollContainerRef = useRef(null);

  // Hook for paginated calls
  const { data: callsData, isLoading: callsLoading } = useCalls({}, page, 10);

  const isLoading = parentLoading || (page === 0 && callsLoading);

  useEffect(() => {
    if (activities && activities.length > 0) {
      setDisplayedItems(activities);
    } else if (callsData?.content) {
      const calls = callsData.content.map(c => ({
        id: c.callId || c.id,
        leadName: c.leadName || "Student",
        action: "Outbound Call",
        status: c.outcome || c.callOutcome || "CONNECTED",
        time: c.callDateTime ? new Date(c.callDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Today",
        duration: c.duration || "00:00"
      }));
      
      setDisplayedItems(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = calls.filter(item => !existingIds.has(item.id));
        if (newItems.length === 0 && calls.length > 0) {
          setHasMore(false);
        }
        return [...prev, ...newItems];
      });
    }
  }, [activities, callsData]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 20 && hasMore && !loadingMore && !callsLoading) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
      setTimeout(() => setLoadingMore(false), 800);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] animate-pulse font-outfit">
        <div className="flex justify-between items-center mb-4">
          <div className="w-28 h-5 bg-slate-100 rounded" />
          <div className="w-16 h-5 bg-slate-100 rounded" />
        </div>
        <div className="space-y-3 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isLoading && displayedItems.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <History size={16} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-none">Recent Activity</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Live stream with infinite scroll</p>
            </div>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center mt-5">
          <EmptyState title="No recent activity" description="Your calling activity will appear here." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 flex flex-col h-[360px] justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <History size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-none">Recent Activity</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Live stream with infinite scroll</p>
          </div>
        </div>
        
        <Link href="/telecaller/calls/history" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
          <span>View All</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Infinite Scroll Activity List */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="space-y-2 flex-1 overflow-y-auto pr-1 [scrollbar-width:none]"
      >
        {displayedItems.map((item, idx) => {
          const initials = (item.leadName || "L").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
          const isConnected = (item.status || "").toUpperCase() === "CONNECTED" || (item.status || "").toUpperCase() === "ADMITTED";
          const isMissed = (item.status || "").toUpperCase().includes("NO") || (item.status || "").toUpperCase().includes("MISSED");
          
          return (
            <div 
              key={item.id || idx} 
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-2xs transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 border border-blue-100 flex items-center justify-center text-[10px] font-extrabold shadow-2xs shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {item.leadName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate">
                    {item.action}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-0.5">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                  isConnected 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : isMissed 
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}>
                  {item.status || "LOGGED"}
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-medium">
                  {item.time || "Today"}
                </span>
              </div>
            </div>
          );
        })}

        {loadingMore && (
          <div className="py-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <Loader2 size={13} className="animate-spin text-blue-600" />
            <span>Loading more activities...</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
        <span>Showing {displayedItems.length} events</span>
        <span>Scroll for older logs</span>
      </div>
    </div>
  );
}
