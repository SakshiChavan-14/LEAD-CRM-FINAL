# Design System Guidelines — Motion & Micro-Interactions

## Overview

The motion system governs transition speeds, easings, hover scale shifts, card elevation lifts, loading feedback, and modal dialog transitions across the CRM application.

---

## Motion Standards

### 1. Duration Tokens
- `--duration-fast` (`150ms`): Micro-interactions, checkboxes, icon shifts, table row hovers.
- `--duration-normal` (`200ms`): Buttons, inputs, tab switches, dropdown items, card hover lifts.
- `--duration-slow` (`300ms`): Modal dialogs, slide-over drawers, accordion expansions.

### 2. Easing Tokens
- `--ease-standard` (`cubic-bezier(0.4, 0.0, 0.2, 1)`): Smooth bidirectional transitions.
- `--ease-emphasized` (`cubic-bezier(0.2, 0.0, 0.0, 1.0)`): Dialog entrance reveals.
- `--ease-decelerate` (`cubic-bezier(0.0, 0.0, 0.2, 1.0)`): Exit animations.

---

## Component Interaction Patterns

| Component | Hover State | Active Press | Transition Class |
| :--- | :--- | :--- | :--- |
| **Primary Button** | `hover:bg-primary-hover hover:scale-[1.01]` | `active:scale-[0.99]` | `.transition-fast` |
| **KPI Metric Card** | `hover:-translate-y-0.5 hover:shadow-card-hover` | — | `.transition-standard` |
| **Table Row** | `hover:bg-slate-50/80 cursor-pointer` | `active:bg-slate-100` | `.transition-fast` |
| **Dialog Panel** | Entrance: `scale-95 opacity-0` -> `scale-100 opacity-100` | — | `.transition-slow` |
| **Input / Select** | `hover:border-border-strong` | `focus-visible:border-primary` | `.transition-fast` |

---

## Do's and Don'ts

- **DO** use performance-friendly CSS properties (`transform`, `opacity`, `background-color`, `border-color`).
- **DO** use `transition-colors` when only background/border color is animating.
- **DON'T** use `transition-all` indiscriminately on heavy layout elements as it causes unnecessary browser recalculations.
- **DON'T** exceed `300ms` for standard UI transitions to keep the application feeling crisp and fast.
