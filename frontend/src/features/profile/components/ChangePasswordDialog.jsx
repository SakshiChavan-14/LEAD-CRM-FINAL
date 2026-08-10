import React, { useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useFormik } from "formik";
import { passwordSchema } from "../validation/passwordSchema";
import { useChangePassword } from "../hooks/useChangePassword";
import Button from "@/components/ui/Button";

export default function ChangePasswordDialog({ isOpen, onClose }) {
  const [showPassword, setShowPassword] = React.useState({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <h2 id="change-password-title" className="text-lg font-semibold text-gray-900">Change Password</h2>
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
          <form id="change-password-form" onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.currentPassword}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7A1F2B] focus:border-[#7A1F2B]"
                  placeholder="Enter current password"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex="-1"
                >
                  {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.currentPassword && formik.errors.currentPassword ? (
                <p className="mt-1 text-sm text-red-600">{formik.errors.currentPassword}</p>
              ) : null}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7A1F2B] focus:border-[#7A1F2B]"
                  placeholder="Enter new password"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex="-1"
                >
                  {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <p className="mt-1 text-sm text-red-600">{formik.errors.newPassword}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7A1F2B] focus:border-[#7A1F2B]"
                  placeholder="Confirm new password"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => togglePassword('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  tabIndex="-1"
                >
                  {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
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
            form="change-password-form"
            disabled={isPending || !formik.isValid}
            loading={isPending}
            className="bg-[#7A1F2B] hover:bg-[#6a1b26] text-white"
          >
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}
