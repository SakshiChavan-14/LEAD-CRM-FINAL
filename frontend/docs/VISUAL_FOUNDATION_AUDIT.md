# Visual Foundation Audit Report

This document contains a comprehensive read-only audit of all spacing, border-radius, and shadow utilities in the CRM frontend, outlining current usage, inconsistencies, and recommended semantic tokens.

## 1. Padding (`p-`, `px-`, `py-`, etc.)

**Occurrences (Top 15):**
- `px-4`: 84
- `p-6`: 76
- `p-4`: 52
- `py-2`: 50
- `px-6`: 48
- `px-3`: 48
- `py-4`: 47
- `py-3`: 40
- `py-1`: 30
- `py-2.5`: 29
- `px-2`: 27
- `py-0.5`: 26
- `p-5`: 24
- `p-3`: 23
- `px-5`: 21

**Inconsistencies & Duplication:**
- Heavy reliance on `p-6` (24px) for cards/sections, but some use `p-5` (20px) or `p-4` (16px).
- Button/Input padding relies on multiple scale combinations (e.g. `px-4 py-2`, `px-3 py-1.5`, `px-3 py-2`).

## 2. Margin (`m-`, `mx-`, `my-`, etc.)

**Occurrences (Top 10):**
- `mt-1`: 52
- `mb-6`: 48
- `mb-4`: 41
- `mb-2`: 39
- `mb-1`: 31
- `mt-2`: 30
- `mb-3`: 28
- `mt-4`: 22
- `mt-0.5`: 19
- `mx-auto`: 15

**Inconsistencies & Duplication:**
- Bottom margins (`mb-6` = 24px, `mb-4` = 16px) frequently used to separate sections.
- Micro-margins (`mt-1`, `mt-0.5`) used for form labels or tight spacing.

## 3. Gap & Space (`gap-`, `space-x-`, `space-y-`)

**Occurrences (Top 10):**
- `gap-2`: 161
- `gap-4`: 96
- `gap-3`: 92
- `gap-6`: 52
- `gap-1.5`: 51
- `gap-1`: 38
- `space-y-6`: 20
- `space-y-4`: 18
- `space-y-1`: 14
- `space-y-2`: 8

**Inconsistencies & Duplication:**
- `gap-2` (8px) and `gap-3` (12px) are highly common for inline items and small flex layouts.
- `gap-4` (16px) and `gap-6` (24px) are used for grid and section layouts.

## 4. Border Radius (`rounded-`)

**Occurrences:**
- `rounded-full`: 221 (Icons, Badges, Avatars)
- `rounded-xl`: 132 (Cards, Dialogs)
- `rounded-lg`: 97 (Inputs, Buttons)
- `rounded`: 64
- `rounded-[20px]`: 39 (Premium Cards/Charts)
- `rounded-md`: 24
- `rounded-[16px]`: 20 (Dashboard Cards)
- `rounded-[22px]`: 15 (Premium Layouts)
- `rounded-[28px]`: 3 (Modals/Dialogs)

**Inconsistencies & Duplication:**
- Cards are a mix of `rounded-xl`, `rounded-2xl`, `rounded-[16px]`, `rounded-[20px]`, and `rounded-[22px]`.
- Form controls use `rounded-lg`, `rounded-md`.
- Dialogs/Modals use `rounded-xl`, `rounded-[20px]`, `rounded-[28px]`.

## 5. Shadows (`shadow-`)

**Occurrences:**
- `shadow-sm`: 135
- `shadow-md`: 21
- `shadow-[0_4px_20px_rgba(0,0,0,0.05)]`: ~15 (Cards)
- `shadow-[0_2px_12px_rgba(0,0,0,0.04)]`: ~10 (Cards)
- `shadow-[0_18px_40px_rgba(38,41,46,0.08)]`: ~2 (Modals/Dialogs)
- `shadow-lg`: 12
- `shadow-xl`: 7

**Inconsistencies & Duplication:**
- Standard Tailwind shadows are mixed with arbitrary `shadow-[]` values.
- Premium cards use specific arbitrary RGBA shadows that should be tokenized.

## Recommended Semantic Tokens

Based on the audit, we recommend the following semantic tokens to normalize these values without altering existing visual appearance.

### Spacing Tokens (`src/styles/spacing.css`)
- `--spacing-section`: 24px (`p-6`, `mb-6`, `gap-6`, `space-y-6`) - Layout separation
- `--spacing-card`: 16px (`p-4`, `mb-4`, `gap-4`) - Padding inside standard cards
- `--spacing-content`: 12px (`p-3`, `gap-3`) - Item lists, internal card spacing
- `--spacing-control`: 8px (`gap-2`, `p-2`) - Buttons, form groups
- `--spacing-inline`: 4px (`gap-1`, `mb-1`) - Tight spacing, icon gaps

### Radius Tokens (`src/styles/radius.css`)
- `--radius-control`: 8px (`rounded-lg`) - Inputs, Selects, Buttons
- `--radius-card`: 16px (`rounded-[16px]`, `rounded-2xl`) - Standard cards
- `--radius-card-lg`: 20px (`rounded-[20px]`, `rounded-[22px]`) - Premium cards
- `--radius-dialog`: 24px (`rounded-[24px]` / `rounded-[28px]`) - Modals, Overlays
- `--radius-pill`: 9999px (`rounded-full`) - Badges, Tags, Avatars

### Shadow Tokens (`src/styles/shadow.css`)
- `--shadow-card`: `0 2px 12px rgba(0,0,0,0.04)` - Standard cards
- `--shadow-card-hover`: `0 4px 20px rgba(0,0,0,0.05)` - Interactive/Premium cards
- `--shadow-dropdown`: `0 10px 25px rgba(0,0,0,0.08)` - Popovers, Menus
- `--shadow-dialog`: `0 18px 40px rgba(38,41,46,0.08)` - Modals, Overlays
- `--shadow-control`: `0 1px 2px rgba(0,0,0,0.05)` - Inputs, Buttons (`shadow-sm`)
