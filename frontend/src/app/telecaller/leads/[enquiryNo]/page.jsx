import ContentSection from "@/components/management/ContentSection";
import TelecallerLeadDetailsClient from "./TelecallerLeadDetailsClient";
import { telecallerBreadcrumbs } from "@/config/telecallerBreadcrumbs";

export default async function TelecallerLeadDetailsPage({ params }) {
  const { enquiryNo } = await params;

  return (
    <ContentSection className="min-h-0 h-full overflow-y-auto">
      <div className="flex-1 pb-10">
        <TelecallerLeadDetailsClient enquiryNo={enquiryNo} />
      </div>
    </ContentSection>
  );
}
