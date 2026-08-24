# CRM lead-service — RAW runtime capture (telecaller)

- Captured at: 2026-08-17T07:55:26.469Z
- Backend base URL: http://192.168.1.9:8080
- Role captured as: telecaller
- Auth mechanism: cookie (accessToken, set by POST /api/leads/auth/login)

> Every response body below is verbatim from the server at capture time. Nothing here is reconstructed or inferred.

---

## 1. Login

### Endpoint: POST /api/leads/auth/login
**Page:** Login
**Frontend caller:** authService.login()

**HTTP Request:**
```text
POST /api/leads/auth/login

Body:
{
  "username": "telecaller11",
  "password": "[REDACTED]"
}
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "empId": "EMP0005",
    "username": "telecaller11",
    "name": "karun poojari",
    "userGroup": "TELE-CALLER"
  },
  "errors": null
}
```

---

## 2. Discovery calls (used to pull real IDs for the rest of this sweep)

### Endpoint: GET /api/leads/auth/me
**Page:** Any (session check)
**Frontend caller:** authService.getMe()

**HTTP Request:**
```text
GET /api/leads/auth/me
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "slNo": 24,
    "username": "telecaller11",
    "empId": "EMP0005",
    "phoneNo": null,
    "name": "karun poojari",
    "userGroup": "TELE-CALLER",
    "college": null,
    "programme": null,
    "course": null,
    "discipline": null,
    "photo": "http://192.168.1.23:9000/gmu-lead-service-avatars/avatars/EMP0005_1786597800991.jpg",
    "virtualNumberFlag": null,
    "status": "ACTIVE"
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/telecaller/leads?page=0&size=5
**Page:** Telecaller My Leads
**Frontend caller:** telecallerLeadsService.getMyLeads()

**HTTP Request:**
```text
GET /api/leads/telecaller/leads?page=0&size=5
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Assigned leads fetched successfully",
  "data": {
    "leads": [
      {
        "enquiryNo": 3,
        "source": "Walk-in",
        "status": "COLD",
        "callCount": null,
        "name": "Ganesh Nair",
        "mobileNo": "9884472940",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Mandya",
        "taluk": "Krishnarajpet"
      },
      {
        "enquiryNo": 2,
        "source": "Walk-in",
        "status": "COMPLETED",
        "callCount": null,
        "name": "Manoj Iyer",
        "mobileNo": "9707536455",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Vijayapura",
        "taluk": "Babaleshwar"
      },
      {
        "enquiryNo": 5,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Nandini Hegde",
        "mobileNo": "9081967273",
        "course": null,
        "opinion": "Warm",
        "state": "Tamil Nadu",
        "district": "Dharmapuri",
        "taluk": "Palakkodu"
      },
      {
        "enquiryNo": 6,
        "source": "Facebook Ads",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Padma Menon",
        "mobileNo": "9864887663",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Arsikere"
      },
      {
        "enquiryNo": 7,
        "source": "Education Fair",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Suresh Achar",
        "mobileNo": "9875347787",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Arsikere"
      }
    ],
    "currentPage": 0,
    "totalPages": 2,
    "totalItems": 10
  },
  "errors": null
}
```

**Pagination (custom Paged*Response envelope):** currentPage=0 totalPages=2 totalItems=10

---

### Endpoint: GET /api/leads/telecaller/calls?page=0&size=5
**Page:** Telecaller Call History
**Frontend caller:** telecallerCallService.getCallHistory()

**HTTP Request:**
```text
GET /api/leads/telecaller/calls?page=0&size=5
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Call history fetched",
  "data": {
    "content": [
      {
        "callId": 12,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": "CONNECTED",
        "callDurationSeconds": 7,
        "telecallerNotes": null,
        "recordingUrl": "https://api.twilio.com/2010-04-01/Accounts/AC_REDACTED_ACCOUNT_SID/Recordings/RE_REDACTED_RECORDING_SID",
        "createdAt": "2026-08-16T18:17:01"
      },
      {
        "callId": 11,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": "CONNECTED",
        "callDurationSeconds": 9,
        "telecallerNotes": "ready to be admitted",
        "recordingUrl": null,
        "createdAt": "2026-08-16T18:16:51"
      },
      {
        "callId": 10,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": null,
        "callDurationSeconds": null,
        "telecallerNotes": null,
        "recordingUrl": null,
        "createdAt": "2026-08-16T18:16:49"
      },
      {
        "callId": 9,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": "CONNECTED",
        "callDurationSeconds": 8,
        "telecallerNotes": null,
        "recordingUrl": "https://api.twilio.com/2010-04-01/Accounts/AC_REDACTED_ACCOUNT_SID/Recordings/RE_REDACTED_RECORDING_SID",
        "createdAt": "2026-08-16T18:15:45"
      },
      {
        "callId": 8,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": null,
        "callDurationSeconds": null,
        "telecallerNotes": null,
        "recordingUrl": null,
        "createdAt": "2026-08-16T18:15:30"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 5,
      "sort": {
        "sorted": false,
        "empty": true,
        "unsorted": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": false,
    "totalElements": 7,
    "totalPages": 2,
    "first": true,
    "numberOfElements": 5,
    "size": 5,
    "number": 0,
    "sort": {
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "empty": false
  },
  "errors": null
}
```

**Pagination (Spring Page envelope):** totalElements=7 totalPages=2 number=0 numberOfElements=5

---

> Discovered sample IDs for this run: enquiryNo=3 callId=12


## 4. Telecaller — full GET sweep

### Endpoint: GET /api/leads/telecaller/dashboard
**Page:** Telecaller Dashboard
**Frontend caller:** telecallerDashboardService.getDashboard()

**HTTP Request:**
```text
GET /api/leads/telecaller/dashboard
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Dashboard fetched successfully",
  "data": {
    "assignedLeads": 10,
    "hotLeads": 1,
    "warmLeads": 9,
    "coldLeads": 0,
    "todaysFollowups": 1,
    "overdueFollowups": 0,
    "todaysCalls": 0,
    "admissionsConverted": 0,
    "callStatusBreakdown": [
      {
        "label": "CONNECTED",
        "total": 3
      }
    ],
    "dailyCalls": [
      {
        "label": "2026-08-16",
        "total": 7
      }
    ],
    "monthlyCalls": [
      {
        "label": "2026-08",
        "total": 7
      }
    ]
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/telecaller/dashboard/v2
**Page:** Telecaller Dashboard
**Frontend caller:** telecallerDashboardService.getDashboardV2()

**HTTP Request:**
```text
GET /api/leads/telecaller/dashboard/v2
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Dashboard fetched successfully",
  "data": {
    "summary": {
      "assignedLeads": 10,
      "leadsToday": 0,
      "todaysCalls": 0,
      "todaysFollowUps": 1,
      "admitsYTD": 0
    },
    "pipeline": {
      "ENQUIRY": 6,
      "COLD": 1,
      "HOT": 1,
      "COMPLETED": 1,
      "WARM": 1
    },
    "recentActivity": [
      {
        "type": "FOLLOW_UP",
        "enquiryNo": 3,
        "leadName": "Ganesh Nair",
        "description": "",
        "occurredAt": "2026-08-16T18:53:11"
      },
      {
        "type": "FOLLOW_UP",
        "enquiryNo": 1,
        "leadName": "Manoj",
        "description": "",
        "occurredAt": "2026-08-16T18:19:17"
      },
      {
        "type": "CALL",
        "enquiryNo": 1,
        "leadName": "Manoj",
        "description": "Call — CONNECTED",
        "occurredAt": "2026-08-16T18:17:01"
      },
      {
        "type": "CALL",
        "enquiryNo": 1,
        "leadName": "Manoj",
        "description": "Call — CONNECTED",
        "occurredAt": "2026-08-16T18:16:51"
      },
      {
        "type": "CALL",
        "enquiryNo": 1,
        "leadName": "Manoj",
        "description": "Call — null",
        "occurredAt": "2026-08-16T18:16:49"
      },
      {
        "type": "CALL",
        "enquiryNo": 1,
        "leadName": "Manoj",
        "description": "Call — CONNECTED",
        "occurredAt": "2026-08-16T18:15:45"
      },
      {
        "type": "CALL",
        "enquiryNo": 1,
        "leadName": "Manoj",
        "description": "Call — null",
        "occurredAt": "2026-08-16T18:15:30"
      },
      {
        "type": "CALL",
        "enquiryNo": 1,
        "leadName": "Manoj",
        "description": "Call — null",
        "occurredAt": "2026-08-16T18:15:08"
      },
      {
        "type": "CALL",
        "enquiryNo": 1,
        "leadName": "Manoj",
        "description": "Call — null",
        "occurredAt": "2026-08-16T18:13:21"
      }
    ],
    "todaysSchedule": [
      {
        "enquiryNo": 3,
        "leadName": "Ganesh Nair",
        "mobileNo": "9884472940",
        "scheduledTime": "10:00:00",
        "nextAction": ""
      }
    ],
    "performance": {
      "dailyCalls": [
        {
          "label": "2026-08-16",
          "total": 7
        }
      ],
      "monthlyCalls": [
        {
          "label": "2026-08",
          "total": 7
        }
      ]
    },
    "targets": {
      "weeklyCallTarget": 80,
      "weeklyInterestedTarget": 100,
      "weeklyAdmissionTarget": 15,
      "dailyCallTarget": 50,
      "callsToday": 0,
      "callsRemainingToday": 50
    }
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/telecaller/leads?page=0&size=10
**Page:** Telecaller My Leads
**Frontend caller:** telecallerLeadService.getMyLeads()

**HTTP Request:**
```text
GET /api/leads/telecaller/leads?page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Assigned leads fetched successfully",
  "data": {
    "leads": [
      {
        "enquiryNo": 3,
        "source": "Walk-in",
        "status": "COLD",
        "callCount": null,
        "name": "Ganesh Nair",
        "mobileNo": "9884472940",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Mandya",
        "taluk": "Krishnarajpet"
      },
      {
        "enquiryNo": 2,
        "source": "Walk-in",
        "status": "COMPLETED",
        "callCount": null,
        "name": "Manoj Iyer",
        "mobileNo": "9707536455",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Vijayapura",
        "taluk": "Babaleshwar"
      },
      {
        "enquiryNo": 5,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Nandini Hegde",
        "mobileNo": "9081967273",
        "course": null,
        "opinion": "Warm",
        "state": "Tamil Nadu",
        "district": "Dharmapuri",
        "taluk": "Palakkodu"
      },
      {
        "enquiryNo": 6,
        "source": "Facebook Ads",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Padma Menon",
        "mobileNo": "9864887663",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Arsikere"
      },
      {
        "enquiryNo": 7,
        "source": "Education Fair",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Suresh Achar",
        "mobileNo": "9875347787",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Arsikere"
      },
      {
        "enquiryNo": 8,
        "source": "Education Fair",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Kavya Nair",
        "mobileNo": "9178472671",
        "course": null,
        "opinion": "Warm",
        "state": "Punjab",
        "district": "Amritsar",
        "taluk": "Lopoke"
      },
      {
        "enquiryNo": 9,
        "source": "YouTube Ads",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Divya Shetty",
        "mobileNo": "9270107981",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Vijayapura",
        "taluk": "Chadachan"
      },
      {
        "enquiryNo": 10,
        "source": "Facebook Ads",
        "status": "ENQUIRY",
        "callCount": null,
        "name": "Latha Reddy",
        "mobileNo": "9520599728",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Dakshina Kannada",
        "taluk": "Puttur"
      },
      {
        "enquiryNo": 1,
        "source": "",
        "status": "HOT",
        "callCount": 1,
        "name": "Manoj",
        "mobileNo": "6363045415",
        "course": "",
        "opinion": "Interested",
        "state": "Karnataka",
        "district": "Davangere",
        "taluk": "Davanagere"
      },
      {
        "enquiryNo": 4,
        "source": "Education Fair",
        "status": "WARM",
        "callCount": null,
        "name": "Arjun Desai",
        "mobileNo": "9168976846",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Arkalgud"
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalItems": 10
  },
  "errors": null
}
```

**Pagination (custom Paged*Response envelope):** currentPage=0 totalPages=1 totalItems=10

---

### Endpoint: GET /api/leads/telecaller/leads/filter-options
**Page:** Telecaller My Leads
**Frontend caller:** telecallerLeadService.getFilterOptions()

**HTTP Request:**
```text
GET /api/leads/telecaller/leads/filter-options
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Filter options fetched",
  "data": {
    "courses": [
      ""
    ],
    "sources": [
      "Walk-in",
      "Instagram",
      "Facebook Ads",
      "Education Fair",
      "YouTube Ads",
      ""
    ],
    "districts": [
      "Mandya",
      "Vijayapura",
      "Dharmapuri",
      "Hassan",
      "Amritsar",
      "Dakshina Kannada",
      "Davangere"
    ],
    "states": [
      "Karnataka",
      "Tamil Nadu",
      "Punjab"
    ],
    "statuses": [
      "COLD",
      "COMPLETED",
      "ENQUIRY",
      "HOT",
      "WARM"
    ]
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/telecaller/leads/3
**Page:** Telecaller Lead Details
**Frontend caller:** telecallerLeadService.getLeadDetails()

**HTTP Request:**
```text
GET /api/leads/telecaller/leads/3
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Lead detail fetched successfully",
  "data": {
    "enquiryNo": 3,
    "name": "Ganesh Nair",
    "mobileNo": "9884472940",
    "email": "ganesh.nair3@outlook.com",
    "source": "Walk-in",
    "enquiryDate": "2026-08-16",
    "state": "Karnataka",
    "district": "Mandya",
    "taluk": "Krishnarajpet",
    "collegeStudied": "MS Ramaiah Institute",
    "programme": null,
    "course": null,
    "discipline": null,
    "interestedUniversity": null,
    "interestedLocation": null,
    "status": "COLD",
    "opinion": "Warm",
    "remarks": null,
    "callersEmpId": "EMP0005",
    "callerName": "karun poojari",
    "currentlyAssigned": true,
    "callCount": null,
    "callDuration": null,
    "callDate": null,
    "followupDate": null,
    "followupCollege": null,
    "followupProgram": null,
    "followupCourse": null,
    "followupDiscipline": null,
    "lastUpdated": "2026-08-16T19:10:49",
    "transferHistory": [
      {
        "fromEmpId": null,
        "fromName": null,
        "toEmpId": "EMP0005",
        "toName": "karun poojari",
        "reason": "Auto-assigned on import",
        "transferredAt": "2026-08-16T17:55:46",
        "transferredBy": "SYSTEM"
      }
    ],
    "interactionHistory": [
      {
        "telecallerEmpId": "EMP0005",
        "interactionType": "FOLLOW_UP",
        "outcome": null,
        "opinion": null,
        "notes": null,
        "createdAt": "2026-08-16T18:53:11"
      }
    ]
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/telecaller/leads/3/timeline
**Page:** Telecaller Lead Details
**Frontend caller:** telecallerLeadService.getLeadTimeline()

**HTTP Request:**
```text
GET /api/leads/telecaller/leads/3/timeline
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Timeline fetched",
  "data": [
    {
      "type": "STATUS_CHANGE",
      "title": "Status changed: ENQUIRY → COLD",
      "description": null,
      "occurredAt": "2026-08-16T19:10:45"
    },
    {
      "type": "FOLLOW_UP",
      "title": "Follow-up scheduled",
      "description": "",
      "occurredAt": "2026-08-16T18:53:11"
    },
    {
      "type": "ASSIGNED",
      "title": "Assigned to karun poojari",
      "description": "karun poojari",
      "occurredAt": "2026-08-16T17:55:46"
    },
    {
      "type": "CREATED",
      "title": "Lead Created",
      "description": "Ganesh Nair submitted an inquiry",
      "occurredAt": "2026-08-16T00:00:00"
    }
  ],
  "errors": null
}
```

**Record count (plain array):** 4

---

### Endpoint: GET /api/leads/telecaller/leads/3/status-history
**Page:** Telecaller Lead Details
**Frontend caller:** telecallerLeadService.getStatusHistory()

**HTTP Request:**
```text
GET /api/leads/telecaller/leads/3/status-history
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Lead status history fetched successfully",
  "data": [
    {
      "id": 5,
      "oldStatus": "ENQUIRY",
      "newStatus": "COLD",
      "oldOpinion": "Warm",
      "newOpinion": "Warm",
      "changedByName": "karun poojari",
      "changedAt": "2026-08-16T19:10:45"
    }
  ],
  "errors": null
}
```

**Record count (plain array):** 1

---

### Endpoint: GET /api/leads/telecaller/calls?page=0&size=10
**Page:** Telecaller Call history / Recent Calls
**Frontend caller:** telecallerCallService.getCallHistory()

**HTTP Request:**
```text
GET /api/leads/telecaller/calls?page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Call history fetched",
  "data": {
    "content": [
      {
        "callId": 12,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": "CONNECTED",
        "callDurationSeconds": 7,
        "telecallerNotes": null,
        "recordingUrl": "https://api.twilio.com/2010-04-01/Accounts/AC_REDACTED_ACCOUNT_SID/Recordings/RE_REDACTED_RECORDING_SID",
        "createdAt": "2026-08-16T18:17:01"
      },
      {
        "callId": 11,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": "CONNECTED",
        "callDurationSeconds": 9,
        "telecallerNotes": "ready to be admitted",
        "recordingUrl": null,
        "createdAt": "2026-08-16T18:16:51"
      },
      {
        "callId": 10,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": null,
        "callDurationSeconds": null,
        "telecallerNotes": null,
        "recordingUrl": null,
        "createdAt": "2026-08-16T18:16:49"
      },
      {
        "callId": 9,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": "CONNECTED",
        "callDurationSeconds": 8,
        "telecallerNotes": null,
        "recordingUrl": "https://api.twilio.com/2010-04-01/Accounts/AC_REDACTED_ACCOUNT_SID/Recordings/RE_REDACTED_RECORDING_SID",
        "createdAt": "2026-08-16T18:15:45"
      },
      {
        "callId": 8,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": null,
        "callDurationSeconds": null,
        "telecallerNotes": null,
        "recordingUrl": null,
        "createdAt": "2026-08-16T18:15:30"
      },
      {
        "callId": 7,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": null,
        "callDurationSeconds": null,
        "telecallerNotes": null,
        "recordingUrl": null,
        "createdAt": "2026-08-16T18:15:08"
      },
      {
        "callId": 6,
        "enquiryNo": 1,
        "leadName": "Manoj",
        "mobileNo": "6363045415",
        "callDirection": "OUTBOUND",
        "outcome": null,
        "callDurationSeconds": null,
        "telecallerNotes": null,
        "recordingUrl": null,
        "createdAt": "2026-08-16T18:13:21"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false,
        "empty": true,
        "unsorted": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 7,
    "totalPages": 1,
    "first": true,
    "numberOfElements": 7,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "empty": false
  },
  "errors": null
}
```

**Pagination (Spring Page envelope):** totalElements=7 totalPages=1 number=0 numberOfElements=7

---

### Endpoint: GET /api/leads/telecaller/calls/12
**Page:** Telecaller Call history
**Frontend caller:** telecallerCallService.getCallDetails()

**HTTP Request:**
```text
GET /api/leads/telecaller/calls/12
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Call detail fetched",
  "data": {
    "callId": 12,
    "enquiryNo": 1,
    "leadName": "Manoj",
    "mobileNo": "6363045415",
    "callDirection": "OUTBOUND",
    "outcome": "CONNECTED",
    "callDurationSeconds": 7,
    "telecallerNotes": null,
    "recordingUrl": "https://api.twilio.com/2010-04-01/Accounts/AC_REDACTED_ACCOUNT_SID/Recordings/RE_REDACTED_RECORDING_SID",
    "createdAt": "2026-08-16T18:17:01"
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/telecaller/followups?tab=today&page=0&size=10
**Page:** Telecaller Follow-ups
**Frontend caller:** telecallerFollowupService.getFollowups()

**HTTP Request:**
```text
GET /api/leads/telecaller/followups?tab=today&page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Follow-ups fetched",
  "data": {
    "content": [
      {
        "id": 14,
        "enquiryNo": 3,
        "leadName": "Ganesh Nair",
        "mobileNo": "9884472940",
        "scheduledDate": "2026-08-17",
        "scheduledTime": "10:00:00",
        "priority": null,
        "status": "PENDING",
        "nextAction": "",
        "createdAt": "2026-08-16T18:53:11"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false,
        "empty": true,
        "unsorted": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "numberOfElements": 1,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "empty": false
  },
  "errors": null
}
```

**Pagination (Spring Page envelope):** totalElements=1 totalPages=1 number=0 numberOfElements=1

---

### Endpoint: GET /api/leads/telecaller/followups?tab=upcoming&page=0&size=10
**Page:** Telecaller Follow-ups
**Frontend caller:** telecallerFollowupService.getFollowups()

**HTTP Request:**
```text
GET /api/leads/telecaller/followups?tab=upcoming&page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Follow-ups fetched",
  "data": {
    "content": [],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false,
        "empty": true,
        "unsorted": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 0,
    "totalPages": 0,
    "first": true,
    "numberOfElements": 0,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "empty": true
  },
  "errors": null
}
```

**Pagination (Spring Page envelope):** totalElements=0 totalPages=0 number=0 numberOfElements=0

---

### Endpoint: GET /api/leads/telecaller/followups?tab=overdue&page=0&size=10
**Page:** Telecaller Follow-ups
**Frontend caller:** telecallerFollowupService.getFollowups()

**HTTP Request:**
```text
GET /api/leads/telecaller/followups?tab=overdue&page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Follow-ups fetched",
  "data": {
    "content": [],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false,
        "empty": true,
        "unsorted": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 0,
    "totalPages": 0,
    "first": true,
    "numberOfElements": 0,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "empty": true
  },
  "errors": null
}
```

**Pagination (Spring Page envelope):** totalElements=0 totalPages=0 number=0 numberOfElements=0

---

### Endpoint: GET /api/leads/telecaller/followups?tab=missed&page=0&size=10
**Page:** Telecaller Follow-ups
**Frontend caller:** telecallerFollowupService.getFollowups()

**HTTP Request:**
```text
GET /api/leads/telecaller/followups?tab=missed&page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Follow-ups fetched",
  "data": {
    "content": [],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false,
        "empty": true,
        "unsorted": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 0,
    "totalPages": 0,
    "first": true,
    "numberOfElements": 0,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "empty": true
  },
  "errors": null
}
```

**Pagination (Spring Page envelope):** totalElements=0 totalPages=0 number=0 numberOfElements=0

---

### Endpoint: GET /api/leads/auth/me
**Page:** Telecaller Profile
**Frontend caller:** authService.getMe()

**HTTP Request:**
```text
GET /api/leads/auth/me
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "slNo": 24,
    "username": "telecaller11",
    "empId": "EMP0005",
    "phoneNo": null,
    "name": "karun poojari",
    "userGroup": "TELE-CALLER",
    "college": null,
    "programme": null,
    "course": null,
    "discipline": null,
    "photo": "http://192.168.1.23:9000/gmu-lead-service-avatars/avatars/EMP0005_1786597800991.jpg",
    "virtualNumberFlag": null,
    "status": "ACTIVE"
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/telecaller/notifications?page=0&size=10
**Page:** Telecaller Notifications
**Frontend caller:** notificationService.getNotifications()

**HTTP Request:**
```text
GET /api/leads/telecaller/notifications?page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Notifications fetched",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "New lead assigned",
        "message": "Manoj Nair has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 1,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 2,
        "title": "New lead assigned",
        "message": "Manoj Iyer has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 2,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 3,
        "title": "New lead assigned",
        "message": "Ganesh Nair has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 3,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 4,
        "title": "New lead assigned",
        "message": "Arjun Desai has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 4,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 5,
        "title": "New lead assigned",
        "message": "Nandini Hegde has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 5,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 6,
        "title": "New lead assigned",
        "message": "Padma Menon has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 6,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 7,
        "title": "New lead assigned",
        "message": "Suresh Achar has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 7,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 8,
        "title": "New lead assigned",
        "message": "Kavya Nair has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 8,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 9,
        "title": "New lead assigned",
        "message": "Divya Shetty has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 9,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      },
      {
        "id": 10,
        "title": "New lead assigned",
        "message": "Latha Reddy has been assigned to you.",
        "type": "LEAD_ASSIGNED",
        "referenceId": 10,
        "createdAt": "2026-08-16T17:55:46",
        "read": true
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": false,
        "empty": true,
        "unsorted": true
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 10,
    "totalPages": 1,
    "first": true,
    "numberOfElements": 10,
    "size": 10,
    "number": 0,
    "sort": {
      "sorted": false,
      "empty": true,
      "unsorted": true
    },
    "empty": false
  },
  "errors": null
}
```

**Pagination (Spring Page envelope):** totalElements=10 totalPages=1 number=0 numberOfElements=10

---

### Endpoint: GET /api/leads/telecaller/notifications/unread-count
**Page:** Telecaller Notifications
**Frontend caller:** notificationService.getUnreadCount()

**HTTP Request:**
```text
GET /api/leads/telecaller/notifications/unread-count
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Unread count fetched",
  "data": 0,
  "errors": null
}
```

---

### Endpoint: GET /api/leads/telecaller/voice/token
**Page:** Telecaller Calls (browser dialer init)
**Frontend caller:** voiceService.getToken()

**HTTP Request:**
```text
GET /api/leads/telecaller/voice/token
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Token generated",
  "data": {
    "token": "[REDACTED_TWILIO_TOKEN]"
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/geo/states
**Page:** Lead create/edit forms
**Frontend caller:** geoService.getStates()

**HTTP Request:**
```text
GET /api/leads/geo/states
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "States fetched successfully",
  "data": [
    "Andaman And Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu And Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "The Dadra And Nagar Haveli And Daman And Diu",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ],
  "errors": null
}
```

**Record count (plain array):** 36

---

## 5. Logout

### Endpoint: POST /api/leads/auth/logout
**Page:** Any
**Frontend caller:** authService.logout()

**HTTP Request:**
```text
POST /api/leads/auth/logout
```

**HTTP Status:** 200
**Content-Type:** unknown

**Actual Response Body:**
```json

```

---
