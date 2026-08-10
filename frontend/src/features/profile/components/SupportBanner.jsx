import React from "react";
import { Info, Mail } from "lucide-react";

export default function SupportBanner() {
  return (
    <div className="bg-blue-50/80 border border-blue-100 rounded-[24px] p-6 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex gap-4">
        <div className="h-10 w-10 rounded-full bg-blue-100/80 flex items-center justify-center shrink-0">
          <Info size={20} className="text-blue-600" />
        </div>
        <div>
          <h4 className="text-[15px] font-semibold text-gray-900">Need help?</h4>
          <p className="text-[13px] text-gray-600 mt-0.5 leading-relaxed">
            If you're having trouble managing your account, please contact your administrator.
          </p>
        </div>
      </div>
      
      <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 w-full sm:w-auto">
        <Mail size={16} />
        Contact Support
      </button>
    </div>
  );
}
