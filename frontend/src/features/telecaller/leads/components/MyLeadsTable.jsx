import React from "react";
import DataTable from "@/components/table/DataTable";
import Badge from "@/components/ui/Badge";
import { Phone, PhoneForwarded, PhoneOff, Globe, Share2, Users, MessageCircle, Search, Link as LinkIcon, HelpCircle, User } from "lucide-react";

const formatDistanceToNow = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const toTitleCase = (str) => {
  if (!str) return "-";
  return str.toLowerCase().split(/[\s_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
};

const getStatusVariant = (status) => {
  const s = (status || "").toUpperCase();
  if (s.includes("NEW") || s.includes("ENQUIRY")) return "blue";
  if (s.includes("NOT INTERESTED") || s.includes("COLD")) return "neutral"; // Gray
  if (s.includes("INTERESTED") || s.includes("WARM")) return "success"; // Green
  if (s.includes("ADMISSION") || s.includes("ENROLLED") || s.includes("CONVERTED")) return "purple"; // Emerald requested, but purple is close. Let's use custom class if needed. Wait, badge variant has predefined. We can stick to success for converted, or add emerald.
  if (s.includes("FOLLOW") || s.includes("PROGRESS")) return "warning"; // Amber
  return "neutral";
};

const getSourceOutlinedStyle = (source) => {
  const s = (source || "").toLowerCase();
  if (s.includes("instagram")) return { icon: <Share2 size={12} />, border: "border-gray-200 text-gray-600" };
  if (s.includes("referral") || s.includes("friend")) return { icon: <LinkIcon size={12} />, border: "border-purple-200 text-purple-700" };
  if (s.includes("web")) return { icon: <Globe size={12} />, border: "border-emerald-200 text-emerald-700" };
  if (s.includes("walk-in") || s.includes("walkin")) return { icon: <User size={12} />, border: "border-gray-200 text-gray-600" };
  return { icon: <HelpCircle size={12} />, border: "border-gray-200 text-gray-500" };
};

const getFollowupIndicator = (row) => {
  // If nextFollowup exists, compare with today
  if (!row.nextFollowup) return { color: "bg-gray-200", title: "No follow-up" }; // None
  const followupDate = new Date(row.nextFollowup);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fDate = new Date(followupDate);
  fDate.setHours(0, 0, 0, 0);

  if (fDate < today) return { color: "bg-rose-500", title: "Overdue" }; // Overdue
  if (fDate.getTime() === today.getTime()) return { color: "bg-amber-400", title: "Due Today" }; // Today
  return { color: "bg-emerald-500", title: "Upcoming" }; // Upcoming
};

const getLastActivity = (row) => {
  const activityDate = row.lastInteractionAt || row.updatedAt || row.followupUpdatedAt || row.createdAt;
  if (!activityDate) return "—";
  try {
    return formatDistanceToNow(new Date(activityDate), { addSuffix: true });
  } catch (e) {
    return "—";
  }
};

const commonHeaderProps = {
  headerClassName: "!h-[44px] !py-2 !bg-gray-50 !text-gray-500 !uppercase !tracking-wide !text-[12px]",
  cellClassName: "!py-3 !min-h-[72px]"
};

const getColumns = (onCall) => [
  {
    key: "enquiryNo",
    label: "Enquiry",
    width: "90px",
    ...commonHeaderProps,
    render: (value, row) => (
      <span className="text-sm font-semibold text-gray-900">#{row.enquiryNo || row.id}</span>
    ),
  },
  {
    key: "name",
    label: "Lead",
    width: "240px",
    ...commonHeaderProps,
    render: (value, row) => {
      const nameTitleCase = toTitleCase(row.name);
      const indicator = getFollowupIndicator(row);
      return (
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className="relative shrink-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold bg-[#8B1023]`}>
              {getInitials(nameTitleCase)}
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${indicator.color}`} title={indicator.title}></span>
              <p className="text-[14px] font-semibold text-gray-900 m-0 truncate">{nameTitleCase}</p>
            </div>
            <p className="text-[12px] text-gray-500 m-0 truncate">{row.email || "-"}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: "mobileNo",
    label: "Mobile No",
    width: "150px",
    ...commonHeaderProps,
    render: (value, row) => {
      const number = value || row.mobileNo;
      return (
        <div className="flex items-center gap-2">
          {number ? (
            <button
              onClick={(e) => { e.stopPropagation(); onCall && onCall(number); }}
              role="button"
              tabIndex={0}
              aria-label={`Call ${row.name || number}`}
              className="w-7 h-7 rounded-full bg-gray-50 hover:bg-[#8B1023]/10 flex items-center justify-center text-gray-400 hover:text-[#8B1023] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B1023]/30"
            >
              <Phone size={13} />
            </button>
          ) : (
            <span className="w-7 h-7"></span>
          )}
          <span className="text-[13px] font-medium text-gray-700">{number || "-"}</span>
        </div>
      );
    },
  },
  {
    key: "course",
    label: "Course",
    width: "100px",
    ...commonHeaderProps,
    render: (value) => (
      <span className="text-[13px] text-gray-700 font-medium">
        {value ? (['MCA', 'BCA', 'MBA', 'BTECH', 'MTECH', 'BBA'].includes(value.toUpperCase()) ? value.toUpperCase() : toTitleCase(value)) : "-"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    width: "120px",
    ...commonHeaderProps,
    render: (value) => {
      const s = (value || "").toUpperCase();
      let colorClass = "bg-gray-100 text-gray-700";
      if (s.includes("NEW") || s.includes("ENQUIRY")) colorClass = "bg-blue-50 text-blue-700 border border-blue-200";
      else if (s.includes("PROGRESS") || s.includes("FOLLOW")) colorClass = "bg-amber-50 text-amber-700 border border-amber-200";
      else if (s.includes("INTERESTED") && !s.includes("NOT")) colorClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";
      else if (s.includes("NOT INTERESTED") || s.includes("COLD")) colorClass = "bg-gray-50 text-gray-600 border border-gray-200";
      else if (s.includes("CONVERTED") || s.includes("ADMISSION") || s.includes("ENROLLED")) colorClass = "bg-emerald-100 text-emerald-800 border border-emerald-300";

      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${colorClass}`}>
          {value || "NEW"}
        </span>
      );
    },
  },
  {
    key: "opinion",
    label: "Interest",
    width: "120px",
    ...commonHeaderProps,
    render: (value) => (
      <span className="text-[13px] text-gray-600">{toTitleCase(value) || "-"}</span>
    ),
  },
  {
    key: "callCount",
    label: "Calls",
    width: "80px",
    headerClassName: "!h-[44px] !py-2 !bg-gray-50 !text-gray-500 !uppercase !tracking-wide !text-[12px] text-center",
    cellClassName: "!py-3 !min-h-[72px] text-center",
    render: (value, row) => {
      const count = value || row.callCount || 0;
      return (
        <div className={`inline-flex items-center gap-1.5 ${count > 0 ? "text-gray-900" : "text-gray-400"}`}>
          {count > 0 ? <PhoneForwarded size={12} className="text-gray-400" /> : <PhoneOff size={12} className="text-gray-300" />}
          <span className="font-bold text-[13px]">{count}</span>
        </div>
      );
    },
  },
  {
    key: "lastActivity",
    label: "Last Activity",
    width: "120px",
    ...commonHeaderProps,
    render: (value, row) => (
      <span className="text-[13px] text-gray-500">{getLastActivity(row)}</span>
    ),
  },
  {
    key: "source",
    label: "Source",
    width: "120px",
    ...commonHeaderProps,
    render: (value) => {
      const style = getSourceOutlinedStyle(value);
      return (
        <div className={`inline-flex items-center gap-1.5 border px-2 py-1 rounded-full bg-transparent ${style.border}`}>
          {style.icon}
          <span className="text-[11px] font-semibold uppercase tracking-wider">{toTitleCase(value || "Unknown")}</span>
        </div>
      );
    },
  },
];

export default function MyLeadsTable({ data = [], onRowClick, isLoading, onCall }) {
  const columns = getColumns(onCall);

  const renderMobileCard = (row, index) => {
    return (
      <div
        key={row.enquiryNo || index}
        onClick={() => onRowClick && onRowClick(row)}
        className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 overflow-hidden">
            {columns.find(c => c.key === 'name')?.render(row.name, row)}
          </div>
          <div className="text-right flex flex-col items-end gap-2 shrink-0">
            {columns.find(c => c.key === 'status')?.render(row.status, row)}
            <span className="text-[11px] font-semibold text-gray-400">#{row.enquiryNo}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 mt-1">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Course</span>
            <span className="text-[13px] font-medium text-gray-700 truncate">
              {columns.find(c => c.key === 'course')?.render(row.course, row)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Interest</span>
            <span className="text-[13px] truncate">
              {columns.find(c => c.key === 'opinion')?.render(row.opinion, row)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey="enquiryNo"
      selectable={false}
      onRowClick={onRowClick}
      loading={isLoading}
      renderMobileCard={renderMobileCard}
    />
  );
}
