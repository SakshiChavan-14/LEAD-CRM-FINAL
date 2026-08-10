import { useState } from "react";
import TelecallerLeaderboard from "./TelecallerLeaderboard";
import MonthlyPerformanceTable from "./MonthlyPerformanceTable";
import TelecallerDetailDrawer from "./TelecallerDetailDrawer";

export default function TelecallerPerformanceSection({ data, isLoading }) {
  const [selectedTelecaller, setSelectedTelecaller] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (telecaller) => {
    setSelectedTelecaller(telecaller);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedTelecaller(null), 300); // clear after animation
  };

  return (
    <>
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

      <TelecallerDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
        telecaller={selectedTelecaller} 
      />
    </>
  );
}
