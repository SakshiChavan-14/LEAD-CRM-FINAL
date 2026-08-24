"use client";

import { useState } from "react";
import ErrorState from "@/components/ui/ErrorState";
import { LayoutDashboard, History, FileText } from "lucide-react";

import { TABS_CONFIG } from "@/features/leads/constants/detailsConfig";
import LeadHeaderCard from "@/features/leads/components/profile/LeadHeaderCard";
import LeadStatisticsSection from "@/features/leads/components/statistics/LeadStatisticsSection";
import ProfileSkeleton from "@/features/leads/components/profile/ProfileSkeleton";
import EditLeadDialog from "@/features/leads/components/dialogs/EditLeadDialog";

export default function LeadDetailsView({
  leadId,
  viewModel,
  rawData,
  isLoading,
  isError,
  error,
  isDeleting,
  onDelete,
  onEdit,
  canEdit = true,
  isTelecaller = false,
  actions,
  tabsConfig,
  showStats = true,
}) {
  const [activeTab, setActiveTab] = useState((tabsConfig || TABS_CONFIG)[0].id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const resolvedTabs = tabsConfig || TABS_CONFIG;
  const activeTabConfig = resolvedTabs.find((t) => t.id === activeTab) || resolvedTabs[0];
  const ActiveTabComponent = activeTabConfig.component;

  if (isLoading) return <ProfileSkeleton />;

  if (isError) {
    return (
      <div className="mt-6">
        <ErrorState
          title="Error Loading Lead Details"
          message={error?.response?.data?.message || error?.message || "Failed to load lead details."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!viewModel) return null;

  console.groupCollapsed("[LeadDetails] Render");
  console.log("Lead ID", leadId);
  console.log("Raw status", rawData?.status);
  console.log("Status history", viewModel?.statusHistory || rawData?.statusHistory);
  console.log("Calls", rawData?.calls?.length);
  console.log("Followups", rawData?.followups?.length);
  console.log("Timeline", rawData?.timeline?.length);
  console.groupEnd();

  return (
    <div className="flex flex-col gap-6 w-full font-outfit">
      
      {/* ── Lead Header & Metadata ─────────────────────────────────────────────── */}
      <LeadHeaderCard
        viewModel={viewModel}
        rawData={rawData}
        actions={actions}
        onDelete={onDelete}
        onEdit={canEdit ? (onEdit || (() => setIsEditModalOpen(true))) : undefined}
      />

      {isEditModalOpen && (
        <EditLeadDialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          lead={rawData}
        />
      )}

      {/* ── Statistics Section ─────────────────────────────────────────────────── */}
      {showStats && <LeadStatisticsSection leadId={leadId} viewModel={viewModel} rawData={rawData} isTelecaller={isTelecaller} />}

      {/* ── Tabs Navigation (Standard Slate UI with Smooth Active Indicator) ───── */}
      <nav className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto [scrollbar-width:none]">
        {resolvedTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const getIcon = (id) => {
            if (id === "info" || id === "overview") return LayoutDashboard;
            if (id === "notes") return FileText;
            if (id === "timeline" || id === "activity") return History;
            return LayoutDashboard;
          };
          const Icon = getIcon(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 flex items-center gap-2 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Active Tab Content ─────────────────────────────────────────────────── */}
      <ActiveTabComponent data={viewModel} rawData={rawData} leadId={leadId} />

    </div>
  );
}
