"use client";

import React, { useState, useMemo } from "react";
import { Search, Phone, User, PhoneCall, Check, X } from "lucide-react";
import { useVoice } from "../context/VoiceProvider";
import { VOICE_STATES } from "../utils/twilioEvents";
import { useTelecallerLeads } from "../../hooks/useMyLeads";

export default function QuickDialCard() {
  const voiceCtx = useVoice();
  const voiceState = voiceCtx?.voiceState || "IDLE";
  const { selectedLead, setSelectedLead } = voiceCtx;

  const [mode, setMode] = useState("search"); // "search" | "manual"
  const [searchQuery, setSearchQuery] = useState(selectedLead?.name || "");
  const [manualPhone, setManualPhone] = useState("");

  const { data: leadsData } = useTelecallerLeads({}, 0, 200);
  const allLeads = leadsData?.leads || [];

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return allLeads
      .filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.mobileNo?.includes(q) ||
        String(l.enquiryNo || "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [allLeads, searchQuery]);

  const isBusy =
    voiceState === VOICE_STATES.CONNECTING ||
    voiceState === VOICE_STATES.CONNECTED ||
    voiceState === VOICE_STATES.RINGING;

  const isReady = voiceState === VOICE_STATES.READY;

  const handleSelectLead = (lead) => {
    setSelectedLead({
      ...lead,
      phone: lead.mobileNo || lead.phone
    });
    setSearchQuery(lead.name || "");
  };

  const handleCall = () => {
    if (!isReady) {
      alert("Twilio Device is not ready yet. Please check your token or connection status.");
      return;
    }

    if (mode === "search" && selectedLead) {
      voiceCtx?.startCall(selectedLead.enquiryNo || selectedLead.id, selectedLead.phone);
    } else if (mode === "search" && !selectedLead && manualPhone.trim().length >= 10) {
      voiceCtx?.startCall(null, manualPhone.trim());
    } else if (mode === "manual" && manualPhone.trim().length >= 10) {
      voiceCtx?.startCall(null, manualPhone.trim());
    } else {
      alert("Please select a lead or enter a valid 10-digit phone number.");
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col h-[560px] overflow-hidden font-outfit">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-sm font-extrabold text-slate-900 mb-3">Quick Outbound Dial</h2>
        
        {/* Segmented Controls */}
        <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => { setMode("search"); setSelectedLead(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "search"
                ? "bg-white text-blue-700 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Search Contact
          </button>
          <button
            onClick={() => { setMode("manual"); setSelectedLead(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "manual"
                ? "bg-white text-blue-700 shadow-2xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Direct Number
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        {/* Search Mode */}
        {mode === "search" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Directory</label>
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedLead(null);
                  }}
                  placeholder="Type name, phone or enquiry ID..."
                  className="w-full text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium shadow-2xs"
                />
              </div>
            </div>

            {/* Autocomplete dropdown */}
            {searchQuery.length > 1 && !selectedLead && searchResults.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-lg max-h-[160px] overflow-y-auto -mt-2 custom-scrollbar">
                {searchResults.map((lead) => (
                  <button
                    key={lead.enquiryNo}
                    onClick={() => handleSelectLead(lead)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-blue-50/50 transition-colors text-left border-b border-slate-100 last:border-0 cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                      {(lead.name || "?")[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate">{lead.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{lead.mobileNo || lead.phone}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Lead Preview */}
            {selectedLead && (
              <div className="flex items-center justify-between gap-3 p-3.5 bg-blue-50/70 rounded-xl border border-blue-200/80 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    {(selectedLead.name || "?")[0]}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">{selectedLead.name}</span>
                    <span className="text-[11px] text-blue-700 font-mono font-semibold">{selectedLead.phone}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">or dial phone</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Direct Phone Number input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Direct Phone</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={15}
                  className="w-full text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-bold shadow-2xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Manual Mode */}
        {mode === "manual" && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Direct Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={15}
                  className="w-full text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-bold shadow-2xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Call Button with #00C853 */}
      <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex-shrink-0">
        <button
          onClick={handleCall}
          disabled={isBusy}
          className={`w-full flex items-center justify-center gap-2 font-bold text-xs py-3 rounded-xl transition-all border shadow-xs active:scale-95 cursor-pointer ${
            isBusy 
              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" 
              : "bg-white border-slate-200 hover:bg-slate-50 text-[#00C853]"
          }`}
        >
          <PhoneCall size={14} />
          <span>{isBusy ? "Call in Progress..." : "Start Outbound Call"}</span>
        </button>
      </div>
    </div>
  );
}
