"use client";

import useAuthStore from "@/store/authStore";
import { useProfile } from "@/features/profile/hooks/useProfile";
import TodayGoalGauge from "./TodayGoalGauge";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function GreetingBlock() {
  const user = useAuthStore((state) => state.user);
  const { data: profile } = useProfile();
  
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const rawName = profile?.name || profile?.fullName || user?.name || user?.username || user?.empName || "Telecaller";
  const firstName = rawName.trim().split(/\s+/)[0];
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const greeting = getGreeting();

  return (
    <div className="flex flex-col h-[64px] justify-center">
      <h1 className="text-[36px] font-bold text-gray-900 tracking-tight leading-none">
        {greeting}, {capitalizedFirstName} 👋
      </h1>
      <p className="text-[12px] text-gray-500 font-medium mt-1.5">
        Let&apos;s make today count! • {today}
      </p>
    </div>
  );
}

export default function DashboardHeader({ isLoading, summary }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
      <GreetingBlock />
      <TodayGoalGauge isLoading={isLoading} summary={summary} />
    </div>
  );
}
