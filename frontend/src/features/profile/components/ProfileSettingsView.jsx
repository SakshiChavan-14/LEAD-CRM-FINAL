"use client";

import React, { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import ProfileHeroCard from "./ProfileHeroCard";
import PersonalInformationCard from "./PersonalInformationCard";
import SecurityCard from "./SecurityCard";
import SupportBanner from "./SupportBanner";
import EditProfileDialog from "./EditProfileDialog";
import { CardSkeleton } from "@/components/ui/Skeletons";
import { UserCheck } from "lucide-react";

export default function ProfileSettingsView() {
  const { data: profile, isLoading, isError } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 font-outfit">
        <CardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 font-outfit">
        <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl border border-rose-200 shadow-xs text-center">
          <h3 className="text-base font-extrabold">Failed to load profile details</h3>
          <p className="text-xs text-rose-500 mt-1">Please check your network connection or try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6 font-outfit animate-in fade-in duration-300">
        
        {/* Profile Hero Card */}
        <ProfileHeroCard 
          profile={profile} 
          onEditProfile={() => setIsEditModalOpen(true)} 
        />

        {/* 2-Column Balanced Grid: Personal Info + Security (No Account Status Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Personal Information */}
          <div className="flex flex-col h-full">
            <PersonalInformationCard profile={profile} />
          </div>
          
          {/* Right Column: Security & Authentication */}
          <div className="flex flex-col h-full">
            <SecurityCard />
          </div>
        </div>



        {/* Edit Profile Modal */}
        <EditProfileDialog 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          profile={profile}
        />
      </div>
    </div>
  );
}
