"use client";

import React from "react";
import { 
  Globe, 
  Calendar, 
  Clock, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Pencil, 
  Trash2 
} from "lucide-react";
import { formatDisplayDate } from "@/utils/dateUtils";
import { useLeadCalls } from "@/features/telecaller/hooks/useLeadCalls";

export default function LeadHeaderCard({ viewModel, rawData, actions, onDelete, onEdit }) {
  if (!viewModel) return null;

  const leadName = viewModel.header?.name || rawData?.student?.name || rawData?.studentName || rawData?.name || "Student";
  const enquiryNo = rawData?.lead?.enquiryNo || rawData?.enquiryNo || rawData?.id || "N/A";
  const qualificationStatus = (viewModel.status?.currentStatus || rawData?.lead?.status || rawData?.status || "N/A").toUpperCase();
  const course = viewModel.header?.course || rawData?.education?.course || rawData?.course || rawData?.education?.programme || rawData?.programme || "N/A";
  const email = viewModel.contact?.email || rawData?.student?.email || rawData?.email || "N/A";
  const phone = viewModel.contact?.mobile || rawData?.student?.mobile || rawData?.mobileNo || rawData?.mobile || "N/A";
  const locationStr = viewModel.contact?.locationStr 
    || [rawData?.location?.city, rawData?.location?.district, rawData?.location?.state].filter(Boolean).join(", ")
    || [rawData?.city, rawData?.district, rawData?.state].filter(Boolean).join(", ")
    || rawData?.location || rawData?.address || "N/A";
  const source = viewModel.lead?.source || rawData?.lead?.source || rawData?.source || "N/A";
  
  // Safe resolved dates and assignment
  const rawCreated = rawData?.createdAt || rawData?.lead?.createdAt || rawData?.leadCreationDate;
  const createdAt = rawCreated ? formatDisplayDate(rawCreated) : "N/A";
  
  const rawLastContact = rawData?.lastContactAt || rawData?.lead?.lastContactAt || rawData?.lastInteractionAt || rawData?.updatedAt;
  const cleanEnquiryNo = enquiryNo && enquiryNo !== "N/A" ? String(enquiryNo).replace(/[^\d]/g, "") : null;
  const { data: callsData } = useLeadCalls(cleanEnquiryNo);
  const calls = Array.isArray(callsData) ? callsData : [];
  
  console.log("[LeadHeaderCard] enquiryNo:", enquiryNo, "| cleanEnquiryNo:", cleanEnquiryNo, "| calls fetched:", calls.length);
  
  const latestCall = [...calls].sort((a, b) => new Date(b.callDateTime || b.createdAt || b.date || 0) - new Date(a.callDateTime || a.createdAt || a.date || 0))[0];
  const lastContactAt = latestCall 
    ? formatDisplayDate(latestCall.callDateTime || latestCall.createdAt || latestCall.date) 
    : (rawLastContact ? formatDisplayDate(rawLastContact) : "N/A");
  
  const rawAssigned = viewModel.assignment?.telecaller || rawData?.lead?.assignedTo?.name || rawData?.assignedTo?.name || rawData?.callerName || rawData?.telecallerName || viewModel.assignment?.assignee;
  const assignedTo = (!rawAssigned || rawAssigned.toLowerCase() === "unassigned") ? "Unassigned" : rawAssigned;

  // Initials
  const initials = leadName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "RS";

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "ADMITTED":
      case "CONVERTED":
        return "bg-purple-50 text-purple-700 border-purple-200/80";
      case "INTERESTED":
      case "QUALIFIED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      case "CONTACTED":
        return "bg-blue-50 text-blue-700 border-blue-200/80";
      case "HOT":
        return "bg-rose-50 text-rose-700 border-rose-200/80";
      case "COLD":
      case "LOST":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200/80";
    }
  };

  return (
    <section className="bg-white rounded-[24px] border border-slate-200/80 p-6 md:p-8 shadow-sm font-outfit transition-all hover:shadow-md hover:border-slate-300">
      {/* Top Profile Hero Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Left Side: Avatar (Circular, No Star) + Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Circular Avatar without star */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 md:w-22 md:h-22 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center text-2xl font-black shadow-md border-4 border-white">
              {initials}
            </div>
          </div>

          {/* Student Info */}
          <div className="flex flex-col text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {leadName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200/80">
                LEAD ID: #{enquiryNo}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-2xs ${getStatusBadge(qualificationStatus)}`}>
                {qualificationStatus}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-600">{course}</p>

            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 pt-1 text-xs text-slate-600 font-medium">
              {email && (
                <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                  <Mail size={14} className="text-slate-400" />
                  <span>{email}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                  <Phone size={14} className="text-slate-400" />
                  <span className="font-mono font-bold">{phone}</span>
                </div>
              )}
              {locationStr && (
                <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{locationStr}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons (Call, Follow-up, Edit, Delete) */}
        {(actions || onDelete || onEdit) && (
          <div className="flex flex-wrap items-center justify-center sm:justify-start lg:justify-end gap-3 shrink-0">
            {actions}

            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/90 text-slate-700 hover:text-blue-600 hover:border-blue-200 text-xs font-bold rounded-xl shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer h-10"
              >
                <Pencil size={14} />
                <span>Edit Lead</span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl shadow-2xs active:scale-95 transition-all cursor-pointer h-10"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Metadata Info Row */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap gap-x-8 gap-y-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Globe size={14} className="text-slate-400" />
          <span>Source: <strong className="text-slate-800 font-extrabold">{source}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <UserCheck size={14} className="text-slate-400" />
          <span>Assigned to: <strong className="text-slate-800 font-extrabold">{assignedTo}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-slate-400" />
          <span>Created on: <strong className="text-slate-800 font-extrabold">{createdAt}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-slate-400" />
          <span>Last Contact: <strong className="text-slate-800 font-extrabold">{lastContactAt}</strong></span>
        </div>
      </div>
    </section>
  );
}
