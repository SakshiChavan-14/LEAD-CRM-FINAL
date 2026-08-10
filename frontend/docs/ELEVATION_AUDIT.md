# Sprint 18 — Shadow & Elevation System Audit

## 1. Current Shadow Usage Inventory

Audit of 354 shadow instances across `frontend/src/`:

### Tailwind Standard Shadow Classes
| Class | Occurrences | Typical Components | Proposed Semantic Token |
| :--- | :--- | :--- | :--- |
| `shadow-sm` | 129 | Form controls, small badges, base cards | `--shadow-card` |
| `shadow` | 26 | Standard cards, header bars | `--shadow-surface` |
| `shadow-md` | 19 | Hover cards, dropdown menus, popovers | `--shadow-dropdown` / `--shadow-card-hover` |
| `shadow-lg` | 12 | Select dropdowns, floating action menus | `--shadow-floating` |
| `shadow-xl` | 7 | Slide-over drawers, alert modals | `--shadow-dialog` |
| `shadow-2xl` | 6 | Main application modal dialogs | `--shadow-modal` |

### Arbitrary Custom Shadows (Raw CSS strings)
| Raw Arbitrary Shadow String | Frequency | Usage Location | Proposed Token |
| :--- | :--- | :--- | :--- |
| `shadow-[0_4px_20px_rgba(0,0,0,0.05)]` | 15 | Telecaller & User profile card headers | `--shadow-card-elevated` |
| `shadow-[0_2px_12px_rgba(0,0,0,0.04)]` | 17 | CRM summary stat cards | `--shadow-card` |
| `shadow-[0_4px_16px_rgba(0,0,0,0.08)]` | 1 | Header dropdown popups | `--shadow-dropdown` |
| `shadow-[0_18px_40px_rgba(38,41,46,0.08)]` | 1 | Dialog overlay panels | `--shadow-dialog` |
| `shadow-[0_0_15px_rgba(239,68,68,0.3)]` | 2 | High priority alert badges | `--shadow-glow-danger` |

---

## 2. Classification by Surface Type

| Surface Category | Current Shadow Classes Used | Recommended Standard Elevation Token |
| :--- | :--- | :--- |
| **Surface / Card** | `shadow-sm`, `shadow`, `shadow-[0_2px_12px_rgba(0,0,0,0.04)]` | `var(--shadow-card)` |
| **Hover Surface** | `hover:shadow-md`, `shadow-[0_4px_20px_rgba(0,0,0,0.05)]` | `var(--shadow-card-hover)` |
| **Dropdown / Menu** | `shadow-md`, `shadow-lg`, `shadow-[0_4px_16px_rgba(0,0,0,0.08)]` | `var(--shadow-dropdown)` |
| **Dialog / Modal** | `shadow-xl`, `shadow-2xl`, `shadow-[0_18px_40px_rgba(...)]` | `var(--shadow-dialog)` |
| **Popover / Floating** | `shadow-md` | `var(--shadow-popover)` |
| **Tooltip** | `shadow-sm` | `var(--shadow-tooltip)` |
| **Overlay / Drawer** | `shadow-2xl` | `var(--shadow-overlay)` |

---

## 3. Recommended Elevation Tokens (`src/styles/elevation.css`)

```css
:root {
  --shadow-card: 0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05);
  --shadow-card-hover: 0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
  --shadow-dropdown: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
  --shadow-dialog: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06);
  --shadow-popover: 0 4px 6px -1px rgba(15, 23, 42, 0.08);
  --shadow-tooltip: 0 2px 4px 0 rgba(15, 23, 42, 0.06);
}
```
