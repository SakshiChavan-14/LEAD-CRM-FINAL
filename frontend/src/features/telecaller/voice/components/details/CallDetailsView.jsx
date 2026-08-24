"use client";

import React, { useState } from "react";
import { AlertCircle, LayoutDashboard, Mic, History, StickyNote } from "lucide-react";
import { useCallDetails } from "@/features/telecaller/hooks/useCalls";
import CallHeader from "./CallHeader";
import SummaryTab from "./tabs/SummaryTab";
import RecordingTab from "./tabs/RecordingTab";
import TimelineTab from "./tabs/TimelineTab";
import NotesTab from "./tabs/NotesTab";

import EmptyState from "@/components/ui/EmptyState";

const CallDetailsSkeleton = () => (
  <div className="space-y-6 animate-pulse p-2 font-outfit">
    <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100" />
      <div className="space-y-2">
        <div className="w-32 h-6 bg-slate-100 rounded-lg" />
        <div className="w-24 h-4 bg-slate-100 rounded-lg" />
      </div>
    </div>
    <div className="h-10 w-full bg-slate-100 rounded-xl" />
    <div className="w-full h-44 bg-slate-100 rounded-2xl" />
  </div>
);

export default function CallDetailsView({ callId, callData, defaultTab = "summary", showRecording = true }) {
  const { data: fetchedCall, isLoading, isError } = useCallDetails(callId, { enabled: !!callId });
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  if (isLoading && !callData) return <CallDetailsSkeleton />;
  if (isError && !callData && !fetchedCall) {
    return <EmptyState title="Call Details Unavailable" description="Could not load the requested call details." />;
  }
  
  const call = { ...(callData || {}), ...(fetchedCall || {}) };

  const tabs = [
    { id: "summary", label: "Summary", icon: LayoutDashboard },
    ...(showRecording ? [{ id: "recording", label: "Recording", icon: Mic }] : []),
    { id: "timeline", label: "Timeline", icon: History },
    { id: "notes", label: "Notes", icon: StickyNote },
  ];

  return (
    <div className="flex flex-col space-y-5 h-full font-outfit">
      <CallHeader call={call} />

      {/* Tabs Navigation (Blue active indicator - NO MAROON) */}
      <div className="flex items-center gap-2 border-b border-slate-200/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto min-h-[220px]">
        {activeTab === "summary" && <SummaryTab call={call} />}
        {activeTab === "recording" && showRecording && <RecordingTab call={call} callId={callId} />}
        {activeTab === "timeline" && <TimelineTab enquiryNo={call.enquiryNo || "135"} call={call} />}
        {activeTab === "notes" && <NotesTab call={call} />}
      </div>
    </div>
  );
}
