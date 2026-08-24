# CRM FRONTEND ↔ BACKEND FINAL DATA FLOW RECONCILIATION

---

## 1. Executive Summary

This document presents the final forensic reconciliation across:
1. **Frontend Source Code Architecture**: Presentation Components, Hooks, Data Services, ViewModel Mappers, and Axios request configurations.
2. **Backend API Reference Contract**: DTO definitions, request parameters, endpoint schemas, and role security boundaries.
3. **Live Admin Runtime Capture (`RAW_CAPTURE_ADMIN.md`)**: 26 verified endpoint requests with verbatim response envelopes.
4. **Live Telecaller Runtime Capture (`RAW_CAPTURE_TELECALLER.md`)**: 23 verified endpoint requests with verbatim response envelopes.

### Proven Root Causes of Prior Bugs:
- **Admin Reports KPI Zeros (Resolved in logic, needs clean sync)**: `callReportsService.getTelecallerPerformance` originally dropped `dateFrom` and `dateTo`, causing `/api/leads/calls/users` to return empty data or fail filtering.
- **Admin Performer Detail Page Zeros (`/dashboard/reports/telecaller/EMP0005`) (CONFIRMED FIRST FAILURE POINT)**: `useTelecallerReport.js` checks `Array.isArray(telecallersData)` (evaluates to `false` due to Spring Page wrapper `{ data: { content: [...] } }`) and attempts to match `t.empId || t.id` against the URL parameter `EMP0005`. The backend returns the identifier as `userId: "EMP0005"` and name as `name: "karun poojari"`. The match fails, falling back to a hardcoded zeroed state with name `"Telecaller"`.
- **Recent Call Logs Default Strings (CONFIRMED FIRST FAILURE POINT)**: `RecentCallLogsSection.jsx` reads `log.studentName`, `log.mobile`, `log.duration`, and `log.nextFollowUp`, whereas the backend returns `leadName`, `mobileNo`, `callDurationSeconds`, and `scheduledDate`.

---

## 2. Admin Pages Detailed Reconciliation

### 1. Admin Overview (`/dashboard`)
- **Component Hierarchy**: `src/app/dashboard/page.jsx` → `CallActivityCard.jsx`, `FollowUpsCard.jsx`, `ActivityTimeline.jsx`, `CoursePerformanceTable.jsx`, `TopPerformersList.jsx`.
- **Service & Hook**: `dashboardService.getStats` via `useDashboardStats()`, `useDatewiseSummary()` via `useDashboardRawData()`.
- **Backend Endpoints**:
  - `GET /api/leads/dashboard/stats` → Returns `overall` (total: 50, hot: 1, cold: 0, allotted: 50), `sourceStats`, `pipelineStats`.
  - `GET /api/leads/dashboard/activity?limit=20` → Returns 20 call/system event items.
  - `GET /api/leads/calls/individual?empId=EMP0005` → Returns 7 call logs for EMP0005.
- **Reconciliation & First Failure Point**:
  - `CallActivityCard.jsx` checks `c.interactionStatus || c.status`. Backend returns `outcome: "CONNECTED"`. This caused `"No Call Activity Record"`.

### 2. Admin Reports (`/dashboard/reports`)
- **Component Hierarchy**: `src/app/dashboard/reports/page.jsx` → `ReportKPIGrid.jsx`, `TeamSnapshotSection.jsx`, `LeaderboardTable.jsx`.
- **Service & Hook**: `callReportsService.getTelecallerPerformance` via `useCallReportsSummary()`.
- **Backend Endpoint**: `GET /api/leads/calls/users?dateFrom=2026-08-01&dateTo=2026-08-17&page=0&size=100`.
- **Actual Response Envelope**:
  ```json
  {
    "success": true,
    "data": {
      "content": [
        {
          "userId": "EMP0005",
          "name": "karun poojari",
          "totalCalls": 7,
          "connectedCalls": 3,
          "avgDuration": 8,
          "recordingsCount": 2,
          "lastActive": "2026-08-16T18:17:01"
        }
      ],
      "totalElements": 3,
      "totalPages": 1
    }
  }
  ```
