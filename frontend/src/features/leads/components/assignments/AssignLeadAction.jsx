"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import AssignLeadsModal from "@/features/leads/components/dialogs/AssignLeadsModal";
import useUsers from "@/features/users/hooks/useUsers";
import { useAssignLeads } from "@/features/leads/hooks/useAssignLeads";

export default function AssignLeadAction({ leadId, isAssigned, currentTelecallerId, fullWidth }) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  
  const { data: usersData } = useUsers({ size: 1000 });
  const telecallers = usersData?.users || [];
  const { mutate: assignLeads, isPending: isAssigning } = useAssignLeads(() => {
    setIsAssignModalOpen(false);
  });

  const handleAssign = (selectedTelecallerId) => {
    assignLeads({
      userId: selectedTelecallerId,
      enquiryIds: [leadId],
    });
  };

  const mode = isAssigned ? "reassign" : "assign";

  return (
    <>
      <button 
        className={`inline-flex items-center justify-center gap-2 bg-admin-primary hover:bg-admin-primary-hover active:bg-admin-primary-active active:scale-95 text-white font-bold text-xs rounded-xl shadow-2xs px-4 py-2 transition-all cursor-pointer ${fullWidth ? 'w-full' : ''}`}
        onClick={() => setIsAssignModalOpen(true)}
      >
        <UserPlus size={14} />
        <span>{isAssigned ? "Reassign Lead" : "Assign Lead"}</span>
      </button>

      {isAssignModalOpen && (
        <AssignLeadsModal
          open={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssign}
          telecallers={telecallers}
          selectedCount={1}
          isAssigning={isAssigning}
          mode={mode}
          currentTelecallerId={currentTelecallerId}
        />
      )}
    </>
  );
}
