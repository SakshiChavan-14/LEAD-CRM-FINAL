"use client";

import React, { useMemo, useRef } from "react";
import { Activity, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useInfiniteCalls } from "@/features/telecaller/hooks/useCalls";

export default function RecentActivity({ isLoading: parentLoading, activities = [] }) {
  const {
    data,
    isLoading: callsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteCalls({}, 10);

  const scrollRef = useRef(null);
  const isLoading = parentLoading && callsLoading;

  // Extract raw calls from infinite pages
  const infiniteCalls = useMemo(() => {
    if (!data || !data.pages) return [];
    const list = [];
    data.pages.forEach((page) => {
      const pageCalls = Array.isArray(page?.content)
        ? page.content
        : Array.isArray(page)
        ? page
        : Array.isArray(page?.calls)
        ? page.calls
        : [];
      list.push(...pageCalls);
    });
    return list;
  }, [data]);

  // Combine and deduplicate activities
  const allItems = useMemo(() => {
    const seenIds = new Set();
    const result = [];

    const addItem = (item) => {
      const id = String(item.id || item.callId || item.interactionId || "");
      if (!id || seenIds.has(id)) return;
      seenIds.add(id);
      result.push(item);
    };

    // 1. Add infinite query items
    infiniteCalls.forEach((c) => {
      const id = c.callId || c.id || c.interactionId;
      const outcome = (c.outcome || c.callOutcome || c.status || "").toUpperCase();
      let statusText = "Call logged — LOGGED";
      let dotColor = "bg-amber-500";

      if (outcome.includes("CONNECT") || outcome.includes("ADMIT")) {
        statusText = "Call logged — CONNECTED";
        dotColor = "bg-emerald-500";
      } else if (outcome.includes("NOT") || outcome.includes("MISS") || outcome.includes("BUSY") || outcome.includes("REJECT")) {
        statusText = "Call logged — NOT CONNECTED";
        dotColor = "bg-amber-500";
      } else if (outcome.includes("FOLLOW") || outcome.includes("SCHEDULE")) {
        statusText = "Follow-up scheduled";
        dotColor = "bg-blue-500";
      } else if (outcome.includes("INTEREST")) {
        statusText = "Lead marked as INTERESTED";
        dotColor = "bg-purple-500";
      }

      let timeStr = "Today";
      if (c.callDateTime || c.createdAt || c.date) {
        const d = new Date(c.callDateTime || c.createdAt || c.date);
        if (!isNaN(d.getTime())) {
          timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
      }

      addItem({
        id: `call-${id}`,
        title: statusText,
        leadName: c.leadName || c.name || c.studentName || "Student",
        dotColor,
        time: c.time || timeStr,
      });
    });

    // 2. Seed with dashboard activities if available
    if (Array.isArray(activities)) {
      activities.forEach((act, idx) => {
        const actId = act.id || `prop-act-${idx}`;
        addItem({
          id: actId,
          title: act.title || act.action || "Activity",
          leadName: act.leadName || act.studentName || act.name || "Student",
          dotColor: act.dotColor || "bg-blue-500",
          time: act.time || "Today",
        });
      });
    }

    return result;
  }, [infiniteCalls, activities]);

  const handleScroll = () => {
    if (!scrollRef.current || isFetchingNextPage || !hasNextPage) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollHeight - scrollTop - clientHeight < 40) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col font-outfit h-full animate-pulse">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100" />
            <div className="h-5 w-28 bg-slate-100 rounded" />
          </div>
          <div className="h-4 w-16 bg-slate-100 rounded" />
        </div>
        <div className="pt-3.5 space-y-4 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-1.5">
                <div className="h-3.5 w-36 bg-slate-100 rounded" />
                <div className="h-3 w-24 bg-slate-50 rounded" />
              </div>
              <div className="h-3 w-12 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-xs p-5 flex flex-col font-outfit hover:shadow-md transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/70 shrink-0">
            <Activity size={16} />
          </div>
          <h2 className="text-sm font-bold text-slate-900 leading-tight">Recent Activity</h2>
        </div>
        <Link
          href="/telecaller/calls/history"
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>View All</span>
          <ChevronRight size={13} />
        </Link>
      </div>

      {/* Infinite Scroll List */}
      {allItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-2 shadow-2xs">
            <Activity size={18} />
          </div>
          <p className="text-xs font-bold text-slate-700">No recent activity</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Your calls and events will stream here live.</p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="pt-2 divide-y divide-slate-100/80 flex-1 overflow-y-auto [scrollbar-width:none] max-h-[260px]"
        >
          {allItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center justify-between py-2.5 first:pt-1 last:pb-1">
              <div className="flex items-start gap-2.5 min-w-0 pr-2">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.dotColor || "bg-blue-500"}`} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate leading-snug">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                    Lead: {item.leadName || "Student"}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-medium shrink-0 whitespace-nowrap">
                {item.time || "Today"}
              </span>
            </div>
          ))}

          {isFetchingNextPage && (
            <div className="py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
              <Loader2 size={13} className="animate-spin text-blue-600" />
              <span>Loading more activities...</span>
            </div>
          )}

          {error && (
            <div className="py-2 text-center text-[11px] font-semibold text-slate-400">
              Could not load older activities.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
