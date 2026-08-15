import React from "react";
import { PhoneCall, Clock, CheckCircle2, FileText, Calendar, ArrowRight } from "lucide-react";

export default function TimelineTab({ enquiryNo, call }) {
  const timelineEvents = [
    {
      id: 1,
      title: "Call Connected with Student",
      time: "Today • 05:41 PM",
      description: "Direct outbound call answered. Discussed B.Tech engineering course curriculum and admission deadlines.",
      status: "completed",
      badge: "Connected",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: PhoneCall
    },
    {
      id: 2,
      title: "Course Brochure Shared",
      time: "Today • 05:43 PM",
      description: "Brochure for Computer Science & Engineering sent via WhatsApp to student mobile.",
      status: "completed",
      badge: "WhatsApp",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: FileText
    },
    {
      id: 3,
      title: "Campus Visit Scheduled",
      time: "Tomorrow • 11:00 AM",
      description: "Student scheduled physical visit to the GMU main campus admissions office with parents.",
      status: "scheduled",
      badge: "Scheduled",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Calendar
    },
  ];

  return (
    <div className="py-2 space-y-4 font-outfit">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <Clock size={14} className="text-blue-600" />
        <span>Interaction Timeline</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {timelineEvents.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <div key={evt.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-2xs group-hover:scale-110 transition-transform">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              </div>

              {/* Event Card */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 hover:bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-blue-600" />
                    <h5 className="text-xs font-bold text-slate-900">{evt.title}</h5>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${evt.badgeClass}`}>
                    {evt.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>
                <span className="text-[10px] font-medium text-slate-400 mt-2 block font-mono">
                  {evt.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
