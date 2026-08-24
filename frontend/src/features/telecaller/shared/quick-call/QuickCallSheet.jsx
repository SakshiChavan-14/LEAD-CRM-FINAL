"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, Phone, PhoneCall, MicOff, Mic, Pause, PhoneOff, Loader2 } from "lucide-react";
import { useVoice } from "../../voice/context/VoiceProvider";
import { VOICE_STATES } from "../../voice/utils/twilioEvents";
import QuickCallLeadSearch from "./QuickCallLeadSearch";
import QuickCallKeypad from "./QuickCallKeypad";

export default function QuickCallSheet({ onClose, isCallsPage }) {
  const router = useRouter();
  const pathname = usePathname();
  const voiceCtx = useVoice();
  const voiceState = voiceCtx?.voiceState || "IDLE";
  
  const [activeTab, setActiveTab] = useState("search"); // search | dial
  const [manualPhone, setManualPhone] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

  const isActive =
    voiceState === VOICE_STATES.CONNECTING ||
    voiceState === VOICE_STATES.RINGING ||
    voiceState === VOICE_STATES.CONNECTED;

  const isConnected = voiceState === VOICE_STATES.CONNECTED;

  const handleCall = () => {
    if (manualPhone.trim().length >= 10) {
      const returnTo = encodeURIComponent(pathname || "/telecaller");
      onClose?.();
      router.push(`/telecaller/calling/manual?phone=${encodeURIComponent(manualPhone.trim())}&returnTo=${returnTo}`);
    } else {
      alert("Please enter a valid 10-digit phone number.");
    }
  };

  const handleSelectLead = (lead) => {
    const returnTo = encodeURIComponent(pathname || "/telecaller");
    onClose?.();
    router.push(`/telecaller/calling/${lead.enquiryNo || lead.id}?returnTo=${returnTo}`);
  };

  const handleEndCall = () => {
    voiceCtx?.endCall();
    setIsMuted(false);
    setShowKeypad(false);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    voiceCtx?.muteCall(next);
  };

  const handleDigit = (digit) => {
    if (isConnected) {
      voiceCtx?.sendDigits(digit);
    } else {
      setManualPhone((prev) => prev + digit);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl border border-slate-200/90 w-full sm:w-[380px] flex flex-col overflow-hidden pointer-events-auto transition-all font-outfit"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900 leading-none">Quick Voice Actions</h2>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Instant browser telephony</p>
        </div>
        <button 
          onClick={onClose}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors focus:outline-none cursor-pointer"
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>

      {isCallsPage && !isActive ? (
        <div className="p-6 flex flex-col items-center bg-slate-50/50">
          <Phone className="text-slate-400 mb-3" size={28} />
          <p className="text-xs text-slate-500 text-center font-medium">
            Use the Quick Dial workspace on this page.
          </p>
        </div>
      ) : isActive ? (
        <div className="p-5 flex flex-col items-center bg-slate-50/50">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#00C853] flex items-center justify-center mb-3 relative shadow-2xs border border-emerald-200">
            <PhoneCall size={22} className="animate-bounce" />
            {voiceState === VOICE_STATES.CONNECTING && (
              <Loader2 className="absolute inset-0 w-full h-full text-[#00C853] animate-spin opacity-50" />
            )}
          </div>
          
          <div className="text-sm font-extrabold text-slate-900 mb-0.5">
            {voiceState === VOICE_STATES.CONNECTING && "Connecting Call..."}
            {voiceState === VOICE_STATES.RINGING && "Ringing..."}
            {voiceState === VOICE_STATES.CONNECTED && "Connected"}
          </div>
          
          <div className="text-xs text-slate-500 font-mono mb-4">
            {voiceCtx?.activeCall?.number || "Direct Lead Call"}
          </div>
          
          <div className="text-2xl font-mono font-extrabold text-slate-900 tracking-wider mb-6">
            {voiceCtx?.formattedTime || "00:00"}
          </div>

          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              onClick={handleToggleMute}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isMuted
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
              <span>{isMuted ? "Unmute" : "Mute"}</span>
            </button>
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showKeypad
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>Keypad</span>
            </button>
            <button
              onClick={handleEndCall}
              className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <PhoneOff size={15} />
              <span>End Call</span>
            </button>
          </div>
          
          {showKeypad && isConnected && (
             <div className="mt-4 w-full pt-4 border-t border-slate-200/80">
               <QuickCallKeypad onDigit={handleDigit} />
             </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {/* Segmented Control Tabs */}
          <div className="p-4 border-b border-slate-100 bg-white pb-3">
             <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "search"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Search Lead
              </button>
              <button
                onClick={() => setActiveTab("dial")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "dial"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Enter Number
              </button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto max-h-[380px] [scrollbar-width:none] bg-white">
            {activeTab === "search" ? (
              <QuickCallLeadSearch onSelectLead={handleSelectLead} />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="relative flex items-center bg-slate-50/70 border border-slate-200/80 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                  <div className="pl-3.5 pr-1.5 text-slate-400 font-mono text-sm font-semibold">+91</div>
                  <input
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCall();
                    }}
                    placeholder="Enter phone number"
                    maxLength={10}
                    className="w-full text-base font-mono bg-transparent py-3 text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <QuickCallKeypad onDigit={handleDigit} />
                <button
                  onClick={handleCall}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-[#00C853] hover:bg-[#00b048] text-white shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer mt-1"
                >
                  <PhoneCall size={15} />
                  <span>Call Now</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
