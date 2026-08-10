import React, { useEffect } from "react";
import { X } from "lucide-react";
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
          mobile: profile.mobile || "",
          email: profile.email || "",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, profile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 id="edit-profile-title" className="text-lg font-semibold text-gray-900">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
            disabled={isPending}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="edit-profile-form" onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7A1F2B] focus:border-[#7A1F2B]"
                placeholder="Enter full name"
                disabled={isPending}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                name="mobile"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7A1F2B] focus:border-[#7A1F2B]"
                placeholder="Enter mobile number"
                disabled={isPending}
              />
              {formik.touched.mobile && formik.errors.mobile ? (
                <p className="mt-1 text-sm text-red-600">{formik.errors.mobile}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7A1F2B] focus:border-[#7A1F2B]"
                placeholder="Enter email address"
                disabled={isPending}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              ) : null}
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isPending}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            form="edit-profile-form"
            disabled={isPending || !formik.isValid}
            loading={isPending}
            className="bg-[#7A1F2B] hover:bg-[#6a1b26] text-white"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
