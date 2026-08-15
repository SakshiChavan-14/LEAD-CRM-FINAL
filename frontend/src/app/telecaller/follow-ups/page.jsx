"use client";

import React, { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useFollowups } from "@/features/telecaller/hooks/useFollowups";
import { useUpdateFollowup, useCompleteFollowup } from "@/features/telecaller/hooks/useFollowupMutations";
import { useFollowupWorkspace } from "@/features/telecaller/hooks/useFollowupWorkspace";
import { useTelecallerLeads } from "@/features/telecaller/hooks/useMyLeads";
import { CalendarClock, Plus, Calendar } from "lucide-react";

import FollowupListView from "@/features/telecaller/followups/components/FollowupListView";
import FollowupCalendarView from "@/features/telecaller/followups/components/FollowupCalendarView";
import WorkspaceControls from "@/features/telecaller/followups/components/WorkspaceControls";
import ActiveFilterChips from "@/features/telecaller/followups/components/ActiveFilterChips";
import SummaryCards from "@/features/telecaller/followups/components/SummaryCards";
import ReusableFilterDrawer from "@/components/layout/ReusableFilterDrawer";
import RescheduleModal from "@/features/telecaller/followups/components/RescheduleModal";
import ScheduleFollowupModal from "@/features/telecaller/followups/components/ScheduleFollowupModal";
import EmptyFollowups from "@/features/telecaller/followups/components/EmptyFollowups";
import Button from "@/components/ui/Button";

