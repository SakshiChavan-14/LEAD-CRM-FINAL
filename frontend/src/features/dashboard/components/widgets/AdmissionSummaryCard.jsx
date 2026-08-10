import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";

const cardClass = "rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 flex flex-col justify-between h-full font-outfit";

export default function AdmissionSummaryCard() {
  // Use existing hook directly — React Query will return the cached data
  const { data } = useDashboardStats();

  const statsList = data?.stats || [];
  const followupsList = data?.tables?.followups;

  // Extract needed metrics
  const newLeadsStats = statsList.find((s) => s.title === "New Today");
  const newLeadsCount = newLeadsStats ? newLeadsStats.value : 0;

  const admissionsStats = statsList.find((s) => s.title === "Admissions");
  const admissionsCount = admissionsStats && admissionsStats.value !== "--" ? admissionsStats.value : 0;

  const upcomingCount = followupsList?.upcoming?.data?.length || 0;
  const overdueCount = followupsList?.overdue?.data?.length || 0;
  const followupsDueCount = upcomingCount + overdueCount;

  return (
    <section className={cardClass}>
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Today&apos;s Admission Summary</h2>
        
        <div className="space-y-4">
          {/* New Leads */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">New Leads</span>
            <span className="font-bold text-slate-800 text-base">{newLeadsCount}</span>
          </div>

          {/* Follow-ups Due */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Follow-ups Due</span>
            <span className="font-bold text-slate-800 text-base">{followupsDueCount}</span>
          </div>

          {/* Admissions */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">Admissions</span>
            <span className="font-bold text-slate-800 text-base">{admissionsCount}</span>
          </div>

          {/* Revenue Impact */}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-50">
            <span className="text-slate-500 font-medium">Revenue Impact</span>
            <span className="font-bold text-slate-800 text-base">₹0</span>
          </div>
        </div>
      </div>

      {/* Target Progress */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>Monthly target not configured</span>
        <button 
          onClick={() => alert("Configure Target dialog...")}
          className="text-[#7F1D1D] font-semibold hover:underline"
        >
          Configure
        </button>
      </div>
    </section>
  );
}
