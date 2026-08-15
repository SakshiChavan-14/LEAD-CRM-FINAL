"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward } from "lucide-react";
import { formatDuration } from "../utils/callMapper";

export default function RecordingPlayer({ src, duration = 180 }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const d = audio.duration || duration || 1;
      setProgress((audio.currentTime / d) * 100);
      setCurrentTime(audio.currentTime);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [duration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying(!isPlaying);
      return;
    }
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Fallback simulation if no active audio stream
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextSpeed = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleSeek = (i) => {
    const pct = (i / 40);
    const newTime = pct * (duration || 180);
    setCurrentTime(newTime);
    setProgress(pct * 100);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl font-outfit space-y-4">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Main Controls Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Play / Pause button */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30 active:scale-95 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5 fill-white" />}
          </button>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-200">Call Audio Recording</span>
            <span className="text-[11px] font-mono text-slate-400">
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Playback speed & Mute controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeed}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-mono font-bold transition-all border border-slate-700 cursor-pointer"
            title="Change Playback Speed"
          >
            {playbackRate}x
          </button>

          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all border border-slate-700 cursor-pointer"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </div>

      {/* Modern Waveform Visualizer */}
      <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
        <div className="h-10 flex items-center gap-[3px] cursor-pointer">
          {Array.from({ length: 40 }).map((_, i) => {
            const barHeight = Math.max(15, Math.abs(Math.sin(i * 0.45 + 1.2) * 85 + Math.cos(i * 0.2) * 15));
            const filled = (i / 40) * 100 <= progress;
            return (
              <div
                key={i}
                onClick={() => handleSeek(i)}
                className={`flex-1 rounded-full transition-all duration-150 hover:scale-y-125 ${
                  filled 
                    ? "bg-gradient-to-t from-blue-600 to-indigo-400" 
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
                style={{ height: `${barHeight}%` }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