- **Reconciliation & First Failure Point**:
  - Leaderboard correctly maps `t.userId` (`EMP0005`) and `t.name` (`karun poojari`), displaying `7 calls` and `3 connected`.

### 3. Admin Telecaller Performer Detail (`/dashboard/reports/telecaller/[empId]`)
- **Component Hierarchy**: `src/app/dashboard/reports/telecaller/[id]/page.jsx` → `TelecallerHeader.jsx`, `TelecallerKPIGrid.jsx`, `TelecallerAnalyticsGrid.jsx`, `TelecallerActivityGrid.jsx`.
- **Service & Hook**: `useTelecallerReport(id, range)` (`src/features/reports/hooks/useTelecallerReport.js`).
- **Data Flow Trace**:
  ```text
  URL (/dashboard/reports/telecaller/EMP0005)
    ↓ id = "EMP0005"
  useTelecallerReport("EMP0005", "this-month")
    ↓ useCallReportsSummary({ dateFrom, dateTo })
  GET /api/leads/calls/users
    ↓ returns { data: { content: [ { userId: "EMP0005", name: "karun poojari", totalCalls: 7, connectedCalls: 3 } ] } }
  Array.isArray(telecallersData) -> FALSE (telecallersData is { content: [...] })
    ↓ telecallerList = []
  telecallerList.find(t => t.empId === "EMP0005") -> UNDEFINED (t.userId is EMP0005, t.empId is undefined)
    ↓ realTc = undefined
  DROPS TO ZEROED FALLBACK STATE
    ↓ name: "Telecaller", callsMade: 0, connected: 0, conversion: 0%
  RENDERED UI: All 0s and generic "Telecaller"
  ```
- **First Failure Point**: `useTelecallerReport.js` Lines 47, 75, 78 (failure to unwrap `data.content` and mismatch between `userId` vs `empId`).

### 4. Management → Call Reports (`/dashboard/management/call-reports` & `/[id]`)
- **Component Hierarchy**: `src/app/dashboard/management/call-reports/page.jsx` and `[id]/page.jsx` → `StitchCallReportTable.jsx`.
- **Backend Endpoints**:
  - `/api/leads/calls/users` (Leaderboard list)
  - `/api/leads/calls/individual?empId=EMP0005` (Detailed logs table)
- **Reconciliation**:
  - `[id]/page.jsx` receives `userId` param (`EMP0005`) and calls `/api/leads/calls/individual?empId=EMP0005`.
  - Backend returns 7 call records. Correctly renders 7 logs in the table and calculates `Total Calls: 7`, `Connected Calls: 3`, `Recordings Count: 2`.

### 5. Lead Details (`/dashboard/management/leads/[leadId]`)
- **Component Hierarchy**: `LeadDetailsClient.jsx` → `LeadDetailsView.jsx` → `LeadHeaderCard.jsx`, `LeadStatisticsSection.jsx`.
- **Backend Endpoints**:
  - `GET /api/leads/1` → Returns Manoj, mobile: 6363045415, assignedTo: karun poojari (id: 24).
  - `GET /api/leads/1/timeline` → Returns 10 timeline events.
  - `GET /api/leads/telecaller/leads/1/status-history` → Returns 3 status change logs.
- **Reconciliation**:
  - `useLeadCalls("1")` uses Strategy 2 (admin aggregating via `/api/leads/calls/individual?empId=EMP0005`).
  - Finds 7 calls where `enquiryNo === 1`.
  - `LeadStatisticsSection.jsx` displays `Total Calls = 7`, `Connected = 3`, `Missed = 4`, `Follow-ups = 1`.

### 6. User Directory & Telecaller Details (`/dashboard/management/user-directory/[userId]`)
- **Component Hierarchy**: `TelecallerDetailsClient.jsx` → `TelecallerDetailsView.jsx` → `PerformanceSnapshot.jsx`, `RecentCallLogsSection.jsx`.
- **Backend Endpoints**:
  - `GET /api/leads/manager/users/EMP0005/dashboard` → Returns `profile` (karun poojari), `kpi` (callsThisMonth: 7, assignedLeads: 10, pendingFollowUps: 1), `callOutcomes` (CONNECTED: 3), `callsPerformance` ([{ date: "2026-08-16", calls: 7 }]).
  - `GET /api/leads/calls/individual?empId=EMP0005` → Returns 7 call logs.
