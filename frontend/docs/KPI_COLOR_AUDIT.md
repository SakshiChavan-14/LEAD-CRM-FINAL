# Sprint 18 — KPI Metric Card Visual System Audit

## 1. KPI Card Inventory across Features

Audit of 67 KPI summary card instances across Admin Dashboard, Telecaller Dashboard, Call Reports, Users, and Leads:

| Feature / Page | Current Visual Styling | Identified Inconsistencies |
| :--- | :--- | :--- |
| **Admin Dashboard** | `bg-white p-6 rounded-[20px] border border-[#ECECEC] shadow-[0_4px_20px_rgba(0,0,0,0.05)]` | Icon container uses `bg-[#7A1F2B]/10 text-[#7A1F2B]`. Title uses `text-gray-500`. |
| **Telecaller Dashboard** | `bg-white p-5 rounded-2xl border border-slate-200 shadow-sm` | Icon container uses `bg-blue-50 text-blue-600`. Title uses `text-slate-500`. |
| **Call Reports** | `bg-white p-6 rounded-xl border border-gray-200 shadow-sm` | Icon container uses `bg-purple-50 text-purple-600`. Value text uses `text-gray-900`. |
| **User Directory Header** | `bg-white p-4 rounded-xl border border-[#E8EAF2] shadow-sm` | Icon container uses `bg-emerald-50 text-emerald-600`. Trend uses `text-emerald-700`. |
| **Leads Metric Summary** | `bg-white p-5 rounded-2xl border border-[#ECECEC] shadow-sm` | Icon container uses `bg-amber-50 text-amber-600`. Border uses `border-[#ECECEC]`. |

---

## 2. Standardized KPI Card Tokens

To establish 100% visual consistency without modifying page layouts or React logic:

- **Card Container**: `bg-surface border border-border-subtle rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-normal`
- **Metric Label / Title**: `text-xs font-semibold text-text-secondary uppercase tracking-wider`
- **Metric Value Number**: `text-2xl font-bold text-text-primary tracking-tight`
- **Icon Container Fills**:
  - Primary Accent: `bg-primary/10 text-primary`
  - Success Accent: `bg-emerald-50 text-emerald-600`
  - Info Accent: `bg-blue-50 text-blue-600`
  - Warning Accent: `bg-amber-50 text-amber-600`
- **Trend Indicators**:
  - Positive Trend: `bg-emerald-50 text-emerald-700 border border-emerald-200/50`
  - Negative Trend: `bg-rose-50 text-rose-700 border border-rose-200/50`
