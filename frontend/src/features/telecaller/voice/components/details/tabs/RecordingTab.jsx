"use client";

import React, { useState, useEffect } from "react";
import { Mic, Download, ExternalLink, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import RecordingPlayer from "@/features/telecaller/voice/components/RecordingPlayer";
import EmptyState from "@/components/ui/EmptyState";
import { callHistoryService } from "@/features/telecaller/voice/services/callHistoryService";
import API_ENDPOINTS from "@/utils/apiEndpoints";

export default function RecordingTab({ call, callId }) {
  const [copied, setCopied] = useState(false);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const interactionId = callId || call?.callId || call?.id;
  const hasRecording = Boolean(call?.recordingUrl && String(call?.recordingUrl).trim() !== "");

  useEffect(() => {
    let currentBlobUrl = null;
    let isMounted = true;

    if (!hasRecording || !interactionId) {
      setAudioBlobUrl(null);
      setIsLoadingAudio(false);
      return;
    }

    setIsLoadingAudio(true);
    setAudioError(null);

    callHistoryService.getRecording(interactionId)
      .then((data) => {
        if (!isMounted) return;
        if (data instanceof Blob) {
          currentBlobUrl = URL.createObjectURL(data);
          setAudioBlobUrl(currentBlobUrl);
        } else if (typeof data === "string") {
          setAudioBlobUrl(data);
        }
        setIsLoadingAudio(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load recording blob:", err);
        setAudioError(err?.response?.data?.message || "Failed to load audio recording");
        setIsLoadingAudio(false);
      });

    return () => {
      isMounted = false;
      if (currentBlobUrl) {
        URL.revokeObjectURL(currentBlobUrl);
      }
    };
  }, [interactionId, hasRecording]);

  const handleCopyLink = () => {
    const endpointUrl = typeof window !== "undefined" && interactionId
      ? `${window.location.origin}${API_ENDPOINTS.TELECALLER.VOICE.RECORDING(interactionId)}`
      : "";
    if (endpointUrl) {
      navigator.clipboard.writeText(endpointUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInTab = (e) => {
    e.preventDefault();
    if (audioBlobUrl) {
      window.open(audioBlobUrl, "_blank");
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();
    if (audioBlobUrl) {
      const link = document.createElement("a");
      link.href = audioBlobUrl;
      link.download = `call-${interactionId}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!hasRecording || !interactionId) {
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
          src={audioBlobUrl} 
          duration={call?.callDurationSeconds || call?.callDuration || call?.duration || 195} 
          isLoading={isLoadingAudio}
          error={audioError}
        />
        
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleOpenInTab}
            disabled={!audioBlobUrl || isLoadingAudio}
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <ExternalLink size={14} className="text-slate-400" />
            <span>Open in Tab</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={!audioBlobUrl || isLoadingAudio}
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Download size={14} className="text-slate-400" />
            <span>Download Audio</span>
          </button>
          <button
            onClick={handleCopyLink}
            disabled={!interactionId}
            className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-400" />} 
            <span>{copied ? "Copied URL" : "Copy Audio Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
