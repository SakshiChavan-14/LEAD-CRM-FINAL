"use client";

import React from "react";
import { Phone, PhoneCall, StickyNote, Loader2, Signal } from "lucide-react";
import { useVoice } from "../context/VoiceProvider";
import { VOICE_STATES } from "../utils/twilioEvents";
import CallControls from "./CallControls";

export default function ActiveCallCard({ callNotes, setCallNotes }) {
  const voiceCtx = useVoice();
  const voiceState = voiceCtx?.voiceState || "IDLE";
  const formattedTime = voiceCtx?.formattedTime || "00:00";
  const selectedLead = voiceCtx?.selectedLead;

  const isActive =
    voiceState === VOICE_STATES.CONNECTING ||
    voiceState === VOICE_STATES.RINGING ||
    voiceState === VOICE_STATES.CONNECTED;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col h-[560px] overflow-hidden font-outfit">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">Active Call Session</h2>
        </div>
        {!isActive ? (
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60 shadow-2xs">
            Standby Mode
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#00C853] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
            {voiceState === VOICE_STATES.CONNECTING && <><Loader2 size={11} className="animate-spin text-[#00C853]" /> Connecting...</>}
            {voiceState === VOICE_STATES.RINGING && "Ringing..."}
            {voiceState === VOICE_STATES.CONNECTED && <><Signal size={12} className="animate-pulse" /> Live Call</>}
          </span>
        )}
      </div>

      {/* Center Dial Monitor */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40">
        {!isActive ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3.5 border border-slate-200/80 shadow-xs">
              <PhoneCall className="text-[#00C853]" size={26} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-1">No Active Call</h3>
            <p className="text-xs text-slate-500 font-medium max-w-[260px] leading-relaxed">
              Select a contact from <strong className="text-slate-700">Priority Queue</strong> or dial a number to initiate a call.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {selectedLead && (
              <div className="mb-3 flex flex-col items-center">
                <span className="text-base font-extrabold text-slate-900">{selectedLead.name || "Student"}</span>
                <span className="text-xs font-mono text-slate-500 font-bold">{selectedLead.phone || selectedLead.mobileNo}</span>
              </div>
            )}
            <div className="px-6 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs mb-2">
              <span className="font-mono text-3xl font-extrabold text-slate-900 tracking-widest">
                {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#00C853]">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-ping" />
              <span>Voice Channel Encrypted</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls & Quick Notes */}
      <div className="p-5 bg-white border-t border-slate-100 flex-shrink-0 space-y-3.5">
        {/* Notes — while connected */}
        {voiceState === VOICE_STATES.CONNECTED && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <StickyNote size={12} className="text-slate-400" />
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Quick Call Notes</span>
            </div>
            <textarea
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="Type instant notes during call..."
              rows={2}
              className="w-full text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all font-medium"
            />
          </div>
        )}

        {/* Bottom Controls */}
        <CallControls />
      </div>
    </div>
  );
}
