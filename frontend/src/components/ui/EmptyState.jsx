import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "No data available",
  description = "Data will appear here once records are available.",
  icon: Icon = Inbox
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-gray-200 rounded-[24px] text-center w-full h-full min-h-[160px] font-outfit">
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
        <Icon className="text-gray-400" size={24} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-[280px]">{description}</p>
    </div>
  );
}
