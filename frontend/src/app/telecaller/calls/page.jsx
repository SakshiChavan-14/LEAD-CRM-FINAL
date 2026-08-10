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

import ContentSection from "@/components/management/ContentSection";

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
    <ContentSection
      className="bg-[#FFFFFF] -m-4 sm:-m-6 p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500 min-h-screen"
      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
    >
      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <VoiceHeader />

      {/* ── ANALYTICS STRIP (TOP) ──────────────────────────────────────── */}
      <div className="mb-2">
        <AnalyticsCards />
      </div>

      {/* ── WORKSPACE PANELS (BOTTOM) ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        <div className="flex flex-col h-full">
          <TodayCallQueue />
        </div>
        <div className="flex flex-col h-full">
          <ActiveCallCard callNotes={callNotes} setCallNotes={setCallNotes} />
        </div>
        <div className="flex flex-col h-full">
          <QuickDialCard />
        </div>
      </div>

      {/* ── MODALS ────────────────────────────────────────────────────── */}
      <AudioTestModal isOpen={isAudioTestOpen} onClose={() => setIsAudioTestOpen(false)} />
      <DeviceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </ContentSection>
  );
}
