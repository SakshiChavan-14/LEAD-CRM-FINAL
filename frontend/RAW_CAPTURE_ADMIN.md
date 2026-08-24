# CRM lead-service — RAW runtime capture (admin)

- Captured at: 2026-08-17T07:54:05.629Z
- Backend base URL: http://192.168.1.9:8080
- Role captured as: admin
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
  "username": "admin",
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
    "empId": "EMP001",
    "username": "admin",
    "name": "Leesha",
    "userGroup": "ADMIN"
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
    "slNo": 1,
    "username": "admin",
    "empId": "EMP001",
    "phoneNo": null,
    "name": "Leesha",
    "userGroup": "ADMIN",
    "college": null,
    "programme": null,
    "course": null,
    "discipline": null,
    "photo": "http://192.168.1.6:9000/gmu-lead-service-avatars/avatars/EMP001_1785753509175.png",
    "virtualNumberFlag": null,
    "status": "ACTIVE"
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/calls/users?page=0&size=5
**Page:** Admin Reports / Call Reports
**Frontend caller:** callReportsService.getTelecallerPerformance()

**HTTP Request:**
```text
GET /api/leads/calls/users?page=0&size=5
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Callers fetched successfully",
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
      },
      {
        "userId": "EMP0011",
        "name": "sakshi chavan",
        "totalCalls": 3,
        "connectedCalls": 3,
        "avgDuration": 100.6667,
        "recordingsCount": 0,
        "lastActive": "2026-08-16T18:54:55"
      },
      {
        "userId": "EMP0010",
        "name": "Preetham",
        "totalCalls": 1,
        "connectedCalls": 1,
        "avgDuration": 27,
        "recordingsCount": 0,
        "lastActive": "2026-08-16T18:58:05"
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
    "last": true,
    "totalElements": 3,
    "totalPages": 1,
    "first": true,
    "numberOfElements": 3,
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

**Pagination (Spring Page envelope):** totalElements=3 totalPages=1 number=0 numberOfElements=3

---

### Endpoint: GET /api/leads/overview?type=all&page=0&size=5
**Page:** Admin Leads listing
**Frontend caller:** leadService.getOverview()

**HTTP Request:**
```text
GET /api/leads/overview?type=all&page=0&size=5
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Lead overview fetched successfully",
  "data": {
    "leads": [
      {
        "enquiryNo": 1,
        "source": "",
        "status": "HOT",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "enquiryNo": 2,
        "source": "Walk-in",
        "status": "COMPLETED",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "enquiryNo": 3,
        "source": "Walk-in",
        "status": "COLD",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "enquiryNo": 4,
        "source": "Education Fair",
        "status": "WARM",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
        "callCount": null,
        "name": "Arjun Desai",
        "mobileNo": "9168976846",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Arkalgud"
      },
      {
        "enquiryNo": 5,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
        "callCount": null,
        "name": "Nandini Hegde",
        "mobileNo": "9081967273",
        "course": null,
        "opinion": "Warm",
        "state": "Tamil Nadu",
        "district": "Dharmapuri",
        "taluk": "Palakkodu"
      }
    ],
    "currentPage": 0,
    "totalPages": 10,
    "totalItems": 50
  },
  "errors": null
}
```

**Pagination (custom Paged*Response envelope):** currentPage=0 totalPages=10 totalItems=50

---

### Endpoint: GET /api/leads/manager/users?page=0&size=5
**Page:** Admin User Directory
**Frontend caller:** userService.listUsers()

**HTTP Request:**
```text
GET /api/leads/manager/users?page=0&size=5
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "slNo": 24,
        "username": "telecaller11",
        "empId": "EMP0005",
        "phoneNo": "6363907325",
        "name": "karun poojari",
        "college": "",
        "programme": "",
        "course": "",
        "discipline": "",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": "http://192.168.1.23:9000/gmu-lead-service-avatars/avatars/EMP0005_1786597800991.jpg",
        "defaultPassword": null
      },
      {
        "slNo": 37,
        "username": "telecaller5",
        "empId": "EMP0013",
        "phoneNo": "7338597156",
        "name": "Pradeep",
        "college": "Saptagiri",
        "programme": "UG",
        "course": "BE",
        "discipline": "ai",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": null,
        "defaultPassword": null
      },
      {
        "slNo": 34,
        "username": "telecaller2",
        "empId": "EMP0010",
        "phoneNo": "6363045415",
        "name": "Preetham",
        "college": "GMU",
        "programme": "PG",
        "course": "MCA",
        "discipline": "AI",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": null,
        "defaultPassword": null
      },
      {
        "slNo": 35,
        "username": "telecaller3",
        "empId": "EMP0011",
        "phoneNo": "9353270442",
        "name": "sakshi chavan",
        "college": "GMU",
        "programme": "PG",
        "course": "MCA",
        "discipline": "CY",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": null,
        "defaultPassword": null
      },
      {
        "slNo": 36,
        "username": "telecaller4",
        "empId": "EMP0012",
        "phoneNo": "6362379895",
        "name": "Shivu",
        "college": "Saptagiri",
        "programme": "UG",
        "course": "BE",
        "discipline": "CS",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": null,
        "defaultPassword": null
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalItems": 5,
    "pageSize": 5
  },
  "errors": null
}
```

**Pagination (custom Paged*Response envelope):** currentPage=0 totalPages=1 totalItems=5

---

> Discovered sample IDs for this run: empId=EMP0005 enquiryNo=1 slNo=24


## 3. Admin — full GET sweep

### Endpoint: GET /api/leads/dashboard/stats
**Page:** Admin Dashboard/Overview
**Frontend caller:** dashboardService.getStats()

**HTTP Request:**
```text
GET /api/leads/dashboard/stats
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "overall": {
      "groupName": "Overall",
      "total": 50,
      "hot": 1,
      "cold": 0,
      "alloted": 50,
      "notAlloted": 0,
      "recent": 50
    },
    "sourceStats": [
      {
        "groupName": "Overall",
        "total": 50,
        "hot": 1,
        "cold": 0,
        "alloted": 50,
        "notAlloted": 0,
        "recent": 50
      },
      {
        "groupName": "Instagram",
        "total": 10,
        "hot": 0,
        "cold": 0,
        "alloted": 10,
        "notAlloted": 0,
        "recent": 10
      },
      {
        "groupName": "YouTube Ads",
        "total": 10,
        "hot": 0,
        "cold": 0,
        "alloted": 10,
        "notAlloted": 0,
        "recent": 10
      },
      {
        "groupName": "Walk-in",
        "total": 6,
        "hot": 0,
        "cold": 0,
        "alloted": 6,
        "notAlloted": 0,
        "recent": 6
      },
      {
        "groupName": "Facebook Ads",
        "total": 6,
        "hot": 0,
        "cold": 0,
        "alloted": 6,
        "notAlloted": 0,
        "recent": 6
      },
      {
        "groupName": "Website",
        "total": 5,
        "hot": 1,
        "cold": 0,
        "alloted": 5,
        "notAlloted": 0,
        "recent": 5
      },
      {
        "groupName": "Referral",
        "total": 5,
        "hot": 0,
        "cold": 0,
        "alloted": 5,
        "notAlloted": 0,
        "recent": 5
      },
      {
        "groupName": "Google Ads",
        "total": 3,
        "hot": 0,
        "cold": 0,
        "alloted": 3,
        "notAlloted": 0,
        "recent": 3
      },
      {
        "groupName": "Education Fair",
        "total": 3,
        "hot": 0,
        "cold": 0,
        "alloted": 3,
        "notAlloted": 0,
        "recent": 3
      }
    ],
    "opinionStats": [
      {
        "groupName": "Overall",
        "total": 50,
        "hot": 1,
        "cold": 0,
        "alloted": 50,
        "notAlloted": 0,
        "recent": 50
      },
      {
        "groupName": "Warm",
        "total": 45,
        "hot": 0,
        "cold": 0,
        "alloted": 45,
        "notAlloted": 0,
        "recent": 45
      },
      {
        "groupName": "Interested",
        "total": 3,
        "hot": 0,
        "cold": 0,
        "alloted": 3,
        "notAlloted": 0,
        "recent": 3
      },
      {
        "groupName": "Cold",
        "total": 2,
        "hot": 0,
        "cold": 0,
        "alloted": 2,
        "notAlloted": 0,
        "recent": 2
      }
    ],
    "stateStats": [
      {
        "groupName": "Karnataka",
        "total": 42,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "Telangana",
        "total": 2,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "Tamil Nadu",
        "total": 1,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "Uttar Pradesh",
        "total": 1,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "Haryana",
        "total": 1,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "Andhra Pradesh",
        "total": 1,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "Uttarakhand",
        "total": 1,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "Punjab",
        "total": 1,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      }
    ],
    "statusStats": [
      {
        "groupName": "ENQUIRY",
        "total": 43,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "WARM",
        "total": 3,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "HOT",
        "total": 2,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "COLD",
        "total": 1,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      },
      {
        "groupName": "COMPLETED",
        "total": 1,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      }
    ],
    "monthlyStats": [
      {
        "groupName": "2026-08",
        "total": 50,
        "hot": 0,
        "cold": 0,
        "alloted": 0,
        "notAlloted": 0,
        "recent": 0
      }
    ],
    "pipelineStats": {
      "newCount": 45,
      "leadInCount": 5,
      "convertedCount": 0,
      "lostCount": 0
    }
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/dashboard/activity?limit=20
**Page:** Admin Dashboard/Overview
**Frontend caller:** dashboardService.getRecentActivity()

