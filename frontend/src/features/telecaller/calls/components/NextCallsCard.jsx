import { PhoneCall, Star, Clock, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import CallButton from "@/features/telecaller/voice/components/CallButton";
import Link from "next/link";

const NextCallSkeleton = () => (
  <div className="flex flex-col p-4 rounded-xl border border-gray-200 bg-white mb-3">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse shrink-0"></div>
      <div className="flex flex-col gap-2">
        <div className="w-32 h-4 bg-gray-100 animate-pulse rounded"></div>
        <div className="w-20 h-3 bg-gray-100 animate-pulse rounded"></div>
      </div>
    </div>
  </div>
);

export default function NextCallsCard({ isLoading, nextCalls, onLogCall }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-5 flex flex-col min-h-[240px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-semibold text-gray-900">Next Best Lead</h2>
        </div>
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => <NextCallSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[16px] shadow-sm p-5 h-full flex flex-col min-h-[240px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Star className="text-[#F59E0B] fill-[#F59E0B]" size={18} />
          <h2 className="text-[16px] font-semibold text-gray-900">Next Best Lead</h2>
        </div>
        <span className="text-[12px] font-bold text-[#8B1538] bg-[#8B1538]/10 px-2 py-0.5 rounded-full">
          {nextCalls?.length || 0} Priority
        </span>
      </div>
      
      {!nextCalls || nextCalls.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center flex-1 h-[240px]">
          <h3 className="text-[18px] font-bold text-gray-900 mb-1">All caught up</h3>
          <p className="text-[14px] text-gray-500 mb-6">No priority leads right now.</p>
          <Link href="/telecaller/leads">
            <Button variant="primary" className="bg-[#8B1538] hover:bg-[#6F102D] text-white rounded-xl shadow-sm px-6 font-semibold">
              Open My Leads
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {nextCalls.map((call) => (
            <div key={call.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-[#8B1538]/30 hover:shadow-sm transition-all group gap-4">
              
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-gray-900 truncate mb-0.5">{call.name}</span>
                  <div className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
                    <span className="truncate max-w-[120px]">{call.course || "General"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {call.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                {call.score ? (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Score</span>
                    <span className="text-[14px] font-bold text-green-600">{call.score}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Score</span>
                    <span className="text-[14px] font-bold text-green-600">82</span>
                  </div>
                )}
                <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
                  <CallButton
                    enquiryNo={call.id}
                    name={call.name}
                    phone={call.phone}
                    className="h-8 px-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-semibold text-[13px] border border-green-200/50 shadow-none"
                    iconSize={14}
                    label="Call"
                  />
                  <Link href={`/telecaller/leads/${call.id}`}>
                    <Button variant="outline" className="h-8 px-3 rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-[13px] shadow-none flex items-center gap-1.5">
                      <ExternalLink size={14} /> Open
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
