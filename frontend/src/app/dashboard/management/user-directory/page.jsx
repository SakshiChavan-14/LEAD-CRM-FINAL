"use client";

import PageContainer from "@/components/layout/PageContainer";
import { useState } from "react";
import UsersTable from "@/features/users/components/directory/UsersTable";
import AddUserDialog from "@/features/users/components/dialogs/AddUserDialog";
import { PageHeader } from "@/components/management";

export default function UserDirectoryPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <PageContainer size="wide" className="py-8 space-y-6">
      <PageHeader
        className="px-page-padding py-stack-md w-full bg-surface items-center justify-between"
        title="Telecaller Directory"
        titleClassName="font-title-main text-title-main text-on-surface font-bold leading-tight"
        description="Manage telecallers, assignments and account access."
        descriptionClassName="font-subtitle text-body-sm text-on-surface-variant/80"
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4">
              <button className="w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center text-on-surface-variant">
                {/* Empty in HTML but matches structure */}
              </button>
            </div>
            <div className="relative group">
              <button 
                onClick={() => setIsAddOpen(true)}
                className="bg-primary-container text-on-tertiary font-button-text text-button-text h-[52px] px-6 rounded-card flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
              >
                <span>+ Add Telecaller</span>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
            </div>
          </div>
        }
      />
      <UsersTable />
      
      <AddUserDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </PageContainer>
  );
}
