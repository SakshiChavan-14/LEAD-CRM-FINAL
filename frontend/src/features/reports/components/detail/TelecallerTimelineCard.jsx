"use client";

import ChartCard from "@/features/reports/components/ChartCard";
import { CheckCircle2, Clock, PhoneCall, Heart, StickyNote } from "lucide-react";

const TIMELINE_CONFIG = {
  conversion: { icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  followup:   { icon: Clock,         color: "bg-amber-50 text-amber-600 border-amber-200" },
  call:       { icon: PhoneCall,     color: "bg-blue-50 text-blue-600 border-blue-200" },
  interested: { icon: Heart,         color: "bg-violet-50 text-violet-600 border-violet-200" },
  note:       { icon: StickyNote,    color: "bg-slate-50 text-slate-500 border-slate-200" },
};

export default function TelecallerTimelineCard({ timeline = [], isLoading, exportMode = false }) {
  return (
    <ChartCard
      title="Activity Timeline"
      subtitle="Recent actions, conversions and call notes"
      isLoading={isLoading}
      skeletonHeight="260px"
    >
      {timeline.length > 0 && (
        <div className="mt-5 relative pl-4">
          {/* Vertical connector line */}
          <div className="absolute left-[27px] top-3 bottom-3 w-px bg-slate-100" />

          <div className="space-y-0">
            {timeline.map((item, i) => {
              const config = TIMELINE_CONFIG[item.type] || TIMELINE_CONFIG.note;
              const Icon = config.icon;

              return (
                <div key={i} className="relative flex items-start gap-4 min-h-[72px] group">
                  {/* Timeline dot */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border ${config.color} transition-transform group-hover:scale-110`}>
                    <Icon size={15} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1 pb-4">
                    <p className="text-[13px] font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-[12px] font-medium text-slate-500 truncate">
                        {item.description}
                      </p>
                      <span className="text-slate-300 text-[11px]">·</span>
                      <p className="text-[11px] font-medium text-slate-400 shrink-0">
                        {item.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {timeline.length === 0 && !isLoading && (
        <div className="mt-6 text-center py-8 text-sm text-slate-400 font-medium bg-slate-50/50 rounded-2xl">
          No activity recorded for this period.
        </div>
      )}
    </ChartCard>
  );
}
