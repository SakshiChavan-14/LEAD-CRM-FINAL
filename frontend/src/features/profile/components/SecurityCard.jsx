import React, { useState } from "react";
import { Shield, Lock, CheckCircle2, History, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function SecurityCard() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const securityTips = [
    "Use at least 8 characters",
    "Include uppercase and lowercase letters",
    "Include numbers and special characters",
    "Avoid using personal information"
  ];

  return (
    <>
      <div className="bg-white rounded-[24px] shadow-sm border border-[#ECECEC] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#ECECEC] flex items-center gap-3">
          <Shield size={18} className="text-[#7A1F2B]" />
          <h3 className="text-[16px] font-semibold text-gray-900">Security</h3>
        </div>
        
        <div className="p-6">
          {/* Password Section */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                <Lock size={20} className="text-[#7A1F2B]" />
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-gray-900">Password</h4>
                <p className="text-[18px] font-bold text-gray-900 tracking-[0.2em] leading-tight mt-0.5">••••••••</p>
                <p className="text-[12px] text-gray-500 mt-1">Last changed: 20 July 2025</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-[#7A1F2B] hover:bg-[#6a1b26] text-white flex items-center justify-center gap-2 px-5 whitespace-nowrap shadow-sm"
            >
              <Lock size={16} />
              Change Password
            </Button>
          </div>

          {/* Read Only Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-b border-[#ECECEC] pb-6">
             <div className="flex items-center gap-3">
               <History size={16} className="text-gray-400" />
               <div>
                  <p className="text-[12px] font-medium text-gray-500 uppercase">Last Login</p>
                  <p className="text-[14px] font-semibold text-gray-900 mt-0.5">Today, 09:41 AM</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <Clock size={16} className="text-green-500" />
               <div>
                  <p className="text-[12px] font-medium text-gray-500 uppercase">Active Session</p>
                  <p className="text-[14px] font-semibold text-gray-900 mt-0.5">Windows • Chrome</p>
               </div>
             </div>
          </div>

          {/* Tips List */}
          <div className="mt-6">
            <h4 className="text-[14px] font-semibold text-gray-900 mb-4">Tips for a strong password</h4>
            <div className="space-y-3">
              {securityTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-[13.5px] text-gray-600 leading-snug">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordDialog 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </>
  );
}
