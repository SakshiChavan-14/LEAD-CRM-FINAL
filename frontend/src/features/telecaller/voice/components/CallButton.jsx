"use client";

import React, { useState } from "react";
import { PhoneCall } from "lucide-react";
import Button from "@/components/ui/Button";
import CallDialog from "./CallDialog";
import { useVoice } from "../context/VoiceProvider";
import { VOICE_STATES } from "../utils/twilioEvents";

export default function CallButton({ enquiryNo, phone, name, variant = "primary", className, iconOnly = false, label = "Call", iconSize = 14 }) {
  const { voiceState, startCall, setErrorMsg } = useVoice();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isBusy = voiceState === VOICE_STATES.CONNECTING || voiceState === VOICE_STATES.CONNECTED || voiceState === VOICE_STATES.RINGING;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBusy) {
      setErrorMsg("Finish current call first.");
      return;
    }

    if (voiceState !== VOICE_STATES.READY) {
      setErrorMsg("Device is not ready. Please check permissions or network.");
      return;
    }

    setIsDialogOpen(true);
  };

  const handleConfirmCall = () => {
    setIsDialogOpen(false);
    startCall(enquiryNo, phone);
  };

  if (iconOnly) {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isBusy || voiceState !== VOICE_STATES.READY}
          className={`w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#00C853] flex items-center justify-center transition-all duration-200 shrink-0 shadow-xs hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
          title={`Call ${name || phone}`}
          aria-label={`Call ${name || phone}`}
        >
          <PhoneCall size={iconSize} />
        </button>
        {isDialogOpen && (
          <CallDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirmCall}
            name={name}
            phone={phone}
          />
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isBusy || voiceState !== VOICE_STATES.READY}
        className={`inline-flex items-center justify-center gap-1.5 font-bold rounded-xl shadow-xs px-4 py-2 text-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          variant === "primary" 
            ? "bg-[#00C853] hover:bg-[#00b048] text-white shadow-emerald-500/20" 
            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
        } ${className}`}
      >
        <PhoneCall size={iconSize} />
        <span>{label}</span>
      </button>

      {isDialogOpen && (
        <CallDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleConfirmCall}
          name={name}
          phone={phone}
        />
      )}
    </>
  );
}
