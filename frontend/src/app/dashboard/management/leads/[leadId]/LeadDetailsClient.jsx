"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useLeadDetails } from "@/features/leads/hooks/useLeadDetails";
import { useDeleteLead } from "@/features/leads/hooks/useDeleteLead";
import { mapLeadToViewModel } from "@/features/leads/utils/leadViewModelMapper";
import LeadDetailsView from "@/features/leads/components/views/LeadDetailsView";
import AssignLeadAction from "@/features/leads/components/assignments/AssignLeadAction";
import { useConfirm } from "@/hooks/useConfirm";

export default function LeadDetailsClient({ leadId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const telecallerId = searchParams.get("userId");
  const backUrl = searchParams.get("backUrl");
  const confirm = useConfirm();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else if (from === "telecaller" && telecallerId) {
      router.push(`/dashboard/management/user-directory/${telecallerId}`);
    } else {
      router.push("/dashboard/management/leads");
    }
  };

  const { data: rawData, isLoading, isError, error } = useLeadDetails(leadId);
  const { mutate: deleteLead, isPending: isDeleting } = useDeleteLead(handleBack);
  const viewModel = mapLeadToViewModel(rawData);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Delete Lead?",
      description: "Are you sure you want to delete this lead? This action cannot be undone.",
      variant: "danger",
      confirmText: "Delete",
    });
    if (confirmed) deleteLead(leadId);
  };

  const isAssigned = viewModel?.assignment?.telecaller && viewModel.assignment.telecaller !== "Unassigned";
  const currentTelecallerId = rawData?.lead?.assignedTo?._id || rawData?.lead?.assignedTo?.id || rawData?.telecallerId || rawData?.assigneeId;

  // Admin-specific hero actions (Assign Lead only — Edit & Delete are in ProfileHeader)
  const actions = (
    <AssignLeadAction 
      leadId={leadId} 
      isAssigned={isAssigned} 
      currentTelecallerId={currentTelecallerId} 
    />
  );

  return (
    <div className="py-6 px-4 sm:px-6 max-w-[1600px] mx-auto w-full font-outfit">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleBack}
          className="px-3.5 py-2 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-2 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer active:scale-95"
        >
          <ArrowLeft size={15} />
          {backUrl ? "Back" : "Back to Leads"}
        </button>
      </div>

      <LeadDetailsView
        leadId={leadId}
        rawData={rawData}
        viewModel={viewModel}
        isLoading={isLoading}
        isError={isError}
        error={error}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        actions={actions}
        showStats={true}
      />
    </div>
  );
}
