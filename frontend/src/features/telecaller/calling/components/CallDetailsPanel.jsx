"use client";

import React from "react";

export default function CallDetailsPanel({ leadData, voiceState, formattedTime, callStartTime }) {
  const getStatusLabel = () => {
    switch (voiceState) {
      case "CONNECTING": return "Connecting";
      case "RINGING": return "Ringing";
      case "CONNECTED": return "Connected";
      case "READY":
      case "DISCONNECTED": return "Call Ended";
      case "FAILED": return "Failed";
      default: return "Idle";
    }
  };

  const formatStartTime = () => {
    if (!callStartTime) return "—";
    try {
      return new Date(callStartTime).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "—";
    }
  };

  const items = [
    { label: "Contact", value: leadData?.name || "Unknown Contact" },
    { label: "Phone", value: leadData?.phone || "—" },
    { label: "Enquiry ID", value: leadData?.enquiryNo ? `#ENQ-${leadData.enquiryNo}` : "—" },
    { label: "Direction", value: "Outbound" },
    { label: "Started", value: formatStartTime() },
    { label: "Duration", value: formattedTime || "00:00" },
    { label: "Status", value: getStatusLabel() },
  ];

  return (
    <div className="call-details-list">
      {items.map((item) => (
        <div key={item.label} className="call-details-item">
          <span className="call-details-item__label">{item.label}</span>
          <span className="call-details-item__value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
