"use client";

import { useState, useMemo } from "react";

import { TableSkeleton } from "@/components/ui/Skeletons";
import TableCard from "@/components/table/TableCard";

import { useDetailNavigation } from "@/hooks/useDetailNavigation";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useUrlState } from "@/hooks/useUrlState";

import useInfiniteUsers from "../../hooks/useInfiniteUsers";

import UserKPICards from "./UserKPICards";
import UserToolbar from "./UserToolbar";
import UserDirectoryTable from "./UserDirectoryTable";
import UserPagination from "../ui/UserPagination";

export default function UsersTable() {
  const { navigateToDetail } = useDetailNavigation();
  const { getParam, setParams } = useUrlState();

  const search = getParam("search", "");
  const status = getParam("status", "");

  const setSearch = (val) => setParams({ search: val }, { resetPage: false });
  const setStatus = (val) => setParams({ status: val }, { resetPage: false });

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteUsers({
    size: 10,
    search,
    status,
  });

  useScrollRestoration({ ready: !isLoading && data !== undefined });

  const usersData = useMemo(() => {
    return data?.pages?.flatMap(page => page?.users ?? page?.content ?? []) ?? [];
  }, [data]);

  const totalResults = data?.pages?.[0]?.totalItems ?? data?.pages?.[0]?.page?.totalElements ?? 0;

  if (isLoading) {
    return <TableSkeleton rows={5} columns={5} />;
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-500">
        {error.message}
      </div>
    );
  }

  return (
    <div className="p-page-padding space-y-section-gap font-body-sm">
      <UserKPICards users={usersData} totalResults={totalResults} />
      
      <UserToolbar 
        search={search} 
        onSearchChange={setSearch} 
        status={status}
        onStatusChange={setStatus}
      />
      
      <TableCard>
        <UserDirectoryTable 
          users={usersData} 
          onView={(user) => navigateToDetail(`/dashboard/management/user-directory/${user.empId}`)} 
        />
        
        {totalResults > 0 && (
          <UserPagination 
            totalResults={totalResults}
            currentCount={usersData.length}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </TableCard>
      
      {/* Bottom Space for Scroll Breathability */}
      <div className="h-10"></div>
    </div>
  );
}