export default function FollowUpsPage() {
  // Fetch data
  const { data: allFollowupsData, isLoading } = useFollowups("all");
  const allFollowups = Array.isArray(allFollowupsData) ? allFollowupsData : [];
  
  const { data: leadsData } = useTelecallerLeads({}, 0, 100);
  const telecallerLeads = Array.isArray(leadsData?.content) 
    ? leadsData.content 
    : Array.isArray(leadsData?.leads) 
    ? leadsData.leads 
    : Array.isArray(leadsData) 
    ? leadsData 
    : [];
  
  const { mutate: completeFollowup } = useCompleteFollowup();

  // Workspace UI State & Derived Filtered Data
  const workspace = useFollowupWorkspace(allFollowups);

  // Modals state
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDefaultDate, setScheduleDefaultDate] = useState("");

  const handleOpenReschedule = (followup) => setRescheduleData(followup);
  const handleCloseReschedule = () => setRescheduleData(null);
  
  const handleComplete = (followup) => {
    completeFollowup(followup.id);
  };

  const handleOpenSchedule = (date) => {
    setScheduleDefaultDate(date || "");
    setIsScheduleOpen(true);
  };
  const handleCloseSchedule = () => setIsScheduleOpen(false);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 font-outfit space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <CalendarClock size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Follow-up Management
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Track, schedule, and execute your student touchpoints
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenSchedule(workspace.selectedCalendarDay)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>Schedule Follow-up</span>
          </button>
        </div>

        {/* Top KPI Summary Cards */}
        <SummaryCards 
          summaryCards={workspace.tabCounts} 
          activeTab={workspace.activeTab}
          onTabChange={workspace.setActiveTab}
        />

        {/* Controls Section */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 space-y-4">
          <WorkspaceControls 
            workspace={workspace} 
            onOpenFilters={() => setFilterDrawerOpen(true)}
          />

          {/* Active Filter Badges */}
          <ActiveFilterChips 
            filters={workspace.filters}
            datePreset={workspace.datePreset}
            onRemoveFilter={(key) => {
              if (key === 'datePreset') workspace.setDatePreset('all');
              else workspace.setFilters({ ...workspace.filters, [key]: "" });
            }}
            onClearAll={() => {
              workspace.setDatePreset('all');
              workspace.setFilters({ priority: "", course: "", status: "", source: "", assignedCounselor: "", date: "" });
            }}
          />
        </div>

        {/* Content Section */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            workspace.viewMode === "list" ? (
              <FollowupListView 
                followups={workspace.displayFollowups} 
                onReschedule={handleOpenReschedule}
                onComplete={handleComplete}
                activeTab={workspace.activeTab}
              />
            ) : (
              // Calendar mode: two separate cards (left calendar ~40%, right follow-up list ~60%)
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="lg:w-[42%] w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300">
                  <FollowupCalendarView 
                    followups={workspace.filteredFollowups}
                    selectedDate={workspace.selectedCalendarDay}
                    onSelectDate={(d) => workspace.setSelectedCalendarDay(d)}
                    onSchedule={handleOpenSchedule}
                  />
                </div>

                <div className="lg:w-[58%] w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col min-h-[460px]">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        {workspace.selectedCalendarDay ? new Date(workspace.selectedCalendarDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {workspace.selectedCalendarDay ? `${workspace.filteredFollowups.filter(f => f.scheduledDate === workspace.selectedCalendarDay && String(f.status || "").toLowerCase() !== "completed").length} follow-up${workspace.filteredFollowups.filter(f => f.scheduledDate === workspace.selectedCalendarDay && String(f.status || "").toLowerCase() !== "completed").length !== 1 ? 's' : ''} pending` : 'Click a date on the calendar to view tasks'}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handleOpenSchedule(workspace.selectedCalendarDay)}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                    >
                      <Plus size={14} />
                      <span>Schedule Follow-up</span>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {(!workspace.selectedCalendarDay || workspace.filteredFollowups.filter(f => f.scheduledDate === workspace.selectedCalendarDay && String(f.status || "").toLowerCase() !== "completed").length === 0) ? (
                      <EmptyFollowups type={workspace.selectedCalendarDay ? 'empty_day' : 'no_results'} />
                    ) : (
                      <FollowupListView 
                        followups={workspace.filteredFollowups.filter(f => f.scheduledDate === workspace.selectedCalendarDay && String(f.status || "").toLowerCase() !== "completed")}
                        onReschedule={handleOpenReschedule}
                        onComplete={handleComplete}
                        activeTab={workspace.activeTab}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

      </div>

      <ReusableFilterDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Refine Follow-ups"
        onApply={() => setFilterDrawerOpen(false)}
        onReset={() => workspace.setFilters({ priority: "", course: "", status: "", source: "", assignedCounselor: "", date: "" })}
      >
        <div className="flex flex-col gap-5 font-outfit">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
            <select
              value={workspace.filters.priority}
              onChange={(e) => workspace.setFilters({...workspace.filters, priority: e.target.value})}
              className="w-full h-10 px-3.5 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Course</label>
            <select
              value={workspace.filters.course}
              onChange={(e) => workspace.setFilters({...workspace.filters, course: e.target.value})}
              className="w-full h-10 px-3.5 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">All Courses</option>
              <option value="B.Tech">B.Tech</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
            <select
              value={workspace.filters.status}
              onChange={(e) => workspace.setFilters({...workspace.filters, status: e.target.value})}
              className="w-full h-10 px-3.5 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Source</label>
            <select
              value={workspace.filters.source}
              onChange={(e) => workspace.setFilters({...workspace.filters, source: e.target.value})}
              className="w-full h-10 px-3.5 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Specific Date</label>
            <input
              type="date"
              value={workspace.filters.date}
              onChange={(e) => workspace.setFilters({...workspace.filters, date: e.target.value})}
              className="w-full h-10 px-3.5 bg-slate-50/70 border border-slate-200/90 rounded-xl text-xs font-mono font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </ReusableFilterDrawer>

      <RescheduleModal 
        isOpen={!!rescheduleData}
        onClose={handleCloseReschedule}
        followup={rescheduleData}
      />

      <ScheduleFollowupModal 
        isOpen={isScheduleOpen}
        onClose={handleCloseSchedule}
        defaultDate={scheduleDefaultDate}
        existingFollowups={workspace.filteredFollowups.filter(f => f.scheduledDate === scheduleDefaultDate)}
        allFollowups={allFollowups}
        leads={telecallerLeads}
      />
    </div>
  );
}
