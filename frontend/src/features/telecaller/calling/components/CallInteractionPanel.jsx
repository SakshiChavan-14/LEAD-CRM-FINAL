"use client";

import React, { useState } from "react";
import { Save } from "lucide-react";
import CallOutcomeSelector from "./CallOutcomeSelector";
import OpinionSelector from "./OpinionSelector";
import CallNotes from "./CallNotes";
import FollowUpScheduler from "./FollowUpScheduler";
import CallDetailsPanel from "./CallDetailsPanel";

export default function CallInteractionPanel({
  leadData,
  voiceState,
  formattedTime,
  elapsedSeconds,
  callStartTime,
  onSaveLog,
  onCancel,
  isSaving,
}) {
  const [activeTab, setActiveTab] = useState("log"); // "log" | "details"

  // Interaction form state
  const [outcome, setOutcome] = useState("CONNECTED");
  const [opinion, setOpinion] = useState("");
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [reminder, setReminder] = useState("");

  const handleOutcomeSelect = (value) => {
    setOutcome(value);
    if (value !== "CONNECTED") {
      setOpinion("");
    }
  };

  const handleSave = () => {
    // Calculate call duration in seconds (required by backend validation)
    let durationSeconds = 0;
    if (typeof elapsedSeconds === "number" && elapsedSeconds > 0) {
      durationSeconds = elapsedSeconds;
    } else if (formattedTime && typeof formattedTime === "string") {
      const parts = formattedTime.split(":").map((p) => parseInt(p, 10) || 0);
      if (parts.length === 2) {
        durationSeconds = parts[0] * 60 + parts[1];
      } else if (parts.length === 3) {
        durationSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      }
    }

    // Build the payload matching existing LogCallModal format exactly
    const payload = {
      enquiryNo: leadData?.enquiryNo ? parseInt(leadData.enquiryNo, 10) : null,
      callDurationSeconds: durationSeconds,
      callDirection: "OUTBOUND",
      outcome,
      telecallerNotes: notes,
    };

    // Only include opinion if outcome is CONNECTED
    if (outcome === "CONNECTED" && opinion) {
      payload.opinion = opinion;
    }

    // Build nextCallDate as ISO datetime if both date and time are provided
    if (followUpDate) {
      if (followUpTime) {
        payload.nextCallDate = `${followUpDate}T${followUpTime}`;
      } else {
        payload.nextCallDate = `${followUpDate}T09:00`;
      }
    }

    // Reminder as nextAction
    if (reminder) {
      payload.nextAction = reminder;
    }

    onSaveLog(payload);
  };

  return (
    <div className="interaction-panel">
      {/* Tabs */}
      <div className="interaction-panel__tabs">
        <button
          type="button"
          className={`interaction-panel__tab ${activeTab === "log" ? "interaction-panel__tab--active" : ""}`}
          onClick={() => setActiveTab("log")}
        >
          Log Interaction
        </button>
        <button
          type="button"
          className={`interaction-panel__tab ${activeTab === "details" ? "interaction-panel__tab--active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Call Details
        </button>
      </div>

      {/* Body */}
      <div className="interaction-panel__body">
        {activeTab === "log" ? (
          <>
            <CallOutcomeSelector selected={outcome} onSelect={handleOutcomeSelect} />

            {outcome === "CONNECTED" && (
              <OpinionSelector selected={opinion} onSelect={setOpinion} />
            )}

            <CallNotes value={notes} onChange={setNotes} />

            <FollowUpScheduler
              date={followUpDate}
              time={followUpTime}
              reminder={reminder}
              onDateChange={setFollowUpDate}
              onTimeChange={setFollowUpTime}
              onReminderChange={setReminder}
            />
          </>
        ) : (
          <CallDetailsPanel
            leadData={leadData}
            voiceState={voiceState}
            formattedTime={formattedTime}
            callStartTime={callStartTime}
          />
        )}
      </div>

      {/* Actions — only show on Log tab */}
      {activeTab === "log" && (
        <div className="interaction-panel__actions">
          <button
            type="button"
            className="action-btn--cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="action-btn--save"
            onClick={handleSave}
            disabled={isSaving || !notes.trim()}
          >
            <Save size={14} />
            <span>{isSaving ? "Saving..." : "Save Log"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
