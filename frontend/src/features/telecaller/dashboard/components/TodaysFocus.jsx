import { ChevronRight } from "lucide-react";
import Link from "next/link";

const FocusItemSkeleton = () => (
  <div className="flex items-center justify-between px-4 h-[64px] rounded-2xl border border-gray-100 bg-white mb-2">
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-gray-100 animate-pulse"></div>
      <div className="w-32 h-4 bg-gray-100 animate-pulse rounded"></div>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-6 h-5 rounded bg-gray-100 animate-pulse"></div>
    </div>
  </div>
);

const FocusItem = ({ title, count, dotColor, link }) => {
  return (
    <Link href={link} className="block mb-2 outline-none">
      <div className="flex items-center justify-between px-4 h-[64px] rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 group cursor-pointer bg-white">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shadow-[0_0_0_4px_rgba(255,255,255,1)] ring-1 ring-black/5 group-hover:scale-125 transition-transform duration-300`}></div>
          <span className="text-[14px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[16px] font-bold text-gray-900">{count}</span>
          <ChevronRight size={16} strokeWidth={2.5} className="text-gray-300 group-hover:text-[#8B1538] transition-colors" />
        </div>
      </div>
    </Link>
  );
};

export default function TodaysFocus({ isLoading, focus }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-5 flex flex-col min-h-[380px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900">Today's Focus</h2>
        </div>
        <div className="flex-1">
          {[...Array(4)].map((_, i) => <FocusItemSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!focus) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-5 flex flex-col min-h-[380px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-semibold text-gray-900">Today's Focus</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <FocusItem 
          title="High Priority Leads" 
          count={focus.highPriority}
          dotColor="bg-[#EF4444]"
          link="/telecaller/leads?priority=high"
        />
        <FocusItem 
          title="Overdue Follow-ups" 
          count={focus.overdueFollowups}
          dotColor="bg-[#F59E0B]"
          link="/telecaller/followups?status=overdue"
        />
        <FocusItem 
          title="Calls Remaining" 
          count={focus.callsRemaining}
          dotColor="bg-[#2563EB]"
          link="/telecaller/calls?status=pending"
        />
        <FocusItem 
          title="Near Conversion" 
          count={focus.nearConversion}
          dotColor="bg-[#16A34A]"
          link="/telecaller/leads?stage=documents"
        />
      </div>
    </div>
  );
}
