"use client";

import React from "react";

export default function WaveformVisual({ isActive = false }) {
  return (
    <div className={`waveform-visual ${!isActive ? "waveform-visual--idle" : ""}`}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="waveform-visual__bar" />
      ))}
    </div>
  );
}
