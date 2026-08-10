# Sprint 18 — Comprehensive Motion & Micro-Interaction System Audit

## 1. Motion Tokens & Interactive Behavior System

Motion is expanded beyond basic duration to encompass **Scales, Surface Elevation Shifts, Loading Patterns, Dialog Transitions, and Table Interactions**.

---

## 2. Standardized Micro-Interaction Specifications

### A. Hover Scale System
| Scale Class | Value | Target Components |
| :--- | :--- | :--- |
| `scale-100` | `transform: scale(1)` | Default resting state for all controls |
| `scale-[1.01]` | `transform: scale(1.01)` | Primary action buttons, stat KPI cards on hover |
| `scale-[1.02]` | `transform: scale(1.02)` | Interactive thumbnail previews, floating badges |
| `scale-[0.99]` | `transform: scale(0.99)` | Active button press / mouse down feedback |

---

### B. Card Lift & Surface Elevation Shift
| Motion Effect | Utility Combination | Target Components |
| :--- | :--- | :--- |
| **Subtle Card Lift** | `hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-normal ease-standard` | Primary dashboard KPI cards & feature grid items |
| **Interactive Row Lift** | `hover:-translate-y-[1px] hover:shadow-sm transition-all duration-fast` | Telecaller follow-up card lists |

---

### C. Standardized Loading Animations
| Loading Pattern | Class Specification | Usage Context |
| :--- | :--- | :--- |
| **Skeleton Loader** | `animate-pulse bg-gray-200/80 rounded-lg` | Table row loading, chart loading placeholders |
| **Spinner** | `animate-spin text-primary h-5 w-5` | Button loading states, async form submission |
| **Pulse Highlight** | `animate-pulse bg-primary/10 text-primary` | Active telecaller status, incoming live calls |
| **Fade In** | `animate-fade-in transition-opacity duration-normal` | Async data section load completion |

---

### D. Dialog Entrance & Exit Transitions
| Transition Phase | CSS / Tailwind Transition Utility | Timing & Easing Token |
| :--- | :--- | :--- |
| **Backdrop Enter** | `opacity-0` -> `opacity-100` | `duration-normal ease-standard` (200ms) |
| **Backdrop Exit** | `opacity-100` -> `opacity-0` | `duration-fast ease-decelerate` (150ms) |
| **Panel Enter** | `opacity-0 scale-95` -> `opacity-100 scale-100` | `duration-normal ease-emphasized` (200ms) |
| **Panel Exit** | `opacity-100 scale-100` -> `opacity-0 scale-95` | `duration-fast ease-decelerate` (150ms) |

---

### E. Table Row Hover Standard
| State | Tailwind Utility Class | Behavior |
| :--- | :--- | :--- |
| **Hover** | `hover:bg-slate-50/80 transition-colors duration-fast cursor-pointer` | Subtle highlight with standard fast transition |
| **Active Click** | `active:bg-slate-100/90` | Immediate tactile click feedback |
