import React from "react";
import { Camera, Edit2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import AvatarUploadDialog from "./AvatarUploadDialog";
import { useState } from "react";

export default function ProfileHeader({ profile, onEditProfile }) {
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[16px] shadow-sm border border-[#ECECEC] p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar 
              src={profile.avatarUrl} 
              name={profile.name} 
              size="2xl" 
              className="border-4 border-white shadow-md"
            />
            <button 
              onClick={() => setIsAvatarUploadOpen(true)}
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-[#7A1F2B] hover:border-[#7A1F2B]/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Change profile picture"
            >
              <Camera size={16} />
            </button>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full pt-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-[15px] text-gray-500 font-medium mt-1">
                  {profile.role} • {profile.department}
                </p>
              </div>
              
              <Button 
                onClick={onEditProfile}
                variant="outline" 
                className="flex items-center gap-2 self-center md:self-start"
              >
                <Edit2 size={16} />
                Edit Profile
              </Button>
            </div>

            {/* Badges / Quick Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                ID: {profile.empId}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                {profile.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AvatarUploadDialog 
        isOpen={isAvatarUploadOpen} 
        onClose={() => setIsAvatarUploadOpen(false)}
        currentAvatar={profile.avatarUrl}
        name={profile.name}
      />
    </>
  );
}
