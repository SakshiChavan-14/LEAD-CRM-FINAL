"use client";

import useAuthStore from "@/store/authStore";
import TodayGoalGauge from "./TodayGoalGauge";

function GreetingBlock() {
  const user = useAuthStore((state) => state.user);
  
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const firstName = user?.name?.split(' ')[0] || user?.username || "Sakshi";

  return (
    <div className="flex flex-col h-[64px] justify-center">
      <h1 className="text-[36px] font-bold text-gray-900 tracking-tight leading-none">
        Hello, Karun 👋
      </h1>
      <p className="text-[12px] text-gray-500 font-medium mt-1.5">
        Let's make today count! • {today}
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
