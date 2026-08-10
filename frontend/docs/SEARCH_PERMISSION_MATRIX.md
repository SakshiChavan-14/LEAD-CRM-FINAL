# Sprint 19 — Search Permissions & RBAC Matrix

## Executive Summary
Global search and cross-entity queries must strictly adhere to the CRM's Role-Based Access Control (RBAC). A user should never see search results for entities they do not have permission to view.

---

## Searchable Entity RBAC Matrix

| Role | Leads | Users / Telecallers | Call Reports | Follow-ups | Voice Logs | Admin Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Admin** | Global (All) | Global (All) | Global (All) | Global (All) | Global (All) | Global (All) |
| **Manager** | Team Scope | Team Members | Team Scope | Team Scope | Team Scope | No Access |
| **Telecaller** | Assigned Only | No Access | Self Only | Self Only | Self Only | No Access |

---

## Security Implementation Rules

1. **Backend Enforcement**: The ultimate source of truth for search permissions is the backend. API endpoints (`GET /api/global-search` or entity endpoints) must filter results based on the authenticated user's JWT role and ID.
2. **Client-Side Hiding**: The Global Search UI should dynamically adjust its searchable categories (e.g., hiding the "Users" tab for Telecallers) based on frontend RBAC utilities (`hasRole`, `hasPermission`).
