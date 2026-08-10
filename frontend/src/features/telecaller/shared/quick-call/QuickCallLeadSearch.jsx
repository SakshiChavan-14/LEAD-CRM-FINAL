import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useTelecallerLeads } from "../../hooks/useMyLeads";

export default function QuickCallLeadSearch({ onSelectLead }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: leadsData } = useTelecallerLeads({}, 0, 200);
  const allLeads = leadsData?.leads || [];

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
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
    <div className="flex flex-col gap-4 h-full">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, phone or enquiry no..."
          className="w-full text-[13px] bg-white border border-[#ECECEC] rounded-xl pl-10 pr-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B1023]/15 focus:border-[#8B1023]/30 transition-all shadow-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-[160px]">
        {searchQuery.length > 1 && searchResults.length > 0 && (
          <div className="flex flex-col gap-2">
            {searchResults.map((lead) => (
              <button
                key={lead.enquiryNo}
                onClick={() => onSelectLead(lead)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-gray-50 transition-colors text-left border border-transparent hover:border-[#ECECEC] focus:outline-none focus:ring-2 focus:ring-[#8B1023]/30"
              >
                <div className="w-10 h-10 rounded-full bg-[#8B1023] text-white flex items-center justify-center font-[700] text-sm shrink-0 shadow-sm">
                  {(lead.name || "?")[0]}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-[600] text-gray-900 truncate">{lead.name}</span>
                  <span className="text-[12px] text-gray-500 font-mono">{lead.mobileNo}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {searchQuery.length > 1 && searchResults.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-6">
            No leads found
          </div>
        )}
      </div>
    </div>
  );
}
