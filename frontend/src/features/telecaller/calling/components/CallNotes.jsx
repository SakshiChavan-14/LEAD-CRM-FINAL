"use client";

import React from "react";
import { Bold, List, Paperclip, Mic } from "lucide-react";

export default function CallNotes({ value, onChange, maxLength = 2000 }) {
  return (
    <div className="call-notes">
      <span className="call-notes__label">Call Log / Notes</span>
      <div className="call-notes__container">
        <textarea
          className="call-notes__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your call notes here..."
          maxLength={maxLength}
          rows={4}
        />
        <div className="call-notes__footer">
          <div className="call-notes__tools">
            <button type="button" className="call-notes__tool-btn" aria-label="Bold" tabIndex={-1}>
              <Bold size={14} />
            </button>
            <button type="button" className="call-notes__tool-btn" aria-label="List" tabIndex={-1}>
              <List size={14} />
            </button>
            <button type="button" className="call-notes__tool-btn" aria-label="Attach" tabIndex={-1}>
              <Paperclip size={14} />
            </button>
            <button type="button" className="call-notes__tool-btn" aria-label="Record" tabIndex={-1}>
              <Mic size={14} />
            </button>
          </div>
          <span className="call-notes__counter">{value.length} / {maxLength}</span>
        </div>
      </div>
    </div>
  );
}
