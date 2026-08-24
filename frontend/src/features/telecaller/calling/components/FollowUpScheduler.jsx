"use client";

import React from "react";
import { CalendarClock } from "lucide-react";

export default function FollowUpScheduler({ date, time, reminder, onDateChange, onTimeChange, onReminderChange }) {
  return (
    <div className="followup-scheduler">
      <div className="followup-scheduler__title">
        <CalendarClock size={16} />
        <span>Schedule Next Follow-up (Optional)</span>
      </div>

      <div className="followup-scheduler__row">
        <div className="followup-scheduler__field">
          <label>Follow-up Date</label>
          <input
            type="date"
            className="followup-scheduler__input"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            placeholder="dd-mm-yyyy"
          />
        </div>
        <div className="followup-scheduler__field">
          <label>Follow-up Time</label>
          <input
            type="time"
            className="followup-scheduler__input"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            placeholder="--:-- --"
          />
        </div>
      </div>

      <div className="followup-scheduler__field">
        <label>Reminder</label>
        <select
          className="followup-scheduler__select"
          value={reminder}
          onChange={(e) => onReminderChange(e.target.value)}
        >
          <option value="">No Reminder</option>
          <option value="15min">15 minutes before</option>
          <option value="30min">30 minutes before</option>
          <option value="1hr">1 hour before</option>
          <option value="1day">1 day before</option>
        </select>
      </div>
    </div>
  );
}
