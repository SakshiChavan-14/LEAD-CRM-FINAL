"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, Grid3X3, PhoneOff, Volume2 } from "lucide-react";
import { Phone as PhoneIcon } from "lucide-react";
import { VOICE_STATES } from "@/features/telecaller/voice/utils/twilioEvents";
import WaveformVisual from "./WaveformVisual";
import DTMFKeypad from "./DTMFKeypad";

export default function ActiveCallPanel({
  leadData,
  voiceState,
  formattedTime,
  isMuted,
  onMuteToggle,
  onEndCall,
  onSendDigits,
}) {
  const [showKeypad, setShowKeypad] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isActive =
    voiceState === VOICE_STATES.CONNECTING ||
    voiceState === VOICE_STATES.RINGING ||
    voiceState === VOICE_STATES.CONNECTED;

  const isConnected = voiceState === VOICE_STATES.CONNECTED;

  const getStateLabel = () => {
    switch (voiceState) {
      case VOICE_STATES.CONNECTING: return "Connecting...";
      case VOICE_STATES.RINGING: return "Ringing...";
      case VOICE_STATES.CONNECTED: return "Connected";
      case VOICE_STATES.READY:
      case VOICE_STATES.DISCONNECTED: return "Call Ended";
      case VOICE_STATES.FAILED: return "Failed";
      default: return "Initializing...";
    }
  };

  const getStateLabelClass = () => {
    switch (voiceState) {
      case VOICE_STATES.CONNECTED: return "call-state-label--connected";
      case VOICE_STATES.CONNECTING: return "call-state-label--connecting";
      case VOICE_STATES.RINGING: return "call-state-label--ringing";
      case VOICE_STATES.FAILED: return "call-state-label--failed";
      default: return "call-state-label--ended";
    }
  };

  const getInitials = (name) => {
    if (!name || name === "Unknown Contact") return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleDigit = (digit) => {
    onSendDigits(digit);
  };

  return (
    <div className="active-call-panel">
      {/* Top row: time + signal indicator */}
      <div className="active-call-panel__header">
        <span>{currentTime}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.5, fontSize: 13 }}>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Center: waveform, state, avatar, lead info */}
      <div className="active-call-panel__body">
        <WaveformVisual isActive={isConnected} />

        <div className={`call-state-label ${getStateLabelClass()}`}>
          {getStateLabel()}
        </div>
        <div className="call-timer-display">{formattedTime}</div>

        <div className="lead-avatar">
          <span className="lead-avatar__initials">
            {getInitials(leadData?.name)}
          </span>
        </div>

        <div className="lead-name">{leadData?.name || "Unknown Contact"}</div>

        <div className="lead-phone">
          <PhoneIcon size={14} />
          <span>{leadData?.phone || "—"}</span>
        </div>

        {leadData?.enquiryNo && (
          <div className="lead-enquiry">
            Enquiry ID: #ENQ-{leadData.enquiryNo}
          </div>
        )}
      </div>

      {/* Bottom: 4 controls */}
      <div className="active-call-panel__footer">
        {/* Mute */}
        <button
          className="call-control-btn"
          onClick={() => onMuteToggle(!isMuted)}
          disabled={!isActive}
          type="button"
        >
          <div className={`call-control-btn__icon ${isMuted ? "call-control-btn__icon--active" : ""}`}>
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </div>
          <span className="call-control-btn__label">Mute</span>
        </button>

        {/* Keypad */}
        <button
          className="call-control-btn"
          onClick={() => setShowKeypad(!showKeypad)}
          disabled={!isConnected}
          type="button"
        >
          <div className={`call-control-btn__icon ${showKeypad ? "call-control-btn__icon--active" : ""}`}>
            <Grid3X3 size={22} />
          </div>
          <span className="call-control-btn__label">Keypad</span>
        </button>

        {/* End Call */}
        <button
          className="call-control-btn"
          onClick={onEndCall}
          disabled={!isActive}
          type="button"
        >
          <div className="call-control-btn__icon call-control-btn__icon--end">
            <PhoneOff size={22} />
          </div>
          <span className="call-control-btn__label" style={{ color: "#EF4444" }}>&nbsp;</span>
        </button>

        {/* Speaker (visual toggle) */}
        <button
          className="call-control-btn"
          onClick={() => setSpeakerOn(!speakerOn)}
          disabled={!isActive}
          type="button"
        >
          <div className={`call-control-btn__icon ${speakerOn ? "call-control-btn__icon--active" : ""}`}>
            <Volume2 size={22} />
          </div>
          <span className="call-control-btn__label">Speaker</span>
        </button>
      </div>

      {/* DTMF Keypad overlay */}
      {showKeypad && isConnected && (
        <DTMFKeypad
          onDigit={handleDigit}
          onClose={() => setShowKeypad(false)}
        />
      )}
    </div>
  );
}
