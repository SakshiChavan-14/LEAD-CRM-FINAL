import React from "react";
import { StickyNote, MessageSquare, CheckCircle, Clock } from "lucide-react";

export default function NotesTab({ call }) {
  const notesText = call?.telecallerNotes || call?.notes || call?.remarks || call?.comment || call?.discussion || call?.description || null;
  const interestLevel = call?.interestLevel || call?.temperature || null;
  const followUp = call?.scheduledDate || call?.nextFollowUp || call?.followupDate || null;

  return (
    <div className="py-2 space-y-4 font-outfit">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
        <StickyNote size={14} className="text-amber-500" />
        <span>Telecaller Discussion Notes</span>
      </div>

      <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-5 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={14} className="text-amber-700" />
          <span className="text-xs font-bold text-amber-900">Remarks Logged</span>
          <span className="text-[10px] font-mono text-amber-700 ml-auto">Logged by Telecaller</span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
          {notesText || "No discussion notes recorded for this call."}
        </p>

        {(interestLevel || followUp) && (
          <div className="mt-4 pt-3 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {interestLevel && (
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                <CheckCircle size={13} className="text-emerald-600" />
                <span>Interest Level: {interestLevel}</span>
              </div>
            )}
            {followUp && (
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                <Clock size={13} className="text-blue-600" />
                <span>Follow-up: {followUp}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
