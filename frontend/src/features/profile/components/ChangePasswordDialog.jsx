"use client";

import React, { useEffect, useState } from "react";
import { X, Eye, EyeOff, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useFormik } from "formik";
import { passwordSchema } from "../validation/passwordSchema";
import { useChangePassword } from "../hooks/useChangePassword";
import Button from "@/components/ui/Button";

export default function ChangePasswordDialog({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const { mutate: changePassword, isPending } = useChangePassword();
  
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      changePassword(values, {
        onSuccess: () => {
          onClose();
        },
      });
    },
  });

  useEffect(() => {
    if (isOpen) {
      formik.resetForm();
      setShowPassword({ current: false, new: false, confirm: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-outfit">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/90 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 id="change-password-title" className="text-base font-extrabold text-slate-900 leading-none">Change Password</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Ensure your account uses a secure password</p>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
            disabled={isPending}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="change-password-form" onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.currentPassword}
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="Enter current password"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex="-1"
                >
                  {showPassword.current ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formik.touched.currentPassword && formik.errors.currentPassword ? (
                <p className="mt-1 text-[11px] font-bold text-rose-600">{formik.errors.currentPassword}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="Enter new strong password"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex="-1"
                >
                  {showPassword.new ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <p className="mt-1 text-[11px] font-bold text-rose-600">{formik.errors.newPassword}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-200/90 rounded-xl text-xs font-medium text-slate-900 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="Confirm new password"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex="-1"
                >
                  {showPassword.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <p className="mt-1 text-[11px] font-bold text-rose-600">{formik.errors.confirmPassword}</p>
              ) : null}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2.5 bg-slate-50/70 flex-shrink-0">
          <button 
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="change-password-form"
            disabled={isPending || !formik.isValid}
            className="px-5 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            {isPending ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
