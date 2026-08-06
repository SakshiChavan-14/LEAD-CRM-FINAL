# Component Duplication Report

This report evaluates components with overlapping responsibilities to identify opportunities for future convergence or explain why they should remain separate.

---

## 1. Card & Layout Wrappers

### SectionCard vs. TableCard vs. DashboardSection vs. ContentSection

* **Why do they all exist?**
  - `SectionCard` is a wrapper containing headers, titles, actions, and custom slots.
  - `TableCard` is a thin visual container specifically for tables (`rounded-[22px] overflow-hidden`).
  - `DashboardSection` is a flex container for widgets with titles and action controls.
  - `ContentSection` is a simple vertical column with a `gap-6` styling to space multiple sections.

* **Should they stay separate?**
  - **Yes, mostly.** `TableCard` should remain a light container since tables require specialized overflow controls (like horizontal scrolls) and borders. `ContentSection` is a spacing utility, not a card.
  - **Convergence Candidate**: `DashboardSection` duplicates the logic of `SectionCardHeader`. The widgets in the dashboard could easily render inside a standard `SectionCard` or use its header components, eliminating `DashboardSection` completely.

* **Would merging reduce clarity?**
  - Merging `DashboardSection` into `SectionCard` would actually **improve** clarity by unifying card layout parameters. Merging `TableCard` into `SectionCard` would decrease clarity due to complex scroll requirements inside tables.

---

## 2. Dialog & Overlay Wrappers

### Modal vs. ConfirmDialog

* **Why do both exist?**
  - `Modal` is a general React Portal component wrapper that renders any children inside an overlay.
  - `ConfirmDialog` is a single, globally mounted dialog connected to `useConfirmStore` that displays structured confirm/cancel options (like deleting users or unsaved leads warnings).

* **Should they stay separate?**
  - **Yes.** They serve different purposes. `Modal` is a layout/presentation primitive. `ConfirmDialog` is a logic-linked utility. However, `ConfirmDialog` internally consumes `Modal` as its layout base, which is the correct architecture.

---

## 3. Badge Components (Badge Audit)

### Badge vs. StatusBadge vs. PriorityBadge vs. PreviewBadge

* **Why do they all exist?**
  - `Badge` is the visual representation of a color pill.
  - `StatusBadge` matches CRM statuses (e.g. `Enquiry`, `Leads`, `Assigned`) to colors and renders a `Badge`.
  - `PriorityBadge` matches CRM priorities (e.g. `High`, `Medium`, `Low`) to colors.
  - `PreviewBadge` is a specialized badge used inside templates.

* **Does each own business logic?**
  - `Badge` and `PreviewBadge` are purely presentational.
  - `StatusBadge` and `PriorityBadge` contain mapping logic (translating domain strings like "hot" or "cold" to theme colors).

* **Can variants be unified?**
  - **Yes.** `PreviewBadge` can be completely deleted and replaced by a standard `<Badge variant="info">` or `<Badge variant="rose">`.
  - `StatusBadge` and `PriorityBadge` should remain separate as they map distinct business domains, but they should strictly compose `Badge` internally without redeclaring badge HTML structures.

---

## 4. Headers

### PageHeader vs. ManagementHeader

* **Why do both exist?**
  - Both render page headings and action lists on management views.
  - `ManagementHeader` was introduced during earlier phases but acts as a duplicate of `PageHeader`.

* **Can they converge?**
  - **Yes.** `ManagementHeader` should be deleted. All occurrences should be migrated to `PageHeader` using standard action slots.
