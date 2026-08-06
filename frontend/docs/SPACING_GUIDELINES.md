# Design System: Spacing, Radius & Shadows

This document outlines the semantic design tokens established in Sprint 17. The goal of this system is to replace arbitrary utility values (`p-4`, `rounded-xl`, `shadow-sm`) with semantic CSS variables that describe the **purpose** of the token rather than its exact pixel value.

All tokens are defined as CSS variables in `src/styles/` and injected into the Tailwind theme through arbitrary value syntax (e.g., `p-[var(--spacing-card)]`).

---

## 1. Spacing (`src/styles/spacing.css`)

The spacing scale is intentionally small, focusing on structural layout and component padding.

| Token | CSS Variable | Value | Equivalent Tailwind | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Section** | `--spacing-section` | `1.5rem` (24px) | `p-6`, `gap-6` | Major layout separation, large card padding |
| **Card** | `--spacing-card` | `1rem` (16px) | `p-4`, `gap-4` | Standard card padding, component separation |
| **Content** | `--spacing-content` | `0.75rem` (12px)| `p-3`, `gap-3` | Inner content spacing, lists, item gaps |
| **Toolbar** | `--spacing-toolbar` | `0.75rem` (12px)| `p-3`, `py-3` | Toolbars, top/bottom padding for inputs |
| **Control** | `--spacing-control` | `0.5rem` (8px) | `p-2`, `gap-2` | Gap between buttons, small internal paddings |
| **Inline** | `--spacing-inline` | `0.25rem` (4px) | `p-1`, `gap-1` | Tight clusters, icon & text spacing |

**Usage Example:**
```jsx
// Before
<div className="flex flex-col gap-4 p-6">...</div>

// After
<div className="flex flex-col gap-[var(--spacing-card)] p-[var(--spacing-section)]">...</div>
```

---

## 2. Border Radius (`src/styles/radius.css`)

Radius tokens use surface-oriented naming to guarantee consistency across different elevation layers.

| Token | CSS Variable | Value | Equivalent Tailwind | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Control** | `--radius-control` | `0.75rem` (12px)| `rounded-xl` | Inputs, Selects, Buttons, small panels |
| **Surface** | `--radius-surface` | `1rem` (16px) | `rounded-2xl` | Standard cards, feature wrappers |
| **Surface Large** | `--radius-surface-lg`| `1.25rem` (20px)| `rounded-[20px]` | Premium cards, dashboard KPIs |
| **Overlay** | `--radius-overlay` | `1.5rem` (24px) | `rounded-[24px]` | Modals, dialogs, popovers |
| **Pill** | `--radius-pill` | `9999px` | `rounded-full` | Badges, avatars, decorative icons |

**Usage Example:**
```jsx
// Before
<div className="bg-white rounded-xl">...</div>

// After
<div className="bg-white rounded-[var(--radius-surface)]">...</div>
```

---

## 3. Shadows (`src/styles/shadow.css`)

Shadows use elevation-oriented naming (`sm`, `md`, `lg`, `overlay`) rather than component-specific names, matching industry best practices.

| Token | CSS Variable | Elevation | Equivalent Tailwind | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Small** | `--shadow-sm` | Level 1 | `shadow-sm` | Standard cards, list items, subtle containers |
| **Medium** | `--shadow-md` | Level 2 | `shadow-md` | Hover states, interactive cards |
| **Large** | `--shadow-lg` | Level 3 | `shadow-lg` | Dropdowns, popovers, select menus |
| **Overlay**| `--shadow-overlay` | Level 4 | `shadow-2xl` | Modals, full-screen dialogs |

**Usage Example:**
```jsx
// Before
<div className="bg-white shadow-sm hover:shadow-md">...</div>

// After
<div className="bg-white shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]">...</div>
```

---

## Migration Strategy

When creating new components or refactoring existing ones:
1. **Always prefer semantic tokens** over arbitrary tailwind pixel classes for structural elements.
2. If a legacy component uses a non-standard padding (e.g. `p-5` / 20px) that does not map directly to the tokens, leave it as a Tailwind utility class rather than forcing it into an incorrect token, unless redesigning it is explicitly permitted.
3. Inherit visual properties from shared components (`Button`, `Input`, `SectionCard`, `TableCard`) rather than re-declaring them locally.
