"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, PhoneCall, AlertTriangle, CalendarPlus } from "lucide-react";
import { useLeadDetails } from "@/features/telecaller/hooks/useLeadDetails";
import { useFollowups } from "@/features/telecaller/hooks/useFollowups";
import LeadDetailsView from "@/features/leads/components/views/LeadDetailsView";
import LogCallModal from "@/features/telecaller/calls/components/LogCallModal";
import ScheduleFollowupModal from "@/features/telecaller/followups/components/ScheduleFollowupModal";
import Button from "@/components/ui/Button";
import { TELECALLER_TABS_CONFIG } from "@/features/telecaller/constants/telecallerDetailsConfig";
import CallButton from "@/features/telecaller/voice/components/CallButton";
import CallStatusBadge from "@/features/telecaller/voice/components/CallStatusBadge";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";
import UpdateLeadStatusAction from "@/features/telecaller/leads/components/UpdateLeadStatusAction";

export default function TelecallerLeadDetailsClient({ enquiryNo }) {
  const router = useRouter();
  const [isLogCallOpen, setIsLogCallOpen] = useState(false);
  const [isScheduleFollowupOpen, setIsScheduleFollowupOpen] = useState(false);
  const { postCallEnquiryNo, setPostCallEnquiryNo } = useVoice();

  // Fetch all followups to pass to modal for duplicate validation
  const { data: allFollowupsData } = useFollowups("all");
  const allFollowups = Array.isArray(allFollowupsData) ? allFollowupsData : [];

  // If a call just ended for this enquiry, open the log call modal automatically
  useEffect(() => {
    if (postCallEnquiryNo === enquiryNo && !isLogCallOpen) {
      setIsLogCallOpen(true);
      setPostCallEnquiryNo(null);
    }
  }, [postCallEnquiryNo, enquiryNo, isLogCallOpen, setPostCallEnquiryNo]);

  const handleBack = () => router.push("/telecaller/leads");

  const { data: viewModel, isLoading, isError, error } = useLeadDetails(enquiryNo);

  console.groupCollapsed("[TelecallerLead] Render");
  console.log("Enquiry No", enquiryNo);
  console.log("Current status", viewModel?.rawData?.status || viewModel?.status?.stage);
  console.log("Status history", viewModel?.rawData?.statusHistory);
  console.log("Assigned telecaller", viewModel?.rawData?.assignedTo);
  console.groupEnd();

  // ── Error states ────────────────────────────────────────────────────────────
  if (isError && error?.response?.status === 403) {
    return (
      <div className="flex flex-col mt-4 max-w-6xl mx-auto items-center justify-center h-96 font-outfit">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-6 max-w-md text-center">
          You don&apos;t have access to this lead. It may be assigned to another telecaller.
        </p>
        <Button onClick={handleBack} variant="outline">Return to My Leads</Button>
      </div>
    );
  }

  if (isError && error?.response?.status === 404) {
    return (
      <div className="flex flex-col mt-4 max-w-6xl mx-auto items-center justify-center h-96 font-outfit">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Lead Not Found</h2>
        <p className="text-slate-500 mb-6 max-w-md text-center">
          This lead does not exist or has been deleted.
        </p>
        <Button onClick={handleBack} variant="outline">Return to My Leads</Button>
      </div>
    );
  }

  // ── Unified Horizontal Actions Bar ──────────────────────────────────────────
  const actions = (
    <div className="flex items-center gap-2.5 font-outfit">
      <CallStatusBadge />
      
      {/* Vibrant Green #00C853 Call Button */}
      <CallButton
        enquiryNo={enquiryNo}
        phone={viewModel?.contact?.mobile || "9338495402"}
        name={viewModel?.header?.name || "Student"}
        label="Call Student"
        className="h-10 px-4 rounded-xl text-xs font-bold bg-[#00C853] hover:bg-[#00b048] text-white shadow-xs"
      />

      {/* Electric Blue Add Follow-up Button (Replaced purple as requested) */}
      <button
        onClick={() => setIsScheduleFollowupOpen(true)}
        className="h-10 px-4 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200/80 shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <CalendarPlus size={14} />
        <span>Add Follow-up</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 font-outfit space-y-6">
      <LeadDetailsView
        leadId={enquiryNo}
        viewModel={viewModel}
        rawData={viewModel?.rawData}
        isLoading={isLoading}
        isError={isError}
        error={error}
        actions={actions}
        tabsConfig={TELECALLER_TABS_CONFIG}
        showStats={true}
        canEdit={false}
        isTelecaller={true}
      />

      {/* Log Call Modal */}
      {isLogCallOpen && (
        <LogCallModal
          open={isLogCallOpen}
          onClose={() => setIsLogCallOpen(false)}
          enquiryNo={enquiryNo}
        />
      )}

      {/* Schedule Followup Modal */}
      {isScheduleFollowupOpen && (
        <ScheduleFollowupModal
          isOpen={isScheduleFollowupOpen}
          onClose={() => setIsScheduleFollowupOpen(false)}
          initialLeadId={enquiryNo}
          allFollowups={allFollowups}
        />
      )}
    </div>
  );
}
