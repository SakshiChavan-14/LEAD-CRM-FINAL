import React, { useState, useEffect } from "react";
import { X, Phone, MicOff, Mic, Pause, PhoneOff, Loader2 } from "lucide-react";
import { useVoice } from "../../voice/context/VoiceProvider";
import { VOICE_STATES } from "../../voice/utils/twilioEvents";
import QuickCallLeadSearch from "./QuickCallLeadSearch";
import QuickCallKeypad from "./QuickCallKeypad";

export default function QuickCallSheet({ onClose, isCallsPage }) {
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
      voiceCtx?.startCall(null, manualPhone.trim());
    } else {
      alert("Please enter a valid 10-digit phone number.");
    }
  };

  const handleSelectLead = (lead) => {
    voiceCtx?.startCall(lead.enquiryNo, lead.mobileNo);
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
      className="bg-white sm:rounded-[20px] rounded-t-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-[#ECECEC] w-full sm:w-[380px] flex flex-col overflow-hidden pointer-events-auto transition-all"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="p-5 border-b border-[#ECECEC] flex items-center justify-between bg-white flex-shrink-0">
        <div>
          <h2 className="text-[16px] font-[700] text-gray-900">Quick Actions</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">Call a lead instantly</p>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B1023]/30"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {isCallsPage && !isActive ? (
        <div className="p-8 flex flex-col items-center bg-gray-50/50">
          <Phone className="text-gray-400 mb-4" size={32} />
          <p className="text-[14px] text-gray-500 text-center font-[500]">
            Use the Quick Dial workspace on this page.
          </p>
        </div>
      ) : isActive ? (
        <div className="p-6 flex flex-col items-center bg-gray-50/50">
          <div className="w-16 h-16 rounded-full bg-[#8B1023]/10 flex items-center justify-center mb-4 relative shadow-sm border border-[#8B1023]/10">
            <Phone className="text-[#8B1023]" size={24} />
            {voiceState === VOICE_STATES.CONNECTING && (
              <Loader2 className="absolute inset-0 w-full h-full text-[#8B1023] animate-spin opacity-50" />
            )}
          </div>
          
          <div className="text-[16px] font-[600] text-gray-900 mb-1">
            {voiceState === VOICE_STATES.CONNECTING && "Connecting..."}
            {voiceState === VOICE_STATES.RINGING && "Ringing..."}
            {voiceState === VOICE_STATES.CONNECTED && "Connected"}
          </div>
          
          <div className="text-[14px] text-gray-500 font-mono mb-6">
            {voiceCtx?.activeCall?.number || "Unknown Number"}
          </div>
          
          <div className="text-[28px] font-mono font-[700] text-gray-900 tracking-wider mb-8">
            {voiceCtx?.formattedTime || "00:00"}
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={handleToggleMute}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-[600] border transition-all ${
                isMuted
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              Mute
            </button>
            <button
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-[600] border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all opacity-50 cursor-not-allowed"
            >
              <Pause size={16} />
              Hold
            </button>
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className={`col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-[600] border transition-all ${
                showKeypad
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Keypad
            </button>
            <button
              onClick={handleEndCall}
              className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-[600] bg-[#8B1023] hover:bg-[#6a0c1a] text-white transition-all shadow-sm"
            >
              <PhoneOff size={16} />
              End Call
            </button>
          </div>
          
          {showKeypad && isConnected && (
             <div className="mt-6 w-full pt-6 border-t border-[#ECECEC]">
               <QuickCallKeypad onDigit={handleDigit} />
             </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col flex-1 max-h-[520px]">
          {/* Segmented Control Tabs */}
          <div className="p-5 border-b border-[#ECECEC] bg-white pb-0">
             <div className="flex bg-gray-100/50 p-1 rounded-xl border border-[#ECECEC] mb-5">
              <button
                onClick={() => setActiveTab("search")}
                className={`flex-1 py-2 text-[13px] font-[600] rounded-lg transition-all ${
                  activeTab === "search"
                    ? "bg-white text-gray-900 shadow-sm border border-[#ECECEC]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border border-transparent"
                }`}
              >
                Search Lead
              </button>
              <button
                onClick={() => setActiveTab("dial")}
                className={`flex-1 py-2 text-[13px] font-[600] rounded-lg transition-all ${
                  activeTab === "dial"
                    ? "bg-white text-gray-900 shadow-sm border border-[#ECECEC]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 border border-transparent"
                }`}
              >
                Enter Number
              </button>
            </div>
          </div>

          <div className="p-5 overflow-y-auto flex-1 bg-white">
            {activeTab === "search" ? (
              <QuickCallLeadSearch onSelectLead={handleSelectLead} />
            ) : (
              <div className="flex flex-col gap-6">
                <div className="relative flex items-center bg-gray-50 border border-[#ECECEC] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#8B1023]/20 focus-within:border-[#8B1023]/30 transition-all">
                  <div className="pl-4 pr-2 text-gray-400 font-mono text-[16px]">+91</div>
                  <input
                    type="tel"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCall();
                    }}
                    placeholder="Enter phone number"
                    maxLength={10}
                    className="w-full text-[18px] font-mono bg-transparent py-4 text-gray-900 placeholder-gray-300 focus:outline-none"
                  />
                </div>
                <QuickCallKeypad onDigit={handleDigit} />
                <button
                  onClick={handleCall}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[15px] font-[600] bg-[#8B1023] hover:bg-[#6a0c1a] text-white shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#8B1023]/30 mt-2"
                >
                  <Phone size={18} />
                  Call Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
