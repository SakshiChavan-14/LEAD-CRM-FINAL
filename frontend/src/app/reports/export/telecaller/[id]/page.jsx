"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useTelecallerReport } from "@/features/reports/hooks/useTelecallerReport";
import TelecallerReportTemplate from "@/features/reports/export-templates/TelecallerReportTemplate";

/**
 * Hidden print/export route.
 * Renders the A4 template without the dashboard sidebar, header, or breadcrumbs.
 * This route is opened by the backend (Playwright/Puppeteer) to generate the PDF.
 *
 * URL: /reports/export/telecaller/[id]?range=this-month
 *
 * Print-safe CSS ensures colours render correctly in PDF output.
 */
export const dynamic = "force-dynamic";

export default function TelecallerExportPage({ params }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const range = searchParams.get("range") || "this-month";

  const { data } = useTelecallerReport(id, range);

  return (
    <>
      <style>{`
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @media print {
          body { margin: 0; padding: 0; background: #fff; }
          @page { size: A4; margin: 0; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Outfit', sans-serif; background: #ffffff; }
      `}</style>

      <div className="flex items-start justify-center min-h-screen bg-white">
        <TelecallerReportTemplate data={data} id={id} range={range} />
      </div>
    </>
  );
}
