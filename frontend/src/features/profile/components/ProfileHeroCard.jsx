"use client";

import React, { useState } from "react";
import { Camera, Pencil, CheckCircle2, ShieldCheck, Mail, Phone, Building, Briefcase, UserCheck } from "lucide-react";
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

  const name = profile?.name || "Karun Poojari";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "KP";

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 sm:p-8 font-outfit hover:border-slate-300 hover:shadow-md transition-all duration-300 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-50/60 via-purple-50/30 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 z-10">
          
          {/* Avatar Section */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative group cursor-pointer" onClick={() => setIsAvatarUploadOpen(true)}>
              {profile?.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={name} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center text-3xl font-black border-4 border-white shadow-md transition-transform group-hover:scale-105">
                  {initials}
                </div>
              )}
              
              {/* Camera Upload Trigger */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAvatarUploadOpen(true);
                }}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Change profile picture"
                title="Update photo"
              >
                <Camera size={16} />
              </button>
            </div>
            
            {/* Success Toast pill */}
            {showSuccess && (
              <div className="mt-2.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200/80 animate-in fade-in zoom-in-95 shadow-2xs">
                Avatar updated!
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center md:text-left flex flex-col justify-center min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {name}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs">
                    EMP ID: #{profile?.empId || "EMP001"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase shadow-2xs">
                    {profile?.status || "ACTIVE"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-xs font-semibold text-slate-600">
                  <span className="text-blue-600 font-bold uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {profile?.role || "Telecaller"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-bold capitalize">
                    {profile?.department || "Admissions & Counseling"}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500 font-medium">
                    Joined 20 July 2025
                  </span>
                </div>
              </div>
              
              {/* Edit Profile Action */}
              <div className="flex flex-col items-center lg:items-end gap-2 shrink-0">
                <button 
                  onClick={onEditProfile}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold rounded-xl border border-blue-200/80 shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  <Pencil size={14} />
                  <span>Edit Profile</span>
                </button>
                <p className="text-[11px] text-slate-400 font-medium">
                  Last profile sync: Today
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
        currentAvatar={profile?.avatarUrl}
        name={name}
      />
    </>
  );
}
