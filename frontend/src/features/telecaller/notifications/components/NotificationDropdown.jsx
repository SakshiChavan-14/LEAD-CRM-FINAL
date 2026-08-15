"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Clock, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useNotifications } from "../hooks/useNotifications";
import { useUnreadNotificationsCount } from "../hooks/useUnreadNotificationsCount";
import { useMarkNotificationRead } from "../hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../hooks/useMarkAllNotificationsRead";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";
import useAuthStore from "@/store/authStore";
import { ROLES } from "@/constants/roles";
import { formatTimeAgo } from "@/utils/dateUtils";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const userRole = user?.userGroup || user?.role;
  const isTelecaller = userRole === ROLES.TELE_CALLER || pathname?.startsWith("/telecaller");

  const { data: unreadData } = useUnreadNotificationsCount({ enabled: isTelecaller });
  const { data: notificationsData, isLoading } = useNotifications(0, 10, { 
    enabled: isTelecaller && isOpen 
  });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Do not render notification bell for non-telecaller roles
  if (!isTelecaller) {
    return null;
  }

  // Determine unread count from various backend payload shapes
  const unreadCount = typeof unreadData === "number" 
    ? unreadData 
    : (unreadData?.count ?? unreadData?.unreadCount ?? unreadData?.data?.count ?? unreadData?.data?.unreadCount ?? (typeof unreadData?.data === "number" ? unreadData.data : 0));

  const notifications = notificationsData?.content 
    || notificationsData?.items 
    || notificationsData?.data?.content 
    || notificationsData?.data?.items 
    || notificationsData?.data 
    || (Array.isArray(notificationsData) ? notificationsData : []);

  const handleNotificationClick = (item) => {
    if (!item.read) {
      markReadMutation.mutate(item.id);
    }
    if (item.referenceId) {
      router.push(`/telecaller/leads/${item.referenceId}`);
    } else if (item.actionUrl || item.link) {
      router.push(item.actionUrl || item.link);
    } else if (item.enquiryNo || item.leadId) {
      router.push(`/telecaller/leads/${item.enquiryNo || item.leadId}`);
    }
    setIsOpen(false);
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllReadMutation.mutate();
  };

  const getTypeIcon = (type, isRead) => {
    if (type === "LEAD_ASSIGNED") {
      return (
        <div className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
          isRead ? "bg-gray-50 text-gray-400" : "bg-blue-50 text-blue-600"
        }`}>
          <User size={16} />
        </div>
      );
    }
    // Unknown types (Neutral slate icon)
    return (
      <div className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
        isRead ? "bg-gray-50 text-gray-400" : "bg-slate-100 text-slate-600"
      }`}>
        <Bell size={16} />
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 relative text-gray-700 transition-colors cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 border border-red-100">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAllReadMutation.isPending}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer disabled:opacity-50"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-6 text-center text-xs text-gray-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="No notifications"
                  description="You are all caught up! No recent notifications."
                />
              </div>
            ) : (
              notifications.map((item) => {
                const isRead = item.read;
                const hasDescription = (item.title && item.message) || item.description || item.body;
                const descriptionText = (item.title && item.message) ? item.message : (item.description || item.body);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isRead ? "bg-white hover:bg-gray-50" : "bg-blue-50/40 hover:bg-blue-50/70"
                    }`}
                  >
                    {/* Left: Type Icon with Unread indicator */}
                    <div className="relative shrink-0 mt-0.5">
                      {getTypeIcon(item.type, isRead)}
                      {!isRead && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${isRead ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                        {item.title || item.message || item.text}
                      </p>
                      {hasDescription ? (
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                          {descriptionText}
                        </p>
                      ) : null}
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-1 font-medium">
                        <Clock size={10} />
                        {formatTimeAgo(item.createdAt) || "Just now"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
