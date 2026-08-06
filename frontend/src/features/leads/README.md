# Leads Feature Domain

## Overview
Manages lead lists, search, filtration drawers, status transition actions, and full lead details view pages.

## Responsibilities
- Rendering leads data tables with pagination and bulk action handling.
- Lead filter drawers and active filter chip containers.
- Detailed lead information tabs (Timeline, Notes, Overview).

## Key Entry Points
- `LeadsDataTable.jsx` — Main table view.
- `LeadDetailsView.jsx` — Full-page lead detail view.
- `useLeads.js` — React Query hooks for lead mutations & queries.
- `leadsService.js` — API integration endpoints.

## Dependencies
- `@/components/ui/` (Button, Modal, Skeletons, ErrorState)
- `@/components/crm/` (CRM Status Pills & Badges)
- `@/components/table/` (DataTable, TableCard, TablePagination)
