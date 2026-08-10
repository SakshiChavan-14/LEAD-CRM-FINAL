import Select from "@/components/ui/Select";
import ExportReportButton from "./ExportReportButton";

export default function ReportsToolbar({ range, setRange, team, setTeam, isLoading }) {
  const rangeOptions = [
    { value: "this-month", label: "This Month" },
    { value: "last-month", label: "Last Month" },
    { value: "last-3-months", label: "Last 3 Months" },
  ];

  const teamOptions = [
    { value: "all", label: "All Teams" },
    { value: "admissions", label: "Admissions" },
    { value: "sales", label: "Sales" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3 w-full max-w-[420px]">
        <div className="flex-1 min-w-[140px]">
          <Select 
            value={range} 
            onChange={(e) => setRange(e.target.value)} 
            options={rangeOptions} 
            disabled={isLoading}
          />
        </div>

        <div className="flex-1 min-w-[140px]">
          <Select 
            value={team} 
            onChange={(e) => setTeam(e.target.value)} 
            options={teamOptions} 
            disabled={isLoading}
          />
        </div>
      </div>

      <ExportReportButton range={range} team={team} disabled={isLoading} />
    </div>
  );
}
