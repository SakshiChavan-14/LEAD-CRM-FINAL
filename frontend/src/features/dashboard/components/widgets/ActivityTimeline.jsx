import { Activity } from "lucide-react";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";
import { formatTimeAgo } from "@/utils/dateUtils";

// Rotating dot colors per Stitch design
const DOT_COLORS = [
  "bg-green-500",
  "bg-blue-600",
  "bg-[#7b1a1a]",
  "bg-amber-500",
  "bg-purple-500",
];

export default function ActivityTimeline({ timeline }) {
  const error = timeline?.error;
  const data = timeline?.data || [];

  if (error) {
    return (
      <div className="h-full min-h-[300px]">
        <EmptyState title="Failed to load activity" description="An error occurred while fetching recent activity." />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 h-[420px] flex flex-col font-outfit overflow-hidden">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h2>
      </div>

      {/* Timeline List */}
      {data.length === 0 ? (
        <div className="py-8 px-6 flex-grow flex items-center justify-center">
          <EmptyState title="No recent activity" description="There are no recent updates in the system." icon={Activity} />
        </div>
      ) : (
        <div 
          className="px-6 py-2 flex-grow overflow-y-auto hide-scrollbar"
          style={{ 
            scrollbarWidth: "none", 
            msOverflowStyle: "none" 
          }}
        >
          {data.map((activity, index) => {
            const dotColor = DOT_COLORS[index % DOT_COLORS.length];

            // Compute display time
            const displayTime = activity.time
              || (activity.timestamp ? formatTimeAgo(new Date(activity.timestamp)) : "Just now");

            return (
              <div key={activity.id || index} className="flex gap-4 py-3 items-start border-l-2 border-slate-100 ml-1.5 pl-4 relative last:border-0 pb-5">
                {/* Colored Dot */}
                <div className={`absolute left-[-5px] top-1.5 h-2 w-2 rounded-full ring-4 ring-white ${dotColor}`} />

                {/* Activity Content */}
                <div className="flex-grow">
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {activity.description || activity.action || activity.title || "Activity"}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                    {displayTime}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer — Stitch: centered "View All Activity" link */}
      {data.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-100 flex justify-center shrink-0 bg-slate-50/50">
          <a
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1"
            href="#"
          >
            View All Activity →
          </a>
        </div>
      )}
    </div>
  );
}