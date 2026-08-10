# Sprint 19 — Backend Search API Matrix & Contract Audit

## Executive Summary
This document audits all backend API endpoints supporting search queries across the CRM, mapping parameter names, query keys, supported filters, and response models.

---

## Backend Endpoint Matrix

| Feature Domain | Endpoint | Query Parameter Name | Supported Search Fields | React Query Hook | Query Key Definition |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Leads** | `GET /api/leads` | `search` | Name, Email, Phone, Lead ID, State | `useLeadOverview` | `["leads", "overview", activeFilters]` |
| **Users** | `GET /api/users` | `search` | Name, Username, Phone, Employee ID | `useUsers` | `["users", page, size, search, status]` |
| **Telecaller Leads**| `GET /api/telecaller/leads`| `search` | Lead Name, Mobile, Course, City | `useMyLeads` | `["telecaller", "leads", filters, page, size]` |
| **Follow-ups** | `GET /api/telecaller/followups`| `search` | Lead Name, Mobile, Remarks | `useFollowups` | `["followups", tab, filters]` |
| **Call Reports** | `GET /api/call-reports/performance`| `search` | Employee Name, Telecaller ID | `useCallReports` | `["callReports", "performance", filters, page, size]` |
| **Voice Logs** | `GET /api/telecaller/calls` | `search` | Lead Phone, Call ID | `useCallHistory` | **`["telecaller-calls"]` (MISSING PARAMS)** |
| **Global Search** | **NONE** | N/A | Cross-entity search (Leads, Users, Calls) | **NONE** | **NONE** |

---

## Parameter Discrepancy Findings

1. **Parameter Naming**: All primary endpoints currently accept `search` as the query parameter string, which simplifies standardization.
2. **Missing Search Support in Voice Logs**: `useCallHistory` defines static query key `["telecaller-calls"]` and does not pass search query parameters to `telecallerCallService`.
