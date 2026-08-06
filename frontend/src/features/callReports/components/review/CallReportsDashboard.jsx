"use client";

import { ContentSection } from "@/components/management";
import TelecallerPerformanceTable from "../tables/TelecallerPerformanceTable";

export default function CallReportsDashboard() {
  return (
    <ContentSection>
      <TelecallerPerformanceTable />
    </ContentSection>
  );
}
