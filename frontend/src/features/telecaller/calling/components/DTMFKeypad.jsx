"use client";

import React from "react";
import { createPortal } from "react-dom";

const DTMF_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "#"],
];

export default function DTMFKeypad({ onDigit, onClose }) {
  return createPortal(
    <div className="dtmf-overlay" onClick={onClose}>
      <div className="dtmf-keypad" onClick={(e) => e.stopPropagation()}>
        <div className="dtmf-keypad__title">Dial Pad</div>
        <div className="dtmf-keypad__grid">
          {DTMF_KEYS.flat().map((key) => (
            <button
              key={key}
              className="dtmf-key"
              onClick={() => onDigit(key)}
              type="button"
            >
              {key}
            </button>
          ))}
        </div>
        <button
          className="dtmf-keypad__close"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
