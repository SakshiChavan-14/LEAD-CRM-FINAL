# Design System Guidelines — Elevation & Shadows

## Overview

The elevation system defines standard shadow levels and visual hierarchy across surface layers in the CRM.

---

## Elevation Layers & Tokens

| Layer Category | Token / Class | Shadow Specification | Typical Components |
| :--- | :--- | :--- | :--- |
| **Surface / Card** | `var(--shadow-card)` | `0 1px 3px rgba(15,23,42,0.05)` | Resting dashboard cards, table containers |
| **Hover Surface** | `var(--shadow-card-hover)` | `0 4px 12px rgba(15,23,42,0.08)` | Hovered KPI cards, feature cards |
| **Dropdown / Menu** | `var(--shadow-dropdown)` | `0 10px 15px rgba(15,23,42,0.08)` | Select menus, action dropdowns |
| **Dialog / Modal** | `var(--shadow-dialog)` | `0 20px 25px rgba(15,23,42,0.1)` | Centered dialog modals, alert popups |
| **Popover** | `var(--shadow-popover)` | `0 4px 6px rgba(15,23,42,0.08)` | Date pickers, inline popovers |
| **Tooltip** | `var(--shadow-tooltip)` | `0 2px 4px rgba(15,23,42,0.06)` | Floating icon tooltips |
| **Overlay / Drawer** | `var(--shadow-overlay)` | `0 25px 50px rgba(15,23,42,0.25)` | Full slide-over drawers |

---

## Usage Guidelines

1. **Elevation Stacking**: Higher elevation shadows should correspond to elements higher in the z-index layer hierarchy (Dialog > Dropdown > Card Surface > Base Page).
2. **Elevation Utilities**: Prefer semantic CSS classes (`.elevation-card`, `.elevation-card-hover`, `.elevation-dropdown`, `.elevation-dialog`) or standard Tailwind tokens (`shadow-card`, `shadow-dialog`).
3. **No Arbitrary Pixel Shadows**: Do not declare custom `shadow-[0_4px_20px_rgba(0,0,0,0.05)]` strings in components; use the elevation token system instead.
