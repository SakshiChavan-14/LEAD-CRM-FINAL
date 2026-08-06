# 3. CRM Domain Components

## Context
CRM applications require shared visual identity elements (status badges, layout wrappers, KPI overlays) that are more specialized than generic UI buttons but broader than a single feature.

## Decision
We establish `src/components/crm/` as a dedicated layer for CRM domain layout primitives and reusable CRM visual indicators.

## Consequences
- Prevents clutter in `src/components/ui/`.
- Provides a centralized home for CRM design tokens and visual primitives.
