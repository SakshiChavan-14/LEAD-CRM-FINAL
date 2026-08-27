"use client";

import { useDetailNavigation } from "@/hooks/useDetailNavigation";
import TelecallerLeaderboard from "./TelecallerLeaderboard";
import MonthlyPerformanceTable from "./MonthlyPerformanceTable";

export default function TelecallerPerformanceSection({ data, isLoading, range = "this-month" }) {
  const { navigateToDetail } = useDetailNavigation();

  const handleRowClick = (telecaller) => {
    navigateToDetail(
      `/dashboard/reports/telecaller/${telecaller.id}?range=${range}`
    );
  };

  return (
    <div className="w-full">
      <TelecallerLeaderboard
        data={data?.leaderboard}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
