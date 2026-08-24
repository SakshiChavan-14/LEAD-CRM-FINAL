import React from 'react';
import NoteCard from "@/components/crm/NoteCard";
import { useLeadNotes } from "@/features/leads/hooks/useLeadNotes";
import { useLeadCalls } from "@/features/telecaller/hooks/useLeadCalls";
import { FormSkeleton } from "@/components/ui/Skeletons";

const MemoizedNoteCard = React.memo(NoteCard);

export default function LeadNotesTab({ leadId, rawData }) {
  const { data: notesData, isLoading: isNotesLoading, isError, error } = useLeadNotes(leadId);
  const { data: callsData, isLoading: isCallsLoading } = useLeadCalls(leadId);

  const isLoading = isNotesLoading && isCallsLoading;

  if (isLoading) {
    return (
      <div className="p-5">
        <FormSkeleton />
      </div>
    );
  }

  const directNotes = Array.isArray(notesData) ? notesData : Array.isArray(notesData?.data) ? notesData.data : Array.isArray(notesData?.content) ? notesData.content : [];

  const rawCalls = Array.isArray(callsData) ? callsData : Array.isArray(callsData?.content) ? callsData.content : Array.isArray(rawData?.calls) ? rawData.calls : [];

  const callNotes = rawCalls
    .filter(c => c.telecallerNotes || c.notes || c.remarks || c.comment || c.discussion)
    .map((c, i) => ({
      id: c.callId || c.interactionId || c.id || `call-note-${i}`,
      content: c.telecallerNotes || c.notes || c.remarks || c.comment || c.discussion,
      author: c.telecallerName || c.name || c.callerName || c.assignedTo || "Telecaller",
      createdAt: c.createdAt || c.callDateTime || c.date || c.time,
    }));

  const allRawNotes = [...directNotes, ...callNotes];

  const notes = allRawNotes
    .map((note, index) => {
      const content = note?.content || note?.telecallerNotes || note?.notes || note?.remarks || note?.comment || "";
      return {
        id: note?.id || note?._id || note?.noteId || `note-${index}`,
        content,
        author: note?.author || note?.createdBy || note?.telecallerName || note?.telecaller || "Telecaller",
        createdAt: note?.createdAt || note?.createdDate || note?.date || note?.time,
      };
    })
    .filter(note => note.content && String(note.content).trim() !== "");

  // Deduplicate notes by content + createdAt
  const seen = new Set();
  const uniqueNotes = notes.filter(n => {
    const key = `${n.content.trim()}_${n.createdAt || ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (uniqueNotes.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
        No notes available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {uniqueNotes.map((note, index) => (
        <MemoizedNoteCard key={note.id || index} note={note} />
      ))}
    </div>
  );
}
