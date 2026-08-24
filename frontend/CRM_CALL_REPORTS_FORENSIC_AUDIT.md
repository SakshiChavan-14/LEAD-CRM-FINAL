# CRM CALL REPORTS & RECORDINGS FORENSIC AUDIT

---

## 1. Executive Summary

This forensic audit investigates the **Admin → Management → Call Reports → Telecaller Logs** module (`/dashboard/management/call-reports/EMP0005`), specifically focusing on:
1. **Audio Recording Inaudibility**: Why the audio player opens and simulates playing, but produces 0 bytes of audible sound.
2. **Recording Count vs. Play Button Inconsistency**: Why the KPI reports `Recordings: 2`, but the Call Reports table renders a purple Play button on all 7 rows.
3. **Avg Duration KPI Miscalculation**: Why the KPI displays `03m 15s` instead of the actual `00m 08s`.
4. **Call Details Modal Fidelity (Timeline & Notes tabs)**: Proving that the Timeline and Notes tabs contain static hardcoded mock data.

---

## 2. Phase 1 — Call Records Data Inventory (`EMP0005`)

### Endpoint
- **URL**: `GET /api/leads/calls/individual?empId=EMP0005&page=0&size=50`
- **HTTP Status**: `200 OK`
- **Total Records Returned**: `7`

### Record-by-Record Inventory:

| # | Call ID | Enquiry No | Lead Name | Mobile No | Outcome | Duration (s) | `recordingUrl` Present? | Telecaller Notes | Created At |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **12** | 1 | Manoj | 6363045415 | `CONNECTED` | 7 | **YES** (`https://api.twilio.com/.../RE2e1aa5...`) | `null` | 2026-08-16T18:17:01 |
| 2 | **11** | 1 | Manoj | 6363045415 | `CONNECTED` | 9 | **NO** (`null`) | `"ready to be admitted"` | 2026-08-16T18:16:51 |
| 3 | **10** | 1 | Manoj | 6363045415 | `null` | `null` | **NO** (`null`) | `null` | 2026-08-16T18:16:49 |
| 4 | **9** | 1 | Manoj | 6363045415 | `CONNECTED` | 8 | **YES** (`https://api.twilio.com/.../RE2b20b0...`) | `null` | 2026-08-16T18:15:45 |
| 5 | **8** | 1 | Manoj | 6363045415 | `null` | `null` | **NO** (`null`) | `null` | 2026-08-16T18:15:30 |
| 6 | **7** | 1 | Manoj | 6363045415 | `null` | `null` | **NO** (`null`) | `null` | 2026-08-16T18:15:08 |
| 7 | **6** | 1 | Manoj | 6363045415 | `null` | `null` | **NO** (`null`) | `null` | 2026-08-16T18:13:21 |

