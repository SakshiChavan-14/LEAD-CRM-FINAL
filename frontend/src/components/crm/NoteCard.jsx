"use client";

import React, { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

export default function NoteCard({ note, onEditNote, onDeleteNote }) {
  if (!note) return null;
  const { id, _id, author = "Karun Poojari", createdBy, createdAt, content } = note;
  const noteId = id || _id;
  const noteAuthor = author || createdBy || "Karun Poojari";
  const noteContent = content || note?.telecallerNotes || note?.notes || note?.remarks || note?.comment || "";

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(noteContent);
  const [isSaving, setIsSaving] = useState(false);

  const formattedTime = createdAt ? new Date(createdAt).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
  }) : "Today, 05:41 PM";
  const initials = noteAuthor.substring(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!editedText.trim() || !onEditNote) return;
    try {
      setIsSaving(true);
      await onEditNote(noteId, editedText);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex gap-3.5 group font-outfit">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-2xs select-none">
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-2xl shadow-2xs hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{noteAuthor}</span>
              <span className="text-[10px] text-slate-400 font-mono">{formattedTime}</span>
            </div>
            {/* Action buttons */}
            {!isEditing && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Edit note"
                  onClick={() => {
                    setEditedText(content || "");
                    setIsEditing(true);
                  }}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Pencil size={12} />
                </button>
                {onDeleteNote && (
                  <button
                    type="button"
                    title="Delete note"
                    onClick={() => onDeleteNote(noteId)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-2 mt-1">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !editedText.trim()}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Check size={13} />
                  <span>{isSaving ? "Saving..." : "Save Note"}</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-medium">{noteContent}</p>
          )}
        </div>
      </div>
    </div>
  );
}
