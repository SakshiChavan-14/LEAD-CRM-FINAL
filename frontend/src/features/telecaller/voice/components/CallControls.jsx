"use client";

import React, { useState } from "react";
import { Mic, MicOff, Pause, Grid3X3, PhoneOff } from "lucide-react";
import { useVoice } from "../context/VoiceProvider";
import { VOICE_STATES } from "../utils/twilioEvents";

const DTMF_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

export default function CallControls() {
  const voiceCtx = useVoice();
  const voiceState = voiceCtx?.voiceState || "IDLE";
  const [isMuted, setIsMuted] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

  const isConnected = voiceState === VOICE_STATES.CONNECTED;
  const isActive =
    voiceState === VOICE_STATES.CONNECTING ||
    voiceState === VOICE_STATES.RINGING ||
    voiceState === VOICE_STATES.CONNECTED;

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    voiceCtx?.muteCall(next);
  };

  const handleEndCall = () => {
    voiceCtx?.endCall();
    setIsMuted(false);
    setShowKeypad(false);
  };

  const handleSendDigit = (digit) => {
    voiceCtx?.sendDigits(digit);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full font-outfit">
      {/* DTMF Keypad */}
      {showKeypad && isConnected && (
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-1 w-full">
          {DTMF_KEYS.flat().map((key) => (
            <button
              key={key}
              onClick={() => handleSendDigit(key)}
              className="h-10 rounded-xl bg-white border border-slate-200/80 text-slate-900 font-bold text-sm hover:bg-slate-100 active:bg-slate-200 transition-all shadow-2xs cursor-pointer"
            >
              {key}
            </button>
          ))}
        </div>
      )}

      {/* Button Row: Mute | Hold | Keypad | End Call */}
      <div className="grid grid-cols-4 gap-2 w-full">
        <button
          onClick={handleToggleMute}
          disabled={!isActive}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
            isMuted
              ? "bg-amber-50 border-amber-200 text-amber-700"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          } disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs`}
        >
          {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
          <span>Mute</span>
        </button>

        <button
          disabled={!isActive}
          className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <Pause size={14} />
          <span>Hold</span>
        </button>

        <button
          onClick={() => setShowKeypad(!showKeypad)}
          disabled={!isActive}
          className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
            showKeypad
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          } disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs`}
        >
          <Grid3X3 size={14} />
          <span>Keypad</span>
        </button>

        <button
          onClick={handleEndCall}
          disabled={!isActive}
          className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95"
        >
          <PhoneOff size={14} />
          <span>End</span>
        </button>
      </div>
    </div>
  );
}
