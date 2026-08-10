function formatRelativeTime(dateString) {
  if (!dateString) return "Updating...";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Updated just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Updated ${diffInMinutes} min ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Updated ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  return "Updated recently";
}

export default function ReportHeader({ lastUpdatedAt }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
      <div className="space-y-1">
        <h1 className="text-[32px] font-bold tracking-tight text-gray-900">
          Reports & Performance
        </h1>
        <p className="text-sm text-gray-500">
          Telecaller productivity, conversions, and monthly trends
        </p>
      </div>

      <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm font-medium text-gray-700">Live</span>
        <span className="text-sm text-gray-400">{formatRelativeTime(lastUpdatedAt)}</span>
      </div>
    </div>
  );
}
