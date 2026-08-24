"use client";

import React from "react";
import { ArrowLeft, PhoneOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { VOICE_STATES } from "@/features/telecaller/voice/utils/twilioEvents";

export default function CallingHeader({ voiceState, formattedTime, onEndCall }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive =
    voiceState === VOICE_STATES.CONNECTING ||
    voiceState === VOICE_STATES.RINGING ||
    voiceState === VOICE_STATES.CONNECTED;

  const getStatusLabel = () => {
    switch (voiceState) {
      case VOICE_STATES.CONNECTING: return "Initializing";
      case VOICE_STATES.RINGING: return "Ringing";
      case VOICE_STATES.CONNECTED: return "Connected";
      case VOICE_STATES.READY: return "Call Ended";
      case VOICE_STATES.DISCONNECTED: return "Call Ended";
      case VOICE_STATES.FAILED: return "Failed";
      default: return "Initializing";
    }
  };

  const getStatusDotClass = () => {
    switch (voiceState) {
      case VOICE_STATES.CONNECTED: return "calling-header__status-dot--connected";
      case VOICE_STATES.CONNECTING: return "calling-header__status-dot--connecting";
      case VOICE_STATES.RINGING: return "calling-header__status-dot--ringing";
      case VOICE_STATES.FAILED: return "calling-header__status-dot--failed";
      default: return "calling-header__status-dot--ended";
    }
  };

  const getStatusColor = () => {
    switch (voiceState) {
      case VOICE_STATES.CONNECTED: return "#22C55E";
      case VOICE_STATES.CONNECTING: return "#F59E0B";
      case VOICE_STATES.RINGING: return "#3B82F6";
      case VOICE_STATES.FAILED: return "#EF4444";
      default: return "#94A3B8";
    }
  };

  const handleBack = () => {
    const returnTo = searchParams.get("returnTo") || "/telecaller";
    router.push(returnTo);
  };

  return (
    <div className="calling-header">
      <button className="calling-header__back" onClick={handleBack} type="button">
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <div className="calling-header__center">
        <span className="calling-header__title">Active Call</span>
        <div className="calling-header__status">
          <span className={`calling-header__status-dot ${getStatusDotClass()}`} />
          <span style={{ color: getStatusColor() }}>{getStatusLabel()}</span>
        </div>
      </div>

      <div className="calling-header__right">
        {(isActive || formattedTime !== "00:00") && (
          <span className="calling-header__timer">{formattedTime}</span>
        )}
        <button
          className="calling-header__end-call"
          onClick={onEndCall}
          disabled={!isActive}
          type="button"
        >
          <PhoneOff size={16} />
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
}
