import React, { useState, useMemo } from "react";
import { Search, Phone } from "lucide-react";
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
      phone: lead.mobileNo
    });
    setSearchQuery(lead.name || "");
  };

  const handleCall = () => {
    if (!isReady) {
      alert("Twilio Device is not ready yet. Please check your token or connection status.");
      return;
    }

    if (mode === "search" && selectedLead) {
      voiceCtx?.startCall(selectedLead.enquiryNo, selectedLead.phone);
    } else if (mode === "search" && !selectedLead && manualPhone.trim().length >= 10) {
      voiceCtx?.startCall(null, manualPhone.trim());
    } else if (mode === "manual" && manualPhone.trim().length >= 10) {
      voiceCtx?.startCall(null, manualPhone.trim());
    } else {
      alert("Please select a lead or enter a valid 10-digit phone number.");
    }
  };

  return (
    <div className="bg-white border border-[#ECECEC] rounded-[16px] shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#ECECEC] flex-shrink-0">
        <h2 className="text-[15px] font-[700] text-gray-900 mb-4">Quick Dial</h2>
        
        {/* Segmented Controls */}
        <div className="flex bg-gray-100/50 p-1 rounded-xl border border-[#ECECEC]">
          <button
            onClick={() => { setMode("search"); setSelectedLead(null); }}
            className={`flex-1 py-2 text-[13px] font-[600] rounded-lg transition-all ${
              mode === "search"
                ? "bg-white text-gray-900 shadow-sm border border-[#ECECEC]"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border border-transparent"
            }`}
          >
            Search Lead
          </button>
          <button
            onClick={() => { setMode("manual"); setSelectedLead(null); }}
            className={`flex-1 py-2 text-[13px] font-[600] rounded-lg transition-all ${
              mode === "manual"
                ? "bg-white text-gray-900 shadow-sm border border-[#ECECEC]"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border border-transparent"
            }`}
          >
            Enter Number
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
        {/* Search Mode */}
        {mode === "search" && (
          <div className="flex flex-col gap-5">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedLead(null);
                }}
                placeholder="Search by name, phone or enquiry no..."
                className="w-full text-[13px] bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/15 focus:border-[#7A1F2B]/30 transition-all"
              />
            </div>

            {/* Autocomplete */}
            {searchQuery.length > 1 && !selectedLead && searchResults.length > 0 && (
              <div className="bg-white border border-[#ECECEC] rounded-xl shadow-lg max-h-[160px] overflow-y-auto -mt-3">
                {searchResults.map((lead) => (
                  <button
                    key={lead.enquiryNo}
                    onClick={() => handleSelectLead(lead)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-[#F5F5F5] last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#7A1F2B] text-white flex items-center justify-center text-xs font-[700] shrink-0">
                      {(lead.name || "?")[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-[600] text-gray-900 truncate">{lead.name}</span>
                      <span className="text-[11px] text-gray-500">{lead.mobileNo}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#ECECEC]" />
              <span className="text-[11px] text-gray-400 font-[500] uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#ECECEC]" />
            </div>

            {/* Phone Number input always visible in search mode too */}
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                placeholder="Enter phone number"
                maxLength={15}
                className="w-full text-[13px] bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/15 focus:border-[#7A1F2B]/30 transition-all font-mono"
              />
            </div>

            {/* Selected Lead Preview */}
            {selectedLead && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-[#ECECEC]">
                <div className="w-10 h-10 rounded-full bg-[#7A1F2B] text-white flex items-center justify-center font-[700] text-sm shrink-0">
                  {(selectedLead.name || "?")[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-[600] text-gray-900 truncate">{selectedLead.name}</span>
                  <span className="text-[12px] text-gray-500 font-mono">{selectedLead.phone}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manual Mode */}
        {mode === "manual" && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                placeholder="Enter phone number"
                maxLength={15}
                className="w-full text-[13px] bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/15 focus:border-[#7A1F2B]/30 transition-all font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-[#ECECEC] flex-shrink-0">
        <button
          onClick={handleCall}
          disabled={isBusy}
          className={`w-full flex items-center justify-center gap-2 font-[600] text-[13px] py-3 rounded-xl transition-all shadow-sm ${
            isBusy 
              ? "bg-gray-400 text-white cursor-not-allowed" 
              : "bg-[#7A1F2B] hover:bg-[#6a1b26] text-white"
          }`}
        >
          <Phone size={16} />
          {isBusy ? "Call in Progress..." : "Call Lead"}
        </button>
      </div>
    </div>
  );
}
