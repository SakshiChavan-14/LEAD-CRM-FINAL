import { CalendarClock, Clock, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import CallButton from "@/features/telecaller/voice/components/CallButton";

const FollowupSkeleton = () => (
  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm mb-3">
    <div className="flex flex-col gap-2">
      <div className="w-24 h-4 bg-gray-100 animate-pulse rounded"></div>
      <div className="w-16 h-3 bg-gray-100 animate-pulse rounded"></div>
    </div>
    <div className="w-16 h-8 bg-gray-100 animate-pulse rounded-full"></div>
  </div>
);

const BucketGroup = ({ title, items, colorClass, icon: Icon }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className={colorClass.text} />
        <h3 className={`text-[12px] font-bold uppercase tracking-wider ${colorClass.text}`}>{title}</h3>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${colorClass.bg} ${colorClass.text}`}>
          {items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#8B1538]/30 transition-all group">
            <div className="flex flex-col min-w-0">
              <span className="text-[14px] font-semibold text-gray-900 truncate max-w-[120px]">{item.name}</span>
              <span className="text-[12px] text-gray-500 font-medium">{item.time || 'N/A'}</span>
            </div>
            <CallButton
              enquiryNo={item.id}
              name={item.name}
              phone={item.phone}
              className="h-8 px-3 rounded-full bg-white border border-gray-200 text-[#8B1538] hover:bg-[#8B1538] hover:text-white shadow-none font-semibold text-[13px]"
              iconSize={14}
              label="Call"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function UpcomingFollowups({ isLoading, followups = [], leads = [] }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-5 flex flex-col min-h-[380px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900">Follow-ups</h2>
        </div>
        <div className="flex-1">
          {[...Array(4)].map((_, i) => <FollowupSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // Very basic bucketing logic for UI purposes
  const overdue = [];
  const next2h = [];
  const today = [];
  const tomorrow = [];

  const displayFollowups = Array.isArray(followups) ? followups : [];

  displayFollowups.forEach((f, i) => {
    // Mock distribution for the sake of the CRM UI
    if (i === 0) overdue.push(f);
    else if (i === 1) next2h.push(f);
    else if (i === 2) today.push(f);
    else tomorrow.push(f);
  });

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-5 flex flex-col min-h-[380px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[16px] font-semibold text-gray-900">Follow-ups</h2>
        <span className="text-[12px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {displayFollowups.length} remaining
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {displayFollowups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-6">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <CalendarClock className="text-gray-300" size={24} />
            </div>
            <p className="text-[14px] font-semibold text-gray-900">No follow-ups</p>
            <p className="text-[12px] text-gray-500 mt-1 max-w-[200px]">Enjoy your free schedule 🎉</p>
          </div>
        ) : (
          <div>
            <BucketGroup 
              title="Overdue" 
              items={overdue} 
              icon={AlertCircle} 
              colorClass={{ text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10' }} 
            />
            <BucketGroup 
              title="Next 2 Hours" 
              items={next2h} 
              icon={Clock} 
              colorClass={{ text: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' }} 
            />
            <BucketGroup 
              title="Today" 
              items={today} 
              icon={CalendarClock} 
              colorClass={{ text: 'text-[#2563EB]', bg: 'bg-[#2563EB]/10' }} 
            />
            <BucketGroup 
              title="Tomorrow" 
              items={tomorrow} 
              icon={CalendarClock} 
              colorClass={{ text: 'text-[#64748B]', bg: 'bg-gray-100' }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
