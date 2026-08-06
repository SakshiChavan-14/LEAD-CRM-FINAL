# Component Inventory & Responsibility Audit

This document lists all reusable components found in `src/components` and details their responsibilities, presentation nature, business logic usage, and retirement candidates.

---

## 1. UI Primitives (`src/components/ui/`)

These components serve as the base presentation layer. They do not hold network logic, routes, or local state that ties them to features.

| Component | Responsibility | Pure UI | Business Logic | Candidate | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Button** | Renders custom styled buttons with loading and variant support. | Yes | No | **Keep** | Standardized. |
| **Input** | Custom input wrapper with label, custom icon, error handling. | Yes | No | **Keep** | Standardized. |
| **Select** | Dropdown selection form control with customizable options. | Yes | No | **Keep** | Standardized. |
| **Textarea** | Custom multiline input text area. | Yes | No | **Keep** | Standardized. |
| **Modal** | Handles overlays, escape-key closing, portal binding. | Yes | No | **Keep** | Standardized. |
| **Badge** | Small pill badge displaying tags/metadata. | Yes | No | **Keep** | Standardized. |
| **Avatar** | Displays initials or images for user thumbnails. | Yes | No | **Keep** | Standardized. |
| **Checkbox** | Custom interactive form checkbox element. | Yes | No | **Keep** | Standardized. |
| **ConfirmDialog** | Custom confirmation drawer utilizing a store to trigger actions. | No | Yes (Store connection) | **Keep** | Uses `useConfirmStore` to coordinate global confirms. |
| **PasswordInput** | Input sub-type exposing a toggle visibility icon. | Yes | No | **Keep** | Highly reusable. |
| **PreviewBadge** | Customized badge variant highlighting preview status. | Yes | No | **Review** | Potentially mergeable into the main `Badge` as a variant. |
| **AppToast** | Toast notification element for success/error flash banners. | Yes | No | **Keep** | Global toast component. |
| **ErrorState** | Full-width or inline banner rendering custom error texts. | Yes | No | **Keep** | Reusable feedback container. |
| **Skeletons** | Utility rendering pulse placeholders during data fetches. | Yes | No | **Keep** | Layout skeleton wrappers. |

---

## 2. Management Components (`src/components/management/`)

These components outline layout structures used to construct management dashboards.

| Component | Responsibility | Pure UI | Business Logic | Candidate | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PageHeader** | Standard page title with description and slot for actions. | Yes | No | **Keep** | Heavily adopted. |
| **ManagementHeader** | An alternative implementation of PageHeader. | Yes | No | **Delete** | Duplicate. Should be replaced by `PageHeader`. |
| **SectionCard** | Card layout containing title slots, headers, body, footers. | Yes | No | **Keep** | Standard layout wrapper. |
| **ContentSection** | Vertical column wrapper with built-in gap sizes. | Yes | No | **Keep** | Core layout container. |
| **FilterToolbar** | Form filter block handling filter layout slots and chips. | Yes | No | **Keep** | Layout-only. |
| **PageToolbar** | Row-oriented action bar with left/right layouts. | Yes | No | **Delete** | Under-utilized (0 usages). Can be merged with `FilterToolbar` or custom JSX. |
| **KPIGrid** | Grid container layout managing spacing for KPI grids. | Yes | No | **Keep** | Pure grid layout helper. |
| **SearchBar** | Text field built for searching and clearing inputs. | Yes | No | **Keep** | Used across directory toolbars. |
| **StatsSection** | Structural grid wrapper for smaller dashboard metrics. | Yes | No | **Delete** | Only used in one file. Can use standard grid classes. |

---

## 3. Dashboard Components (`src/components/dashboard-ui/` & `src/components/dashboard/`)

These layout assets build the default and telecaller dashboards.

| Component | Responsibility | Pure UI | Business Logic | Candidate | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **KPICard** | Numeric visual grid cards with charts, loading states, trends. | Yes | No | **Keep** | High usage. |
| **DashboardSection** | Layout segment grouping sections and metric titles. | Yes | No | **Keep** | Layout consistency. |
| **ActivityCard** | Custom feed list-item representing logs/action records. | Yes | No | **Keep** | Specific layout mapping. |
| **DashboardSkeleton** | Skeleton grids representing KPI blocks during loading. | Yes | No | **Keep** | Essential dashboard loading state. |
| **EmptyState** | Centered graphic + text placeholder for blank modules. | Yes | No | **Keep** | Reusable fallback state. |
| **DashboardSidebar** | Sidebar panel mapping menu links and routing paths. | No | Yes (Routing/Auth context) | **Keep** | Core layout navigation structure. |

---

## 4. Table Components (`src/components/table/`)

Primitives used to construct database tables and query paginations.

| Component | Responsibility | Pure UI | Business Logic | Candidate | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DataTable** | Main tabular list layout displaying rows, checkboxes, skeletons. | Yes | No | **Keep** | Highly customizable. |
| **TableCard** | Rounded border container enclosing the DataTable. | Yes | No | **Keep** | Standard table outline. |
| **ActionMenu** | Popover element rendering dropdown list of action hooks. | Yes | No | **Keep** | Row actions dropdown helper. |
| **StatusBadge** | Lead/user status color helper wrapping `Badge`. | No | Yes (Value mapping) | **Keep** | Hardcodes CRM-specific status colors. |
| **PriorityBadge** | Lead priority color helper wrapping `Badge`. | No | Yes (Value mapping) | **Keep** | Hardcodes CRM-specific priority colors. |
| **TablePagination** | Layout pagination controllers (next, back, page sizes). | Yes | No | **Keep** | Shared pager standard. |
