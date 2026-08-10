import ChartCard from "./ChartCard";

export default function TelecallerLeaderboard({ data, isLoading, onRowClick }) {
  // data expected to be leaderboard array

  return (
    <ChartCard 
      title="Telecaller Leaderboard" 
      subtitle="Ranked by admissions and conversion"
      isLoading={isLoading}
      skeletonHeight="320px"
      action={<span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Top 5</span>}
    >
      {data && (
        <div className="flex flex-col mt-4">
          {data.map((user, index) => (
            <div 
              key={user.id} 
              onClick={() => onRowClick?.(user)}
              className="flex items-center justify-between px-2 h-[64px] border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={`text-[15px] font-bold w-6 text-center
                  ${index === 0 ? 'text-[#F59E0B]' : 
                    index === 1 ? 'text-slate-400' : 
                    index === 2 ? 'text-amber-700' : 
                    'text-slate-300'}`}
                >
                  #{user.rank}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">{user.name}</h4>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-700">{user.admissions} admissions</span> • {user.conversion}%
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[13px] font-medium text-slate-700 leading-tight">{user.calls} calls</p>
                <p className="text-[12px] font-medium text-emerald-600 mt-0.5">+{(Math.random() * 15 + 2).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  );
}