**HTTP Request:**
```text
GET /api/leads/dashboard/activity?limit=20
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Recent activity fetched successfully",
  "data": [
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:58:05",
      "enquiryNo": 11,
      "leadName": "Santhosh singh",
      "actorEmpId": "EMP0010",
      "actorName": null,
      "title": "Call logged — CONNECTED"
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:54:55",
      "enquiryNo": 23,
      "leadName": "Sandeep Shetty",
      "actorEmpId": "EMP0011",
      "actorName": null,
      "title": "Call logged — CONNECTED"
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:53:11",
      "enquiryNo": 3,
      "leadName": "Ganesh Nair",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:19:17",
      "enquiryNo": 1,
      "leadName": "Manoj",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:17:01",
      "enquiryNo": 1,
      "leadName": "Manoj",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": "Call logged — CONNECTED"
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:16:51",
      "enquiryNo": 1,
      "leadName": "Manoj",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": "Call logged — CONNECTED"
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:16:49",
      "enquiryNo": 1,
      "leadName": "Manoj",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:15:45",
      "enquiryNo": 1,
      "leadName": "Manoj",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": "Call logged — CONNECTED"
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:15:30",
      "enquiryNo": 1,
      "leadName": "Manoj",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:15:08",
      "enquiryNo": 1,
      "leadName": "Manoj",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:13:21",
      "enquiryNo": 1,
      "leadName": "Manoj",
      "actorEmpId": "EMP0005",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:11:14",
      "enquiryNo": 22,
      "leadName": "Swathi Iyer",
      "actorEmpId": "EMP0011",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:11:14",
      "enquiryNo": 22,
      "leadName": "Swathi Iyer",
      "actorEmpId": "EMP0011",
      "actorName": null,
      "title": "Call logged — CONNECTED"
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:07:48",
      "enquiryNo": 21,
      "leadName": "Kiran Achar",
      "actorEmpId": "EMP0011",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:07:48",
      "enquiryNo": 21,
      "leadName": "Kiran Achar",
      "actorEmpId": "EMP0011",
      "actorName": null,
      "title": "Call logged — CONNECTED"
    },
    {
      "eventType": "CALL",
      "timestamp": "2026-08-16T18:03:03",
      "enquiryNo": 11,
      "leadName": "Santhosh singh",
      "actorEmpId": "EMP0010",
      "actorName": null,
      "title": null
    },
    {
      "eventType": "ASSIGNED",
      "timestamp": "2026-08-16T17:55:46",
      "enquiryNo": 45,
      "leadName": "Girish Naik",
      "actorEmpId": "EMP0013",
      "actorName": "Pradeep",
      "title": "Assigned to Pradeep"
    },
    {
      "eventType": "ASSIGNED",
      "timestamp": "2026-08-16T17:55:46",
      "enquiryNo": 13,
      "leadName": "Manjunath Joshi",
      "actorEmpId": "EMP0010",
      "actorName": "Preetham",
      "title": "Assigned to Preetham"
    },
    {
      "eventType": "ASSIGNED",
      "timestamp": "2026-08-16T17:55:46",
      "enquiryNo": 29,
      "leadName": "Pooja Sharma",
      "actorEmpId": "EMP0011",
      "actorName": "sakshi chavan",
      "title": "Assigned to sakshi chavan"
    },
    {
      "eventType": "ASSIGNED",
      "timestamp": "2026-08-16T17:55:46",
      "enquiryNo": 34,
      "leadName": "Rekha Joshi",
      "actorEmpId": "EMP0012",
      "actorName": "Shivu",
      "title": "Assigned to Shivu"
    }
  ],
  "errors": null
}
```