- **First Failure Point**:
  - `RecentCallLogsSection.jsx` fails on property names (`log.studentName` vs `leadName`, `log.mobile` vs `mobileNo`, `log.duration` vs `callDurationSeconds`), causing fallback values `"Lead Contact"`, `"-"`, `"00:00"`.

---

## 3. Telecaller Pages Detailed Reconciliation

### 1. Telecaller Dashboard (`/telecaller`)
- **Component**: `src/app/telecaller/page.jsx`
- **Hook/Service**: `useTelecallerDashboard` → `telecallerDashboardService.getDashboardV2()`
- **Backend Endpoint**: `GET /api/leads/telecaller/dashboard/v2`
- **Actual Response**:
  ```json
  {
    "success": true,
    "data": {
      "profile": { "slNo": 24, "empId": "EMP0005", "name": "karun poojari", "role": "Telecaller" },
      "kpi": { "assignedLeads": 10, "callsThisMonth": 7, "callsToday": 0, "pendingFollowups": 1 },
      "callsPerformance": [ { "date": "2026-08-16", "calls": 7 } ],
      "callOutcomes": [ { "name": "CONNECTED", "value": 3 }, { "name": "MISSED", "value": 4 } ]
    }
  }
  ```
- **Reconciliation**:
  - Mapped via `mapDashboard` (`telecallerViewModelMapper.js`).
  - Top summary cards correctly render `10 Assigned Leads`, `0 Calls Today`, `3 Connected`, `0 Admissions`.

### 2. Telecaller My Leads (`/telecaller/leads`)
- **Component**: `src/app/telecaller/leads/page.jsx`
- **Hook/Service**: `useTelecallerLeads` → `telecallerLeadService.getMyLeads({ page: 0, size: 10 })`
- **Backend Endpoint**: `GET /api/leads/telecaller/leads?page=0&size=10`
- **Actual Response**: Custom PagedResponse envelope with `leads: [...]`, `currentPage: 0`, `totalPages: 1`, `totalItems: 10`.
- **Reconciliation**:
  - Correctly renders 10 assigned leads (Ganesh Nair, Manoj Iyer, Nandini Hegde, etc.).

### 3. Telecaller Lead Details (`/telecaller/leads/[enquiryNo]`)
- **Component**: `TelecallerLeadDetailsClient.jsx`
- **Hook/Service**: `useLeadDetails(enquiryNo)` → `telecallerLeadService.getLeadDetails(enquiryNo)`
- **Backend Endpoint**: `GET /api/leads/telecaller/leads/3`
- **Reconciliation**:
  - Displays lead contact information, location, call action button, and status update actions.

### 4. Telecaller Call History (`/telecaller/calls` and `/calls/history`)
- **Component**: `src/app/telecaller/calls/page.jsx`
- **Hook/Service**: `callHistoryService.getCallHistory()`
- **Backend Endpoint**: `GET /api/leads/telecaller/calls?page=0&size=10`
- **Actual Response**: Returns 7 calls for the logged-in telecaller.
- **Reconciliation**:
  - Verified working. Audio player uses `/api/leads/telecaller/voice/recordings/{interactionId}`.

### 5. Telecaller Follow-ups (`/telecaller/follow-ups`)
- **Component**: `src/app/telecaller/follow-ups/page.jsx`
- **Backend Endpoint**: `GET /api/leads/telecaller/followups?tab=today` / `upcoming` / `overdue` / `missed`
- **Actual Response**: Returns pending follow-up items.
- **Reconciliation**:
  - Verified working. Displays scheduled follow-ups.

---

## 4. Four-Way Master Reconciliation Table

