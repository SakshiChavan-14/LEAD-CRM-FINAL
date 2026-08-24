"use client";

import React from "react";
import { ThumbsUp, Sun, ThumbsDown } from "lucide-react";

// UI labels map to existing backend values exactly
// "Not Interested" displays in UI but sends "Cold" to backend
const CALL_OPINIONS = [
  { value: "Interested", label: "Interested", Icon: ThumbsUp, iconClass: "opinion-card__icon--interested" },
  { value: "Warm", label: "Warm", Icon: Sun, iconClass: "opinion-card__icon--warm" },
  { value: "Cold", label: "Not Interested", Icon: ThumbsDown, iconClass: "opinion-card__icon--cold" },
];

export default function OpinionSelector({ selected, onSelect }) {
  return (
    <div className="opinion-selector">
      <span className="opinion-selector__label">Opinion</span>
      <div className="opinion-selector__options">
        {CALL_OPINIONS.map(({ value, label, Icon, iconClass }) => {
          const valClass = value === "Interested" ? "opinion-card--interested" : value === "Warm" ? "opinion-card--warm" : "opinion-card--cold";
          return (
            <button
              key={value}
              type="button"
              className={`opinion-card ${valClass} ${selected === value ? "opinion-card--active" : ""}`}
              onClick={() => onSelect(value)}
            >
              <div className={`opinion-card__icon ${iconClass}`}>
                <Icon size={14} />
              </div>
              <span className="opinion-card__label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
