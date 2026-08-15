"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import DataTable from "@/components/table/DataTable";
import { useCallHistory } from "@/features/telecaller/voice/hooks/useCallHistory";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";
import { useTelecallerLeads } from "../../hooks/useMyLeads";
import CallDetailsModal from "@/features/telecaller/voice/components/details/CallDetailsModal";
import { getRecentCallsColumns } from "./recentCallsColumns";
import { Search } from "lucide-react";

export default function RecentCallsTable({ activeFilter = "all" }) {
  const { data: calls, isLoading } = useCallHistory();
  const { data: leadsData } = useTelecallerLeads({}, 0, 250);
  const allLeads = leadsData?.leads || [];

  const { selectedCallId, setSelectedCallId } = useVoice();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(15);
  const tableContainerRef = useRef(null);

  // Filtered, Enriched & Sorted Call Logs
  const allCalls = useMemo(() => {
    let list = Array.isArray(calls) ? [...calls] : [];
    
    // Enrich calls list with actual course and district from assigned leads
    if (allLeads.length > 0) {
      list = list.map(c => {
        const matched = allLeads.find(l => 
          String(l.enquiryNo || l.id) === String(c.enquiryNo || c.leadId || c.id) ||
          String(l.mobileNo || l.phone) === String(c.phone || c.leadPhone || c.mobile || c.mobileNo)
        );
        if (matched) {
          return {
            ...c,
            course: matched.course || c.course,
            district: matched.district || matched.city || matched.taluk || c.district
          };
        }
        return c;
      });
    }
    
    // Sort by latest first
    list.sort((a, b) => new Date(b.callDateTime || b.createdAt || b.date || 0) - new Date(a.callDateTime || a.createdAt || a.date || 0));

    // Filter by KPI category
    if (activeFilter && activeFilter !== "all") {
      if (activeFilter === "connected") {
        list = list.filter(c => String(c.outcome || c.status || "").toLowerCase().includes("connect") || String(c.outcome || "").toLowerCase().includes("answer"));
      } else if (activeFilter === "missed") {
        list = list.filter(c => String(c.outcome || c.status || "").toLowerCase().includes("miss") || String(c.outcome || "").toLowerCase().includes("no answer"));
      } else if (activeFilter === "busy") {
        list = list.filter(c => String(c.outcome || c.status || "").toLowerCase().includes("busy") || String(c.outcome || "").toLowerCase().includes("fail"));
      } else if (activeFilter === "recordings") {
        list = list.filter(c => c.recordingUrl || c.hasRecording || c.callDurationSeconds > 30);
      }
    }

    // Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c => 
        (c.leadName || c.name || "").toLowerCase().includes(q) ||
        (c.phone || c.leadPhone || c.mobile || "").includes(q) ||
        (c.course || c.courseName || "").toLowerCase().includes(q) ||
        (c.district || c.districtName || "").toLowerCase().includes(q) ||
        String(c.enquiryNo || c.leadId || "").includes(q)
      );
    }

    return list;
  }, [calls, allLeads, activeFilter, searchTerm]);

  // Infinite Scroll Handler
  const handleScroll = useCallback(() => {
    if (!tableContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleCount(prev => Math.min(prev + 10, allCalls.length));
    }
  }, [allCalls.length]);

  useEffect(() => {
    const el = tableContainerRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const visibleCalls = useMemo(() => {
    return allCalls.slice(0, visibleCount);
  }, [allCalls, visibleCount]);

  const columns = useMemo(() => getRecentCallsColumns(setSelectedCallId), [setSelectedCallId]);

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300 overflow-hidden font-outfit">
      {/* Table Header & Search */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Call Interaction Logs</h2>
            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
              {allCalls.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Real-time student communications with audio recordings
          </p>
        </div>

        <div className="relative min-w-[240px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student, phone, course, district..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setVisibleCount(15);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/70 border border-slate-200/80 rounded-xl text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 h-10 shadow-2xs hover:border-slate-300"
          />
        </div>
      </div>

      {/* Table with Infinite Scrolling */}
      <div 
        ref={tableContainerRef} 
        className="max-h-[580px] overflow-y-auto custom-scrollbar"
      >
        <DataTable
          columns={columns}
          data={visibleCalls}
          rowKey={(row) => row.callId || row.id || row.interactionId}
          loading={isLoading}
          selectable={false}
          skeletonRows={6}
          onRowClick={(row) => {
            const callId = row.callId || row.id || row.interactionId;
            setSelectedCallId(callId);
          }}
        />

        {visibleCount < allCalls.length && (
          <div className="py-3 text-center text-xs font-semibold text-slate-400 animate-pulse border-t border-slate-100 bg-slate-50/40">
            Scroll to load more call records...
          </div>
        )}
      </div>

      {/* Table Footer */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Showing <strong className="text-slate-900 font-mono font-bold">{visibleCalls.length}</strong> of <strong className="text-slate-900 font-mono font-bold">{allCalls.length}</strong> calls</span>
        <span className="text-blue-600 font-bold">Infinite Scroll Stream</span>
      </div>

      {/* Details & Recording Modal */}
      {selectedCallId && (
        <CallDetailsModal 
          callId={selectedCallId}
          open={!!selectedCallId} 
          defaultTab="summary"
          onClose={() => setSelectedCallId(null)} 
        />
      )}
    </div>
  );
}
