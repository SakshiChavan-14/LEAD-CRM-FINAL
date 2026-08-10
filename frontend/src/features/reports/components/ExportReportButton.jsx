import { useState } from "react";
import { Download } from "lucide-react";
import { exportTeamPDF, exportTeamExcel } from "../utils/exportReport";

export default function ExportReportButton({ range, team, disabled }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type) => {
    if (disabled) return;
    setIsExporting(true);
    try {
      if (type === 'pdf') {
        await exportTeamPDF(range, team);
      } else {
        await exportTeamExcel(range, team);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative group">
      <button 
        disabled={isExporting || disabled}
        className="flex items-center gap-2 px-5 h-11 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium shadow-sm disabled:opacity-50"
      >
        <Download size={16} />
        {isExporting ? "Exporting..." : "Export Report"}
      </button>
      
      {/* Dropdown for options */}
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
        <button 
          onClick={() => handleExport('pdf')}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Export as PDF
        </button>
        <button 
          onClick={() => handleExport('excel')}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Export as Excel
        </button>
        <button 
          onClick={() => handleExport('csv')}
          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Export as CSV
        </button>
      </div>
    </div>
  );
}
