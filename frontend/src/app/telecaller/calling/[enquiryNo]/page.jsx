"use client";

import { useParams, useSearchParams } from "next/navigation";
import CallingPage from "@/features/telecaller/calling/components/CallingPage";

export default function CallingRoute() {
  const params = useParams();
  const searchParams = useSearchParams();

  const enquiryNo = params.enquiryNo;
  const isManualCall = enquiryNo === "manual";
  const manualPhone = searchParams.get("phone") || "";

  return (
    <CallingPage
      enquiryNo={isManualCall ? null : enquiryNo}
      isManualCall={isManualCall}
      manualPhone={manualPhone}
    />
  );
}
