import { useState } from "react";
import { X, User, Download, CheckCircle2, PhoneCall, Heart, Clock, Target, Calendar, StickyNote } from "lucide-react";
import { exportTelecallerPDF } from "../utils/exportReport";

const MOCK_CALLS = [
  { lead: "Naruto", course: "MCA", duration: "08:12", outcome: "Connected", time: "Today, 09:41 AM" },
  { lead: "Pooja Verma", course: "Cybersecurity", duration: "05:44", outcome: "Interested", time: "Today, 08:56 AM" },
  { lead: "Rahul Sharma", course: "MBA", duration: "02:18", outcome: "Follow-up", time: "Yesterday, 05:12 PM" },
  { lead: "Harsha B", course: "MCA", duration: "00:46", outcome: "No Response", time: "Yesterday, 03:40 PM" },
  { lead: "Meghana Singh", course: "BCA", duration: "06:31", outcome: "Connected", time: "Yesterday, 11:22 AM" },
];

const MOCK_FOLLOWUPS = [
  { lead: "Pooja Verma", course: "Cybersecurity", due: "Today • 04:30 PM", priority: "High" },
  { lead: "Rahul Sharma", course: "MBA", due: "Tomorrow • 10:00 AM", priority: "Medium" },
  { lead: "Divya Kulkarni", course: "BCA", due: "Tomorrow • 03:15 PM", priority: "Medium" },
  { lead: "Deepak Jain", course: "MCA", due: "12 Aug • 11:45 AM", priority: "Low" },
];

const MOCK_TIMELINE = [
  { type: "conversion", title: "Admission completed for Naruto", description: "MCA • ₹25,000 fee confirmed", time: "Today, 10:14 AM" },
  { type: "followup", title: "Follow-up scheduled", description: "Pooja Verma • Cybersecurity", time: "Today, 09:02 AM" },
  { type: "call", title: "Outbound call connected", description: "Rahul Sharma • 06m 12s", time: "Yesterday, 05:18 PM" },
  { type: "interested", title: "Lead marked Interested", description: "Divya Kulkarni • BCA", time: "Yesterday, 03:47 PM" },
  { type: "note", title: "Note added", description: "Discuss scholarship options", time: "Yesterday, 11:20 AM" },
];

const MOCK_CONVERSION = {
  assigned: 842,
  connected: 561,
  interested: 103,
  followups: 74,
  converted: 6,
};

