# Layout-Only Wrapper Component Audit

This document audits layout-only wrapper components. These components contain no business logic, state, hooks, routing, permissions, or viewmodel mapping. They only return CSS-styled JSX wrappers.

---

## Audited Layout Wrappers

### 1. `ContentSection.jsx` (`src/components/management/`)
* **Classification**: **KEEP**
* **Rationale**: This is a simple vertical column divider with `gap-6` (`gap-[var(--spacing-section)]`). It provides page-level vertical division consistency. Keeping it standardizes spacing between different layout blocks.

### 2. `KPIGrid.jsx` (`src/components/management/`)
* **Classification**: **KEEP**
* **Rationale**: Groups multiple `KPICard` instances with standard responsive columns (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`). Unifies the responsive breakpoint behavior for KPI blocks.

### 3. `StatsSection.jsx` (`src/components/management/`)
* **Classification**: **DELETE**
* **Rationale**: Simple horizontal grid layout wrapper containing only 3 grid cells. Underutilized and can be replaced by normal layout utilities on the page.

### 4. `PageToolbar.jsx` (`src/components/management/`)
* **Classification**: **DELETE**
* **Rationale**: Layout is extremely simple and has 0 usages across the features. Replaced in real-world pages by custom inline search inputs or standard flex rows.

### 5. `TableCard.jsx` (`src/components/table/`)
* **Classification**: **KEEP**
* **Rationale**: Enforces unified border-radius (`rounded-[22px]`), border outline, shadows, and overflow clipping on data tables.

### 6. `DashboardSection.jsx` (`src/components/dashboard-ui/`)
* **Classification**: **REVIEW**
* **Rationale**: Serves the same layout purpose as `SectionCard` (title, optional action, and body slots). It should eventually be deprecated, and the dashboard features should consume `SectionCard` instead to keep structural cards unified.
