"use client";

import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import ContentSection from "@/components/management/ContentSection";
import LeadsHeader from "@/features/leads/components/ui/LeadsHeader";
import LeadsOverviewTable from "@/features/leads/components/tables/LeadsOverviewTable";
import { useLeadOverviewFilters } from "@/features/leads/hooks/useLeadOverviewFilters";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

export default function LeadsPage() {
  const { search, filters, actions } = useLeadOverviewFilters();
  const [isDataReady, setIsDataReady] = useState(false);

  useScrollRestoration({ ready: isDataReady });

  return (
    <PageContainer size="wide" className="py-8">
      <ContentSection>
        <LeadsHeader />
        <LeadsOverviewTable 
          filters={filters} 
          actions={actions} 
          search={search} 
          onDataReady={setIsDataReady}
        />
      </ContentSection>
    </PageContainer>
  );
}
