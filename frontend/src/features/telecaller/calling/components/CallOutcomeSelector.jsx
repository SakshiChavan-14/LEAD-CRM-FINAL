"use client";

import React from "react";

const CALL_OUTCOMES = [
  { value: "CONNECTED", label: "Connected" },
  { value: "BUSY", label: "Busy" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WRONG_NUMBER", label: "Wrong No." },
  { value: "NO_RESPONSE", label: "No Response" },
];

export default function CallOutcomeSelector({ selected, onSelect }) {
  return (
    <div className="outcome-selector">
      <span className="outcome-selector__label">Call Outcome</span>
      <div className="outcome-selector__options">
        {CALL_OUTCOMES.map((outcome) => (
          <button
            key={outcome.value}
            type="button"
            className={`outcome-chip ${selected === outcome.value ? "outcome-chip--active" : ""}`}
            onClick={() => onSelect(outcome.value)}
          >
            {outcome.label}
          </button>
        ))}
      </div>
    </div>
  );
}
