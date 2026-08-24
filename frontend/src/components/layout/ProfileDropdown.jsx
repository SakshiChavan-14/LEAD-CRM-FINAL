"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, Lock, LogOut } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import useAuthStore from "@/store/authStore";
import authService from "@/features/auth/services/authService";
import { ROLES } from "@/constants/roles";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { toast } from "sonner";
import LogoutConfirmModal from "@/components/layout/LogoutConfirmModal";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  
  const user = useAuthStore((state) => state.user);
  const logoutState = useAuthStore((state) => state.logout);
  const { data: profile } = useProfile();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutRequest = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logoutState();
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      toast.success("Logged out successfully. See you next time!");
      setShowLogoutModal(false);
      setTimeout(() => {
        router.push("/");
      }, 400);
    }
  };

  const getProfilePath = () => {
    return user?.userGroup === ROLES.TELE_CALLER ? "/telecaller/profile" : "/dashboard/profile";
  };

  const menuItems = [
    { label: "My Profile", icon: User, onClick: () => { router.push(getProfilePath()); setIsOpen(false); } },
    { label: "Account Settings", icon: Settings, onClick: () => { router.push(getProfilePath()); setIsOpen(false); } },
    { label: "Change Password", icon: Lock, onClick: () => { router.push(getProfilePath()); setIsOpen(false); } },
  ];

  if (!user) return null;

  const displayName = profile?.name || user.name || user.fullName || (user.username === "telecaller" || user.username === "leesha" ? "Karun Poojari" : user.username) || "User";
  const avatarSource = profile?.avatarUrl || user.avatarUrl || user.photo;

  return (
    <>
      <div className="relative font-outfit" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center rounded-full hover:ring-2 hover:ring-blue-500/30 transition-all focus:outline-none cursor-pointer"
          aria-label="User profile menu"
        >
          <Avatar 
            src={avatarSource}
            name={displayName} 
            colorClass="bg-admin-primary-subtle text-admin-primary-text border border-admin-primary-border"
            className="w-10 h-10 border border-slate-200 shadow-2xs hover:scale-105 transition-transform"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <p className="text-xs font-extrabold text-slate-900 truncate">{displayName}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">{user.userGroup?.replace('_', '-') || "TELECALLER"}</p>
            </div>
            
            <div className="py-1.5 px-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50/60 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"
                >
                  <item.icon size={15} className="text-slate-400" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-slate-100 py-1.5 px-1">
              <button
                onClick={handleLogoutRequest}
                className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
