"use client";

import { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useLeadImport } from "@/features/leads/import/hooks/useLeadImport";
import { 
  MapPin, 
  User, 
  Smartphone, 
  Mail, 
  GraduationCap, 
  Map, 
  MapPinned, 
  FileText, 
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import UploadIllustration from "@/components/illustrations/UploadIllustration";

const REQUIRED_COLUMNS = [
  { label: "Source", icon: MapPin },
  { label: "Name", icon: User },
  { label: "Mobile", icon: Smartphone },
  { label: "Email", icon: Mail },
  { label: "College", icon: GraduationCap },
  { label: "State", icon: Map },
  { label: "District", icon: MapPinned },
  { label: "Taluk", icon: MapPin },
];

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

export default function ImportLeadsDialog({ open, onClose }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [autoAssign, setAutoAssign] = useState(false);
  const [rowCount, setRowCount] = useState(null);
  
  const fileInputRef = useRef(null);

  const {
    startImport,
    reset,
    stage,
    uploadProgress,
    statusData,
    error: apiError
  } = useLeadImport();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setFile(null);
      setFileError("");
      setIsDragging(false);
      setAutoAssign(false);
      setRowCount(null);
      reset();
    }
  }, [open, reset]);

  const processFile = async (selected) => {
    setFileError("");
    reset();
    if (!selected) {
      setFile(null);
      setRowCount(null);
      return;
    }

    if (selected.type !== "text/csv" && !selected.name.endsWith(".csv")) {
      setFileError("Invalid file format. Please upload a CSV file.");
      setFile(null);
      setRowCount(null);
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setFileError("File exceeds the maximum size limit of 5 MB.");
      setFile(null);
      setRowCount(null);
      return;
    }

    setFile(selected);
    
    // Quick parse for row count
    try {
      const text = await selected.text();
      const lines = text.split("\n").filter(line => line.trim().length > 0);
      setRowCount(lines.length > 1 ? lines.length - 1 : 0);
    } catch {
      setRowCount(null);
    }
  };

  const handleFileChange = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (stage === "uploading" || stage === "processing") return;
    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile);
  };

  const handleImport = () => {
    if (!file) return;
    startImport(file, autoAssign);
  };

  // Status mapping
  const renderStatus = () => {
    if (stage === "completed") {
      const total = statusData?.totalRows ?? rowCount ?? 0;
      const inserted = statusData?.insertedRows ?? statusData?.inserted ?? total;
      const failed = statusData?.failedRows ?? statusData?.failed ?? 0;
      const assigned = statusData?.assignedRows ?? statusData?.assigned ?? (autoAssign ? inserted : 0);
      const isAuto = statusData?.autoAssign ?? autoAssign;

      return (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6 bg-green-50 rounded-2xl border border-green-200 text-center">
            <CheckCircle2 size={44} className="text-green-600 mb-2" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Import Completed Successfully</h3>
            <p className="text-xs text-gray-600 font-medium">
              All leads processed and saved to the CRM pipeline.
            </p>
          </div>

          {/* Progress / Summary Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Import Summary</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-400 block">Total Rows</span>
                <span className="text-lg font-bold text-gray-900">{total}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                <span className="text-[11px] font-semibold text-emerald-600 block">Inserted</span>
                <span className="text-lg font-bold text-emerald-700">{inserted}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
                <span className="text-[11px] font-semibold text-rose-600 block">Failed</span>
                <span className="text-lg font-bold text-rose-700">{failed}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                <span className="text-[11px] font-semibold text-blue-600 block">Assigned</span>
                <span className="text-lg font-bold text-blue-700">{assigned}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs col-span-2 sm:col-span-2">
                <span className="text-[11px] font-semibold text-gray-400 block">Auto Assign</span>
                <span className="text-sm font-bold text-gray-800">{isAuto ? "Yes (Round Robin)" : "No"}</span>
              </div>
              {statusData?.processingTimeMs !== undefined && (
                <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs">
                  <span className="text-[11px] font-semibold text-gray-400 block">Processing Time</span>
                  <span className="text-lg font-bold text-gray-900">{statusData.processingTimeMs} ms</span>
                </div>
              )}
            </div>
            {statusData?.distributionByCaller && Object.keys(statusData.distributionByCaller).length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-2 mt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Lead Assignment Distribution</span>
                <div className="grid grid-cols-2 gap-2.5 text-xs font-medium text-slate-600 font-mono">
                  {Object.entries(statusData.distributionByCaller).map(([empId, count]) => (
                    <div key={empId} className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500">{empId}:</span>
                      <span className="font-bold text-slate-800">{count} {count === 1 ? 'lead' : 'leads'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (stage === "error") {
      return (
        <div className="flex flex-col items-center justify-center py-10 bg-red-50 rounded-2xl border border-red-200 text-center">
          <AlertCircle size={44} className="text-red-500 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Import Failed</h3>
          <p className="text-xs text-gray-600 mb-5 max-w-xs">
            {typeof apiError === "string" ? apiError : apiError?.message || "Failed to process CSV file. Please verify file structure."}
          </p>
          <Button variant="outline" onClick={reset}>
            Try Again
          </Button>
        </div>
      );
    }

    if (stage === "uploading") {
      return (
        <div className="flex flex-col items-center justify-center py-12 border border-blue-100 rounded-2xl bg-sky-50">
          <UploadIllustration state="uploading" className="mb-4 w-24 h-24" />
          <div className="w-64 max-w-full relative px-4 text-center">
            <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
              <span>Uploading CSV...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      );
    }

    if (stage === "processing") {
      const isAutoAssigning = autoAssign || statusData?.autoAssign;
      return (
        <div className="flex flex-col items-center justify-center py-12 border border-blue-100 rounded-2xl bg-sky-50 text-center">
          <Loader2 size={36} className="text-blue-600 animate-spin mb-4" />
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {isAutoAssigning ? "Auto Assigning Leads..." : "Processing Rows..."}
          </h3>
          <p className="text-xs text-gray-500">
            Validating rows and inserting into database pipeline.
          </p>
        </div>
      );
    }

    // Default: Idle state
    return (
      <div className="space-y-6">
        {/* Required CSV Columns */}
        <div>
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Required CSV Columns</h3>
          <div className="flex flex-wrap gap-2">
            {REQUIRED_COLUMNS.map((col, idx) => {
              const IconComponent = col.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600"
                >
                  <IconComponent size={14} className="text-gray-400" />
                  {col.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Drag & Drop Area */}
        {!file && (
          <div
            className={`
              mt-2 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer
              ${isDragging 
                ? "border-blue-500 bg-blue-50/80 shadow-sm scale-[1.01]" 
                : "border-gray-200 hover:border-blue-400 bg-gray-50/50"
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIllustration 
              state={isDragging ? "dragging" : "idle"} 
              className="mb-3 w-24 h-24" 
            />
            <h3 className="text-base font-bold text-gray-900 mb-1">Drag & Drop CSV File Here</h3>
            <p className="text-xs text-gray-400 mb-3">or</p>
            <Button variant="outline" className="mb-4 pointer-events-none bg-white text-xs">Browse Computer</Button>
            <p className="text-[11px] text-gray-400 font-medium">
              Maximum Size: 5 MB &bull; CSV Only
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {/* File Error */}
        {fileError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2 font-medium">
            <AlertCircle size={16} />
            {fileError}
          </div>
        )}

        {/* Selected File Summary */}
        {file && (
          <div className="flex items-center justify-between p-4 border border-blue-100 rounded-2xl bg-sky-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-gray-200 text-blue-600 shadow-2xs">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] font-medium text-gray-500">
                  <span>{formatSize(file.size)}</span>
                  {rowCount !== null && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{rowCount} Rows Detected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setRowCount(null);
                setFileError("");
                reset();
              }}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              aria-label="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Auto Assign Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={autoAssign}
                onChange={(e) => setAutoAssign(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 accent-blue-600 cursor-pointer"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Automatically assign imported leads
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                Distribute imported leads equally among active telecallers using Round Robin assignment.
              </p>
            </div>
          </label>
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import Leads"
      footer={
        stage === "idle" || stage === "error" ? (
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleImport}
              disabled={!file || Boolean(fileError)}
            >
              Import CSV
            </Button>
          </div>
        ) : stage === "completed" ? (
          <div className="flex items-center justify-end w-full">
            <Button variant="admin-primary" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : null
      }
    >
      <div className="mb-5 text-xs text-gray-500 font-medium">
        Upload a CSV file to import student leads into the CRM.
      </div>
      
      {renderStatus()}
    </Modal>
  );
}
