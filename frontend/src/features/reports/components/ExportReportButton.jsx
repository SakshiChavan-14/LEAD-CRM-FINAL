import { useState } from "react";
import { Download } from "lucide-react";
import reportsService from "../services/reportsService";
import { downloadBlob, getExportFilename } from "../utils/downloadBlob";
import { useAppToast } from "@/hooks/useAppToast";

export default function ExportReportButton({ range = "this-month", team = "all", disabled }) {
  const [isExporting, setIsExporting] = useState(false);
  const toast = useAppToast();

  const handleExport = async (format) => {
    if (disabled || isExporting) return;
    setIsExporting(true);
    try {
      const blobData = await reportsService.exportTeamReport(format, range, team);
      const filename = getExportFilename("Team-Report", "", range, format);
      downloadBlob(blobData, filename);
      toast.success("Export Complete", `Downloaded ${filename}`);
    } catch (err) {
      toast.error("Export Failed", err?.response?.data?.message || "Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative group">
      <button 
        disabled={isExporting || disabled}
        className="flex items-center gap-2 px-5 h-11 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors font-medium shadow-sm disabled:opacity-50 cursor-pointer"
      >
        <Download size={16} />
        {isExporting ? "Exporting..." : "Export Report"}
      </button>
      
      {/* Dropdown for options */}
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
        <button 
          onClick={() => handleExport("pdf")}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Export as PDF
        </button>
        <button 
          onClick={() => handleExport("excel")}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Export as Excel
        </button>
        <button 
          onClick={() => handleExport("csv")}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          Export as CSV
        </button>
      </div>
    </div>
  );
}
