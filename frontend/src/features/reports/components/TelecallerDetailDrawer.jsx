import { useState, useMemo, useEffect } from "react";
import { X, User, Download, CheckCircle2, PhoneCall, Heart, Clock, Target, Calendar, StickyNote } from "lucide-react";
import { useTelecallerCallLogs } from "@/features/callReports/hooks/useCallReports";
import { useTelecallerReport } from "@/features/reports/hooks/useTelecallerReport";
import EmptyState from "@/components/ui/EmptyState";
import { useTelecallerTimeline, useTelecallerFollowups } from "@/features/reports/hooks/useReportsQueries";
import FollowupCard from "@/features/telecaller/followups/components/FollowupCard";
import TimelineItem from "@/components/crm/TimelineItem";

export default function TelecallerDetailDrawer({ isOpen, onClose, telecaller }) {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  // Use empId for admin endpoints as required by backend
  const tcId = telecaller?.empId;

  console.log("Selected telecaller", telecaller);
  console.log("Using empId", telecaller?.empId);

  // Fetch performance report stats
  const { data: reportData, isLoading: isReportLoading } = useTelecallerReport(
    tcId,
    'this-month',
    { enabled: isOpen && !!tcId }
  );

  // Fetch real call logs
  const { data: callsData, isLoading: isCallsLoading } = useTelecallerCallLogs(
    tcId,
    {},
    0,
    20,
    { enabled: isOpen && !!tcId && activeTab === 'Calls' }
  );

  // Follow-ups state
  const [followupStatus, setFollowupStatus] = useState("ALL");
  const [followupPage, setFollowupPage] = useState(0);

  // Timeline state
  const [timelinePage, setTimelinePage] = useState(0);

  // Fetch follow-ups
  const { data: followupsData, isLoading: isFollowupsLoading } = useTelecallerFollowups(
    tcId, 
    followupStatus, 
    followupPage, 
    20
  );

  // Fetch timeline
  const { data: timelineData, isLoading: isTimelineLoading } = useTelecallerTimeline(
    tcId,
    timelinePage,
    20
  );

  const [followupsList, setFollowupsList] = useState([]);
  const [timelineList, setTimelineList] = useState([]);

  useEffect(() => {
    if (followupsData?.items) {
      if (followupPage === 0) setFollowupsList(followupsData.items);
      else setFollowupsList(prev => [...prev, ...followupsData.items]);
    }
  }, [followupsData, followupPage]);

  useEffect(() => {
    setFollowupPage(0);
  }, [followupStatus, tcId]);

  useEffect(() => {
    if (timelineData?.items) {
      if (timelinePage === 0) setTimelineList(timelineData.items);
      else setTimelineList(prev => [...prev, ...timelineData.items]);
    }
  }, [timelineData, timelinePage]);

  useEffect(() => {
    setTimelinePage(0);
  }, [tcId]);

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!telecaller) return;
    setIsExporting(true);
    try {
      await new Promise(res => setTimeout(res, 1000));
    } finally {
      setIsExporting(false);
    }
  };

  const name = telecaller?.name || reportData?.telecaller?.name || "Telecaller";
  const rank = telecaller?.rank || reportData?.telecaller?.rank || "—";
  
  const getOutcomeColor = (outcome) => {
    const norm = String(outcome).toLowerCase();
    if (norm.includes("connect")) return "bg-green-50 text-green-700";
    if (norm.includes("interest")) return "bg-emerald-50 text-emerald-700";
    if (norm.includes("follow")) return "bg-amber-50 text-amber-700";
    if (norm.includes("no") || norm.includes("miss")) return "bg-gray-50 text-gray-700";
    return "bg-slate-50 text-slate-700";
  };

  const calls = callsData?.content || [];
  const callsCount = reportData?.kpi?.callsMade?.value || 0;
  const connectedCount = reportData?.kpi?.connected?.value || 0;
  const interestedCount = reportData?.kpi?.interested?.value || 0;
  const followupsCount = reportData?.kpi?.followups?.value || 0;
  const admissionsCount = reportData?.kpi?.admissions?.value || 0;
  const conversionRate = reportData?.kpi?.conversion?.value || "0.0%";

  const funnelStages = reportData?.funnel || [
    { name: "Assigned", value: 0 },
    { name: "Connected", value: 0 },
    { name: "Interested", value: 0 },
    { name: "Follow-up", value: 0 },
    { name: "Converted", value: 0 }
  ];

  const funnelColors = ["bg-blue-100", "bg-cyan-100", "bg-violet-100", "bg-amber-100", "bg-emerald-100"];
  const maxFunnelVal = Math.max(1, funnelStages[0]?.value || 0);

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Telecaller Profile</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
 
        {telecaller ? (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <User size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{name}</h3>
                <p className="text-[13px] text-slate-600 font-medium mt-1">Senior Telecaller • Admissions</p>
                <div className="flex items-center gap-2 mt-1.5 text-[12px] text-slate-500 font-medium">
                  <span className="text-amber-600">Rank #{rank}</span>
                </div>
              </div>
            </div>
 
            {/* Tabs */}
            <div className="flex gap-6 border-b border-slate-100 overflow-x-auto shrink-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
              {['Overview', 'Calls', 'Follow-ups', 'Conversions', 'Timeline'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[13px] font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    activeTab === tab 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
 
            {/* Tab Content */}
            <div className="flex-1">
              {activeTab === 'Overview' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Calls Made", value: callsCount },
                      { label: "Connected", value: connectedCount },
                      { label: "Interested", value: interestedCount },
                      { label: "Follow-ups", value: followupsCount },
                      { label: "Admissions", value: admissionsCount },
                      { label: "Conversion", value: conversionRate },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-[13px] font-medium text-slate-500 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                    <p className="text-[13px] font-semibold text-slate-700">{admissionsCount} admissions achieved this period</p>
                  </div>
                </div>
              )}
 
              {activeTab === 'Calls' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {isCallsLoading ? (
                    <div className="p-6 text-center text-[13px] text-slate-400">Loading call history...</div>
                  ) : calls.length === 0 ? (
                    <EmptyState title="No recent calls" description="This telecaller has not logged any calls yet." />
                  ) : calls.map((call, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-bold text-slate-900">{call.leadName || "Student"}</p>
                        <p className="text-[12px] font-medium text-slate-500 mt-0.5">{call.course || "B.Tech"} • {call.callDateTime ? new Date(call.callDateTime).toLocaleDateString() : "Today"}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-1 ${getOutcomeColor(call.outcome || call.callOutcome)}`}>
                          {call.outcome || call.callOutcome || "Connected"}
                        </span>
                        <p className="text-[12px] font-medium text-slate-600">{call.duration || "00:00"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
 
              {activeTab === 'Follow-ups' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    {["ALL", "PENDING", "COMPLETED"].map(status => (
                      <button
                        key={status}
                        onClick={() => { setFollowupStatus(status); setFollowupPage(0); }}
                        className={`px-3 py-1 text-[11px] font-bold rounded-full transition-colors ${
                          followupStatus === status ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {isFollowupsLoading && followupPage === 0 ? (
                    <div className="p-6 text-center text-[13px] text-slate-400">Loading follow-ups...</div>
                  ) : followupsList.length > 0 ? (
                    <div className="space-y-3">
                      {followupsList.map((followup, index) => (
                        <FollowupCard key={followup.id || index} followup={followup} />
                      ))}
                      {followupsData?.currentPage < (followupsData?.totalPages - 1) && (
                        <button 
                          onClick={() => setFollowupPage(p => p + 1)}
                          disabled={isFollowupsLoading}
                          className="w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl disabled:opacity-50"
                        >
                          {isFollowupsLoading ? "Loading..." : "Load More"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <EmptyState title="No follow-ups found" description={`No ${followupStatus.toLowerCase()} follow-ups recorded for this telecaller.`} />
                  )}
                </div>
              )}
 
              {activeTab === 'Conversions' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <h3 className="text-[14px] font-bold text-slate-900">Conversion Funnel</h3>
                    <div className="space-y-3">
                      {funnelStages.map((stage, i) => {
                        const pct = Math.max(10, ((stage.value || 0) / maxFunnelVal) * 100);
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`h-8 rounded-md ${funnelColors[i % funnelColors.length]}`} style={{ width: `${pct}%` }}></div>
                            <span className="text-[13px] font-bold text-slate-900 w-12">{stage.value || 0}</span>
                            <span className="text-[12px] font-medium text-slate-500 w-24">{stage.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
 
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Conversion Rate</p>
                      <p className="text-xl font-bold text-emerald-600">{conversionRate}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Admissions Achieved</p>
                      <p className="text-xl font-bold text-slate-900">{admissionsCount}</p>
                    </div>
                  </div>
                </div>
              )}
 
              {activeTab === 'Timeline' && (
                <div className="animate-in fade-in duration-200">
                  {isTimelineLoading && timelinePage === 0 ? (
                    <div className="p-6 text-center text-[13px] text-slate-400">Loading timeline...</div>
                  ) : timelineList.length > 0 ? (
                    <div className="space-y-0">
                      {timelineList.map((event, index) => (
                        <TimelineItem key={event.id || index} event={event} />
                      ))}
                      {timelineData?.currentPage < (timelineData?.totalPages - 1) && (
                        <button 
                          onClick={() => setTimelinePage(p => p + 1)}
                          disabled={isTimelineLoading}
                          className="w-full mt-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl disabled:opacity-50"
                        >
                          {isTimelineLoading ? "Loading..." : "Load More"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <EmptyState title="No activity recorded" description="Timeline progression history is currently unavailable." />
                  )}
                </div>
              )}
            </div>
 
          </div>
        ) : (
          <div className="flex-1 p-6 flex items-center justify-center text-[14px] text-slate-400 font-medium">
            No telecaller selected
          </div>
        )}
 
        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <button 
            onClick={handleExport}
            disabled={isExporting || !telecaller}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors font-semibold disabled:opacity-50 text-[14px]"
          >
            <Download size={16} />
            {isExporting ? `Exporting ${name} performance report...` : "Export Performance Report"}
          </button>
        </div>
 
      </div>
    </>
  );
}
