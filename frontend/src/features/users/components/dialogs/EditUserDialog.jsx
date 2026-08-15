"use client";

import { useEffect, useState } from "react";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import useUpdateUser from "@/features/users/hooks/useUpdateUser";
import { useConfirm } from "@/hooks/useConfirm";

const initialForm = {
  slNo: null,
  empId: "",
  username: "",
  name: "",
  phoneNo: "",
  phone: "",
  mobile: "",
  email: "",
  department: "",
  role: "",
  reportingManager: "",
};

export default function EditTelecallerDialog({
  open,
  onClose,
  user,
}) {
  const [form, setForm] = useState(initialForm);

  const {
    mutate,
    isPending,
  } = useUpdateUser({
    onSuccess: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (user && open) {
      const phoneValue = user.phoneNo || user.phone || user.mobile || "";
      setForm({
        slNo: user.slNo,
        empId: user.empId,
        username: user.username ?? "",
        name: user.name ?? "",
        phoneNo: phoneValue,
        phone: phoneValue,
        mobile: phoneValue,
        email: user.email ?? "",
        department: user.department ?? "",
        role: user.role ?? "",
        reportingManager: user.reportingManager ?? "",
      });
    } else {
      setForm(initialForm);
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "phoneNo" || name === "phone" || name === "mobile") {
        next.phoneNo = value;
        next.phone = value;
        next.mobile = value;
      }
      return next;
    });
  };

  const confirm = useConfirm();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = await confirm({
      title: "Save Changes?",
      description: "Are you sure you want to update this telecaller's details?",
      confirmText: "Save",
      variant: "admin-primary",
    });

    if (isConfirmed) {
      const payload = {
        slNo: form.slNo,
        empId: form.empId,
        username: form.username,
        name: form.name,
        phoneNo: form.phoneNo,
        email: form.email,
      };
      console.log("Submitting payload:", payload);
      mutate(payload);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Telecaller"
      footer={
        <>
          <Button
            variant="secondary"
            fullWidth={false}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-user-form"
            variant="admin-primary"
            loading={isPending}
            loadingText="Updating..."
            fullWidth={false}
          >
            Save Telecaller
          </Button>
        </>
      }
    >
      <form
        id="edit-user-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 font-outfit"
      >
        <Input
          label="Employee ID"
          name="empId"
          value={form.empId}
          disabled
        />

        <Input
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          autoComplete="off"
          required
        />

        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Phone Number"
          name="phoneNo"
          value={form.phoneNo}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Department"
          name="department"
          value={form.department}
          disabled
        />

        <Input
          label="Role"
          name="role"
          value={form.role}
          disabled
        />

        <Input
          label="Reporting Manager"
          name="reportingManager"
          value={form.reportingManager}
          disabled
        />
      </form>

      <div className="mt-4 px-2">
        <p className="text-sm text-slate-500 font-medium font-outfit">
          Password changes are managed separately and cannot be updated by administrators.
        </p>
      </div>
    </Modal>
  );
}