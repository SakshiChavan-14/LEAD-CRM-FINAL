"use client";

import ContentSection from "@/components/management/ContentSection";
import LeadsHeader from "@/features/leads/components/ui/LeadsHeader";
import LeadsOverviewTable from "@/features/leads/components/tables/LeadsOverviewTable";
import { useLeadOverviewFilters } from "@/features/leads/hooks/useLeadOverviewFilters";

export default function LeadsPage() {
  const { search, filters, actions } = useLeadOverviewFilters();

  return (
    <ContentSection className="p-8 max-w-[1600px] mx-auto w-full">
      <LeadsHeader />
      <LeadsOverviewTable filters={filters} actions={actions} search={search} />
    </ContentSection>
  );
}
