import React from "react";
import ExportReportButton from "./ExportReportButton";

export default function ReportsToolbar({ fromDate, setFromDate, toDate, setToDate, isLoading }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between font-outfit hover:border-blue-200 transition-colors duration-300">
      <div className="flex flex-wrap items-center gap-4 w-full max-w-[640px]">
        {/* From Date */}
        <div className="flex-1 min-w-[160px] flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={isLoading}
            className="w-full text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
          />
        </div>

        {/* To Date */}
        <div className="flex-1 min-w-[160px] flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            disabled={isLoading}
            className="w-full text-xs bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
          />
        </div>
      </div>

      <ExportReportButton range={`${fromDate}-to-${toDate}`} team="all" disabled={isLoading} />
    </div>
  );
}
