"use client";

import { useRouter } from "next/navigation";
import TelecallerLeaderboard from "./TelecallerLeaderboard";
import MonthlyPerformanceTable from "./MonthlyPerformanceTable";
// TelecallerDetailDrawer is kept for rollback — uncomment + restore state to revert
// import TelecallerDetailDrawer from "./TelecallerDetailDrawer";

export default function TelecallerPerformanceSection({ data, isLoading, range = "this-month" }) {
  const router = useRouter();

  const handleRowClick = (telecaller) => {
    router.push(
      `/dashboard/reports/telecaller/${telecaller.id}?range=${range}`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TelecallerLeaderboard
        data={data?.leaderboard}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />
      <MonthlyPerformanceTable
        data={data?.productivityTrend}
        isLoading={isLoading}
      />
    </div>
  );
}