**Record count (plain array):** 20

---

### Endpoint: GET /api/leads/overview/followups/upcoming
**Page:** Admin Dashboard/Overview
**Frontend caller:** leadService.getUpcomingFollowups()

**HTTP Request:**
```text
GET /api/leads/overview/followups/upcoming
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Upcoming follow-ups fetched successfully",
  "data": [
    {
      "enquiryNo": 21,
      "source": "Referral",
      "status": "WARM",
      "callerName": "sakshi chavan",
      "callersEmpId": "EMP0011",
      "callCount": 1,
      "name": "Kiran Achar",
      "mobileNo": "9659397615",
      "course": null,
      "opinion": "Interested",
      "state": "Karnataka",
      "district": "Dharwad",
      "taluk": "Hubballi Urban"
    },
    {
      "enquiryNo": 22,
      "source": "Website",
      "status": "ENQUIRY",
      "callerName": "sakshi chavan",
      "callersEmpId": "EMP0011",
      "callCount": 1,
      "name": "Swathi Iyer",
      "mobileNo": "9060454146",
      "course": null,
      "opinion": "Interested",
      "state": "Uttarakhand",
      "district": "Dehradun",
      "taluk": "Rishikesh"
    }
  ],
  "errors": null
}
```

**Record count (plain array):** 2

---

### Endpoint: GET /api/leads/overview/followups/overdue
**Page:** Admin Dashboard/Overview
**Frontend caller:** leadService.getOverdueFollowups()

**HTTP Request:**
```text
GET /api/leads/overview/followups/overdue
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Overdue follow-ups fetched successfully",
  "data": [],
  "errors": null
}
```

**Record count (plain array):** 0

---

### Endpoint: GET /api/leads/overview/filter-options
**Page:** Admin Leads
**Frontend caller:** leadService.getFilterOptions()

