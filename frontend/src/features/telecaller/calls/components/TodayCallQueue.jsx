import React, { useState, useRef, useEffect } from "react";
import { Phone, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { useTodayCallQueue } from "../hooks/useTodayCallQueue";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeletons";
import Avatar from "@/components/ui/Avatar";
import StatusBadge from "@/components/table/StatusBadge";
import { useVoice } from "@/features/telecaller/voice/context/VoiceProvider";
import { useRouter } from "next/navigation";

export default function TodayCallQueue() {
  const { summary, recommendedLead, queue, isLoading } = useTodayCallQueue();
  const { setSelectedCallId } = useVoice();
  const router = useRouter();
  
  const scrollRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  if (isLoading) {
    return <CardSkeleton />;
  }

  const handleCall = (e, id) => {
    e.stopPropagation();
    setSelectedCallId(id);
  };

  const handleOpenLead = (id) => {
    router.push(`/telecaller/leads/${id}`);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenLead(id);
    }
  };

  const allQueueItems = recommendedLead ? [recommendedLead, ...queue] : queue;
  const isEmpty = allQueueItems.length === 0;

  const totalPages = Math.max(1, Math.ceil(allQueueItems.length / itemsPerPage));
  const currentItems = allQueueItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="bg-white rounded-[16px] shadow-sm border border-[#ECECEC] overflow-hidden flex flex-col h-full">
      {/* Header & Summary */}
      <div className="p-5 border-b border-[#ECECEC] flex-shrink-0">
        <h2 className="text-[15px] font-[700] text-gray-900 mb-2">Priority Queue</h2>
        <div className="flex items-center gap-2 text-[12px] font-[500] text-gray-500 flex-wrap">
          <span><strong className="text-gray-900">{summary.assignedLeads}</strong> Leads</span>
          <span className="text-gray-300">•</span>
          <span><strong className="text-gray-900">{summary.pendingFollowups}</strong> Pending</span>
          <span className="text-gray-300">•</span>
          <span className="text-red-600"><strong className="text-red-600">{summary.overdueCalls}</strong> Overdue</span>
        </div>
      </div>

      {/* Body */}
      <div ref={scrollRef} className="p-5 flex flex-col flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex-1 flex flex-col justify-center py-8">
            <EmptyState 
              title="No Leads in Your Queue" 
              description="You're all caught up for now." 
              icon={CheckCircle} 
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {currentItems.map((lead) => (
              <div 
                key={lead.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenLead(lead.id)}
                onKeyDown={(e) => handleKeyDown(e, lead.id)}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 py-3 px-4 rounded-[12px] border border-[#ECECEC] bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7A1F2B]/50 h-16"
              >
                {/* Avatar */}
                <Avatar name={lead.name} size="md" className="shrink-0" />
                
                {/* Name */}
                <div className="text-[15px] font-semibold text-gray-900 truncate leading-snug">
                  {lead.name}
                </div>

                {/* Status Badge */}
                <div className="flex items-center shrink-0">
                  <div className="h-6 flex items-center rounded-full overflow-hidden">
                    <StatusBadge status={lead.status} />
                  </div>
                </div>

                {/* Call Action */}
                <div className="flex items-center shrink-0 ml-1">
                  <button 
                    onClick={(e) => handleCall(e, lead.id)}
                    tabIndex={0}
                    className="h-8 w-20 rounded-lg bg-[#7A1F2B] flex items-center justify-center text-white hover:bg-[#6a1b26] transition-colors text-[12px] font-semibold gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#7A1F2B]"
                    title="Call"
                  >
                    <Phone size={14} />
                    Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!isEmpty && (
        <div className="px-6 py-4 border-t border-[#ECECEC] bg-gray-50/50 flex-shrink-0 flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 text-[13px] font-[600] ${
              currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-[#7A1F2B] transition-colors"
            }`}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>
          
          <span className="text-[12px] font-[500] text-gray-600">
            Page <strong className="text-gray-900">{currentPage}</strong> of <strong className="text-gray-900">{totalPages}</strong>
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 text-[13px] font-[600] ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:text-[#7A1F2B] transition-colors"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
