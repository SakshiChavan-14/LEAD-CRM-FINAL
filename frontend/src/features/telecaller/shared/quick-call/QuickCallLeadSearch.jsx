"use client";

import React, { useState, useMemo } from "react";
import { Search, PhoneCall } from "lucide-react";
import { useTelecallerLeads } from "../../hooks/useMyLeads";

export default function QuickCallLeadSearch({ onSelectLead }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: leadsData } = useTelecallerLeads({}, 0, 200);
  const allLeads = leadsData?.leads || [
    { enquiryNo: "101", name: "Rahul Sharma", mobileNo: "9338495402", course: "Computer Science" },
    { enquiryNo: "104", name: "Aisha Khan", mobileNo: "9638414555", course: "Data Science" },
    { enquiryNo: "108", name: "Rohan Patil", mobileNo: "9722760329", course: "Mechanical Eng" },
    { enquiryNo: "112", name: "Sneha Patil", mobileNo: "9876543210", course: "Cybersecurity" },
  ];

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return allLeads.slice(0, 4);
    const q = searchQuery.toLowerCase();
    return allLeads
      .filter((l) =>
        l.name?.toLowerCase().includes(q) ||
        l.mobileNo?.includes(q) ||
        String(l.enquiryNo || "").toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [allLeads, searchQuery]);

  return (
    <div className="flex flex-col gap-3 h-full font-outfit">
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone or enquiry no..."
          className="w-full text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
        />
      </div>

      <div className="flex-1 overflow-y-auto max-h-[260px] [scrollbar-width:none]">
        {searchResults.length > 0 ? (
          <div className="flex flex-col gap-2">
            {searchResults.map((lead) => {
              const initials = (lead.name || "?")[0].toUpperCase();
              return (
                <button
                  key={lead.enquiryNo}
                  onClick={() => onSelectLead(lead)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-2xs transition-all text-left border border-slate-200/80 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-2xs">
                      {initials}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {lead.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {lead.mobileNo}
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#00C853] flex items-center justify-center group-hover:bg-[#00C853] group-hover:text-white transition-colors shrink-0 border border-emerald-200">
                    <PhoneCall size={12} />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-xs text-slate-400 py-6 font-medium">
            No matching leads found
          </div>
        )}
      </div>
    </div>
  );
}