**HTTP Request:**
```text
GET /api/leads/overview/filter-options
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Filter options fetched successfully",
  "data": {
    "sources": [
      "Education Fair",
      "Facebook Ads",
      "Google Ads",
      "Instagram",
      "Referral",
      "Walk-in",
      "Website",
      "YouTube Ads"
    ],
    "statuses": [
      "COLD",
      "COMPLETED",
      "ENQUIRY",
      "HOT",
      "WARM"
    ],
    "callerNames": [
      "karun poojari",
      "Pradeep",
      "Preetham",
      "sakshi chavan",
      "Shivu"
    ],
    "courses": [],
    "opinions": [
      "Cold",
      "Interested",
      "Warm"
    ],
    "states": [
      "Andhra Pradesh",
      "Haryana",
      "Karnataka",
      "Punjab",
      "Tamil Nadu",
      "Telangana",
      "Uttar Pradesh",
      "Uttarakhand"
    ],
    "districts": [
      "Aligarh",
      "Amritsar",
      "Annamayya",
      "Belagavi",
      "Bengaluru Rural",
      "Bengaluru Urban",
      "Bhiwani",
      "Dakshina Kannada",
      "Davangere",
      "Dehradun",
      "Dharmapuri",
      "Dharwad",
      "Hassan",
      "Kolar",
      "Koppal",
      "Mandya",
      "Mysuru",
      "Ramanagara",
      "Siddipet",
      "Uttara Kannada",
      "Vijayanagar",
      "Vijayapura",
      "Vikarabad"
    ],
    "taluks": [
      "Arkalgud",
      "Arsikere",
      "Athni",
      "Babaleshwar",
      "Bengaluru North",
      "Bengaluru South",
      "Bhiwani",
      "Chadachan",
      "Channarayapatna",
      "Chinnakodur",
      "Davanagere",
      "Devanahalli",
      "Dodda Ballapur",
      "Harihar",
      "Hassan",
      "Hosapete",
      "Hubballi Urban",
      "Hukeri",
      "Iglas",
      "Jagalur",
      "Kambhamvaripalle",
      "Koppal",
      "Krishnarajpet",
      "Lopoke",
      "Magadi",
      "Marpalle",
      "Moodubidire",
      "Mudalgi",
      "Mulbagal",
      "Mundgod",
      "Nanjangud",
      "Nidagundi",
      "Palakkodu",
      "Puttur",
      "Rishikesh"
    ]
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/calls/users?page=0&size=10
**Page:** Admin Reports / Call Reports
**Frontend caller:** callReportsService.getTelecallerPerformance()

**HTTP Request:**
```text
GET /api/leads/calls/users?page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Callers fetched successfully",
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
      },
      {
        "userId": "EMP0011",
        "name": "sakshi chavan",
        "totalCalls": 3,
        "connectedCalls": 3,
        "avgDuration": 100.6667,
        "recordingsCount": 0,
        "lastActive": "2026-08-16T18:54:55"
      },
      {
        "userId": "EMP0010",
        "name": "Preetham",
        "totalCalls": 1,
        "connectedCalls": 1,
        "avgDuration": 27,
        "recordingsCount": 0,
        "lastActive": "2026-08-16T18:58:05"
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
    "totalElements": 3,
    "totalPages": 1,
    "first": true,
    "numberOfElements": 3,
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

**Pagination (Spring Page envelope):** totalElements=3 totalPages=1 number=0 numberOfElements=3

---

### Endpoint: GET /api/leads/calls/source-leads?page=0&size=10
**Page:** Admin Reports
**Frontend caller:** callReportsService.getSourceLeads()

**HTTP Request:**
```text
GET /api/leads/calls/source-leads?page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Source leads fetched successfully",
  "data": {
    "content": [
      {
        "name": "Manoj",
        "state": "Karnataka",
        "source": "",
        "status": "HOT",
        "mobileNo": "6363045415",
        "course": "",
        "callCount": 1,
        "district": "Davangere",
        "enquiryNo": 1,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Davanagere",
        "opinion": "Interested"
      },
      {
        "name": "Manoj Iyer",
        "state": "Karnataka",
        "source": "Walk-in",
        "status": "COMPLETED",
        "mobileNo": "9707536455",
        "course": null,
        "callCount": null,
        "district": "Vijayapura",
        "enquiryNo": 2,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Babaleshwar",
        "opinion": "Warm"
      },
      {
        "name": "Ganesh Nair",
        "state": "Karnataka",
        "source": "Walk-in",
        "status": "COLD",
        "mobileNo": "9884472940",
        "course": null,
        "callCount": null,
        "district": "Mandya",
        "enquiryNo": 3,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Krishnarajpet",
        "opinion": "Warm"
      },
      {
        "name": "Arjun Desai",
        "state": "Karnataka",
        "source": "Education Fair",
        "status": "WARM",
        "mobileNo": "9168976846",
        "course": null,
        "callCount": null,
        "district": "Hassan",
        "enquiryNo": 4,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Arkalgud",
        "opinion": "Warm"
      },
      {
        "name": "Nandini Hegde",
        "state": "Tamil Nadu",
        "source": "Instagram",
        "status": "ENQUIRY",
        "mobileNo": "9081967273",
        "course": null,
        "callCount": null,
        "district": "Dharmapuri",
        "enquiryNo": 5,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Palakkodu",
        "opinion": "Warm"
      },
      {
        "name": "Padma Menon",
        "state": "Karnataka",
        "source": "Facebook Ads",
        "status": "ENQUIRY",
        "mobileNo": "9864887663",
        "course": null,
        "callCount": null,
        "district": "Hassan",
        "enquiryNo": 6,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Arsikere",
        "opinion": "Warm"
      },
      {
        "name": "Suresh Achar",
        "state": "Karnataka",
        "source": "Education Fair",
        "status": "ENQUIRY",
        "mobileNo": "9875347787",
        "course": null,
        "callCount": null,
        "district": "Hassan",
        "enquiryNo": 7,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Arsikere",
        "opinion": "Warm"
      },
      {
        "name": "Kavya Nair",
        "state": "Punjab",
        "source": "Education Fair",
        "status": "ENQUIRY",
        "mobileNo": "9178472671",
        "course": null,
        "callCount": null,
        "district": "Amritsar",
        "enquiryNo": 8,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Lopoke",
        "opinion": "Warm"
      },
      {
        "name": "Divya Shetty",
        "state": "Karnataka",
        "source": "YouTube Ads",
        "status": "ENQUIRY",
        "mobileNo": "9270107981",
        "course": null,
        "callCount": null,
        "district": "Vijayapura",
        "enquiryNo": 9,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Chadachan",
        "opinion": "Warm"
      },
      {
        "name": "Latha Reddy",
        "state": "Karnataka",
        "source": "Facebook Ads",
        "status": "ENQUIRY",
        "mobileNo": "9520599728",
        "course": null,
        "callCount": null,
        "district": "Dakshina Kannada",
        "enquiryNo": 10,
        "callersEmpId": "EMP0005",
        "callerName": "karun poojari",
        "taluk": "Puttur",
        "opinion": "Warm"
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
    "last": false,
    "totalElements": 50,
    "totalPages": 5,
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

**Pagination (Spring Page envelope):** totalElements=50 totalPages=5 number=0 numberOfElements=10

---

### Endpoint: GET /api/leads/calls/datewise-summary?page=0&size=10
**Page:** Admin Reports
**Frontend caller:** callReportsService.getDatewiseSummary()

**HTTP Request:**
```text
GET /api/leads/calls/datewise-summary?page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Date-wise summary fetched successfully",
  "data": {
    "content": [
      {
        "callDate": "2026-08-16",
        "totalCalls": 5,
        "hotCount": 2,
        "uniqueCallers": 3,
        "coldCount": 0
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

### Endpoint: GET /api/leads/calls/date-details?callDate=2026-08-17&page=0&size=10
**Page:** Admin Reports
**Frontend caller:** callReportsService.getDateDetails()

**HTTP Request:**
```text
GET /api/leads/calls/date-details?callDate=2026-08-17&page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Call details fetched successfully",
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

### Endpoint: GET /api/leads/calls/individual?empId=EMP0005&page=0&size=10
**Page:** Admin Telecaller Performer Detail / Call Reports Detail
**Frontend caller:** callReportsService.getTelecallerCallLogs()

**HTTP Request:**
```text
GET /api/leads/calls/individual?empId=EMP0005&page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Individual calls fetched successfully",
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

### Endpoint: GET /api/leads/overview?type=all&page=0&size=30
**Page:** Admin Leads listing
**Frontend caller:** leadService.getOverview()

**HTTP Request:**
```text
GET /api/leads/overview?type=all&page=0&size=30
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Lead overview fetched successfully",
  "data": {
    "leads": [
      {
        "enquiryNo": 1,
        "source": "",
        "status": "HOT",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "enquiryNo": 2,
        "source": "Walk-in",
        "status": "COMPLETED",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "enquiryNo": 3,
        "source": "Walk-in",
        "status": "COLD",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "enquiryNo": 4,
        "source": "Education Fair",
        "status": "WARM",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
        "callCount": null,
        "name": "Arjun Desai",
        "mobileNo": "9168976846",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Arkalgud"
      },
      {
        "enquiryNo": 5,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "callerName": "karun poojari",
        "callersEmpId": "EMP0005",
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
        "enquiryNo": 11,
        "source": "",
        "status": "HOT",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": 1,
        "name": "Santhosh singh",
        "mobileNo": "6363907325",
        "course": "",
        "opinion": "Cold",
        "state": "Karnataka",
        "district": "Bengaluru Rural",
        "taluk": "Devanahalli"
      },
      {
        "enquiryNo": 12,
        "source": "YouTube Ads",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Aditi Sharma",
        "mobileNo": "9105500875",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Vijayapura",
        "taluk": "Chadachan"
      },
      {
        "enquiryNo": 13,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Manjunath Joshi",
        "mobileNo": "9298369579",
        "course": null,
        "opinion": "Warm",
        "state": "Telangana",
        "district": "Vikarabad",
        "taluk": "Marpalle"
      },
      {
        "enquiryNo": 14,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Sneha Shetty",
        "mobileNo": "9080737028",
        "course": null,
        "opinion": "Warm",
        "state": "Telangana",
        "district": "Siddipet",
        "taluk": "Chinnakodur"
      },
      {
        "enquiryNo": 15,
        "source": "YouTube Ads",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Anjali Naik",
        "mobileNo": "9468616425",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Koppal",
        "taluk": "Koppal"
      },
      {
        "enquiryNo": 16,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Kavya Joshi",
        "mobileNo": "9587718841",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "taluk": "Bengaluru North"
      },
      {
        "enquiryNo": 17,
        "source": "YouTube Ads",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Ajay Nair",
        "mobileNo": "9820525898",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Hassan"
      },
      {
        "enquiryNo": 18,
        "source": "Google Ads",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Girish Pillai",
        "mobileNo": "9949482141",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Belagavi",
        "taluk": "Athni"
      },
      {
        "enquiryNo": 19,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Prakash Patil",
        "mobileNo": "9185491452",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Koppal",
        "taluk": "Koppal"
      },
      {
        "enquiryNo": 20,
        "source": "YouTube Ads",
        "status": "ENQUIRY",
        "callerName": "Preetham",
        "callersEmpId": "EMP0010",
        "callCount": null,
        "name": "Jyothi Bhat",
        "mobileNo": "9001304118",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Ramanagara",
        "taluk": "Magadi"
      },
      {
        "enquiryNo": 21,
        "source": "Referral",
        "status": "WARM",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": 1,
        "name": "Kiran Achar",
        "mobileNo": "9659397615",
        "course": null,
        "opinion": "Interested",
        "state": "Karnataka",
        "district": "Dharwad",
        "taluk": "Hubballi Urban"
      },
      {
        "enquiryNo": 22,
        "source": "Website",
        "status": "ENQUIRY",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": 1,
        "name": "Swathi Iyer",
        "mobileNo": "9060454146",
        "course": null,
        "opinion": "Interested",
        "state": "Uttarakhand",
        "district": "Dehradun",
        "taluk": "Rishikesh"
      },
      {
        "enquiryNo": 23,
        "source": "Referral",
        "status": "WARM",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": 1,
        "name": "Sandeep Shetty",
        "mobileNo": "9129110285",
        "course": null,
        "opinion": "Cold",
        "state": "Andhra Pradesh",
        "district": "Annamayya",
        "taluk": "Kambhamvaripalle"
      },
      {
        "enquiryNo": 24,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": null,
        "name": "Rohan Kulkarni",
        "mobileNo": "9566636322",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Uttara Kannada",
        "taluk": "Mundgod"
      },
      {
        "enquiryNo": 25,
        "source": "YouTube Ads",
        "status": "ENQUIRY",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": null,
        "name": "Rekha Menon",
        "mobileNo": "9423004876",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Vijayapura",
        "taluk": "Nidagundi"
      },
      {
        "enquiryNo": 26,
        "source": "Referral",
        "status": "ENQUIRY",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": null,
        "name": "Arjun Naik",
        "mobileNo": "9845850037",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Hassan",
        "taluk": "Channarayapatna"
      },
      {
        "enquiryNo": 27,
        "source": "Website",
        "status": "ENQUIRY",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": null,
        "name": "Usha Desai",
        "mobileNo": "9384535577",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Vijayapura",
        "taluk": "Nidagundi"
      },
      {
        "enquiryNo": 28,
        "source": "Instagram",
        "status": "ENQUIRY",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": null,
        "name": "Deepak Shetty",
        "mobileNo": "9627058602",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Davangere",
        "taluk": "Harihar"
      },
      {
        "enquiryNo": 29,
        "source": "Referral",
        "status": "ENQUIRY",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": null,
        "name": "Pooja Sharma",
        "mobileNo": "9839490668",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Bengaluru Rural",
        "taluk": "Dodda Ballapur"
      },
      {
        "enquiryNo": 30,
        "source": "Walk-in",
        "status": "ENQUIRY",
        "callerName": "sakshi chavan",
        "callersEmpId": "EMP0011",
        "callCount": null,
        "name": "Sowmya Sharma",
        "mobileNo": "9265844093",
        "course": null,
        "opinion": "Warm",
        "state": "Karnataka",
        "district": "Vijayanagar",
        "taluk": "Hosapete"
      }
    ],
    "currentPage": 0,
    "totalPages": 2,
    "totalItems": 50
  },
  "errors": null
}
```

**Pagination (custom Paged*Response envelope):** currentPage=0 totalPages=2 totalItems=50

---

### Endpoint: GET /api/leads/overview/1
**Page:** Admin Leads (legacy detail)
**Frontend caller:** leadService.getOverviewById()

**HTTP Request:**
```text
GET /api/leads/overview/1
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Lead detail fetched successfully",
  "data": {
    "enquiryNo": 1,
    "name": "Manoj",
    "mobileNo": "6363045415",
    "email": "",
    "source": "",
    "enquiryDate": "2026-08-16",
    "state": "Karnataka",
    "district": "Davangere",
    "taluk": "Davanagere",
    "collegeStudied": "",
    "programme": "",
    "course": "",
    "discipline": "",
    "interestedUniversity": null,
    "interestedLocation": null,
    "status": "HOT",
    "opinion": "Interested",
    "remarks": "",
    "callersEmpId": "EMP0005",
    "callerName": "karun poojari",
    "currentlyAssigned": true,
    "callCount": 1,
    "callDuration": "9",
    "callDate": "2026-08-16",
    "followupDate": null,
    "followupCollege": null,
    "followupProgram": null,
    "followupCourse": null,
    "followupDiscipline": null,
    "lastUpdated": "2026-08-16T18:27:34",
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
        "createdAt": "2026-08-16T18:19:17"
      },
      {
        "telecallerEmpId": "EMP0005",
        "interactionType": "CALL",
        "outcome": "CONNECTED",
        "opinion": null,
        "notes": null,
        "createdAt": "2026-08-16T18:17:01"
      },
      {
        "telecallerEmpId": "EMP0005",
        "interactionType": "CALL",
        "outcome": "CONNECTED",
        "opinion": "Interested",
        "notes": "ready to be admitted",
        "createdAt": "2026-08-16T18:16:51"
      },
      {
        "telecallerEmpId": "EMP0005",
        "interactionType": "CALL",
        "outcome": null,
        "opinion": null,
        "notes": null,
        "createdAt": "2026-08-16T18:16:49"
      },
      {
        "telecallerEmpId": "EMP0005",
        "interactionType": "CALL",
        "outcome": "CONNECTED",
        "opinion": null,
        "notes": null,
        "createdAt": "2026-08-16T18:15:45"
      },
      {
        "telecallerEmpId": "EMP0005",
        "interactionType": "CALL",
        "outcome": null,
        "opinion": null,
        "notes": null,
        "createdAt": "2026-08-16T18:15:30"
      },
      {
        "telecallerEmpId": "EMP0005",
        "interactionType": "CALL",
        "outcome": null,
        "opinion": null,
        "notes": null,
        "createdAt": "2026-08-16T18:15:08"
      },
      {
        "telecallerEmpId": "EMP0005",
        "interactionType": "CALL",
        "outcome": null,
        "opinion": null,
        "notes": null,
        "createdAt": "2026-08-16T18:13:21"
      }
    ]
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/1
**Page:** Admin Lead Details
**Frontend caller:** leadService.getLeadDetails()

**HTTP Request:**
```text
GET /api/leads/1
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Lead details fetched successfully",
  "data": {
    "leadId": 1,
    "enquiryNo": "ENQ-1",
    "student": {
      "name": "Manoj",
      "mobile": "6363045415",
      "email": "",
      "gender": null,
      "dob": null
    },
    "location": {
      "state": "Karnataka",
      "district": "Davangere",
      "city": "Davanagere",
      "address": null
    },
    "education": {
      "college": "",
      "programme": "",
      "discipline": "",
      "course": "",
      "passingYear": null
    },
    "lead": {
      "status": "HOT",
      "temperature": "HOT",
      "stage": "HOT",
      "source": "",
      "assignedTo": {
        "id": 24,
        "name": "karun poojari"
      },
      "createdAt": "2026-08-16T00:00:00",
      "updatedAt": "2026-08-16T18:27:34"
    },
    "remarks": "",
    "timeline": [],
    "notes": []
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/1/timeline
**Page:** Admin Lead Details
**Frontend caller:** leadService.getLeadTimeline()

**HTTP Request:**
```text
GET /api/leads/1/timeline
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Timeline fetched successfully",
  "data": [
    {
      "id": "followup-13",
      "type": "FOLLOW_UP",
      "title": "Follow-up Scheduled",
      "description": "",
      "createdAt": "2026-08-16T18:19:17"
    },
    {
      "id": "call-12",
      "type": "CALL",
      "title": "Call Logged — CONNECTED",
      "description": null,
      "createdAt": "2026-08-16T18:17:01"
    },
    {
      "id": "call-11",
      "type": "CALL",
      "title": "Call Logged — CONNECTED",
      "description": "ready to be admitted",
      "createdAt": "2026-08-16T18:16:51"
    },
    {
      "id": "call-10",
      "type": "CALL",
      "title": "Call Logged — null",
      "description": null,
      "createdAt": "2026-08-16T18:16:49"
    },
    {
      "id": "call-9",
      "type": "CALL",
      "title": "Call Logged — CONNECTED",
      "description": null,
      "createdAt": "2026-08-16T18:15:45"
    },
    {
      "id": "call-8",
      "type": "CALL",
      "title": "Call Logged — null",
      "description": null,
      "createdAt": "2026-08-16T18:15:30"
    },
    {
      "id": "call-7",
      "type": "CALL",
      "title": "Call Logged — null",
      "description": null,
      "createdAt": "2026-08-16T18:15:08"
    },
    {
      "id": "call-6",
      "type": "CALL",
      "title": "Call Logged — null",
      "description": null,
      "createdAt": "2026-08-16T18:13:21"
    },
    {
      "id": "transfer-1",
      "type": "ASSIGNED",
      "title": "Lead Assigned",
      "description": "Assigned to karun poojari",
      "createdAt": "2026-08-16T17:55:46"
    },
    {
      "id": "created-1",
      "type": "CREATED",
      "title": "Lead Created",
      "description": "Manoj submitted an inquiry",
      "createdAt": "2026-08-16T00:00:00"
    }
  ],
  "errors": null
}
```

**Record count (plain array):** 10

---

### Endpoint: GET /api/leads/1/notes
**Page:** Admin Lead Details
**Frontend caller:** leadService.getLeadNotes()

**HTTP Request:**
```text
GET /api/leads/1/notes
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Notes fetched successfully",
  "data": [],
  "errors": null
}
```

**Record count (plain array):** 0

---

### Endpoint: GET /api/leads/manager/users?page=0&size=10
**Page:** Admin User Directory
**Frontend caller:** userService.listUsers()

**HTTP Request:**
```text
GET /api/leads/manager/users?page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "slNo": 24,
        "username": "telecaller11",
        "empId": "EMP0005",
        "phoneNo": "6363907325",
        "name": "karun poojari",
        "college": "",
        "programme": "",
        "course": "",
        "discipline": "",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": "http://192.168.1.23:9000/gmu-lead-service-avatars/avatars/EMP0005_1786597800991.jpg",
        "defaultPassword": null
      },
      {
        "slNo": 37,
        "username": "telecaller5",
        "empId": "EMP0013",
        "phoneNo": "7338597156",
        "name": "Pradeep",
        "college": "Saptagiri",
        "programme": "UG",
        "course": "BE",
        "discipline": "ai",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": null,
        "defaultPassword": null
      },
      {
        "slNo": 34,
        "username": "telecaller2",
        "empId": "EMP0010",
        "phoneNo": "6363045415",
        "name": "Preetham",
        "college": "GMU",
        "programme": "PG",
        "course": "MCA",
        "discipline": "AI",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": null,
        "defaultPassword": null
      },
      {
        "slNo": 35,
        "username": "telecaller3",
        "empId": "EMP0011",
        "phoneNo": "9353270442",
        "name": "sakshi chavan",
        "college": "GMU",
        "programme": "PG",
        "course": "MCA",
        "discipline": "CY",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": null,
        "defaultPassword": null
      },
      {
        "slNo": 36,
        "username": "telecaller4",
        "empId": "EMP0012",
        "phoneNo": "6362379895",
        "name": "Shivu",
        "college": "Saptagiri",
        "programme": "UG",
        "course": "BE",
        "discipline": "CS",
        "status": "ACTIVE",
        "email": null,
        "department": null,
        "role": null,
        "reportingManager": null,
        "joiningDate": null,
        "photo": null,
        "defaultPassword": null
      }
    ],
    "currentPage": 0,
    "totalPages": 1,
    "totalItems": 5,
    "pageSize": 10
  },
  "errors": null
}
```

**Pagination (custom Paged*Response envelope):** currentPage=0 totalPages=1 totalItems=5

---

### Endpoint: GET /api/leads/manager/users/EMP0005/dashboard
**Page:** Admin Telecaller Details
**Frontend caller:** telecallerService.getTelecallerDashboard()

**HTTP Request:**
```text
GET /api/leads/manager/users/EMP0005/dashboard
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Telecaller dashboard fetched successfully",
  "data": {
    "profile": {
      "slNo": 24,
      "empId": "EMP0005",
      "name": "karun poojari",
      "email": "sakshichavandvg@gmail.com",
      "phoneNo": "6363907325",
      "username": "telecaller11",
      "role": "Telecaller",
      "department": "General",
      "reportingManager": "N/A",
      "joiningDate": "2026-01-24",
      "status": "ACTIVE",
      "avatar": "http://192.168.1.23:9000/gmu-lead-service-avatars/avatars/EMP0005_1786597800991.jpg"
    },
    "workload": {
      "assignedLeads": 10,
      "conversionRate": 0,
      "pendingFollowUps": 1
    },
    "kpi": {
      "assignedLeads": 10,
      "convertedLeads": 0,
      "callsToday": 0,
      "callsThisMonth": 7,
      "conversionRate": 0,
      "pendingFollowUps": 1
    },
    "callsPerformance": [
      {
        "date": "2026-08-16",
        "calls": 7
      }
    ],
    "callOutcomes": [
      {
        "name": "CONNECTED",
        "value": 3
      }
    ],
    "leadPipeline": [
      {
        "stage": "ENQUIRY",
        "count": 6
      },
      {
        "stage": "COLD",
        "count": 1
      },
      {
        "stage": "HOT",
        "count": 1
      },
      {
        "stage": "COMPLETED",
        "count": 1
      },
      {
        "stage": "WARM",
        "count": 1
      }
    ],
    "assignedLeads": [
      {
        "leadId": 3,
        "enqNo": "ENQ-3",
        "studentName": "Ganesh Nair",
        "mobile": "9884472940",
        "source": "Walk-in",
        "status": "COLD",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 2,
        "enqNo": "ENQ-2",
        "studentName": "Manoj Iyer",
        "mobile": "9707536455",
        "source": "Walk-in",
        "status": "COMPLETED",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 5,
        "enqNo": "ENQ-5",
        "studentName": "Nandini Hegde",
        "mobile": "9081967273",
        "source": "Instagram",
        "status": "ENQUIRY",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 6,
        "enqNo": "ENQ-6",
        "studentName": "Padma Menon",
        "mobile": "9864887663",
        "source": "Facebook Ads",
        "status": "ENQUIRY",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 7,
        "enqNo": "ENQ-7",
        "studentName": "Suresh Achar",
        "mobile": "9875347787",
        "source": "Education Fair",
        "status": "ENQUIRY",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 8,
        "enqNo": "ENQ-8",
        "studentName": "Kavya Nair",
        "mobile": "9178472671",
        "source": "Education Fair",
        "status": "ENQUIRY",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 9,
        "enqNo": "ENQ-9",
        "studentName": "Divya Shetty",
        "mobile": "9270107981",
        "source": "YouTube Ads",
        "status": "ENQUIRY",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 10,
        "enqNo": "ENQ-10",
        "studentName": "Latha Reddy",
        "mobile": "9520599728",
        "source": "Facebook Ads",
        "status": "ENQUIRY",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 1,
        "enqNo": "ENQ-1",
        "studentName": "Manoj",
        "mobile": "6363045415",
        "source": "",
        "status": "HOT",
        "temperature": "HOT",
        "stage": "HOT",
        "assignedDate": "2026-08-16"
      },
      {
        "leadId": 4,
        "enqNo": "ENQ-4",
        "studentName": "Arjun Desai",
        "mobile": "9168976846",
        "source": "Education Fair",
        "status": "WARM",
        "temperature": "WARM",
        "stage": "NEW",
        "assignedDate": "2026-08-16"
      }
    ]
  },
  "errors": null
}
```

---

### Endpoint: GET /api/leads/manager/users/EMP0005/leads?page=0&size=10
**Page:** Admin Telecaller Details
**Frontend caller:** telecallerService.getTelecallerLeads()

**HTTP Request:**
```text
GET /api/leads/manager/users/EMP0005/leads?page=0&size=10
```

**HTTP Status:** 200
**Content-Type:** application/json

**Actual Response Body:**
```json
{
  "success": true,
  "message": "Telecaller's leads fetched successfully",
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

### Endpoint: GET /api/leads/telecaller/leads/1/status-history
**Page:** Admin Telecaller Details (undocumented endpoint)
**Frontend caller:** telecallerLeadService.getStatusHistory()

**HTTP Request:**
```text
GET /api/leads/telecaller/leads/1/status-history
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
      "id": 3,
      "oldStatus": "WARM",
      "newStatus": "HOT",
      "oldOpinion": "Interested",
      "newOpinion": "Interested",
      "changedByName": "karun poojari",
      "changedAt": "2026-08-16T18:27:34"
    },
    {
      "id": 2,
      "oldStatus": "COLD",
      "newStatus": "WARM",
      "oldOpinion": "Interested",
      "newOpinion": "Interested",
      "changedByName": "karun poojari",
      "changedAt": "2026-08-16T18:27:28"
    },
    {
      "id": 1,
      "oldStatus": "ENQUIRY",
      "newStatus": "COLD",
      "oldOpinion": "Interested",
      "newOpinion": "Interested",
      "changedByName": "karun poojari",
      "changedAt": "2026-08-16T18:27:07"
    }
  ],
  "errors": null
}
```

**Record count (plain array):** 3

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
