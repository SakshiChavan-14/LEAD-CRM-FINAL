# Developer Contribution Standards

## Adding New Features
1. Create a dedicated folder under `src/features/<feature-name>`.
2. Follow standard subfolder layout (`components/`, `hooks/`, `services/`, `utils/`).
3. Explicitly export all public components, hooks, and services in `src/features/<feature-name>/index.js`.
4. Ensure no hardcoded color values are used; reference Tailwind design system theme variables or CSS custom properties.

## Code Quality Gates
Before submitting code:
1. Run `npm run build` to verify Next.js static generation and compilation.
2. Run `npm run lint` and verify zero new errors or circular imports.
3. Ensure no component inside `src/components/ui` imports from `@/features`.
