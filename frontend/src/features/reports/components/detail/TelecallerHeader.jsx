"use client";

import { useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import reportsService from "../../services/reportsService";
import { downloadBlob, getExportFilename } from "../../utils/downloadBlob";
import { useAppToast } from "@/hooks/useAppToast";

const RANK_COLORS = [
  "text-amber-500",
  "text-slate-400",
  "text-amber-700",
  "text-slate-300",
  "text-slate-300",
];

export default function TelecallerHeader({ telecaller, id, range = "this-month", exportMode = false }) {
  const router = useRouter();
  const toast = useAppToast();
  const [isExporting, setIsExporting] = useState(false);

  if (!telecaller) return null;

  const { name = "Telecaller", rank = 1 } = telecaller;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleBack = () => {
    try {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/dashboard/reports");
      }
    } catch {
      router.push("/dashboard/reports");
    }
  };

  const handleExport = async (format = "pdf") => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const blobData = await reportsService.exportTelecallerReport(id, format, range);
      const filename = getExportFilename("", name, range, format);
      downloadBlob(blobData, filename);
      toast.success("Export Complete", `Downloaded ${filename}`);
    } catch (err) {
      toast.error("Export Failed", err?.response?.data?.message || "Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 ${exportMode ? "pt-0 shadow-none border-0 border-b border-slate-200 rounded-none" : ""}`}>
      {/* Top Row: Back + Actions */}
      {!exportMode && (
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Reports
          </button>
        </div>
      )}

      {/* Export-only header branding */}
      {exportMode && (
        <div className="flex items-center justify-between mb-6 pt-0">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Telecaller Performance Report
          </span>
          <span className="text-xs text-slate-400">{new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
        </div>
      )}

      {/* Profile Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-md shrink-0">
            {initials}
          </div>

          {/* Name + Meta */}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {name}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Senior Telecaller · Admissions
            </p>
            <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold">
              <span className={RANK_COLORS[(rank - 1) % RANK_COLORS.length]}>
                Rank #{rank} of {5}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-400">Joined Jul 2025</span>
            </div>
          </div>
        </div>

        {/* Export-mode stat summary pill */}
        {exportMode && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Report Period</span>
            <span className="text-xs font-semibold text-blue-600">{range || "This Month"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
