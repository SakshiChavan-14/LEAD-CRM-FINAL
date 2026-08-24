"use client";

import React from "react";
import { PhoneCall } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useVoice } from "../context/VoiceProvider";
import { VOICE_STATES } from "../utils/twilioEvents";

export default function CallButton({ enquiryNo, phone, name, variant = "primary", className, iconOnly = false, label = "Call", iconSize = 14 }) {
  const { voiceState, setErrorMsg } = useVoice();
  const router = useRouter();
  const pathname = usePathname();

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

    // Navigate to the dedicated Calling Page instead of inline calling
    const returnTo = encodeURIComponent(pathname || "/telecaller");
    if (enquiryNo) {
      router.push(`/telecaller/calling/${enquiryNo}?returnTo=${returnTo}`);
    } else if (phone) {
      router.push(`/telecaller/calling/manual?phone=${encodeURIComponent(phone)}&returnTo=${returnTo}`);
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        disabled={isBusy || voiceState !== VOICE_STATES.READY}
        className={`w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#00C853] flex items-center justify-center transition-all duration-200 shrink-0 shadow-xs hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
        title={`Call ${name || phone}`}
        aria-label={`Call ${name || phone}`}
      >
        <PhoneCall size={iconSize} />
      </button>
    );
  }

  return (
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
  );
}
