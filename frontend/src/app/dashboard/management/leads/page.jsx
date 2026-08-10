"use client";

import PageContainer from "@/components/layout/PageContainer";
import ContentSection from "@/components/management/ContentSection";
import LeadsHeader from "@/features/leads/components/ui/LeadsHeader";
import LeadsOverviewTable from "@/features/leads/components/tables/LeadsOverviewTable";
import { useLeadOverviewFilters } from "@/features/leads/hooks/useLeadOverviewFilters";

export default function LeadsPage() {
  const { search, filters, actions } = useLeadOverviewFilters();

  return (
    <PageContainer size="wide" className="py-8">
      <ContentSection>
        <LeadsHeader />
        <LeadsOverviewTable filters={filters} actions={actions} search={search} />
      </ContentSection>
    </PageContainer>
  );
}
