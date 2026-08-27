"use client";

import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import GeoSelectors from "@/features/leads/components/filters/GeoSelectors";
import { updateLeadSchema } from "@/features/leads/schemas/updateLeadSchema";
import { useUpdateLead } from "@/features/leads/hooks/useUpdateLead";
import leadService from "@/features/leads/services/leadService";
import { useAppToast } from "@/hooks/useAppToast";

export default function EditLeadDialog({ open, onClose, lead }) {
  const toast = useAppToast();

  const { mutate, isPending } = useUpdateLead(() => {
    formik.resetForm();
    onClose();
  });

  const formik = useFormik({
    initialValues: {
      enquiryNo: "",
      name: "",
      mobileNo: "",
      email: "",
      source: "",
      collegeStudied: "",
      state: "",
      district: "",
      taluk: "",
      programme: "",
      course: "",
      discipline: "",
      opinion: "",
      remarks: "",
      status: "",
    },
    validationSchema: updateLeadSchema,
    onSubmit: (values) => {
      // In a real app we might update avatar alongside other values or via a separate endpoint
      mutate(values);
    },
  });

  useEffect(() => {
    if (open && lead) {
      formik.setValues({
        enquiryNo: lead.enquiryNo || lead.lead?.enquiryNo || "",
        name: lead.student?.name || lead.name || "",
        mobileNo: lead.student?.mobile || lead.student?.mobileNo || lead.mobileNo || "",
        email: lead.student?.email || lead.email || "",
        source: lead.lead?.source || lead.source || "",
        collegeStudied: lead.education?.college || lead.collegeStudied || "",
        state: lead.location?.state || lead.state || "",
        district: lead.location?.district || lead.district || "",
        taluk: lead.location?.city || lead.location?.taluk || lead.taluk || "",
        programme: lead.education?.programme || lead.programme || "",
        course: lead.education?.course || lead.course || "",
        discipline: lead.education?.discipline || lead.discipline || "",
        opinion: lead.lead?.temperature || lead.opinion || "",
        remarks: lead.remarks || "",
        status: lead.lead?.status || lead.status || "",
      });
    } else {
      formik.resetForm();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lead]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Edit Lead"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-lead-form"
            variant="admin-primary"
            loading={isPending}
            loadingText="Updating..."
          >
            Update Lead
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <form
          id="edit-lead-form"
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <Input
            label="Enquiry Number"
            name="enquiryNo"
            value={formik.values.enquiryNo}
            disabled
            className="sm:col-span-2"
          />
          <Input
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
          required
        />
        <Input
          label="Mobile Number"
          name="mobileNo"
          value={formik.values.mobileNo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mobileNo && formik.errors.mobileNo}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && formik.errors.email}
        />
        <Input
          label="Source"
          name="source"
          value={formik.values.source}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.source && formik.errors.source}
        />

        <GeoSelectors formik={formik} required />

        <Input
          label="College Studied"
          name="collegeStudied"
          value={formik.values.collegeStudied}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.collegeStudied && formik.errors.collegeStudied}
        />
        <Input
          label="Programme"
          name="programme"
          value={formik.values.programme}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.programme && formik.errors.programme}
        />
        <Input
          label="Course"
          name="course"
          value={formik.values.course}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.course && formik.errors.course}
        />
        <Input
          label="Discipline"
          name="discipline"
          value={formik.values.discipline}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.discipline && formik.errors.discipline}
        />
        <Input
          label="Opinion"
          name="opinion"
          value={formik.values.opinion}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.opinion && formik.errors.opinion}
        />
        <Input
          label="Status"
          name="status"
          value={formik.values.status}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.status && formik.errors.status}
        />
        <Input
          label="Remarks"
          name="remarks"
          value={formik.values.remarks}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.remarks && formik.errors.remarks}
          className="sm:col-span-2"
        />
      </form>
      </div>
    </Modal>
  );
}
