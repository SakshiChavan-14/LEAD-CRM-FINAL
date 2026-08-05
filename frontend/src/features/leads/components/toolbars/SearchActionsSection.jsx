import React from "react";
import SearchSection from "@/features/leads/components/toolbars/SearchSection";

export default function SearchActionsSection({ search, onSearch }) {
  return (
    <div className="w-full max-w-md">
      <SearchSection initialSearch={search} onSearch={onSearch} />
    </div>
  );
}
