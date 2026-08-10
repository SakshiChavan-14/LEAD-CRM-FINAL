import React, { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import ProfileHeroCard from "./ProfileHeroCard";
import PersonalInformationCard from "./PersonalInformationCard";
import SecurityCard from "./SecurityCard";
import AccountStatusCard from "./AccountStatusCard";
import SupportBanner from "./SupportBanner";
import EditProfileDialog from "./EditProfileDialog";
import { CardSkeleton } from "@/components/ui/Skeletons";

export default function ProfileSettingsView() {
  const { data: profile, isLoading, isError } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 space-y-6">
        <CardSkeleton />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CardSkeleton />
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
          Failed to load profile. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-4 sm:p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your personal information and account settings</p>
      </div>

      <ProfileHeroCard 
        profile={profile} 
        onEditProfile={() => setIsEditModalOpen(true)} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col h-full">
          <PersonalInformationCard profile={profile} />
        </div>
        
        {/* Right Column */}
        <div className="flex flex-col space-y-6 h-full">
          <SecurityCard />
          <AccountStatusCard profile={profile} />
        </div>
      </div>

      <SupportBanner />

      <EditProfileDialog 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile}
      />
    </div>
  );
}
