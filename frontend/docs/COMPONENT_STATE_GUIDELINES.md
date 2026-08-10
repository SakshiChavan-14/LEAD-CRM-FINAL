# Sprint 18 — Component Interactive State Guidelines

## Executive Summary
This specification defines the mandatory interactive states (Default, Hover, Active, Focus, Disabled, Loading, Selected, Read-Only) across all shared UI components in the CRM design system.

---

## 1. Shared Component State Matrix

### Button State Matrix
| State | Visual Class & Token Specification | Transition |
| :--- | :--- | :--- |
| **Default** | `bg-primary text-white shadow-sm rounded-xl px-4 py-2 font-medium` | `transition-all duration-normal ease-standard` |
| **Hover** | `hover:bg-primary-hover hover:shadow-card-hover hover:scale-[1.01]` | `transition-all duration-fast` |
| **Active (Pressed)**| `active:bg-primary-active active:scale-[0.99] active:shadow-inner` | `transition-all duration-75` |
| **Focus-Visible** | `focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2` | Instant |
| **Disabled** | `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none` | None |
| **Loading** | `relative text-transparent pointer-events-none cursor-wait` + inline SVG spinner | Pulse / Spin |

---

### Input & Textarea State Matrix
| State | Visual Class & Token Specification |
| :--- | :--- |
| **Default** | `bg-surface text-text-primary border border-border-default rounded-xl px-3.5 py-2.5 shadow-sm placeholder:text-text-muted` |
| **Hover** | `hover:border-border-strong hover:bg-surface-elevated` |
| **Focused** | `focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none` |
| **Error** | `border-danger text-danger-text focus-visible:ring-danger/20 placeholder:text-danger/50` |
| **Disabled** | `bg-surface-disabled border-border-subtle text-text-disabled cursor-not-allowed opacity-60` |
| **Read Only** | `bg-surface-subtle border-border-subtle text-text-secondary cursor-default select-all` |

---

### Card State Matrix
| State | Visual Class & Token Specification |
| :--- | :--- |
| **Default** | `bg-surface border border-border-subtle rounded-2xl shadow-card p-6` |
| **Hover (Interactive)**| `hover:shadow-card-hover hover:-translate-y-0.5 hover:border-border-default transition-all duration-normal` |
| **Selected** | `border-primary ring-2 ring-primary/10 bg-primary/5 shadow-md` |
| **Loading** | `animate-pulse bg-surface-subtle border-border-subtle` |

---

### Table Row State Matrix
| State | Visual Class & Token Specification |
| :--- | :--- |
| **Default** | `bg-surface border-b border-border-subtle text-text-body font-table-body` |
| **Hover** | `hover:bg-slate-50/80 transition-colors duration-fast cursor-pointer` |
| **Selected** | `bg-primary/5 border-primary/20` |
| **Active / Pressed**| `bg-slate-100/90` |

---

### Badge State Matrix
| Variant | Default Classes | Hover State (If Clickable) |
| :--- | :--- | :--- |
| **Primary** | `bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 text-xs font-semibold` | `hover:bg-primary/20 transition-colors` |
| **Success** | `bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full px-2.5 py-0.5 text-xs font-semibold` | `hover:bg-emerald-100 transition-colors` |
| **Warning** | `bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full px-2.5 py-0.5 text-xs font-semibold` | `hover:bg-amber-100 transition-colors` |
| **Danger** | `bg-rose-50 text-rose-700 border border-rose-200/60 rounded-full px-2.5 py-0.5 text-xs font-semibold` | `hover:bg-rose-100 transition-colors` |
| **Info** | `bg-blue-50 text-blue-700 border border-blue-200/60 rounded-full px-2.5 py-0.5 text-xs font-semibold` | `hover:bg-blue-100 transition-colors` |
| **Neutral** | `bg-slate-100 text-slate-700 border border-slate-200/60 rounded-full px-2.5 py-0.5 text-xs font-semibold` | `hover:bg-slate-200 transition-colors` |

---

### Modal / Dialog State Matrix
| State | Visual & Motion Behavior |
| :--- | :--- |
| **Opening** | Backdrop fade-in (`opacity-0` -> `opacity-100`, 200ms); Modal panel zoom-in (`scale-95 opacity-0` -> `scale-100 opacity-100`, `ease-emphasized`, 200ms) |
| **Closing** | Backdrop fade-out (150ms); Modal panel scale-down (`scale-100` -> `scale-95 opacity-0`, 150ms) |
| **Loading** | Action buttons set to loading spinner; backdrop prevents outside interaction |
