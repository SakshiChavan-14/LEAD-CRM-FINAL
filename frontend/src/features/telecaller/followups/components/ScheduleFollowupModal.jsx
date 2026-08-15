"use client";

import React, { useState, useEffect, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import { useCreateFollowup } from "@/features/telecaller/hooks/useFollowupMutations";
import { toast } from "sonner";
import { Clock } from "lucide-react";

export default function ScheduleFollowupModal({ isOpen, onClose, defaultDate, existingFollowups = [], allFollowups = [], initialLeadId = "", leads = [] }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const createMutation = useCreateFollowup();

  useEffect(() => {
    if (isOpen) {
      setDate(defaultDate || "");
      setTime("");
      setNotes("");
      setPriority("Medium");
      setSelectedLeadId(initialLeadId || "");
    }
  }, [isOpen, defaultDate, initialLeadId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const enquiryNo = selectedLeadId ? parseInt(selectedLeadId, 10) : null;

    // Duplicate prevention: check for an existing active follow-up for this lead
    const existingActive = allFollowups.find(
      (f) =>
        String(f.enquiryNo) === String(enquiryNo) &&
        String(f.status || "").toLowerCase() !== "completed"
    );

    if (existingActive) {
      toast.warning(
        `This lead already has an active follow-up scheduled on ${existingActive.scheduledDate || "unknown date"} at ${existingActive.scheduledTime || "TBA"}. Please complete or reschedule the existing follow-up before creating another.`
      );
      return;
    }

    const payload = {
      enquiryNo,
      scheduledDate: date,
      scheduledTime: time.length === 5 ? `${time}:00` : time,
      priority: priority,
      remarks: notes
    };

    createMutation.mutate(
      payload,
      {
        onSuccess: () => {
          toast.success("Follow-up scheduled successfully");
          onClose();
        },
        onError: (error) => {
          console.error("Follow-up Error:", error);
          toast.error(error?.response?.data?.message || "Failed to schedule follow-up");
        }
      }
    );
  };

  const formattedDate = defaultDate 
    ? new Date(defaultDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : "Select Date";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Schedule for ${formattedDate}`}>
      <div className="flex flex-col font-outfit">
        
        {/* Existing Follow-ups Section */}
        {existingFollowups.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Existing Follow-ups ({existingFollowups.length})
            </h4>
            <div className="max-h-[160px] overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2">
              {existingFollowups.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                      {f.name || "Student"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Clock size={11} className="text-blue-600" /> {f.scheduledTime || "TBA"}
                    </span>
                  </div>
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${
                    f.priority === 'High' ? 'text-rose-700 bg-rose-50 border-rose-200' :
                    f.priority === 'Medium' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                    'text-blue-700 bg-blue-50 border-blue-200'
                  }`}>
                    {f.priority || "Normal"}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-slate-100 mt-5"></div>
          </div>
        )}

        {/* Schedule Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Schedule New Follow-up</h4>

          {!initialLeadId && leads.length > 0 && (
            <Select 
              label="Select Lead"
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              options={[
                { label: "Choose a lead...", value: "" },
                ...leads.map(lead => ({
                  label: `${lead.name} (${lead.enquiryNo})`,
                  value: String(lead.enquiryNo)
                }))
              ]}
            />
          )}

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

          <Select 
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" }
            ]}
          />

          <Textarea 
            label="Notes (Optional)"
            rows={2}
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
              disabled={createMutation.isPending || (!initialLeadId && !selectedLeadId)}
            >
              {createMutation.isPending ? "Scheduling..." : "Confirm Schedule"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
