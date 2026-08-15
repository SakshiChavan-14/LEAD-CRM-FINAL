"use client";

import { useState, useRef } from "react";
import { 
  Pencil, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone as PhoneIcon, 
  Building, 
  Calendar, 
  Camera, 
  Shield 
} from "lucide-react";
import EditUserDialog from "../dialogs/EditUserDialog";
import useUpdateTelecallerStatus from "@/features/users/hooks/useUpdateTelecallerStatus";
import useUploadTelecallerAvatar from "@/features/users/hooks/useUploadTelecallerAvatar";

export default function TelecallerHeader({ profile }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTelecallerStatus(profile?.empId);

  const handleToggleStatus = () => {
    if (!profile?.empId) return;
    const newStatus = profile.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    updateStatus(newStatus);
  };

  const fileInputRef = useRef(null);
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadTelecallerAvatar(profile?.empId);

  const handleAvatarClick = () => {
    if (!isUploadingAvatar) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
    e.target.value = "";
  };

  if (!profile) return null;

  const initials = (profile.name || "Telecaller")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "TC";

  const isActive = (profile.status || "ACTIVE").toUpperCase() === "ACTIVE";

  return (
    <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200/80 shadow-sm font-outfit transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        
        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Camera Upload Badge */}
          <div className="relative group shrink-0">
            <div 
              onClick={handleAvatarClick}
              className="w-20 h-20 md:w-22 md:h-22 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-md border-2 border-white cursor-pointer hover:opacity-95 transition-all"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            
            {/* Camera / Image Icon Badge */}
            <div 
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 bg-admin-primary hover:bg-admin-primary-hover text-white p-1.5 rounded-full border-2 border-white flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-110"
              title="Upload photo"
            >
              <Camera size={13} className="text-white" />
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Name & Role Details */}
          <div className="flex flex-col text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {profile.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                {profile.role || "Telecaller"}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-2xs ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                    : "bg-rose-50 text-rose-700 border-rose-200/80"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            
            {/* Contact Pills in Good Colors */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs font-medium text-slate-600">
              {profile.email && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg hover:text-blue-600 transition-colors">
                  <Mail size={13} className="text-slate-400" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg hover:text-blue-600 transition-colors">
                  <PhoneIcon size={13} className="text-slate-400" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.department && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                  <Building size={13} className="text-slate-400" />
                  <span>{profile.department}</span>
                </div>
              )}
              {profile.joiningDate && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg">
                  <Calendar size={13} className="text-slate-400" />
                  <span>Joined {profile.joiningDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions (Prominent Edit User button & Activate/Deactivate) */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start lg:justify-end gap-3 shrink-0">
          <button 
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/90 text-slate-700 hover:text-admin-primary-text hover:border-admin-primary-border text-xs font-bold rounded-xl shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            <Pencil size={14} />
            <span>Edit User</span>
          </button>

          <button
            onClick={handleToggleStatus}
            disabled={isUpdatingStatus}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-2xs border cursor-pointer active:scale-95 ${
              isActive
                ? "border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100"
                : "border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
            } ${isUpdatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isActive ? <UserX size={14} /> : <UserCheck size={14} />}
            <span>{isActive ? "Deactivate" : "Activate"}</span>
          </button>
        </div>
      </div>

      <EditUserDialog
        open={isEditOpen}
        user={profile}
        onClose={() => setIsEditOpen(false)}
      />
    </div>
  );
}
