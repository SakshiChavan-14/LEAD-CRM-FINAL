"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * TablePagination — standalone pagination bar for enterprise tables.
 *
 * Supports two modes:
 *   - "page"     → standard page-based (currentPage, totalPages, onPageChange)
 *   - "loadMore" → infinite scroll / load more (hasNextPage, fetchNextPage, isFetchingNextPage)
 *
 * @param {"page"|"loadMore"} mode
 *
 * Page mode props:
 * @param {number}   currentPage
 * @param {number}   pageSize
 * @param {number}   totalPages
 * @param {number}   totalItems
 * @param {function} onPageChange
 * @param {function} onPageSizeChange
 *
 * Load-more mode props:
 * @param {number}   totalItems
 * @param {number}   currentCount
 * @param {boolean}  hasNextPage
 * @param {function} fetchNextPage
 * @param {boolean}  isFetchingNextPage
 */
export default function TablePagination({
  mode = "page",

  // Page mode
  currentPage = 0,
  pageSize = 10,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,

  // Load-more mode
  currentCount = 0,
  hasNextPage = false,
  fetchNextPage,
  isFetchingNextPage = false,
}) {
  // ── Load More Mode ──
  if (mode === "loadMore") {
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50 font-outfit">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>
            Showing <span className="font-mono font-bold text-slate-900">1</span> to{" "}
            <span className="font-mono font-bold text-slate-900">{currentCount}</span> of{" "}
            <span className="font-mono font-bold text-slate-900">{totalItems}</span> results
          </span>
        </div>

        <button
          onClick={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className={`
            flex items-center gap-2
            px-4 py-2
            border border-slate-200 rounded-xl
            text-xs font-bold
            transition-all active:scale-95 shadow-2xs
            ${hasNextPage
              ? "text-blue-700 bg-blue-50/60 hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-pointer"
              : "text-slate-400 bg-slate-50 cursor-not-allowed opacity-50"
            }
          `}
        >
          {isFetchingNextPage ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              Loading…
            </>
          ) : hasNextPage ? (
            <>
              Load More
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          ) : (
            "All loaded"
          )}
        </button>
      </div>
    );
  }

  // ── Page Mode ──
  if (totalPages <= 1) return null;

  const startItem = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 2) {
        pages.push(0, 1, 2, "…", totalPages - 1);
      } else if (currentPage >= totalPages - 3) {
        pages.push(0, "…", totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pages.push(0, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages - 1);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50 gap-4 font-outfit">
      {/* Left — result count + rows per page */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 w-full sm:w-auto justify-between sm:justify-start">
        <span className="hidden sm:inline">
          Showing{" "}
          <span className="font-mono font-bold text-slate-900">{startItem}</span> to{" "}
          <span className="font-mono font-bold text-slate-900">{endItem}</span> of{" "}
          <span className="font-mono font-bold text-slate-900">{totalItems}</span> results
        </span>
        <span className="sm:hidden font-medium">
          Page {currentPage + 1} of {totalPages}
        </span>

        {onPageSizeChange && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-slate-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 bg-white shadow-2xs py-1 px-2.5 outline-none cursor-pointer"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right — page buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 bg-white transition-all shadow-2xs active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="hidden sm:flex items-center gap-1 px-1">
          {getPageNumbers().map((page, idx) =>
            page === "…" ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-bold text-xs">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95 ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-xs font-extrabold ring-2 ring-blue-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {page + 1}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 bg-white transition-all shadow-2xs active:scale-95 cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
