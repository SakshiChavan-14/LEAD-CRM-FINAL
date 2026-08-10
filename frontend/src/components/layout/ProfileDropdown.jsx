"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, Lock, LogOut } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import useAuthStore from "@/store/authStore";
import authService from "@/features/auth/services/authService";
import { ROLES } from "@/constants/roles";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  
  const user = useAuthStore((state) => state.user);
  const logoutState = useAuthStore((state) => state.logout);

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

  const handleLogout = async () => {
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
      
      router.push("/");
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#7A1F2B]/20 transition-all focus:outline-none"
      >
        <Avatar 
          name={user.username || "User"} 
          className="w-10 h-10 border border-gray-200 shadow-sm"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user.userGroup.replace('_', '-')}</p>
          </div>
          
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <item.icon size={16} className="text-gray-400" />
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
