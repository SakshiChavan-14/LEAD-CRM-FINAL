import React from "react";
import { PhoneIncoming, PhoneOutgoing, PhoneOff, Play } from "lucide-react";
import StatusBadge from "@/components/table/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import { formatDuration, getCallDirection, getInitials } from "@/features/telecaller/voice/utils/callMapper";

const formatCompactDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  if (date >= todayStart) return `Today • ${time}`;
  if (date >= yesterdayStart) return `Yesterday • ${time}`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ` • ${time}`;
};

export const getRecentCallsColumns = (onPlayRecording) => [
  {
    key: "lead",
    label: "Lead",
    render: (_, call) => {
      const name = call.leadName || call.name || "Unknown";
      return (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#7A1F2B] text-white flex items-center justify-center text-xs font-[700] shrink-0">
            {getInitials(name)}
          </div>
          <span className="font-[600] text-gray-900 truncate">{name}</span>
        </div>
      );
    },
  },
  {
    key: "phone",
    label: "Phone",
    render: (_, call) => (
      <span className="text-gray-600 font-mono truncate">{call.phone || call.leadPhone || "--"}</span>
    ),
  },
  {
    key: "direction",
    label: "Direction",
    render: (_, call) => {
      const direction = getCallDirection(call);
      return (
        <div className="flex items-center gap-1.5 text-left">
          {direction === "Inbound" ? (
            <PhoneIncoming size={12} className="text-blue-500" />
          ) : (
            <PhoneOutgoing size={12} className="text-gray-400" />
          )}
          <span className="text-xs text-gray-500 font-[500]">{direction}</span>
        </div>
      );
    },
  },
  {
    key: "duration",
    label: "Duration",
    render: (_, call) => {
      const duration = call.callDurationSeconds || call.callDuration || call.duration || 0;
      return <span className="font-mono text-gray-700">{formatDuration(duration)}</span>;
    },
  },
  {
    key: "outcome",
    label: "Outcome",
    render: (_, call) => {
      const outcome = call.outcome || call.callOutcome || "Unknown";
      return <StatusBadge status={outcome} />;
    },
  },
  {
    key: "recording",
    label: "Recording",
    headerClassName: "text-center",
    cellClassName: "text-center",
    render: (_, call) => {
      const hasRecording = call.recordingUrl && call.recordingUrl.trim() !== "";
      const callId = call.callId || call.id || call.interactionId;
      
      return hasRecording ? (
        <div className="flex items-center justify-center">
          <button 
            className="text-[#7A1F2B] p-1.5 bg-[#7A1F2B]/5 hover:bg-[#7A1F2B]/10 rounded-md transition-colors" 
            title="Play Recording"
            onClick={(e) => {
              e.stopPropagation();
              onPlayRecording(callId);
            }}
          >
            <Play size={14} className="ml-0.5" />
          </button>
        </div>
      ) : (
        <span className="text-gray-400 font-medium flex justify-center">—</span>
      );
    },
  },
  {
    key: "date",
    label: "Date",
    render: (_, call) => {
      const date = formatCompactDate(call.callDateTime || call.createdAt || call.date);
      return <span className="text-xs text-gray-500 truncate">{date}</span>;
    },
  },
];
