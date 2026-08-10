# Sprint 18 — Status Color Matrix & Unification

## 1. Current Domain Status Color Audit

Evaluation of status indicators across all feature modules in `frontend/src/`:

| Domain | Status State | Current Color Classes (Inconsistent) | Proposed Unified Semantic Mapping |
| :--- | :--- | :--- | :--- |
| **Lead Status** | `NEW` | `bg-blue-50 text-blue-700`, `bg-sky-100 text-sky-800` | `bg-info-bg text-info` (`blue-50`/`blue-700`) |
| | `CONTACTED` | `bg-purple-50 text-purple-700`, `bg-indigo-50 text-indigo-700` | `bg-purple-50 text-purple-700` |
| | `IN_PROGRESS` | `bg-amber-50 text-amber-700`, `bg-yellow-100 text-yellow-800` | `bg-warning-bg text-warning` (`amber-50`/`amber-700`) |
| | `SCHEDULED` | `bg-teal-50 text-teal-700` | `bg-teal-50 text-teal-700` |
| | `WON` / `QUALIFIED`| `bg-emerald-100 text-emerald-700`, `bg-green-50 text-green-700` | `bg-success-bg text-success` (`emerald-50`/`emerald-700`) |
| | `LOST` / `UNQUALIFIED`| `bg-rose-100 text-rose-700`, `bg-red-50 text-red-700` | `bg-danger-bg text-danger` (`rose-50`/`rose-700`) |
| **Call Status** | `CONNECTED` / `COMPLETED`| `bg-emerald-100 text-emerald-700` | `bg-success-bg text-success` |
| | `MISSED` / `NO_ANSWER` | `bg-amber-100 text-amber-700`, `bg-orange-50 text-orange-700` | `bg-warning-bg text-warning` |
| | `FAILED` / `BUSY` | `bg-rose-100 text-rose-700`, `bg-[#6F1D28] text-white` | `bg-danger-bg text-danger` |
| **User Status** | `ACTIVE` | `bg-emerald-100 text-emerald-700`, `bg-[#10b981] text-white` | `bg-success-bg text-success` |
| | `INACTIVE` / `SUSPENDED`| `bg-rose-100 text-rose-700`, `bg-gray-100 text-gray-700` | `bg-danger-bg text-danger` |
| **Follow-up Status** | `PENDING` | `bg-amber-50 text-amber-700`, `bg-yellow-50 text-yellow-700` | `bg-warning-bg text-warning` |
| | `COMPLETED` | `bg-emerald-50 text-emerald-700` | `bg-success-bg text-success` |
| | `OVERDUE` | `bg-red-50 text-red-700`, `bg-rose-100 text-rose-700` | `bg-danger-bg text-danger` |
| **Telecaller Status**| `ONLINE` / `AVAILABLE`| `bg-emerald-500` (dot), `bg-emerald-100 text-emerald-700` | `bg-success-bg text-success` |
| | `ON_CALL` | `bg-blue-500` (dot), `bg-blue-50 text-blue-700` | `bg-info-bg text-info` |
| | `BREAK` / `OFFLINE` | `bg-gray-400` (dot), `bg-slate-100 text-slate-600` | `bg-muted-bg text-muted` |
| **Payment Status** | `PAID` | `bg-emerald-100 text-emerald-700` | `bg-success-bg text-success` |
| | `PENDING` | `bg-amber-100 text-amber-700` | `bg-warning-bg text-warning` |
| | `FAILED` / `OVERDUE` | `bg-rose-100 text-rose-700` | `bg-danger-bg text-danger` |

---

## 2. Standard Badge Variant Specifications

To eliminate duplicated color logic, badge styling will be standardized around 5 semantic variants:

1. **Success Variant**: `bg-emerald-50 text-emerald-700 border-emerald-200/60`
2. **Warning Variant**: `bg-amber-50 text-amber-700 border-amber-200/60`
3. **Danger Variant**: `bg-rose-50 text-rose-700 border-rose-200/60`
4. **Info Variant**: `bg-blue-50 text-blue-700 border-blue-200/60`
5. **Neutral / Muted Variant**: `bg-slate-100 text-slate-700 border-slate-200/60`
