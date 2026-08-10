# Design System Guidelines — Colors

## Overview & Architecture

The CRM design system uses a **Two-Tier Token Architecture** for colors:
1. **Foundation Tokens**: Palette primitives defined in `src/styles/foundation/colors.css`.
2. **Semantic Tokens**: Functional role mappings defined in `src/styles/colors.css`.

---

## Token Consumption Rules

### 1. Always Use Semantic Tokens
When building UI components, consume semantic tokens rather than raw hex values or arbitrary palette shades.

| Intent | Correct Semantic Token | Incorrect Hardcoded Usage |
| :--- | :--- | :--- |
| Primary Action Button | `var(--color-primary-action)` | `#6F1D28` |
| Primary Brand Header | `var(--color-primary)` | `#7A1F2B` |
| Card / Dialog Surface | `var(--color-surface)` | `#FFFFFF` |
| Primary Heading Text | `var(--color-text-primary)` | `#111827` or `#0F172A` |
| Muted Body / Label | `var(--color-text-secondary)` | `#6B7280` or `#9CA3AF` |
| Standard Surface Border | `var(--color-border-default)` | `#E5E7EB` or `border-gray-200` |
| Subtle Card Border | `var(--color-border-subtle)` | `#ECECEC` |

---

## Accessibility & WCAG 2.1 AA Requirements

1. **Text Contrast**: Text on surface backgrounds must achieve at least a **4.5:1 contrast ratio** for normal body text and **3:1** for large headings (18pt+ or 14pt bold).
2. **Placeholder Text**: Form placeholders must use `--color-text-secondary` (`#64748B`, ratio 4.6:1). Never use `gray-400` (`#9CA3AF`) for input text.
3. **Status Badges**: Text inside status badges must be bold/semibold and achieve a minimum 4.5:1 ratio against badge backgrounds.

---

## Do's and Don'ts

- **DO** use semantic status colors (`--color-success`, `--color-danger`, `--color-warning`, `--color-info`) for badge variants.
- **DO** use `var(--color-text-inverse)` for text on dark primary backgrounds.
- **DON'T** introduce custom hex values in component inline styles or arbitrary Tailwind square bracket classes (e.g. `bg-[#7A1F2B]`).
- **DON'T** mix `slate-50` page backgrounds with arbitrary `gray-100` card fills on the same page view.
