# Management UI Composition Architecture & Developer Guidelines

## 1. Purpose & Design Philosophy

The Management UI Composition Layer provides a standardized, domain-agnostic set of layout primitives located in `src/components/management/`. 

### Key Objectives
- **Layout Consistency**: Ensure all CRM management views (`Leads`, `User Directory`, `Call Reports`, `Dashboards`, `Follow-ups`, `Voice Center`) share identical vertical spacing, grid layouts, page headers, section cards, and filter toolbars.
- **Zero Business Logic Leakage**: Composition primitives **NEVER** own domain logic, state management, API queries, permissions, or routing handlers.
- **Clean Developer API**: Support both straightforward prop-driven APIs (`<PageHeader title="..." actions={...} />`) AND pragmatic compound subcomponents (`SectionCard.Header`, `SectionCard.Body`, `SectionCard.Footer`, `PageHeader.Actions`) where enhanced layout flexibility is needed.
- **Zero Wrapper Bloat**: Eliminate pure-layout feature wrapper files that only return JSX without owning hooks or business logic.

---

## 2. Component API Reference

All management composition components are exported via the barrel file `src/components/management/index.js`:

```javascript
import {
  PageHeader,
  KPIGrid,
  PageToolbar,
  FilterToolbar,
  SectionCard,
  ContentSection,
  StatsSection
} from "@/components/management";
```

### 2.1 `<PageHeader>`
Flexible page header primitive for page titles, subtitles, and header actions.

```jsx
// Prop-based usage (Standard pages)
<PageHeader
  title="Leads Management"
  description="View and manage all system leads"
  actions={
    <>
      <Button onClick={handleImport}>Import CSV</Button>
      <Button onClick={handleAdd}>Add Lead</Button>
    </>
  }
/>

// Compound subcomponent usage (Flexible layouts)
<PageHeader title="Telecaller Directory" description="Manage access">
  <PageHeader.Actions>
    <Button onClick={handleAdd}>+ Add Telecaller</Button>
  </PageHeader.Actions>
</PageHeader>
```

### 2.2 `<KPIGrid>`
Responsive grid wrapper for KPI summary cards.

```jsx
<KPIGrid columns={4} className="grid-cols-2 sm:grid-cols-4">
  {kpiData.map((kpi) => (
    <KPICard key={kpi.id} title={kpi.title} value={kpi.value} icon={kpi.icon} />
  ))}
</KPIGrid>
```

### 2.3 `<SectionCard>`
Standard card wrapper with optional headers, titles, actions, body, and footers.

```jsx
// Prop-based usage
<SectionCard title="Profile Information" subtitle="Personal details">
  <ProfileDetailsForm />
</SectionCard>

// Compound subcomponent usage
<SectionCard>
  <SectionCard.Header>
    <SectionCard.Title>Call Outcome Breakdown</SectionCard.Title>
    <SectionCard.Actions>
      <ExportButton />
    </SectionCard.Actions>
  </SectionCard.Header>
  <SectionCard.Body>
    <CallOutcomeChart data={data} />
  </SectionCard.Body>
</SectionCard>
```

### 2.4 `<ContentSection>`
Main page-level vertical stack container providing standard layout spacing.

```jsx
<ContentSection>
  <PageHeader title="Call Reports" />
  <KPIGrid>...</KPIGrid>
  <SectionCard>...</SectionCard>
</ContentSection>
```

### 2.5 `<FilterToolbar>` & `<PageToolbar>`
Layout containers for search inputs, status selects, date pickers, and filter action buttons.

```jsx
<FilterToolbar>
  <SearchBar value={search} onChange={setSearch} />
  <StatusSelect value={status} onChange={setStatus} />
</FilterToolbar>
```

---

## 3. Strict Feature Ownership & Wrapper Deletion Rules

### Feature Ownership Boundaries
The following MUST remain strictly inside feature modules (`src/features/<feature>/`):
- ✅ React Query hooks (`useLeads`, `useUsers`, `useVoiceAnalytics`)
- ✅ Local state (`useState`, `useReducer`)
- ✅ ViewModel mapping & data transformations
- ✅ Permission checks & role verification
- ✅ Form validation & submit handlers
- ✅ URL routing & search parameter syncing

### Wrapper Deletion Rule
A component may **ONLY BE DELETED** if it meets ALL 10 criteria:
1. No React hooks
2. No local state
3. No React Query queries/mutations
4. No ViewModel mapping
5. No permissions logic
6. No routing/navigation
7. No URL state manipulation
8. No feature-specific calculations
9. No feature-specific event handlers
10. Only layout composition / JSX wrapping

*If a component contains any of items 1–9, it MUST be kept as a feature component; only its internal layout primitives will be simplified.*

---

## 4. Best Practices & Anti-Patterns

### ✅ Best Practices
- **Use Barrel Export**: Always import management primitives from `@/components/management`.
- **Keep Prop-based APIs Simple**: Use `<PageHeader title="..." description="..." actions={...} />` for 90% of standard page layouts.
- **Inline Pure Layout Wrappers**: When a feature file only wraps a single management primitive without owning hooks or state, inline the primitive into the parent page shell and delete the redundant wrapper.

### ❌ Anti-Patterns
- **Do NOT put business logic inside management components**: Never import `@/features/*` into `src/components/management/`.
- **Do NOT introduce compound APIs for abstraction's sake**: Avoid creating subcomponents (e.g. `KPIGrid.Item`) when standard HTML/Tailwind grid items work perfectly.
- **Do NOT move feature hooks out of feature directories**.
