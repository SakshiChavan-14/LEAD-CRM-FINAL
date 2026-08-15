"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useUpdateFollowup } from "@/features/telecaller/hooks/useFollowupMutations";
import { toast } from "sonner";

const normalizeTimeValue = (value) => {
  if (!value) return "";
  const timeValue = String(value).trim();
  if (timeValue.length <= 5) return timeValue;
  return timeValue.slice(0, 5);
};

export default function RescheduleModal({ isOpen, onClose, followup }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  
  const updateMutation = useUpdateFollowup();

  useEffect(() => {
    if (followup) {
      setDate(followup.scheduledDate || followup.date || "");
      setTime(normalizeTimeValue(followup.scheduledTime || followup.time));
      setNotes(followup.remarks || "");
    }
  }, [followup]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!followup) return;

    const payload = {
      scheduledDate: date,
      scheduledTime: time.length === 5 ? `${time}:00` : time,
      remarks: notes,
    };

    updateMutation.mutate(
      { 
        id: followup.id, 
        data: payload
      },
      {
        onSuccess: () => {
          toast.success("Follow-up rescheduled successfully");
          onClose();
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Failed to reschedule follow-up");
        }
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reschedule Follow-up">
      <form onSubmit={handleSubmit} className="space-y-4 font-outfit">
        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input 
            label="Time"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <Textarea 
          label="Notes (Optional)"
          rows={3}
          placeholder="Add any remarks for this follow-up..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-2.5 pt-4 mt-2 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Confirm Reschedule"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
