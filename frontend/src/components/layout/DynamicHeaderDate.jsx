"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

export default function DynamicHeaderDate() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setDateStr(formatter.format(new Date()));
  }, []);

  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm text-sm font-medium text-gray-700">
      <Calendar size={14} className="text-gray-400" />
      <span>{dateStr || "Loading..."}</span>
    </div>
  );
}
