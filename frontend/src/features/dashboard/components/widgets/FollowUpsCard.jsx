import { Calendar, Phone, MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";

const PRIORITY_STYLES = {
  High: { bg: "bg-[#FDF2F2]", text: "text-[#DE6B6B]", label: "HIGH PRIORITY" },
  Medium: { bg: "bg-[#FEF9EC]", text: "text-[#E9B35C]", label: "MEDIUM PRIORITY" },
  Low: { bg: "bg-blue-50", text: "text-blue-500", label: "LOW PRIORITY" },
};

const ICON_COLORS = [
  "text-[#2563EB]", // Blue
  "text-[#10B981]", // Emerald
  "text-[#8B5CF6]", // Violet
  "text-[#F59E0B]", // Amber
];

const cardClass = "rounded-[24px] border border-slate-200 bg-white shadow-sm p-6 h-[320px] flex flex-col justify-between font-outfit";

export default function FollowUpsCard({ followups }) {
  const upcomingError = followups?.upcoming?.error;
  const overdueError = followups?.overdue?.error;

  const upcomingData = followups?.upcoming?.data || [];
  const overdueData = followups?.overdue?.data || [];

  // Combine overdue and upcoming for display (preserve existing logic)
  const data = [...overdueData, ...upcomingData];

  if (upcomingError || overdueError) {
    return (
      <div className="h-full min-h-[300px]">
        <EmptyState title="Failed to load follow-ups" description="An error occurred while fetching follow-ups." />
      </div>
    );
  }

  // Choose icon based on index
  const getIcon = (idx) => {
    return idx % 2 === 0
      ? <Phone size={18} />
      : <MessageCircle size={18} />;
  };

  // Get priority style
  const getPriorityStyle = (priority) => {
    const key = typeof priority === "string"
      ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
      : "Medium";
    return PRIORITY_STYLES[key] || PRIORITY_STYLES.Medium;
  };

  return (
    <article className={cardClass}>
      {/* Header */}
      <header className="flex justify-between items-center mb-3 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Today&apos;s Follow-ups</h2>
          <p className="text-xs text-slate-500 mt-1">Pending tasks for today</p>
        </div>
        <a
          className="text-[#7F1D1D] font-semibold hover:underline text-xs"
          href="/dashboard/management/leads"
        >
          Calendar
        </a>
      </header>

      {/* Follow-ups List with Timeline */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-400 py-6">
          <Calendar size={32} className="text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No follow-ups scheduled</p>
          <p className="text-xs mt-1">All caught up for today!</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto pr-1 relative mt-3 scrollbar-thin">
          {/* Vertical Timeline Stem */}
          {data.length > 1 && (
            <div className="absolute left-[19px] top-6 bottom-6 w-[1px] bg-slate-100" />
          )}

          <div className="space-y-3 py-1">
            {data.map((item, index) => {
              const priorityStyle = getPriorityStyle(item.priority);
              const iconColor = ICON_COLORS[index % ICON_COLORS.length];

              return (
                <div
                  key={index}
                  className="flex items-center justify-between relative"
                >
                  <div className="flex items-center gap-3">
                    {/* Circular Icon Container */}
                    <div className={`relative z-10 w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-full shadow-sm ${iconColor} shrink-0`}>
                      {getIcon(index)}
                    </div>

                    {/* Name + Subtitle */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
                        {item.student || "Unknown"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.time || "Scheduled"}{item.assignedTo ? ` • ${item.assignedTo}` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className="shrink-0 ml-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${priorityStyle.bg} ${priorityStyle.text}`}>
                      {priorityStyle.label.split(" ")[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}