# Sprint 18 — Color Inventory & Token Unification Architecture

## 1. Two-Tier Token Architecture (Foundation + Semantic Tokens)

To ensure long-term scalability and design system evolution, colors are organized into a two-tier hierarchy:

```
Foundation Tokens (Primitive HSL / Palette Values)
         ↓
Semantic Tokens (Functional Role Mappings)
         ↓
Tailwind Theme Classes (bg-primary, text-on-surface, border-subtle)
```

### Foundation Palette Tokens (`src/styles/foundation/colors.css`)
```css
:root {
  /* Brand Burgundy Palette */
  --brand-50: #FDF2F4;
  --brand-100: #FBE5E8;
  --brand-200: #F7C6CC;
  --brand-300: #EE98A3;
  --brand-400: #E15F72;
  --brand-500: #CD334A;
  --brand-600: #8B1538;
  --brand-700: #7A1F2B; /* Primary Brand Base */
  --brand-800: #6F1D28; /* Primary Action Base */
  --brand-900: #5A1620; /* Deep Brand Hover */

  /* Neutral Slate Palette */
  --gray-50: #F8FAFC;
  --gray-100: #F1F5F9;
  --gray-200: #E2E8F0;
  --gray-300: #CBD5E1;
  --gray-400: #94A3B8;
  --gray-500: #64748B;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1E293B;
  --gray-900: #0F172A;

  /* Functional Status Palettes */
  --green-50: #ECFDF5;
  --green-500: #10B981;
  --green-700: #047857;

  --red-50: #FFF1F2;
  --red-500: #EF4444;
  --red-700: #BE123C;

  --amber-50: #FFFBEB;
  --amber-500: #F59E0B;
  --amber-700: #B45309;

  --blue-50: #EFF6FF;
  --blue-500: #3B82F6;
  --blue-700: #1D4ED8;
}
```

### Semantic Mappings (`src/styles/colors.css`)
```css
:root {
  /* Brand Semantic Mappings */
  --color-primary: var(--brand-700);
  --color-primary-action: var(--brand-800);
  --color-primary-hover: var(--brand-900);
  --color-primary-active: #8F111B;
  --color-primary-subtle: var(--brand-50);

  /* Surface & Background */
  --color-surface: #FFFFFF;
  --color-surface-subtle: var(--gray-50);
  --color-surface-muted: var(--gray-100);
  --color-bg-page: var(--gray-50);

  /* Text Roles */
  --color-text-primary: var(--gray-900);
  --color-text-secondary: var(--gray-500);
  --color-text-muted: var(--gray-400);
  --color-text-inverse: #FFFFFF;

  /* Borders */
  --color-border-default: var(--gray-200);
  --color-border-subtle: #ECECEC;
  --color-border-strong: var(--gray-300);

  /* Status Colors */
  --color-success: var(--green-700);
  --color-success-bg: var(--green-50);
  --color-danger: var(--red-700);
  --color-danger-bg: var(--red-50);
  --color-warning: var(--amber-700);
  --color-warning-bg: var(--amber-50);
  --color-info: var(--blue-700);
  --color-info-bg: var(--blue-50);
}
```

---

## 2. Hardcoded Hex Code Inventory (352 files audited)

| Hardcoded Hex Code | Occurrences | Current Usage Context | Foundation Token | Semantic Token Target |
| :--- | :--- | :--- | :--- | :--- |
| `#ECECEC` | 97 | Card borders & subtle dividers | Custom | `--color-border-subtle` |
| `#7A1F2B` | 80 | Primary brand headers & accents | `--brand-700` | `--color-primary` |
| `#6F1D28` | 79 | Action buttons & toggles | `--brand-800` | `--color-primary-action` |
| `#8B1538` | 41 | Secondary brand highlights | `--brand-600` | `--color-primary-variant` |
| `#FFFFFF` | 32 | Card & dialog surfaces | Pure White | `--color-surface` |
| `#8B0D16` | 27 | Dark burgundy hover state | Custom | `--color-primary-hover` |
| `#8F111B` | 23 | Deep burgundy active state | Custom | `--color-primary-active` |
| `#6B7280` | 16 | Gray text (`text-gray-500`) | `--gray-500` | `--color-text-secondary` |
| `#E5E7EB` | 12 | Table borders (`border-gray-200`) | `--gray-200` | `--color-border-default` |
| `#801B1B` | 10 | Deep chart nodes & rings | Custom | `--color-primary-dark` |
| `#111827` | 9 | Dark heading text (`text-gray-900`) | `--gray-900` | `--color-text-primary` |
| `#F8FAFC` | 6 | Page slate-50 background | `--gray-50` | `--color-bg-page` |
