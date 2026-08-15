"use client";

import React, { useState } from "react";
import CreateLeadDialog from "@/features/leads/components/dialogs/CreateLeadDialog";
import ImportLeadsDialog from "@/features/leads/components/dialogs/ImportLeadsDialog";
import { useExportLeads } from "@/features/leads/hooks/useExportLeads";
import { useConfirm } from "@/hooks/useConfirm";

import PageHeader from "@/components/management/PageHeader";

export default function LeadsHeader() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const { mutate: exportLeads, isPending: isExporting } = useExportLeads();
  const confirm = useConfirm();

  const handleExport = async () => {
    const isConfirmed = await confirm({
      title: "Export Leads?",
      description: "Are you sure you want to export all matching leads to a CSV?",
      confirmText: "Export",
      variant: "admin-primary",
    });
    if (isConfirmed) {
      exportLeads({});
    }
  };

  return (
    <>
      <PageHeader
        title="Leads Management"
        titleClassName="text-4xl font-bold text-gray-900 leading-tight"
        description="View and manage all system leads"
        descriptionClassName="mt-1 text-base text-gray-500"
        className="sm:items-end"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsImportOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-gray-500">upload</span>
              Import CSV
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-admin-primary text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-admin-primary-hover active:bg-admin-primary-active active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Lead
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl shadow-xs hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-gray-500">download</span>
              {isExporting ? "Exporting…" : "Export"}
            </button>
          </div>
        }
      />

      {/* Dialogs — rendered outside layout containers so they portal correctly */}
      <CreateLeadDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <ImportLeadsDialog open={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </>
  );
}
