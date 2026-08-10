import React from "react";
import { Volume2 } from "lucide-react";

export default function VoiceHeader() {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-[26px] font-[700] text-gray-900 tracking-tight">
            Telecaller Voice Center
          </h1>
          <Volume2 size={20} className="text-gray-400 mt-0.5" />
        </div>
        <p className="text-[13px] text-gray-500 font-[400]">
          Browser calling powered by Twilio
        </p>
      </div>

    </div>
  );
}
