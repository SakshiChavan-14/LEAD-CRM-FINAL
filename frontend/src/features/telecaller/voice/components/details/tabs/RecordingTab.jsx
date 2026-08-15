"use client";

import React, { useState } from "react";
import { Mic, Download, ExternalLink, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import RecordingPlayer from "@/features/telecaller/voice/components/RecordingPlayer";
import EmptyState from "@/components/ui/EmptyState";

export default function RecordingTab({ call, callId }) {
  const [copied, setCopied] = useState(false);
  const audioUrl = call?.recordingUrl || (callId ? `/api/leads/telecaller/calls/${callId}/recording` : null);

  const handleCopyLink = () => {
    if (audioUrl) {
      navigator.clipboard.writeText(audioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!audioUrl) {
    return (
      <div className="py-2">
        <EmptyState title="No Call Recording Available" description="This call session does not have an audio recording on record." />
      </div>
    );
  }

  return (
    <div className="py-2 space-y-4 font-outfit">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <Mic size={14} className="text-purple-600" />
        <span>Audio Recording Playback</span>
      </div>

      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
        <RecordingPlayer 
          src={audioUrl} 
          duration={call?.callDurationSeconds || call?.callDuration || call?.duration || 195} 
        />
        
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href={audioUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <ExternalLink size={14} className="text-slate-400" />
            <span>Open in Tab</span>
          </a>
          <a
            href={audioUrl}
            download="call-recording.mp3"
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Download size={14} className="text-slate-400" />
            <span>Download Audio</span>
          </a>
          <button
            onClick={handleCopyLink}
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />} 
            <span>{copied ? "Copied URL" : "Copy Audio Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
