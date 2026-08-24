"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";
import { useLeadDetails } from "@/features/telecaller/hooks/useLeadDetails";
import { useLogInteraction } from "@/features/telecaller/hooks/useTelecallerInteractions";
import { VOICE_STATES } from "@/features/telecaller/voice/utils/twilioEvents";
import { toast } from "sonner";

import CallingHeader from "./CallingHeader";
import ActiveCallPanel from "./ActiveCallPanel";
import CallInteractionPanel from "./CallInteractionPanel";

import "../styles/calling-page.css";

export default function CallingPage({ enquiryNo, isManualCall = false, manualPhone = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/telecaller";

  // ─── Existing hooks (reused, not recreated) ────────────────────────────
  const {
    voiceState,
    formattedTime,
    elapsedSeconds,
    startCall,
    endCall,
    muteCall,
    sendDigits,
    isMuted,
    setSelectedLead,
    callContext,
    setCallContext,
    setPostCallEnquiryNo,
    setErrorMsg,
  } = useVoice();

  const { mutateAsync: logInteraction, isPending: isSaving } = useLogInteraction();

  // ─── Lead data: from URL + existing useLeadDetails (NOT VoiceProvider) ─
  const { data: leadDetailData, isLoading: leadLoading } = useLeadDetails(
    isManualCall ? null : enquiryNo
  );

  // Normalize lead data for display
  const leadData = isManualCall
    ? { name: "Unknown Contact", phone: manualPhone, enquiryNo: null }
    : leadDetailData
      ? {
          name: leadDetailData.header?.name || "Unknown",
          phone: leadDetailData.contact?.mobile || "",
          enquiryNo: enquiryNo,
        }
      : null;

  // ─── Call initiation guard ─────────────────────────────────────────────
  // Guards against: React Strict Mode, re-renders, route transitions,
  // existing active calls, browser back/forward
  const hasInitiatedCall = useRef(false);
  const [callStartTime, setCallStartTime] = useState(null);

  useEffect(() => {
    // Set calling page context flag — scoped, doesn't disable existing post-call flows
    setCallContext("CALLING_PAGE");

    return () => {
      // Only clear context when actually unmounting the Calling Page
      // This ensures dashboard/other pages can check the flag
    };
  }, [setCallContext]);

  useEffect(() => {
    // Don't initiate if already done
    if (hasInitiatedCall.current) return;

    // Don't initiate if a call is already in progress
    if (
      voiceState === VOICE_STATES.CONNECTING ||
      voiceState === VOICE_STATES.RINGING ||
      voiceState === VOICE_STATES.CONNECTED
    ) return;

    // Device must be ready
    if (voiceState !== VOICE_STATES.READY) return;

    // Need phone number
    const phone = isManualCall ? manualPhone : leadData?.phone;
    if (!phone || phone === "N/A" || phone === "—") return;

    // All guards passed — initiate call exactly once
    hasInitiatedCall.current = true;

    // Set selected lead for VoiceProvider tracking (used by existing overlay etc.)
    if (!isManualCall && leadData) {
      setSelectedLead({
        name: leadData.name,
        phone: leadData.phone,
        enquiryNo: enquiryNo,
        mobileNo: leadData.phone,
      });
    }

    const callEnquiryNo = isManualCall ? null : enquiryNo;
    startCall(callEnquiryNo, phone);
    setCallStartTime(new Date());
  }, [voiceState, isManualCall, manualPhone, leadData, enquiryNo, startCall, setSelectedLead]);

  // ─── End Call handler (separate from Save Log) ─────────────────────────
  const handleEndCall = useCallback(() => {
    endCall();
  }, [endCall]);

  // ─── Mute handler ─────────────────────────────────────────────────────
  const handleMuteToggle = useCallback(
    (shouldMute) => {
      muteCall(shouldMute);
    },
    [muteCall]
  );

  // ─── Send digits handler (real Twilio DTMF) ───────────────────────────
  const handleSendDigits = useCallback(
    (digits) => {
      sendDigits(digits);
    },
    [sendDigits]
  );

  // ─── Save Log handler (explicit user action, separate from End Call) ───
  const handleSaveLog = useCallback(
    async (payload) => {
      try {
        // Clean up payload so optional empty fields aren't sent as empty strings
        const cleanPayload = { ...payload };
        if (!cleanPayload.opinion) delete cleanPayload.opinion;
        if (!cleanPayload.nextCallDate) delete cleanPayload.nextCallDate;
        if (!cleanPayload.nextAction) delete cleanPayload.nextAction;

        // Use existing useLogInteraction — exact same API as LogCallModal
        await logInteraction(cleanPayload);

        // Clear calling page context and post-call tracking
        setPostCallEnquiryNo?.(null);
        setCallContext?.(null);

        // Navigate back to origin
        router.push(returnTo);
      } catch (err) {
        const errMsg =
          err?.response?.data?.message || err?.message || "Failed to log interaction";
        toast.error("Failed to save log", { description: errMsg });
      }
    },
    [logInteraction, setPostCallEnquiryNo, setCallContext, router, returnTo]
  );

  // ─── Cancel handler ───────────────────────────────────────────────────
  const handleCancel = useCallback(() => {
    setPostCallEnquiryNo?.(null);
    setCallContext?.(null);
    router.push(returnTo);
  }, [setPostCallEnquiryNo, setCallContext, router, returnTo]);

  // ─── Loading state ────────────────────────────────────────────────────
  if (!isManualCall && leadLoading) {
    return (
      <div className="calling-page">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <div style={{ textAlign: "center", fontFamily: "Outfit, sans-serif" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>
              Loading lead information...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calling-page">
      <CallingHeader
        voiceState={voiceState}
        formattedTime={formattedTime}
        onEndCall={handleEndCall}
      />

      <div className="calling-content">
        <ActiveCallPanel
          leadData={leadData}
          voiceState={voiceState}
          formattedTime={formattedTime}
          isMuted={isMuted}
          onMuteToggle={handleMuteToggle}
          onEndCall={handleEndCall}
          onSendDigits={handleSendDigits}
        />

        <CallInteractionPanel
          leadData={leadData}
          voiceState={voiceState}
          formattedTime={formattedTime}
          elapsedSeconds={elapsedSeconds}
          callStartTime={callStartTime}
          onSaveLog={handleSaveLog}
          onCancel={handleCancel}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