| Page / Feature | Endpoint | Frontend Expects | Backend Contract | Actual Admin Response | Actual Telecaller Response | Match Status | Root Cause / Issue |
|---|---|---|---|---|---|---|---|
| **Admin Overview Stats** | `GET /api/leads/dashboard/stats` | `{ overall: { total, hot, cold } }` | `DashboardStatsDTO` | 200 OK (`total: 50`) | N/A (Admin only) | **MATCH** | Working |
| **Admin Overview Activity** | `GET /api/leads/dashboard/activity` | `Array of event logs` | `List<ActivityDTO>` | 200 OK (20 items) | N/A (Admin only) | **MATCH** | Working |
| **Admin Reports Summary** | `GET /api/leads/calls/users` | `data.content[]` with `totalCalls`, `connectedCalls` | `Page<TelecallerSummaryDTO>` | 200 OK (`content: [{ userId: "EMP0005", name: "karun poojari", totalCalls: 7 }]`) | 403 Forbidden (Admin only) | **MISMATCH (Identifier field)** | Frontend expected `empId`/`empName`, backend returns `userId`/`name` |
| **Performer Detail** | `GET /api/leads/calls/users` + `/individual` | `Array of telecallers` + calls | `Page<TelecallerSummaryDTO>` | 200 OK | N/A | **MISMATCH (Envelope & ID)** | `Array.isArray` check failed; ID matching checked `empId` instead of `userId` |
| **User Directory** | `GET /api/leads/manager/users` | `data.users[]` with `empId`, `name`, `status` | `PagedUserResponse` | 200 OK (`users: [...]`) | N/A (Admin only) | **MATCH** | Working |
| **Telecaller Dashboard View** | `GET /api/leads/manager/users/{empId}/dashboard` | `{ profile, kpi, callsPerformance, callOutcomes }` | `TelecallerDashboardDTO` | 200 OK (`kpi.callsThisMonth = 7`) | N/A (Admin only) | **MATCH** | Working |
| **Telecaller Recent Call Logs** | `GET /api/leads/calls/individual` | `log.studentName`, `log.mobile`, `log.duration` | `Page<CallLogDTO>` | 200 OK (`leadName`, `mobileNo`, `callDurationSeconds`) | N/A | **MISMATCH (Field names)** | Property names in `RecentCallLogsSection.jsx` do not match backend keys |
| **Lead Details** | `GET /api/leads/{enquiryNo}` | `{ student, location, education, lead }` | `LeadDetailsDTO` | 200 OK (Manoj) | N/A | **MATCH** | Working |
| **Telecaller Dashboard** | `GET /api/leads/telecaller/dashboard/v2` | `{ profile, kpi, performance, targets }` | `TelecallerDashboardV2DTO` | N/A (Telecaller only) | 200 OK (`kpi.assignedLeads = 10`) | **MATCH** | Working |
| **Telecaller My Leads** | `GET /api/leads/telecaller/leads` | `data.leads[]` | `PagedLeadResponse` | N/A (Telecaller only) | 200 OK (10 leads) | **MATCH** | Working |
| **Telecaller Call History** | `GET /api/leads/telecaller/calls` | `data.content[]` | `Page<CallHistoryDTO>` | N/A (Telecaller only) | 200 OK (7 calls) | **MATCH** | Working |

---

## 5. Exact Frontend Request Verification

| Endpoint | Frontend Hook / Service | Query Parameters Sent by Frontend | Query Parameters in Live Capture | Status | Parameter Alignment |
|---|---|---|---|---|---|
| `/api/leads/calls/users` | `useCallReportsSummary` (`callReportsService.js`) | `page=0&size=100&dateFrom=2026-08-01&dateTo=2026-08-17` | `page=0&size=10&dateFrom=2026-08-01&dateTo=2026-08-17` | **ALIGNED** | Backend correctly accepts ISO date strings `YYYY-MM-DD`. |
| `/api/leads/calls/individual` | `useTelecallerCallLogs` (`callReportsService.js`) | `empId=EMP0005&page=0&size=10` | `empId=EMP0005&page=0&size=10` | **ALIGNED** | Parameter `empId` is correctly transmitted. |
| `/api/leads/manager/users/{empId}/dashboard` | `useTelecallerDashboard` (`telecallerService.js`) | Path param `empId=EMP0005` | Path param `empId=EMP0005` | **ALIGNED** | Path param is correctly transmitted. |
| `/api/leads/overview` | `useLeads` (`leadService.js`) | `type=all&page=0&size=30` | `type=all&page=0&size=30` | **ALIGNED** | Filter and pagination parameters match backend contract. |

---

## 6. Response Envelope Audit

