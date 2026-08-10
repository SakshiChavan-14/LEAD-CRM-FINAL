import React from "react";
import { UserCheck } from "lucide-react";

export default function AccountStatusCard({ profile }) {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-[#ECECEC] overflow-hidden">
      <div className="px-6 py-5 border-b border-[#ECECEC] flex items-center gap-3">
        <UserCheck size={18} className="text-[#7A1F2B]" />
        <h3 className="text-[16px] font-semibold text-gray-900">Account Status</h3>
      </div>
      
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <UserCheck size={20} className="text-green-600" />
          </div>
          <div>
            <h4 className="text-[15px] font-semibold text-gray-900">Your account is active</h4>
            <p className="text-[13px] text-gray-500 mt-0.5">You have full access to the system.</p>
          </div>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
          {profile.status}
        </span>
      </div>
    </div>
  );
}
