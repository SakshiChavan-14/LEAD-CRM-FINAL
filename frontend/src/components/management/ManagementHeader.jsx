"use client";

import SearchBar from "@/components/ui/SearchBar";
import { useTableScroll } from "@/providers/TableScrollProvider";

export default function ManagementHeader({
  title,
  description,
  search,
  setSearch,
  activeTab,
  actions,
}) {
  const { isScrolled } = useTableScroll();

  return (
    <div className={`transition-all duration-300 ease-in-out ${isScrolled ? "space-y-3" : "space-y-6"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <h1 className="text-heading-1 font-bold font-sans text-slate-900">
            {title}
          </h1>

          <p className={`text-subtitle text-gray-500 font-sans transition-all duration-300 ease-in-out ${isScrolled ? "mt-1" : "mt-2"}`}>
            {description}
          </p>

        </div>

        {actions}

      </div>

      {setSearch && (
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={
            activeTab === "users"
              ? "Search users..."
              : activeTab === "calls"
              ? "Search reports..."
              : "Search leads..."
          }
        />
      )}

    </div>
  );
}