1. **Spring Page Envelope (`{ success: true, data: { content: [...], totalElements, totalPages, number } }`)**:
   - Used by: `/api/leads/calls/users`, `/api/leads/calls/individual`, `/api/leads/telecaller/calls`.
   - **Frontend Envelope Handling**:
     - In `useTelecallerReport.js`: `Array.isArray(telecallersData)` evaluated to `false`. **FAILED**.
     - In `useLeadCalls.js`: `data?.data?.content || data?.content || []`. **PASSED**.
     - In `RecentCallLogsSection.jsx`: `data?.data || data?.content || []`. **PASSED**.
2. **Custom PagedLeadResponse (`{ success: true, data: { leads: [...], currentPage, totalPages, totalItems } }`)**:
   - Used by: `/api/leads/overview`, `/api/leads/telecaller/leads`.
   - **Frontend Envelope Handling**: Handled correctly via `data?.leads || []`. **PASSED**.
3. **Custom PagedUserResponse (`{ success: true, data: { users: [...], currentPage, totalPages, totalItems } }`)**:
   - Used by: `/api/leads/manager/users`.
   - **Frontend Envelope Handling**: Handled correctly via `data?.users || []`. **PASSED**.
4. **Direct Nested Object (`{ success: true, data: { profile: {...}, kpi: {...} } }`)**:
   - Used by: `/api/leads/manager/users/{empId}/dashboard`, `/api/leads/{enquiryNo}`.
   - **Frontend Envelope Handling**: Handled correctly. **PASSED**.

---

## 7. Field-Level Audit & Key Mismatches

| Endpoint / Context | Backend JSON Key | Frontend Expected Key | Component / Hook Location | Resulting UI Behavior |
|---|---|---|---|---|
| `/api/leads/calls/users` | `userId` | `empId` / `id` | `useTelecallerReport.js` (Lines 48, 78) | Telecaller matching fails; displays `"Telecaller"` and `0`s |
| `/api/leads/calls/users` | `name` | `empName` | `useTelecallerReport.js` (Line 140) | Name evaluates to fallback `"Telecaller"` |
| `/api/leads/calls/individual` | `leadName` | `studentName` | `RecentCallLogsSection.jsx` (Line 59) | Displays `"Lead Contact"` |
| `/api/leads/calls/individual` | `mobileNo` | `mobile` / `phone` | `RecentCallLogsSection.jsx` (Line 75) | Displays `"-"` |
| `/api/leads/calls/individual` | `callDurationSeconds` | `duration` | `RecentCallLogsSection.jsx` (Line 81) | Displays `"00:00"` |
| `/api/leads/calls/individual` | `scheduledDate` | `nextFollowUp` | `RecentCallLogsSection.jsx` (Line 103) | Displays `"—"` |
| `/api/leads/calls/individual` | `outcome` | `interactionStatus` / `status` | `useDatewiseSummary` in `useReportsQueries.js` | Displays `"No Call Activity Record"` |

---

## 8. Zero / Empty / N/A Forensics & First Failure Point

| UI Element | Rendered Value | Real Backend Value | Category | First Failure Point in Code | Root Cause Description |
|---|---|---|---|---|---|
| **Performer Detail Header** | `"Telecaller"` | `"karun poojari"` | **F. Field-name mismatch + E. Envelope mismatch** | `src/features/reports/hooks/useTelecallerReport.js` (Line 47 & 78) | `Array.isArray(telecallersData)` is `false`; identifier check compares `t.empId` against `"EMP0005"` when backend provides `userId`. |
| **Performer Detail Calls Made** | `0` | `7` | **E. Response envelope mismatch** | `useTelecallerReport.js` (Line 128) | Falls back to zeroed state because `realTc` is `undefined`. |
| **Performer Detail Connected** | `0` | `3` | **E. Response envelope mismatch** | `useTelecallerReport.js` (Line 130) | Falls back to zeroed state because `realTc` is `undefined`. |
| **Recent Call Logs Duration** | `00:00` | `7 seconds` (00:07) | **F. Field-name mismatch** | `src/features/users/components/details/RecentCallLogsSection.jsx` (Line 81) | Reads `log.duration` instead of `log.callDurationSeconds`. |
| **Recent Call Logs Student Name** | `"Lead Contact"` | `"Manoj"` | **F. Field-name mismatch** | `RecentCallLogsSection.jsx` (Line 59) | Reads `log.studentName` instead of `log.leadName`. |
| **Recent Call Logs Mobile** | `"-"` | `"6363045415"` | **F. Field-name mismatch** | `RecentCallLogsSection.jsx` (Line 75) | Reads `log.mobile` instead of `log.mobileNo`. |
| **Admin Overview Call Activity** | `"No Call Activity Record"` | 7 Calls, 3 Connected | **F. Field-name mismatch** | `src/features/reports/hooks/useReportsQueries.js` (Line 142) | Checks `c.interactionStatus` instead of `c.outcome` / `c.callOutcome`. |

