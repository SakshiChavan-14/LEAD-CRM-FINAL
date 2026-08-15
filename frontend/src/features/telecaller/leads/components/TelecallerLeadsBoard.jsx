"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { LEAD_STAGES } from "@/features/leads/constants/leadStages";
import { useTelecallerUpdateLeadStatus } from "@/features/telecaller/hooks/useTelecallerUpdateLeadStatus";
import { formatDisplayDate } from "@/utils/dateUtils";

// We append NOT_INTERESTED to the board columns
const BOARD_COLUMNS = [...LEAD_STAGES, "NOT_INTERESTED"];

const normalizeStatus = (status) => {
  const s = String(status || "ENQUIRY").trim().toUpperCase();

  if (s === "NOT INTERESTED" || s === "NOT_INTERESTED") return "NOT_INTERESTED";
  if (s === "COMPLETED" || s === "ENROLLED" || s === "ADMITTED") return "ADMISSION";

  return s.replace(/\s+/g, "_");
};

const calculateScore = (lead) => {
  if (normalizeStatus(lead.status) === "NOT_INTERESTED") return 0;
  
  let score = 0;
  // Activity score
  score += Math.min((lead.callCount || 0) * 10, 30);
  score += Math.min((lead.followupCount || 0) * 15, 30);
  
  // Pipeline progression score
  const stageIndex = LEAD_STAGES.indexOf(normalizeStatus(lead.status));
  if (stageIndex > 0) score += (stageIndex * 15);
  
  return Math.min(Math.max(score, 10), 100);
};

export default function TelecallerLeadsBoard({ leads, onRowClick }) {
  const { mutateAsync: updateLeadStatus } = useTelecallerUpdateLeadStatus();
  const [draggedLead, setDraggedLead] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [columnSearch, setColumnSearch] = useState({});

  const handleDragStart = (e, lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", lead.enquiryNo || lead.id);
  };

  const handleDragOver = (e, col) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
    if (overColumn !== col) {
      setOverColumn(col);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setOverColumn(null);
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setOverColumn(null);

    if (!draggedLead) return;
    if (normalizeStatus(draggedLead.status) === targetStatus) {
      setDraggedLead(null);
      return;
    }

    console.groupCollapsed("[Kanban] Drop");
    console.log("Lead", draggedLead?.enquiryNo || draggedLead?.id);
    console.log("From", draggedLead?.status);
    console.log("To", targetStatus);
    console.groupEnd();

    try {
      await updateLeadStatus({
        enquiryNo: draggedLead.enquiryNo || draggedLead.id,
        status: targetStatus,
      });
      setDraggedLead(null);
    } catch (error) {
      console.error(error);
    }
  };

  const groupedLeads = BOARD_COLUMNS.reduce((acc, col) => {
    acc[col] = leads.filter(l => normalizeStatus(l.status) === col);
    return acc;
  }, {});

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 font-outfit h-full min-h-[500px] snap-x snap-mandatory">
      {BOARD_COLUMNS.map((col) => {
        const rawColumnLeads = groupedLeads[col] || [];
        const searchQuery = (columnSearch[col] || "").toLowerCase();
        
        const columnLeads = rawColumnLeads.filter(lead => {
          if (!searchQuery) return true;
          return (
            (lead.name || "").toLowerCase().includes(searchQuery) ||
            (lead.mobileNo || lead.phone || "").toLowerCase().includes(searchQuery) ||
            (lead.enquiryNo || "").toString().includes(searchQuery)
          );
        });
        
        return (
          <div 
            key={col}
            className="flex flex-col flex-shrink-0 w-80 bg-slate-50/50 rounded-2xl border border-slate-200 shadow-sm snap-start transition-colors data-[over=true]:bg-blue-50/50 data-[over=true]:border-blue-300"
            onDragOver={(e) => handleDragOver(e, col)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col)}
            data-over={overColumn === col}
          >
            {/* Column Header */}
            <div className="px-4 py-3 border-b border-slate-200 bg-white rounded-t-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-extrabold text-slate-800 tracking-wider">
                  {col.replace("_", " ")}
                </h3>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  {columnLeads.length}
                </span>
              </div>
              <div className="relative w-full">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search in column..." 
                  value={columnSearch[col] || ""}
                  onChange={(e) => setColumnSearch({...columnSearch, [col]: e.target.value})}
                  className="w-full pl-7 pr-3 py-1.5 text-[11px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Column Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {columnLeads.length > 0 ? (
                columnLeads.map((lead) => {
                  const normalizedLeadStatus = normalizeStatus(lead.status);
                  const isNotInterested = normalizedLeadStatus === "NOT_INTERESTED";
                  const stageIndex = LEAD_STAGES.indexOf(normalizedLeadStatus);
                  const progress = isNotInterested ? 0 : Math.round(((stageIndex + 1) / LEAD_STAGES.length) * 100);
                  const isHighPriority = progress > 80 && !isNotInterested;

                  return (
                    <div
                      key={lead.enquiryNo || lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      onDragEnd={() => setDraggedLead(null)}
                      onClick={() => onRowClick(lead)}
                      data-dragging={draggedLead?.enquiryNo === (lead.enquiryNo || lead.id)}
                      className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing flex flex-col gap-3 data-[dragging=true]:opacity-50 data-[dragging=true]:border-blue-500 data-[dragging=true]:shadow-lg"
                    >
                      {/* Top Row: Badge & Priority */}
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/50">
                          Enquiry #{lead.enquiryNo}
                        </span>
                        {isHighPriority && (
                          <div className="flex items-center gap-1.5 text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            High-priority
                          </div>
                        )}
                      </div>

                      {/* Name & Phone */}
                      <div>
                        <h4 className="text-[15px] font-extrabold text-slate-900 leading-tight">
                          {lead.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5 font-mono">
                          {lead.mobileNo || lead.phone || "N/A"}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[10px] font-bold text-slate-600">Lead Progress</span>
                          <span className="text-[10px] font-extrabold text-slate-900">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isNotInterested ? 'bg-rose-500' : 'bg-blue-500'}`} 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>

                      {/* Stat Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-full text-[9px] font-bold text-slate-600">
                          Calls <span className="bg-slate-200/80 px-1.5 py-0.5 rounded-md text-slate-700">{lead.callCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-full text-[9px] font-bold text-slate-600">
                          Follow-ups <span className="bg-slate-200/80 px-1.5 py-0.5 rounded-md text-slate-700">{lead.followupCount || 0}</span>
                        </div>
                        {lead.lastContactAt && (
                          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded-full text-[9px] font-bold text-slate-600">
                            Last contact <span className="bg-slate-200/80 px-1.5 py-0.5 rounded-md text-slate-700">{formatDisplayDate(lead.lastContactAt)}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer: Source & Score */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100/80 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-full border border-slate-200/50">
                          Source <span className="bg-slate-200/80 px-2 py-0.5 rounded-md text-slate-800">{lead.source || "Direct"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                          Progress 
                          <span className={`px-2 py-0.5 rounded-md text-white font-extrabold ${progress > 70 ? 'bg-blue-600' : progress > 40 ? 'bg-amber-500' : 'bg-slate-400'}`}>
                            {progress}%
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-20 border-2 border-dashed border-slate-200 rounded-xl">
                  <span className="text-[10px] font-semibold text-slate-400">
                    Drop here
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
