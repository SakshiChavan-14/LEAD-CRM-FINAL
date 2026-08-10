import { Users, Trophy, Target } from "lucide-react";

export function TeamSnapshotSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center gap-4 h-[120px]">
          <div className="w-12 h-12 bg-slate-100 animate-pulse rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="w-20 h-4 bg-slate-100 animate-pulse rounded" />
            <div className="w-full h-5 bg-slate-100 animate-pulse rounded" />
            <div className="w-24 h-3 bg-slate-100 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TeamSnapshotSection({ data, isLoading }) {
  if (isLoading) return <TeamSnapshotSkeleton />;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Active Telecallers */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-4 flex items-center gap-5 h-[120px]">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
          <Users size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-[32px] font-bold text-slate-900 leading-none tracking-tight">{data.activeTelecallers}</h4>
          <p className="text-[13px] font-medium text-slate-500 tracking-tight mt-1">Active Telecallers</p>
          <p className="text-[12px] text-slate-400 mt-1">Currently reporting</p>
        </div>
      </div>

      {/* Top Performer */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-4 flex items-center gap-5 h-[120px]">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0">
          <Trophy size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h4 className="text-[20px] font-bold text-slate-900 leading-tight truncate">{data.topPerformer.name}</h4>
          <p className="text-[13px] font-medium text-slate-500 tracking-tight mt-0.5">Top Performer</p>
          <p className="text-[12px] text-slate-400 mt-1">{data.topPerformer.admissions} admissions this month</p>
        </div>
      </div>

      {/* Team Goal */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-4 flex items-center gap-5 h-[120px]">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0">
          <Target size={24} strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-end mb-1">
            <h4 className="text-[20px] font-bold text-slate-900 leading-tight">{data.teamGoal.percentage}%</h4>
            <p className="text-[12px] text-slate-400">{data.teamGoal.percentage} / 100 target achieved</p>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#10B981] rounded-full transition-all duration-1000" 
              style={{ width: `${data.teamGoal.percentage}%` }}
            />
          </div>
          <p className="text-[13px] font-medium text-slate-500 tracking-tight mt-2">Team Goal</p>
        </div>
      </div>
    </div>
  );
}