---

## 9. Cross-Page Metric Reconciliation (EMP0005)

| Metric | Page | Endpoint | Raw API Value | Frontend Mapped Value | UI Rendered Value | Scope / Consistency Status |
|---|---|---|---:|---:|---:|---|
| **Total Calls** | Admin Reports | `/api/leads/calls/users` | `7` | `7` | `7` | **Consistent** (All calls in date range) |
| **Total Calls** | Admin Overview | `/api/leads/calls/individual` | `7` | `7` | `7` | **Consistent** (Aggregated datewise summary) |
| **Total Calls** | Telecaller Details (`EMP0005`) | `/api/leads/manager/users/EMP0005/dashboard` | `7` | `7` | `7` | **Consistent** (`kpi.callsThisMonth`) |
| **Total Calls** | Performer Detail | `/api/leads/calls/users` | `7` | `0` (Bug) | `0` | **Broken** (Envelope/Field mismatch in `useTelecallerReport.js`) |
| **Total Calls** | Lead Details (Manoj #1) | `/api/leads/calls/individual` | `7` | `7` | `7` | **Consistent** (All 7 calls belonged to Lead #1) |
| **Connected Calls** | Admin Reports | `/api/leads/calls/users` | `3` | `3` | `3` | **Consistent** |
| **Connected Calls** | Telecaller Details (`EMP0005`) | `/api/leads/manager/users/EMP0005/dashboard` | `3` | `3` | `3` | **Consistent** (`callOutcomes: [{ name: "CONNECTED", value: 3 }]`) |
| **Connected Calls** | Performer Detail | `/api/leads/calls/users` | `3` | `0` (Bug) | `0` | **Broken** (Envelope/Field mismatch in `useTelecallerReport.js`) |
| **Connected Calls** | Lead Details (Manoj #1) | `/api/leads/calls/individual` | `3` | `3` | `3` | **Consistent** (3 Connected, 4 Missed) |
| **Assigned Leads** | Telecaller Details | `/api/leads/manager/users/EMP0005/dashboard` | `10` | `10` | `10` | **Consistent** (`kpi.assignedLeads = 10`) |
| **Assigned Leads** | Telecaller Dashboard | `/api/leads/telecaller/dashboard/v2` | `10` | `10` | `10` | **Consistent** (`kpi.assignedLeads = 10`) |
| **Follow-ups** | Telecaller Details | `/api/leads/manager/users/EMP0005/dashboard` | `1` | `1` | `1` | **Consistent** (EMP0005 has 1 pending follow-up) |
| **Follow-ups** | Admin Overview | `/api/leads/dashboard/stats` | `2` | `2` | `2` | **Consistent** (Admin total across all telecallers = 2) |

---

## 10. Click-Through & Identifier Preservation Audit

```text
1. Reports Leaderboard
   └─ Row: karun poojari
      └─ ID extracted from: t.userId || t.empId || t.id -> "EMP0005"
         └─ Action: router.push(`/dashboard/reports/telecaller/EMP0005`)
            └─ URL: /dashboard/reports/telecaller/EMP0005?range=2026-08-01-to-2026-08-17
               └─ Param received: id = "EMP0005"
                  └─ Hook: useTelecallerReport("EMP0005", ...)
                     └─ Queries:
                        ├── /api/leads/calls/users (Looks for userId: "EMP0005")
                        ├── /api/leads/calls/individual?empId=EMP0005
                        └── /api/leads/telecaller/EMP0005/followups
   [STATUS: IDENTIFIER PRESERVED. Broken only by internal response field matching.]

2. User Directory
   └─ Row: karun poojari (EMP0005)
      └─ Action: router.push(`/dashboard/management/user-directory/EMP0005`)
         └─ Hook: useTelecallerDashboard("EMP0005")
            └─ Query: /api/leads/manager/users/EMP0005/dashboard
   [STATUS: IDENTIFIER PRESERVED. Successfully returns 200 OK with real data.]

3. Management Leads
   └─ Row: Manoj (Enquiry ENQ-1, LeadId 1)
      └─ Action: router.push(`/dashboard/management/leads/1`)
         └─ Hook: useLeadDetails("1") -> /api/leads/1
         └─ Hook: useLeadCalls("1") -> /api/leads/calls/individual?empId=EMP0005 (Filtered by enquiryNo: 1)
   [STATUS: IDENTIFIER PRESERVED. Successfully renders Lead 1 details & calls.]
```

---

## 11. Hardcoded Defaults & Fallback Value Audit

- **`"Telecaller"`**: Hardcoded fallback string in `useTelecallerReport.js` (Line 199) and `TelecallerHeader.jsx` (Line 25) when data mapping fails.
- **`0` / `0.0%`**: Zeroed fallback object in `useTelecallerReport.js` (Lines 205–210) returned when `realTc` is `undefined`.
- **`"Lead Contact"`**: Default JSX fallback in `RecentCallLogsSection.jsx` (Line 60) when `log.studentName` is `undefined`.
- **`"-"`**: Default JSX fallback in `RecentCallLogsSection.jsx` (Line 76) when `log.mobile` is `undefined`.
- **`"00:00"`**: Default JSX fallback in `RecentCallLogsSection.jsx` (Line 82) when `log.duration` is `undefined`.
- **`"—"`**: Default JSX fallback in `RecentCallLogsSection.jsx` (Line 104) when `log.nextFollowUp` is `undefined`.
- **`"No Call Activity Record"`**: Default empty state in `CallActivityCard.jsx` when trend points array is empty.

---

## 12. Final Status Classification

### PROVEN WORKING
- **Admin Overview**: Executive metrics (`total: 50`, `hot: 1`, `cold: 0`), upcoming/overdue tasks count (`2 Tasks`), activity timeline (20 items).
- **Admin Reports Leaderboard**: Correctly renders `karun poojari` with `7 calls` and `3 connected`.
- **User Directory**: Lists telecallers with active statuses and photos (`/api/leads/manager/users`).
- **Telecaller KPI Snapshot**: Displays `10 Assigned Leads`, `7 Calls This Month`, `1 Pending Follow-up` (`/api/leads/manager/users/EMP0005/dashboard`).
- **Lead Details (Manoj #1)**: Student profile, location, assigned telecaller, and 7 call logs (`/api/leads/1`).
- **Telecaller Dashboard (`/telecaller`)**: KPI summary cards, assigned leads list, and call history.

### PROVEN BROKEN
- **Admin Performer Detail (`/dashboard/reports/telecaller/EMP0005`)**: Displays name `"Telecaller"` and all KPI cards as `0`. First failure point: `useTelecallerReport.js` failing to unwrap Spring Page envelope and matching `empId` instead of `userId`.
- **Recent Call Logs Table (`RecentCallLogsSection.jsx`)**: Displays `"Lead Contact"`, `"-"`, `"00:00"`. First failure point: Mismatched property names (`studentName`, `mobile`, `duration`).
- **Admin Overview Today's Call Activity (`CallActivityCard.jsx`)**: Displays `"No Call Activity Record"`. First failure point: Checking `interactionStatus` instead of `outcome` / `callOutcome`.

---

## 13. Proven Fix Plan

### Fix 1: Admin Performer Detail Data Lineage
- **File**: `src/features/reports/hooks/useTelecallerReport.js`
- **Function**: `useTelecallerReport`
- **Current Logic**:
  ```javascript
  const resolvedEmpId = useMemo(() => {
    const list = Array.isArray(telecallersData) ? telecallersData : [];
    const matched = list.find((t) => String(t.empId || t.id) === String(id));
    return matched?.empId || matched?.id || id;
  }, [telecallersData, id]);

  const data = useMemo(() => {
    const telecallerList = Array.isArray(telecallersData) ? telecallersData : [];
    const realTc = telecallerList.find((t) => String(t.empId || t.id) === String(id));
  ```
- **Actual Backend Field**:
  Envelope is `telecallersData?.content || telecallersData?.users || []`. Identifiers in content are `userId: "EMP0005"`, `name: "karun poojari"`.
- **Correct Logic**:
  1. Unwrap `telecallersData?.content || telecallersData?.users || (Array.isArray(telecallersData) ? telecallersData : [])`.
  2. Match identifier case-insensitively across `t.userId`, `t.empId`, and `t.id`.
  3. Query `useTelecallerDashboard(resolvedEmpId)` to obtain authoritative profile info (`name`, `avatar`, `role`).
  4. Map metrics from `realTc` and profile info from `dashboardData?.profile`.
- **Expected Result**: `/dashboard/reports/telecaller/EMP0005` displays `"karun poojari"`, `Calls Made = 7`, `Connected = 3`, `Follow-ups = 1`, `Conversion = 0.0%`.
- **Priority**: **P0 (Critical)**

---

### Fix 2: Recent Call Logs Table Property Normalization
- **File**: `src/features/users/components/details/RecentCallLogsSection.jsx`
- **Function**: `RecentCallLogsSection`
- **Current Logic**:
  ```javascript
  const displayLogs = rawLogs;
  // Inside JSX:
  {log.studentName || "Lead Contact"}
  {log.mobile || "-"}
  {log.callTime || "Today"}
  {log.duration || "00:00"}
  {log.nextFollowUp || "—"}
  ```
- **Actual Backend Fields from `/api/leads/calls/individual`**:
  `leadName`, `mobileNo`, `createdAt`, `callDurationSeconds`, `outcome`, `scheduledDate`.
- **Correct Logic**:
  Add clean normalization layer `normalizeLog`:
  - `studentName`: `log.name || log.leadName || log.studentName || "Student Lead"`
  - `phone`: `log.phone || log.mobileNo || log.leadPhone || "—"`
  - `callTime`: `formatDisplayDate(log.createdAt || log.callDate || log.date)`
  - `duration`: Format `callDurationSeconds` into `mm:ss` (e.g. 7s → `"00:07"`)
  - `outcome`: `log.callOutcome || log.outcome || log.status`
  - `nextFollowUp`: `formatDisplayDate(log.scheduledDate || log.nextFollowup || "—")`
- **Expected Result**: Call logs display `"Manoj"`, `"6363045415"`, `"16 Aug 2026"`, `"00:07"`, `"CONNECTED"`.
- **Priority**: **P1**

---

### Fix 3: Admin Overview Today's Call Activity Status Normalization
- **File**: `src/features/reports/hooks/useReportsQueries.js`
- **Function**: `useDatewiseSummary`
- **Current Logic**:
  ```javascript
  const status = (c.interactionStatus || c.status || "").toUpperCase();
  const isConnected = status === "CONNECTED" || status === "ANSWERED" || status === "COMPLETED";
  ```
- **Actual Backend Field**:
  `c.callOutcome || c.outcome` (e.g. `"CONNECTED"`).
- **Correct Logic**:
  ```javascript
  const status = (c.callOutcome || c.outcome || c.interactionStatus || c.status || "").toUpperCase();
  const isConnected = status === "CONNECTED" || status === "ANSWERED" || status === "COMPLETED";
  ```
- **Expected Result**: Admin overview AreaChart and live summary counters render live call volume (7 Total, 3 Connected).
- **Priority**: **P1**

---

### Fix 4: Call Outcome Donut Chart Metric Calculation
- **File**: `src/features/users/components/details/charts/CallOutcomeChart.jsx`
- **Function**: `CallOutcomeChart`
- **Current Logic**: Formats legend as `${name} ${value}%` where `value` is raw count (e.g. `3`).
- **Correct Logic**: Calculate dynamic percentage `((value / totalCalls) * 100).toFixed(1)`: `${name} ${percentage}% (${value} calls)`.
- **Expected Result**: Donut legend displays `CONNECTED 42.9% (3 calls)` instead of `CONNECTED 3%`.
- **Priority**: **P2**
