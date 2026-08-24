"use client";

import React, { useMemo } from "react";
import { Filter, Sparkles, PhoneCall, UserCheck, FileText, Award } from "lucide-react";

const DashedConnector = ({ isActive }) => (
  <div className="flex-grow flex items-center justify-center min-w-[8px] md:min-w-[20px] mx-0.5 md:mx-1">
    <div className={`w-full border-t-2 border-dashed ${isActive ? "border-blue-500" : "border-slate-200"} relative`}>
      <div 
        className={`absolute -right-0.5 -top-[5px] w-2 h-2 border-r-2 border-b-2 transform rotate-[-45deg] ${
          isActive ? "border-blue-500" : "border-slate-300"
        }`} 
      />
    </div>
  </div>
);

export default function LeadPipelineChart({ data }) {
  const rawData = Array.isArray(data) ? data : [];
  const [selectedStageIndex, setSelectedStageIndex] = React.useState(null);
  
  // Dynamic stage mapping with fallback values
  const stages = useMemo(() => {
    const findCount = (label) => {
      const getNormalizedAliases = (lbl) => {
        const norm = lbl.toLowerCase();
        if (norm.includes("new") || norm.includes("in")) return ["new lead", "new", "lead in", "lead_in", "enquiry"];
        if (norm.includes("contact")) return ["contacted", "contact", "in_progress", "follow_up", "followup"];
        if (norm.includes("qualif") || norm.includes("interest")) return ["qualified", "interested", "qualified lead"];
        if (norm.includes("app")) return ["application", "applied", "form"];
        if (norm.includes("admiss") || norm.includes("enroll") || norm.includes("convert")) return ["admission", "admitted", "enrolled", "converted", "completed"];
        return [norm];
      };

      const aliases = getNormalizedAliases(label);
      const match = rawData.find(item => {
        const itemStage = String(item.stage || item.label || item.status || "").toLowerCase().trim().replace(/_/g, " ");
        return aliases.includes(itemStage);
      });
      return match ? match.count || match.value || 0 : 0;
    };

    return [
      { key: "new lead", label: "New Lead", count: findCount("New Lead"), percentage: 0, color: "border-blue-500 text-blue-600 bg-blue-50/50", activeColor: "bg-blue-500 text-white border-blue-500", icon: Sparkles, desc: "Lead created" },
      { key: "contacted", label: "Contacted", count: findCount("Contacted"), percentage: 25, color: "border-cyan-500 text-cyan-600 bg-cyan-50/50", activeColor: "bg-cyan-500 text-white border-cyan-500", icon: PhoneCall, desc: "First touch" },
      { key: "qualified", label: "Qualified", count: findCount("Qualified"), percentage: 50, color: "border-emerald-500 text-emerald-600 bg-emerald-50/50", activeColor: "bg-emerald-500 text-white border-emerald-500", icon: UserCheck, desc: "Interested" },
      { key: "application", label: "Application", count: findCount("Application"), percentage: 75, color: "border-amber-500 text-amber-600 bg-amber-50/50", activeColor: "bg-amber-500 text-white border-amber-500", icon: FileText, desc: "Form filled" },
      { key: "admission", label: "Admission", count: findCount("Admission"), percentage: 100, color: "border-purple-500 text-purple-600 bg-purple-50/50", activeColor: "bg-purple-500 text-white border-purple-500", icon: Award, desc: "Enrolled" }
    ];
  }, [rawData]);

  const defaultStageIndex = useMemo(() => {
    // Find the furthest stage (right-most) that has count > 0 to indicate progress
    for (let i = stages.length - 1; i >= 0; i--) {
      if (stages[i].count > 0) {
        return i;
      }
    }
    return 0; // Default to New Lead if all are 0
  }, [stages]);

  const currentStageIndex = selectedStageIndex !== null ? selectedStageIndex : defaultStageIndex;
  const progressPercentage = stages[currentStageIndex].percentage;
  const activeStageLeads = stages[currentStageIndex].count;

  return (
    <div className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-xs h-full flex flex-col justify-between font-outfit hover:shadow-md hover:border-slate-300 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60">
            <Filter size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Lead Pipeline Progression</h3>
            <p className="text-xs text-slate-400">Admission conversion journey</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full shadow-2xs">
          <span className="text-xs font-bold text-slate-600">Progress:</span>
          <span className="text-xs font-extrabold text-blue-700 font-mono">
            {progressPercentage}% ({activeStageLeads} {activeStageLeads === 1 ? 'Lead' : 'Leads'})
          </span>
        </div>
      </div>
 
      {/* Pipeline Stage Progression Nodes */}
      <div className="flex items-center justify-between w-full py-6 mt-4 flex-grow">
        {stages.map((s, index) => {
          const isActive = index === currentStageIndex;
          const isCompleted = index <= currentStageIndex;
          const IconComponent = s.icon;
 
          return (
            <React.Fragment key={s.key}>
              {/* Stage Node */}
              <div 
                onClick={() => setSelectedStageIndex(index)}
                className="flex flex-col items-center gap-2 flex-1 max-w-[120px] group cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center shadow-xs transition-all duration-300 ${
                  isActive 
                    ? s.activeColor + " scale-110 shadow-md ring-4 ring-offset-2 ring-slate-100" 
                    : isCompleted 
                      ? s.color 
                      : "border-slate-200 text-slate-400 bg-slate-50"
                }`}>
                  <IconComponent size={16} />
                </div>
                <div className="text-center">
                  <p className={`text-[11px] font-bold tracking-tight leading-none ${isActive ? "text-slate-900 font-extrabold" : "text-slate-500"}`}>
                    {s.label}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5 hidden md:block">
                    {s.desc}
                  </p>
                </div>
              </div>

              {/* Dashed Connecting Line */}
              {index < stages.length - 1 && (
                <DashedConnector isActive={index < currentStageIndex} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
