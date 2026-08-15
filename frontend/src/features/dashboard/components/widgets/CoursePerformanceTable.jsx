"use client";

import React, { useMemo, useState } from "react";
import { GraduationCap, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useCourseDistribution } from "@/features/reports/hooks/useReportsQueries";
import { EmptyState } from "@/components/dashboard-ui/EmptyState";

const cardClass = "rounded-[24px] border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col font-outfit justify-between overflow-hidden w-full h-[420px]";

export default function CoursePerformanceTable() {
  const { data: rawData, isLoading, isError } = useCourseDistribution();
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 5;

  const coursesList = useMemo(() => {
    if (!rawData || !Array.isArray(rawData)) return [];

    const mapped = rawData.map((item) => {
      const leads = item.leadCount || item.count || 0;
      const admissions = item.admissions || 0;
      const conversionVal = leads > 0 ? (admissions / leads) * 100 : 0;

      return {
        course: item.course || item.programme || "N/A",
        programme: item.programme || "N/A",
        leads,
        admissions,
        conversion: conversionVal,
      };
    });

    // Sort by Leads descending
    return mapped.sort((a, b) => b.leads - a.leads);
  }, [rawData]);

  const maxLeads = useMemo(() => {
    if (coursesList.length === 0) return 1;
    return Math.max(...coursesList.map((c) => c.leads), 1);
  }, [coursesList]);

  const totalPages = Math.ceil(coursesList.length / ITEMS_PER_PAGE);

  const paginatedCourses = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return coursesList.slice(start, start + ITEMS_PER_PAGE);
  }, [coursesList, currentPage]);

  return (
    <section className={cardClass}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Course Performance</h2>
            <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              {coursesList.length} Courses
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Leads, admissions, and conversion metrics by academic program</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center min-h-[220px]">
          <div className="animate-pulse space-y-3 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 h-12 bg-slate-50/80 rounded-xl px-4">
                <div className="flex-grow h-4 bg-slate-200 rounded" />
                <div className="w-16 h-4 bg-slate-200 rounded" />
                <div className="w-16 h-4 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : isError || coursesList.length === 0 ? (
        <div className="flex-grow flex items-center justify-center min-h-[220px]">
          <EmptyState
            title="No Course Data Available"
            description="Leads details by target program will appear here once parsed."
            icon={GraduationCap}
          />
        </div>
      ) : (
        /* Ranked Course Table */
        <div className="flex-grow flex flex-col justify-between overflow-hidden">
          <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs flex-grow mb-3">
            <table className="w-full text-left align-middle border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-50/95 border-b border-slate-200/80 text-[10px] tracking-wider text-slate-500 font-bold uppercase">
                  <th className="py-2.5 px-4 text-left w-[40%]">Course / Program</th>
                  <th className="py-2.5 px-3 text-center w-[20%]">Leads Distribution</th>
                  <th className="py-2.5 px-3 text-center w-[12%]">Leads</th>
                  <th className="py-2.5 px-3 text-center w-[12%]">Admissions</th>
                  <th className="py-2.5 px-4 text-center w-[16%]">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedCourses.map((row, idx) => {
                  const leadSharePercent = Math.round((row.leads / maxLeads) * 100);
                  const isHighConversion = row.conversion >= 12;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors h-[48px]">
                      {/* Course details */}
                      <td className="py-2 px-4 w-[40%] truncate">
                        <div className="flex flex-col truncate">
                          <span className="font-bold text-slate-900 text-xs leading-snug truncate" title={row.course}>
                            {row.course}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider truncate" title={row.programme}>
                            {row.programme}
                          </span>
                        </div>
                      </td>

                      {/* Leads share progress bar */}
                      <td className="py-2 px-3 w-[20%]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${leadSharePercent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                            {leadSharePercent}%
                          </span>
                        </div>
                      </td>

                      {/* Total Leads count */}
                      <td className="py-2 px-3 w-[12%] text-center text-slate-800 text-xs font-semibold">
                        {row.leads.toLocaleString()}
                      </td>

                      {/* Admissions count */}
                      <td className="py-2 px-3 w-[12%] text-center">
                        <span className="text-slate-900 text-xs font-bold bg-blue-50/70 px-2 py-0.5 rounded border border-blue-100/50">
                          {row.admissions}
                        </span>
                      </td>

                      {/* Conversion Rate */}
                      <td className="py-2 px-4 w-[16%] text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono tracking-wide border shadow-xs ${
                          isHighConversion
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}>
                          {isHighConversion && <TrendingUp size={11} />}
                          {row.conversion.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-2xl shrink-0 font-outfit">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-3xs cursor-pointer"
              >
                <ChevronLeft size={14} />
                Prev
              </button>
              <span className="text-[11px] font-bold text-slate-500">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-3xs cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
