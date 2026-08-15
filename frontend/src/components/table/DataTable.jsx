"use client";

import React, { useRef, useEffect } from "react";
import { Inbox } from "lucide-react";

/**
 * DataTable — the unified enterprise table primitive.
 *
 * Owns: thead, tbody, row selection, empty state, loading skeleton, mobile card renderer.
 * Does NOT own: card wrapper (use TableCard), pagination (use TablePagination).
 */
export default function DataTable({
  columns = [],
  data = [],
  selectedRows = [],
  setSelectedRows,
  rowKey = "id",
  renderRowActions,
  onRowClick,
  density = "standard",
  selectable = true,
  loading = false,
  skeletonRows = 6,
  emptyState,
  renderMobileCard,
  onScroll,
  className = "",
  tableClassName = "min-w-[1000px]",
  stickyActions = false,
}) {
  const scrollRef = useRef(null);

  // Unique row id
  const getRowId = (row, index) => row[rowKey] ?? index;

  // Check if all rows are selected
  const allSelected =
    data.length > 0 &&
    data.every((row, index) => selectedRows.includes(getRowId(row, index)));

  // Select/Deselect all rows
  const toggleAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row, index) => getRowId(row, index)));
    }
  };

  // Toggle one row
  const toggleRow = (row, index) => {
    const id = getRowId(row, index);
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((item) => item !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Density tokens
  const cellPadding =
    density === "comfortable"
      ? "px-6 py-4"
      : "px-6 py-4";

  const headerPadding =
    density === "comfortable"
      ? "px-6 py-4"
      : "px-6 py-4";

  // ── Skeleton Loading State ──
  if (loading) {
    return (
      <>
        {/* Desktop skeleton */}
        <div className={`hidden md:block overflow-x-auto no-scrollbar [scrollbar-width:none] ${className}`}>
          <table className={`w-full border-separate border-spacing-0 ${tableClassName}`}>
            <thead className="bg-slate-50/80">
              <tr>
                {selectable && (
                  <th className="w-14 px-6 py-3.5">
                    <div className="w-4 h-4 rounded bg-slate-200 animate-pulse" />
                  </th>
                )}
                {columns.map((col) => (
                  <th key={col.key} className={headerPadding}>
                    <div className="h-3 w-20 rounded bg-slate-200 animate-pulse" />
                  </th>
                ))}
                {renderRowActions && <th className="w-14" />}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: skeletonRows }).map((_, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-100">
                  {selectable && (
                    <td className="w-14 px-6 py-4">
                      <div className="w-4 h-4 rounded bg-slate-200 animate-pulse" />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td key={col.key} className={cellPadding}>
                      <div
                        className={`h-4 rounded bg-slate-200 animate-pulse ${
                          colIdx === 0 ? "w-32" : "w-24"
                        }`}
                      />
                    </td>
                  ))}
                  {renderRowActions && (
                    <td className={`w-14 px-6 py-4 ${stickyActions ? "sticky right-0 bg-white" : ""}`}>
                      <div className="w-6 h-6 rounded bg-slate-200 animate-pulse" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile skeleton */}
        {renderMobileCard && (
          <div className="md:hidden p-4 space-y-3">
            {Array.from({ length: skeletonRows }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse"
              >
                <div className="flex justify-between mb-3">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-5 w-16 rounded-full bg-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-3 w-20 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback skeleton when no mobile renderer */}
        {!renderMobileCard && (
          <div className="md:hidden p-4 space-y-3">
            {Array.from({ length: skeletonRows }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse"
              >
                <div className="h-4 w-32 rounded bg-slate-200 mb-2" />
                <div className="h-3 w-24 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}
      </>
    );
  }

  // ── Empty State ──
  if (!loading && data.length === 0) {
    return (
      <div className="py-16 flex items-center justify-center font-outfit">
        {emptyState || (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Inbox className="text-slate-400" size={24} />
            </div>
            <p className="text-sm font-bold text-slate-800">No records found</p>
            <p className="text-xs text-slate-400 font-medium">
              There is no data matching your filters.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Desktop Table ──
  return (
    <>
      <div
        ref={scrollRef}
        className={`hidden md:block overflow-x-auto flex-1 min-h-0 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
        onScroll={(e) => {
          if (onScroll) onScroll(e);
        }}
      >
        <table className={`w-full border-separate border-spacing-0 font-outfit ${tableClassName}`}>
          {/* Sticky header */}
          <thead className="bg-slate-50/95 sticky top-0 z-20 border-b border-slate-200/80">
            <tr>
              {selectable && (
                <th className="w-[48px] px-3 text-center align-middle border-b border-slate-200/80" style={{ paddingTop: "14px", paddingBottom: "14px" }}>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all rows"
                      className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500/20 focus:ring-2 accent-blue-600 cursor-pointer"
                    />
                  </div>
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  style={{ width: column.width || "auto" }}
                  className={`
                    text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200/80
                    whitespace-nowrap h-[48px]
                    px-4 py-3
                    ${column.headerClassName || ""}
                  `}
                >
                  {column.label}
                </th>
              ))}

              {renderRowActions && (
                <th
                  className={`w-[72px] text-center px-4 py-3 border-b border-slate-200/80 ${stickyActions ? "sticky right-0 bg-slate-50/95 z-20" : ""}`}
                />
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row, index) => {
              const id = getRowId(row, index);
              const isSelected = selectedRows.includes(id);

              return (
                <tr
                  key={id}
                  className={`
                    border-b border-slate-100
                    transition-all duration-150
                    group
                    ${onRowClick ? "cursor-pointer" : ""}
                    ${isSelected ? "bg-blue-50/60" : "hover:bg-blue-50/40 hover:shadow-[inset_0_0_0_1px_rgba(59,130,246,0.12)]"}
                  `}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {/* Checkbox */}
                  {selectable && (
                    <td
                      className="w-[48px] px-3 align-middle text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(row, index)}
                          aria-label={`Select row ${id}`}
                          className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500/20 focus:ring-2 accent-blue-600 cursor-pointer"
                        />
                      </div>
                    </td>
                  )}

                  {/* Cells */}
                  {columns.map((column) => {
                    const value = row[column.key];
                    return (
                      <td
                        key={column.key}
                        className={`
                          text-xs text-slate-700 group-hover:text-slate-900 transition-colors duration-150
                          ${cellPadding}
                          ${column.cellClassName || ""}
                        `}
                      >
                        {column.render ? column.render(value, row) : value}
                      </td>
                    );
                  })}

                  {/* Actions */}
                  {renderRowActions && (
                    <td
                      className={`w-[64px] text-center ${cellPadding} ${stickyActions ? "sticky right-0 bg-white group-hover:bg-slate-50/60" : ""}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {renderRowActions(row)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card View ── */}
      {renderMobileCard ? (
        <div className="md:hidden flex-1 overflow-y-auto bg-slate-50/30 p-4 space-y-3 no-scrollbar [scrollbar-width:none]">
          {data.map((row, index) => (
            <React.Fragment key={getRowId(row, index)}>
              {renderMobileCard(row, index)}
            </React.Fragment>
          ))}
        </div>
      ) : (
        /* Fallback: horizontally scrollable table on mobile without scrollbar */
        <div className="md:hidden overflow-x-auto no-scrollbar [scrollbar-width:none]">
          <table className="w-full min-w-[600px] border-separate border-spacing-0 font-outfit">
            <thead className="bg-slate-50/80">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left text-[11px] font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap px-4 py-3"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const id = getRowId(row, index);
                return (
                  <tr
                    key={id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.key];
                      return (
                        <td key={column.key} className="text-xs text-slate-700 px-4 py-3">
                          {column.render ? column.render(value, row) : value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}