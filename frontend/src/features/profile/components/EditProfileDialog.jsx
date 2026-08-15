"use client";

import React, { useEffect } from "react";
import { X, User, Phone, Mail } from "lucide-react";
import { useFormik } from "formik";
import { profileSchema } from "../validation/profileSchema";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import Button from "@/components/ui/Button";

export default function EditProfileDialog({ isOpen, onClose, profile }) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      updateProfile(values, {
        onSuccess: () => {
          onClose();
        },
      });
    },
  });

  useEffect(() => {
    if (isOpen && profile) {
      formik.resetForm({
        values: {
          name: profile.name || "",
          mobile: (profile.mobile !== "N/A" ? profile.mobile : "") || (profile.phone !== "N/A" ? profile.phone : "") || (profile.phoneNo !== "N/A" ? profile.phoneNo : "") || "",
          email: (profile.email !== "N/A" ? profile.email : "") || "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, profile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 font-outfit">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/90 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 id="edit-profile-title" className="text-base font-extrabold text-slate-900 leading-none">Edit Profile</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Update your personal account details</p>
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

        <div className="p-6 overflow-y-auto">
          <form id="edit-profile-form" onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  className="w-full px-3.5 py-2.5 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="Enter full name"
                  disabled={isPending}
                />
              </div>
              {formik.touched.name && formik.errors.name ? (
                <p className="mt-1 text-[11px] font-bold text-rose-600">{formik.errors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="mobile"
                  type="tel"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mobile}
                  className="w-full px-3.5 py-2.5 border border-slate-200/90 rounded-xl text-xs font-mono font-bold text-slate-900 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="Enter 10-digit mobile number"
                  disabled={isPending}
                />
              </div>
              {formik.touched.mobile && formik.errors.mobile ? (
                <p className="mt-1 text-[11px] font-bold text-rose-600">{formik.errors.mobile}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="w-full px-3.5 py-2.5 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-900 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  placeholder="Enter email address"
                  disabled={isPending}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <p className="mt-1 text-[11px] font-bold text-rose-600">{formik.errors.email}</p>
              ) : null}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2.5 bg-slate-50/70 flex-shrink-0">
          <button 
            onClick={onClose}
            disabled={isPending}
            type="button"
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="edit-profile-form"
            disabled={isPending || !formik.isValid}
            className="px-5 py-2 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            {isPending ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
