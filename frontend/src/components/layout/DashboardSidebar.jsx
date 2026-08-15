"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, LogOut, Settings } from "lucide-react";

import { IMAGES } from "@/constants/images";
import { ROLES, ROLE_LABELS } from "@/constants/roles";
import useAuthStore from "@/store/authStore";
import authService from "@/features/auth/services/authService";
import { useProfile } from "@/features/profile/hooks/useProfile";
import Avatar from "@/components/ui/Avatar";
import { toast } from "sonner";
import LogoutConfirmModal from "@/components/layout/LogoutConfirmModal";

export default function DashboardSidebar({
  navigation,
  isOpen = false,
  onClose,
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user =
    useAuthStore((state) => state.user) || {
      username: ROLE_LABELS[ROLES.ADMIN],
      userGroup: ROLES.ADMIN,
    };
  
  const logoutState = useAuthStore((state) => state.logout);
  const { data: profile } = useProfile();

  const menu = navigation.filter((item) =>
    item.roles.includes(user.userGroup)
  );

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    },
    [onClose]
  );

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Track expanded state for menus with subItems
  const [expandedMenu, setExpandedMenu] = useState(pathname);

  // Close drawer on navigation (mobile UX)
  const handleNavClick = (path) => {
    if (path === pathname) return;
    onClose?.();
  };

  const toggleSubMenu = (e, path) => {
    e.preventDefault();
    setExpandedMenu(expandedMenu === path ? null : path);
  };

  const handleLogoutRequest = () => {
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
      // Clear all accessible client-side cookies
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

  const displayName = profile?.name || user.name || (user.username === "telecaller" ? "Karun Poojari" : user.username) || "User";
  const avatarSource = profile?.avatarUrl || user.avatarUrl || user.photo;

  // Sidebar content — shared between desktop and mobile
  const sidebarContent = (
    <>
      <div className="border-b border-[#E5E7EB] px-4 py-6 flex items-center gap-3 font-outfit">
        <Image
          src={IMAGES.LOGO}
          alt="GM University"
          width={46}
          height={46}
          className="rounded-full shadow-sm"
        />
        <div>
          <h2 className="font-extrabold text-lg text-slate-900 tracking-tight whitespace-nowrap">GMU Admissions</h2>
          <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#6F1D28]">CRM</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar font-outfit">
        <div className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            
            // For items with subItems, check if the current path matches any subItem
            const hasActiveSub = item.subItems?.some(sub => sub.path === pathname);
            const active = pathname === item.path || hasActiveSub;
            
            const isExpanded = expandedMenu === item.path || hasActiveSub;

            if (item.disabled) {
              return (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-slate-400 opacity-50 cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-bold text-sm tracking-wide">{item.title}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <div key={item.path}>
                <Link
                  href={item.subItems ? "#" : item.path}
                  onClick={(e) => {
                    if (item.subItems) {
                      toggleSubMenu(e, item.path);
                    } else {
                      handleNavClick(item.path);
                    }
                  }}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-all duration-200 font-bold group
                    ${active
                      ? "bg-[#6F1D28]/10 text-[#6F1D28] shadow-2xs border border-[#6F1D28]/25"
                      : "text-slate-600 hover:bg-[#6F1D28]/5 hover:text-[#6F1D28]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={`transition-colors duration-200 ${active ? "text-[#6F1D28]" : "text-slate-400 group-hover:text-[#6F1D28]"}`} />
                    <span className="font-bold text-xs tracking-wide">{item.title}</span>
                  </div>
                  {item.subItems && (
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#6F1D28]" : "text-slate-400 group-hover:text-[#6F1D28]"}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* SubItems rendering */}
                {item.subItems && isExpanded && (
                  <div className="mt-1 ml-[22px] border-l-2 border-slate-200 pl-3 space-y-1 py-1">
                    {item.subItems.map((subItem) => {
                      const subActive = pathname === subItem.path;
                      
                      return (
                        <Link
                          key={subItem.title}
                          href={subItem.path}
                          onClick={() => handleNavClick(subItem.path)}
                          className={`block rounded-lg px-3 py-1.5 text-xs transition-all duration-200 font-bold
                            ${subActive
                              ? "text-[#6F1D28] font-extrabold bg-[#6F1D28]/10"
                              : "text-slate-500 hover:text-[#6F1D28] hover:bg-[#6F1D28]/5"
                            }
                          `}
                        >
                          {subItem.title}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-[#E5E7EB] mt-auto shrink-0 bg-white font-outfit">
        <div className="flex items-center gap-2.5 p-2 bg-slate-50/70 rounded-xl border border-slate-200/80 transition-all hover:shadow-2xs">
          <Avatar 
            src={avatarSource}
            name={displayName}
            size="sm"
            colorClass="bg-admin-primary-subtle text-admin-primary-text"
            className="w-8 h-8 rounded-full border border-admin-primary-border shadow-2xs shrink-0"
          />
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-extrabold text-xs leading-tight text-slate-900">
              {displayName}
            </p>
            <p className="truncate text-[9px] text-[#6F1D28] uppercase tracking-wider font-extrabold mt-0.5">
              {user.userGroup?.replace('_', '-') || "TELECALLER"}
            </p>
          </div>
          <Link 
            href={user.userGroup === ROLES.TELE_CALLER ? "/telecaller/profile" : "/dashboard/profile"} 
            className="text-slate-400 hover:text-[#6F1D28] pr-1 transition-colors hover:rotate-90 duration-300" 
            onClick={onClose}
          >
            <Settings size={15} />
          </Link>
        </div>
        
        <button 
          onClick={handleLogoutRequest}
          className="flex items-center justify-center gap-2 mt-2 px-4 py-2 text-slate-500 hover:text-rose-600 w-full font-bold text-xs transition-colors rounded-xl hover:bg-rose-50 cursor-pointer active:scale-95"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* ===== Desktop Sidebar (≥lg) ===== */}
      <aside className="hidden lg:flex w-[260px] h-screen border-r border-[#E5E7EB] bg-white flex-col shadow-2xs font-outfit">
        {sidebarContent}
      </aside>

      {/* ===== Mobile Drawer (<lg) ===== */}
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        id="mobile-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px] bg-white flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out lg:hidden font-outfit
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close navigation menu"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200 cursor-pointer"
        >
          <X size={16} />
        </button>

        {sidebarContent}
      </aside>

      {/* Logout Confirmation Modal — rendered via portal at body level */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
