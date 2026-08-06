# CRM Typography Guidelines & Design System Scale

This document outlines the unified typography design system for the CRM. These guidelines ensure visual hierarchy, consistency, and readability across all screens while preventing utility bloat.

---

## 1. Unified Font Family

The primary typeface for the entire CRM application is **Outfit**. It is configured globally as a CSS variable `--font-sans` which maps directly to the Google Font loaded by Next.js.

Always apply the font via the Tailwind utility:
```html
font-sans
```

---

## 2. Typography Design Scale

The typography scale defines sizes, line heights, and weights hierarchically:

| Token Class | Font Size | Line Height | Font Weight | Usage Context |
| :--- | :--- | :--- | :--- | :--- |
| `text-heading-display` | 40px | 1.1 | Bold (700) | Landing page stats, main landing headers |
| `text-heading-1` | 32px | 1.2 | Bold (700) | Main page titles (`PageHeader`, `ManagementHeader`) |
| `text-heading-2` | 22px | 1.3 | Bold (700) | Section-level headings, modal header titles |
| `text-heading-3` | 16px | 1.4 | Semibold (600) | Card titles (`SectionCard`, `TableCard`) |
| `text-subtitle` | 14px | 1.4 | Regular (400) | Page description / subtexts |
| `text-body` | 15px | 1.5 | Regular (400) | Default body text, forms text input values |
| `text-body-sm` | 13px | 1.4 | Regular (400) | Secondary body text, table cells |
| `text-label` | 13px | 1.3 | Semibold (600) | Form input labels, button text |
| `text-caption` | 11px | 1.3 | Medium (500) | Badges, small metadata text, error messages |
| `text-kpi` | 36px | 1.1 | Bold (700) | Numeric values inside KPI summary cards |

---

## 3. Best Practices & Replacement Rules

### ✅ Do
- **Consume Shared Components**: Prefer using standard components like `Button`, `Input`, `Badge`, `PageHeader`, `SectionCard`, and `KPICard` which inherit the typography system automatically.
- **Always Include `font-sans`**: When writing custom HTML headings, pair size tokens with the `font-sans` class (e.g. `text-heading-2 font-bold font-sans`).
- **Use Semantic Naming**: Use `text-label` for form headers and button text, not random arbitrary sizes.

### ❌ Don't
- **Do not standardize marketing or chart layers**: Third-party components, charts, brand logos, and external rich-text layers are intentionally exempt from the CRM typography tokens.
- **Do not introduce arbitrary sizes**: Avoid using inline styles (e.g. `style={{ fontSize: '13px' }}`) or hardcoded Tailwind values (e.g. `text-[15px]`) for CRM application controls.
