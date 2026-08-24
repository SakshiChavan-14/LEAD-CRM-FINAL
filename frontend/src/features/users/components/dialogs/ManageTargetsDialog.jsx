"use client";

import { useEffect, useState, useMemo } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useTelecallerTargets, useUpdateTelecallerTargets } from "@/features/users/hooks/useTelecallerTargets";
import { useConfirm } from "@/hooks/useConfirm";

export default function ManageTargetsDialog({ open, onClose, profile }) {
  const { data: targets, isLoading } = useTelecallerTargets();
  const { mutate: updateTargets, isPending } = useUpdateTelecallerTargets({
    onSuccess: () => {
      onClose();
    }
  });

  const [form, setForm] = useState({
    telecallerEmpId: "",
    weeklyCallTarget: 350,
    weeklyInterestedTarget: 100,
    weeklyAdmissionTarget: 15,
    dailyCallTarget: 50,
    isGlobalDefault: false,
  });

  // Load the current config for this telecaller (or default)
  const currentConfig = useMemo(() => {
    if (!targets || !profile?.empId) return null;
    
    // 1. Try to find telecaller specific target
    const specific = targets.find(t => t.telecallerEmpId === profile.empId);
    if (specific) return { ...specific, isGlobalDefault: false };
    
    // 2. Fallback to DEFAULT target config
    const globalDefault = targets.find(t => t.telecallerEmpId === "DEFAULT");
    if (globalDefault) return { ...globalDefault, isGlobalDefault: false };

    return null;
  }, [targets, profile]);

  useEffect(() => {
    if (open) {
      if (currentConfig) {
        setForm({
          telecallerEmpId: profile?.empId || "DEFAULT",
          weeklyCallTarget: currentConfig.weeklyCallTarget ?? 350,
          weeklyInterestedTarget: currentConfig.weeklyInterestedTarget ?? 100,
          weeklyAdmissionTarget: currentConfig.weeklyAdmissionTarget ?? 15,
          dailyCallTarget: currentConfig.dailyCallTarget ?? 50,
          isGlobalDefault: currentConfig.telecallerEmpId === "DEFAULT",
        });
      } else {
        setForm({
          telecallerEmpId: profile?.empId || "DEFAULT",
          weeklyCallTarget: 350,
          weeklyInterestedTarget: 100,
          weeklyAdmissionTarget: 15,
          dailyCallTarget: 50,
          isGlobalDefault: false,
        });
      }
    }
  }, [open, currentConfig, profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value) || value
    }));
  };

  const confirm = useConfirm();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = await confirm({
      title: "Save Targets?",
      description: `Are you sure you want to update targets for ${form.isGlobalDefault ? "all telecallers (GLOBAL DEFAULT)" : profile?.name || "this telecaller"}?`,
      confirmText: "Save",
      variant: "admin-primary",
    });

    if (isConfirmed) {
      const payload = {
        telecallerEmpId: form.isGlobalDefault ? "DEFAULT" : profile?.empId || "DEFAULT",
        weeklyCallTarget: Number(form.weeklyCallTarget),
        weeklyInterestedTarget: Number(form.weeklyInterestedTarget),
        weeklyAdmissionTarget: Number(form.weeklyAdmissionTarget),
        dailyCallTarget: Number(form.dailyCallTarget),
      };
      updateTargets(payload);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Configure Target Limits - ${profile?.name || "Telecaller"}`}
      footer={
        <>
          <Button variant="secondary" fullWidth={false} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="manage-targets-form"
            variant="admin-primary"
            loading={isPending || isLoading}
            loadingText="Saving..."
            fullWidth={false}
          >
            Save Targets
          </Button>
        </>
      }
    >
      <form id="manage-targets-form" onSubmit={handleSubmit} className="space-y-4 font-outfit">
        <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 border border-blue-200/50 rounded-xl">
          <input
            type="checkbox"
            id="isGlobalDefault"
            name="isGlobalDefault"
            checked={form.isGlobalDefault}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isGlobalDefault" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
            Apply as Global Fallback (DEFAULT targets for all telecallers)
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Daily Call Target"
            name="dailyCallTarget"
            type="number"
            value={form.dailyCallTarget}
            onChange={handleChange}
            required
          />

          <Input
            label="Weekly Call Target"
            name="weeklyCallTarget"
            type="number"
            value={form.weeklyCallTarget}
            onChange={handleChange}
            required
          />

          <Input
            label="Weekly Interested Target"
            name="weeklyInterestedTarget"
            type="number"
            value={form.weeklyInterestedTarget}
            onChange={handleChange}
            required
          />

          <Input
            label="Weekly Admission Target"
            name="weeklyAdmissionTarget"
            type="number"
            value={form.weeklyAdmissionTarget}
            onChange={handleChange}
            required
          />
        </div>
      </form>
    </Modal>
  );
}
