"use client";

import React, { useState } from "react";
import NoteCard from "@/components/crm/NoteCard";
import { useTelecallerLeadNotes, useUpdateTelecallerLeadNote, useCreateTelecallerLeadNote } from "@/features/telecaller/hooks/useTelecallerLeadNotes";
import { FormSkeleton } from "@/components/ui/Skeletons";
import { Plus, Search, MessageSquarePlus } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function TelecallerNotesTab({ leadId }) {
  const { data, isLoading } = useTelecallerLeadNotes(leadId);
  const updateNoteMutation = useUpdateTelecallerLeadNote(leadId);
  const createNoteMutation = useCreateTelecallerLeadNote(leadId);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newNoteText, setNewNoteText] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleUpdateNote = async (noteId, content) => {
    try {
      if (updateNoteMutation?.mutateAsync) {
        await updateNoteMutation.mutateAsync({ noteId, content });
      }
    } catch (e) {
      console.log("Local note update fallback:", e);
    }
  };

  const handleAddNote = async () => {
    if (!newNoteText.trim()) return;
    try {
      await createNoteMutation.mutateAsync(newNoteText.trim());
      setNewNoteText("");
      setIsAddingNote(false);
    } catch (e) {
      console.error("Failed to create note:", e);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200/80">
        <FormSkeleton />
      </div>
    );
  }

  const rawNotes = Array.isArray(data) ? data : [];
  
  const filteredNotes = rawNotes.filter((note) => 
    (note.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.author || note.createdBy || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-6 font-outfit">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 leading-none">Lead Discussion Notes</h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">Recorded telecalling feedback & remarks ({rawNotes.length})</p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-slate-200/80 rounded-xl text-xs w-48 sm:w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
            />
          </div>

          <button
            onClick={() => setIsAddingNote(!isAddingNote)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Add New Note Box */}
      {isAddingNote && (
        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <MessageSquarePlus size={15} />
            <span>Add Telecaller Remark</span>
          </div>
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Type observations, student preferences, or follow-up discussion points..."
            rows={3}
            className="w-full p-3 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { setIsAddingNote(false); setNewNoteText(""); }}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              disabled={!newNoteText.trim()}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              Save Remark
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="py-6">
          <EmptyState title="No notes found" description={searchTerm ? "No notes matching your search query were found." : "This lead has no discussion notes recorded yet."} />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <NoteCard 
              key={note.id || note._id} 
              note={note} 
              onEditNote={handleUpdateNote} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
