import React from "react";
import { User, CreditCard, AtSign, Phone, Mail, Building2, Briefcase, Calendar } from "lucide-react";

export default function PersonalInformationCard({ profile }) {
  const fields = [
    { label: "Full Name", value: profile.name, icon: User },
    { label: "Employee ID", value: profile.empId, icon: CreditCard },
    { label: "Username", value: profile.username, icon: AtSign },
    { label: "Mobile Number", value: profile.mobile, icon: Phone },
    { label: "Email Address", value: profile.email, icon: Mail },
    { label: "Department", value: profile.department, icon: Building2 },
    { label: "Role", value: profile.role, icon: Briefcase },
    { label: "Date Joined", value: "20 July 2025", icon: Calendar }, // Hardcoded as per design for now, backend could provide this
  ];

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-[#ECECEC] overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-[#ECECEC] flex items-center gap-3">
        <User size={18} className="text-[#7A1F2B]" />
        <h3 className="text-[16px] font-semibold text-gray-900">Personal Information</h3>
      </div>
      
      <div className="flex flex-col divide-y divide-[#ECECEC]">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center p-6 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3 sm:w-1/3 mb-2 sm:mb-0">
                <Icon size={16} className="text-gray-400" />
                <span className="text-[14px] font-medium text-gray-700">{field.label}</span>
              </div>
              <div className="sm:w-2/3 pl-7 sm:pl-0">
                <span className="text-[15px] font-medium text-gray-900">{field.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