- **Calls with real `recordingUrl`**: **2** (Calls #12 and #9)
- **Calls without recording (`recordingUrl: null`)**: **5** (Calls #11, #10, #8, #7, #6)

---

## 3. Phase 2 — Recording URL & Audio Stream Verification

### 1. The Twilio URL Returned by Backend:
- URL: `https://api.twilio.com/2010-04-01/Accounts/AC_REDACTED_ACCOUNT_SID/Recordings/RE_REDACTED_RECORDING_SID`
- Type: Absolute URL pointing to Twilio REST API.

### 2. HTTP Network Probe of the Recording URL:
When requested directly without HTTP Basic Authentication:
- **HTTP Status**: **`401 Unauthorized`**
- **Content-Type**: `application/xml` *(XML error payload, NOT an audio file)*
- **Twilio Error Code**: `20003` (`Authenticate` / Account SID & Auth Token required)
- **Header**: `WWW-Authenticate: Basic realm="Twilio API"`
- **Response Body**:
  ```xml
  <?xml version='1.0' encoding='UTF-8'?>
  <TwilioResponse>
    <RestException>
      <Code>20003</Code>
      <Message>Authenticate</Message>
      <MoreInfo>https://www.twilio.com/docs/errors/20003</MoreInfo>
      <Status>401</Status>
    </RestException>
  </TwilioResponse>
  ```

### 3. Frontend Synthesized Proxy Endpoint Probe:
`RecordingTab.jsx` (lines 11–13) ignores `call.recordingUrl` when `callId` is present and attempts to fetch:
- URL: `GET /api/leads/telecaller/calls/{callId}/recording`
- Live Backend Response: **`404 Not Found`**
  ```json
  {
    "timestamp": "2026-08-17T16:05:44.9880409",
    "status": 404,
    "error": "Not Found",
    "message": "The requested endpoint does not exist",
    "path": "/api/leads/telecaller/calls/12/recording"
  }
  ```

---

## 4. Phase 3 — Frontend Audio Player Mechanics & Audio Failure Root Cause

### Data Lineage to Audio Player:
```text
1. User clicks Play Button on Row #12
2. StitchCallReportTable passes `row` (Call #12) to onPlayRecording(row)
3. TelecallerCallLogsPage sets `selectedCall = row` and renders:
   <CallDetailsModal callId={12} callData={selectedCall} showRecording={true} />
4. CallDetailsView renders RecordingTab:
   <RecordingTab call={call} callId={12} />
5. RecordingTab constructs `audioUrl`:
   const audioUrl = resolvedCallId ? `/api/leads/telecaller/calls/12/recording` : call?.recordingUrl;
   // Evaluates to: "/api/leads/telecaller/calls/12/recording"
6. RecordingTab renders:
   <RecordingPlayer src="/api/leads/telecaller/calls/12/recording" duration={7} />
7. RecordingPlayer assigns <audio ref={audioRef} src="/api/leads/telecaller/calls/12/recording" />
8. Browser makes GET request to "/api/leads/telecaller/calls/12/recording" -> receives HTTP 404 JSON.
9. User clicks Play -> audio.play() fails.
10. RecordingPlayer catches error silently:
    audio.play().catch(() => { /* Fallback simulation if no active audio stream */ });
    setIsPlaying(true);
11. UI animates waveform CSS bars, but 0 audio bytes are received by the browser.
```

### Why No Audio is Heard:
1. **Primary Frontend Bug**: `RecordingTab.jsx` invents a non-existent proxy endpoint `/api/leads/telecaller/calls/${resolvedCallId}/recording` instead of consuming `call.recordingUrl` or handling media loading.
2. **Twilio Authentication Requirement**: The raw `call.recordingUrl` is a private Twilio REST URL requiring Twilio HTTP Basic Auth or signed media access. Direct browser requests to Twilio return `401 Unauthorized` XML.
3. **Player Silent Failure Suppression**: `RecordingPlayer.jsx` swallows `audio.play()` exceptions and starts a visual timer, masking the broken media link.

---

## 5. Phase 4 — Recording Count Consistency & Unconditional Play Buttons

### The Inconsistency:
- **Telecaller Performance KPI**: Displays **`Recordings: 2`** *(Accurately computed from `filteredLogs.filter(c => Boolean(c.recordingUrl))`)*.
- **Call Reports Table**: Renders a purple `<Play>` button for **all 7 rows**.

### Root Cause in Code:
In [`src/features/callReports/components/tables/StitchCallReportTable.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/callReports/components/tables/StitchCallReportTable.jsx#L203-L217):
```javascript
{
  key: "recordingUrl",
  label: "Recording",
  width: "100px",
  headerClassName: "text-center",
  cellClassName: "text-center",
  render: (_, row) => (
    <button 
      onClick={(e) => { e.stopPropagation(); onPlayRecording(row); }}
      className="w-8 h-8 inline-flex rounded-xl bg-purple-50 text-purple-700 border border-purple-200/80 items-center justify-center hover:bg-purple-100 hover:scale-105 transition-all shadow-2xs cursor-pointer active:scale-95"
      title="Play Call Recording"
    >
      <Play size={13} className="ml-0.5 fill-purple-600" />
    </button>
  ),
}
```
The column unconditionally renders a purple `<Play>` button without checking `row.recordingUrl` or `row.hasRecording`.
- For calls where `recordingUrl: null` (Calls #11, #10, #8, #7, #6), it still displays the Play button.

---

## 6. Phase 5 — Other Modules & Tabs on this Page

### A. Telecaller Performance KPI Miscalculation (Avg Duration)
- **Reported in UI**: `Avg Duration: 03m 15s` (195 seconds)
- **Backend Actual**: `avgDuration: 8` (8 seconds) from `/api/leads/calls/users`, and call durations `7s`, `9s`, `8s` in `/api/leads/calls/individual`.
- **Root Cause**: `TelecallerCallLogsPage` (line 141) executes `parseDur(c.callDuration || c.duration)`. The backend field is `c.callDurationSeconds`! Because both `callDuration` and `duration` were `undefined`, `validDurations` was empty `[]`, causing the code to fall back to a hardcoded `195` seconds (`03m 15s`).

### B. Call Details → Timeline Tab
- **Component**: [`TimelineTab.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/telecaller/voice/components/details/tabs/TimelineTab.jsx#L5-L36)
- **Finding**: Contains **100% STATIC HARDCODED MOCK DATA** (`"Call Connected with Student"`, `"Course Brochure Shared"`, `"Campus Visit Scheduled"`). It does not query or map any backend API.

### C. Call Details → Notes Tab
- **Component**: [`NotesTab.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/telecaller/voice/components/details/tabs/NotesTab.jsx#L5)
- **Finding**:
  - `call?.notes` is checked, but the backend field is `call.telecallerNotes`.
  - When `call.notes` is `undefined`, it falls back to the hardcoded string `"Student is interested in B.Tech Computer Science..."`.
  - Statically renders `"Interest Level: High (Hot Lead)"` and `"Follow-up: Scheduled for Tomorrow"` on every single call.

### D. Search, Date Filters, and Dropdown Filters
- **Search**: Filters `filteredLogs` by `name`, `mobileNo`, and `callId` locally on the loaded dataset.
- **Date Filters**: Filters `filteredLogs` by `createdAt` / `date` against `filters.dateFrom` / `filters.dateTo`.
- **Status Filter**: Matches `callOutcome` / `outcome`.
- **Recording Filter**: Filters by `c.recordingUrl`.

---

## 7. Phase 6 — Cross-Page Call Reconciliation (Call #12)

| Field | Backend (`/api/leads/calls/individual`) | Call Reports List (`/call-reports/EMP0005`) | Call Details Summary Modal | User Directory Recent Logs (`/user-directory/EMP0005`) | Lead Details Call Activity (`/leads/1`) | Consistent? |
|---|---|---|---|---|---|---|
| **Lead Name** | `"Manoj"` | `"Manoj"` | `"Manoj"` | `"Manoj"` | `"Manoj"` | **YES** |
| **Mobile Number** | `"6363045415"` | `"6363045415"` | `"6363045415"` | `"6363045415"` | `"6363045415"` | **YES** |
| **Call Time** | `2026-08-16T18:17:01` | `"16 Aug • 06:17 PM"` | `"16 Aug 2026, 06:17 PM"` | `"16 Aug 2026"` | `"16 Aug 2026"` | **YES** |
| **Duration** | `7` (seconds) | `"00:07"` | `"00:07"` | `"00:07"` | `"7s"` | **YES** |
| **Outcome** | `"CONNECTED"` | `"Connected"` (Green badge) | `"CONNECTED"` | `"CONNECTED"` | `"CONNECTED"` | **YES** |
| **Recording Available** | **YES** (`recordingUrl` present) | Purple Play Button (Rendered on all rows) | Tab enabled | — | — | **MISMATCH (Table renders play button even when URL is null)** |
| **Notes / Remarks** | `null` | — | `"Student is interested in B.Tech..."` (Mock fallback) | — | — | **MISMATCH (Mock fallback in NotesTab)** |

---

## 8. Phase 7 — First Points of Failure & Classification

| Issue | Defect Description | Classification | First Point of Failure |
|---|---|---|---|
| **1. Inaudible Audio** | Audio player requests non-existent `/api/leads/telecaller/calls/{id}/recording` (404), while direct Twilio URL returns 401 Unauthorized. Player silently suppresses playback error. | **Wrong Endpoint / Provider Auth Issue** | [`RecordingTab.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/telecaller/voice/components/details/tabs/RecordingTab.jsx#L11-L13) & [`RecordingPlayer.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/telecaller/voice/components/RecordingPlayer.jsx#L49-L53) |
| **2. Unconditional Play Buttons** | Table renders Play button on all 7 rows even though only 2 rows have `recordingUrl`. | **Component Rendering Issue** | [`StitchCallReportTable.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/callReports/components/tables/StitchCallReportTable.jsx#L208-L216) |
| **3. KPI Avg Duration `03m 15s`** | KPI calculation looks for `c.callDuration || c.duration` instead of `c.callDurationSeconds`, falling back to 195s. | **Mapper / Field Name Issue** | [`page.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/app/dashboard/management/call-reports/%5Bid%5D/page.jsx#L141) |
| **4. Timeline Tab Static Mock** | `TimelineTab.jsx` renders hardcoded array of 3 events. | **Static / Mock Data** | [`TimelineTab.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/telecaller/voice/components/details/tabs/TimelineTab.jsx#L5-L36) |
| **5. Notes Tab Static Fallback** | `NotesTab.jsx` reads `call.notes` (ignoring `call.telecallerNotes`), defaulting to hardcoded brochure text and static hot lead indicators. | **Static Fallback / Field Name Issue** | [`NotesTab.jsx`](file:///c:/Users/user/OneDrive/Desktop/Project/GMU/frontend/src/features/telecaller/voice/components/details/tabs/NotesTab.jsx#L5-L33) |

---

## 9. Recommended Minimal Fix Plan (For Review)

### Fix 1: Table Recording Column Conditional Play Button (P0)
- **File**: `src/features/callReports/components/tables/StitchCallReportTable.jsx`
- **Change**: Render the purple `<Play>` button only if `Boolean(row.recordingUrl || row.hasRecording)`. For rows without a recording (`recordingUrl: null`), render a subtle disabled indicator or `—`.

### Fix 2: Avg Duration KPI Field Mapping (P1)
- **File**: `src/app/dashboard/management/call-reports/[id]/page.jsx`
- **Change**: Read `c.callDurationSeconds || c.callDuration || c.duration` in `validDurations` calculation so the actual average duration (`00m 08s`) is displayed instead of the 195s fallback (`03m 15s`).

### Fix 3: RecordingTab & Player Error State (P0)
- **File**: `src/features/telecaller/voice/components/details/tabs/RecordingTab.jsx` & `RecordingPlayer.jsx`
- **Change**:
  1. Use `call.recordingUrl` directly as media source if present.
  2. If the media URL fails to load (e.g. 401 from Twilio or network error), display an explicit error state: `"Audio stream requires telecaller authentication or is unavailable"`, rather than silently pretending to play.

### Fix 4: NotesTab Real Backend Field Normalization (P2)
- **File**: `src/features/telecaller/voice/components/details/tabs/NotesTab.jsx`
- **Change**: Read `call.telecallerNotes || call.notes || call.remarks`. If null, display `"No discussion notes recorded for this call."` instead of hardcoded mock brochure text.