export default function TelecallerDetailDrawer({ isOpen, onClose, telecaller }) {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!telecaller) return;
    setIsExporting(true);
    try {
      // Mock action only
      await new Promise(res => setTimeout(res, 1000));
    } finally {
      setIsExporting(false);
    }
  };

  const name = telecaller?.name || "Sakshi Chavan";
  const rank = telecaller?.rank || 1;
  
  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case "Connected": return "bg-green-50 text-green-700";
      case "Interested": return "bg-emerald-50 text-emerald-700";
      case "Follow-up": return "bg-amber-50 text-amber-700";
      case "No Response": return "bg-gray-50 text-gray-700";
      default: return "bg-slate-50 text-slate-700";
    }
  };

  const getTimelineIcon = (type) => {
    switch (type) {
      case "conversion": return { icon: <CheckCircle2 size={16} />, color: "bg-emerald-50 text-emerald-600" };
      case "followup": return { icon: <Clock size={16} />, color: "bg-amber-50 text-amber-600" };
      case "call": return { icon: <PhoneCall size={16} />, color: "bg-blue-50 text-blue-600" };
      case "interested": return { icon: <Heart size={16} />, color: "bg-violet-50 text-violet-600" };
      case "note": return { icon: <StickyNote size={16} />, color: "bg-slate-100 text-slate-600" };
      default: return { icon: <CheckCircle2 size={16} />, color: "bg-slate-50 text-slate-600" };
    }
  };

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
                  <span className="text-amber-600">Rank #{rank} of 5</span>
                  <span>•</span>
                  <span>Joined Jul 2025</span>
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
                      { label: "Calls Made", value: "842" },
                      { label: "Connected", value: "561" },
                      { label: "Interested", value: "103" },
                      { label: "Follow-ups", value: "74" },
                      { label: "Admissions", value: "6" },
                      { label: "Conversion", value: "18.2%" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                        <p className="text-[13px] font-medium text-slate-500 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[14px] font-bold text-slate-900">Monthly Target</span>
                      <span className="text-[13px] font-semibold text-blue-700">75%</span>
                    </div>
                    <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-blue-600 rounded-full w-[75%]"></div>
                    </div>
                    <p className="text-[13px] font-medium text-slate-600">6 / 8 admissions achieved</p>
                  </div>
                </div>
              )}

              {activeTab === 'Calls' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {MOCK_CALLS.length === 0 ? (
                    <div className="p-6 text-center text-[14px] text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">No activity available for this period.</div>
                  ) : MOCK_CALLS.map((call, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-bold text-slate-900">{call.lead}</p>
                        <p className="text-[12px] font-medium text-slate-500 mt-0.5">{call.course} • {call.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-1 ${getOutcomeColor(call.outcome)}`}>
                          {call.outcome}
                        </span>
                        <p className="text-[12px] font-medium text-slate-600">{call.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Follow-ups' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {MOCK_FOLLOWUPS.length === 0 ? (
                    <div className="p-6 text-center text-[14px] text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">No activity available for this period.</div>
                  ) : MOCK_FOLLOWUPS.map((f, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-bold text-slate-900">{f.lead}</p>
                        <p className="text-[12px] font-medium text-slate-500 mt-0.5">{f.course}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-semibold text-slate-700">{f.due}</p>
                        <p className="text-[12px] font-medium text-slate-500 mt-0.5">{f.priority} Priority</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'Conversions' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <h3 className="text-[14px] font-bold text-slate-900">Conversion Funnel</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Assigned Leads", value: MOCK_CONVERSION.assigned, color: "bg-blue-100" },
                        { label: "Connected", value: MOCK_CONVERSION.connected, color: "bg-cyan-100" },
                        { label: "Interested", value: MOCK_CONVERSION.interested, color: "bg-violet-100" },
                        { label: "Follow-ups", value: MOCK_CONVERSION.followups, color: "bg-amber-100" },
                        { label: "Converted", value: MOCK_CONVERSION.converted, color: "bg-emerald-100" },
                      ].map((stage, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`h-8 rounded-md ${stage.color}`} style={{ width: `${Math.max(10, (stage.value / MOCK_CONVERSION.assigned) * 100)}%` }}></div>
                          <span className="text-[13px] font-bold text-slate-900 w-12">{stage.value}</span>
                          <span className="text-[12px] font-medium text-slate-500 w-24">{stage.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Conversion Rate</p>
                      <p className="text-xl font-bold text-emerald-600">18.2%</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Avg Call Duration</p>
                      <p className="text-xl font-bold text-slate-900">05:14</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Best Source</p>
                      <p className="text-[14px] font-bold text-slate-900">Referral</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <p className="text-[12px] font-medium text-slate-500 mb-1">Best Course</p>
                      <p className="text-[14px] font-bold text-slate-900">MCA</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Timeline' && (
                <div className="animate-in fade-in duration-200">
                  {MOCK_TIMELINE.length === 0 ? (
                    <div className="p-6 text-center text-[14px] text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">No activity available for this period.</div>
                  ) : (
                    <div className="relative pl-4 space-y-0">
                      <div className="absolute left-[31px] top-4 bottom-4 w-px bg-slate-200"></div>
                      {MOCK_TIMELINE.map((item, i) => {
                        const { icon, color } = getTimelineIcon(item.type);
                        return (
                          <div key={i} className="relative flex items-start gap-4 h-[72px]">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${color}`}>
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <p className="text-[14px] font-bold text-slate-900 leading-tight">{item.title}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[13px] font-medium text-slate-600 truncate">{item.description}</p>
                                <span className="text-[12px] text-slate-400 shrink-0 mx-1">•</span>
                                <p className="text-[12px] font-medium text-slate-400 shrink-0">{item.time}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
            {isExporting ? `Exporting ${name} • This Month performance report...` : "Export Performance Report"}
          </button>
        </div>

      </div>
    </>
  );
}
