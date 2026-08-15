"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";

// Voice Components
import VoiceHeader from "@/features/telecaller/voice/components/VoiceHeader";
import TodayCallQueue from "@/features/telecaller/calls/components/TodayCallQueue";
import ActiveCallCard from "@/features/telecaller/voice/components/ActiveCallCard";
import QuickDialCard from "@/features/telecaller/voice/components/QuickDialCard";
import AnalyticsCards from "@/features/telecaller/voice/components/AnalyticsCards";
import AudioTestModal from "@/features/telecaller/voice/components/AudioTestModal";
import DeviceSettingsModal from "@/features/telecaller/voice/components/DeviceSettingsModal";

export default function TelecallerCallsPage() {
  const queryClient = useQueryClient();

  // Modal states
  const [isAudioTestOpen, setIsAudioTestOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Call notes (shared between ActiveCallCard and post-call follow-up)
  const [callNotes, setCallNotes] = useState("");

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["telecaller-calls"] });
    queryClient.invalidateQueries({ queryKey: ["voice-analytics"] });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 font-outfit space-y-6 animate-in fade-in duration-300">
        
        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <VoiceHeader />

        {/* ── ANALYTICS STRIP (TOP) ──────────────────────────────────────── */}
        <AnalyticsCards />

        {/* ── 3 EQUAL WORKSPACE PANELS ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="w-full">
            <TodayCallQueue />
          </div>
          <div className="w-full">
            <ActiveCallCard callNotes={callNotes} setCallNotes={setCallNotes} />
          </div>
          <div className="w-full">
            <QuickDialCard />
          </div>
        </div>

        {/* ── MODALS ────────────────────────────────────────────────────── */}
        <AudioTestModal isOpen={isAudioTestOpen} onClose={() => setIsAudioTestOpen(false)} />
        <DeviceSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
}
