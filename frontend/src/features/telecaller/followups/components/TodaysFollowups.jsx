import { PhoneCall, ChevronRight, CheckCircle2, User } from "lucide-react";

export default function TodaysFollowups({ followups = [], onCallLead }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col h-full font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      <div className="p-6 flex justify-between items-start pb-2">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">Today's Schedule</h3>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Your planned follow-ups for today</p>
        </div>
        <button className="flex items-center text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors leading-tight cursor-pointer">
          <span>View full</span>
          <ChevronRight size={14} className="ml-0.5 shrink-0" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6 mt-4">
        <div className="space-y-3">
          {followups.map((lead) => (
            <div key={lead.id} className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-200/80 flex items-center justify-between hover:bg-white hover:border-blue-200 hover:shadow-2xs transition-all">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs font-extrabold text-xs">
                  {lead.name ? lead.name[0] : "S"}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{lead.name}</p>
                  <p className="text-[11px] font-mono font-medium text-slate-400 mt-0.5">{lead.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-slate-600">{lead.time}</span>
                <button 
                  onClick={() => onCallLead && onCallLead(lead.id)}
                  className="h-8 w-8 rounded-xl bg-[#00C853] text-white hover:bg-[#00b048] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                  title="Call Lead"
                >
                  <PhoneCall size={13} />
                </button>
              </div>
            </div>
          ))}
          {followups.length === 0 && (
            <div className="text-center text-slate-400 text-xs py-6 font-medium">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-[#00C853]" />
              <p>All caught up for today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
