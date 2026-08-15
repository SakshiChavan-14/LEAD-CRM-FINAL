"use client";

import React from "react";
import LeadOverviewLayout from "@/features/leads/components/information/LeadOverviewLayout";

export default function LeadInfoTab({ data, rawData }) {
  return <LeadOverviewLayout data={data} rawData={rawData} isTelecaller={false} />;
}
