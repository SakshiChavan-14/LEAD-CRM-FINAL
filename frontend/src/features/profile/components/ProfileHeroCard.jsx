import React, { useState, useEffect } from "react";
import { Camera, Edit2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import AvatarUploadDialog from "./AvatarUploadDialog";

export default function ProfileHeroCard({ profile, onEditProfile }) {
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAvatarUploadSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <>
      <div className="relative bg-gradient-to-r from-[#7A1F2B]/5 to-transparent bg-white rounded-[24px] shadow-sm border border-[#ECECEC] p-6 lg:p-8 mb-6 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 z-10">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <Avatar 
                src={profile.avatarUrl} 
                name={profile.name} 
                size="3xl" // Need to ensure 3xl or custom class gives ~112px
                className="w-28 h-28 text-4xl border-4 border-white shadow-md transition-transform group-hover:scale-[1.02]"
              />
              <button 
                onClick={() => setIsAvatarUploadOpen(true)}
                className="absolute bottom-0 right-0 bg-white p-2.5 rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-[#7A1F2B] hover:border-[#7A1F2B]/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Change profile picture"
              >
                <Camera size={18} />
              </button>
            </div>
            
            {/* Success Indicator */}
            <div className={`mt-3 text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 transition-all duration-500 ease-in-out ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
              Profile photo updated
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{profile.name}</h1>
                <p className="text-[16px] text-[#7A1F2B] font-semibold mt-1.5 uppercase tracking-wide">
                  {profile.role} <span className="text-gray-400 font-medium lowercase px-1">•</span> <span className="text-gray-500 font-medium capitalize tracking-normal">{profile.department}</span>
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 tracking-wider">
                    ID: {profile.empId}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 uppercase">
                    {profile.status}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-center md:items-end gap-3">
                <Button 
                  onClick={onEditProfile}
                  className="bg-[#7A1F2B] hover:bg-[#6a1b26] text-white flex items-center gap-2 px-6 shadow-md shadow-rose-900/10 rounded-xl"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </Button>
                <p className="text-[12px] text-gray-400 font-medium">
                  Last updated: 20 July 2025 {/* Hardcoded for design sync, update if available */}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <AvatarUploadDialog 
        isOpen={isAvatarUploadOpen} 
        onClose={() => setIsAvatarUploadOpen(false)}
        onSuccess={handleAvatarUploadSuccess}
        currentAvatar={profile.avatarUrl}
        name={profile.name}
      />
    </>
  );
}
