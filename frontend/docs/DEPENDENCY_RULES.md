# Dependency Rules

## Allowed Imports Matrix
| Importing File Location | May Import From |
| :--- | :--- |
| `src/app/` (Pages/Layouts) | `src/features/*`, `src/components/*`, `src/config/*`, `src/lib/*` |
| `src/features/<featureA>/` | `src/features/<featureA>/*`, `src/components/*`, `src/config/*`, `src/lib/*`, `src/features/<featureB>/index.js` (Public API only) |
| `src/components/crm/` | `src/components/ui/*`, `src/components/table/*`, `src/lib/*` |
| `src/components/ui/` | `src/lib/*` (Pure presentational, zero feature dependencies) |

## Strict Prohibitions & Practical Rules
1. ❌ **No Upward Imports**: `src/components/ui` or `src/components/crm` MUST NEVER import from `src/features` or `src/app`.
2. ⚠️ **Cross-Feature Imports Rule**: Feature A should not import private implementation files from Feature B. Cross-feature imports should go through Feature B's documented public entry points. If public barrel exports are not yet adopted, limit cross-feature imports to clearly intentional, stable entry points.
3. ❌ **No Circular Dependencies**: Cyclic imports between features or hooks/services are strictly forbidden.
