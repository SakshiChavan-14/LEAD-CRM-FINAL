import React from "react";
import QuickFilterBar from "@/features/leads/components/filters/QuickFilterBar";
import { LEAD_BUCKETS } from "@/features/leads/constants/leadConstants";

export default function QuickFiltersSection({ activeFilter, onSelect, counts }) {
  return (
    <QuickFilterBar 
      filters={LEAD_BUCKETS} 
      activeFilter={activeFilter} 
      onSelect={onSelect} 
      counts={counts}
    />
  );
}
