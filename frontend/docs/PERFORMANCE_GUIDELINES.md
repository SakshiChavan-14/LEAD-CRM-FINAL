# Performance Guidelines & Engineering Philosophy

## Core Principles
1. **Measure Before Optimizing**: Never introduce memoization, dynamic imports, or custom caching without empirical profiling data.
2. **Profile First**: Use the React DevTools Profiler and `@next/bundle-analyzer` to justify performance changes.
3. **Avoid Premature Optimization**: Do not wrap components in `React.memo` or functions in `useCallback` by default.

## Rules & Standards
- **Component Memoization (`React.memo`)**: Only introduce `React.memo` when React Profiler proves a component re-renders excessively AND its props are referentially stable.
- **Callback Stability (`useCallback`)**: Only use `useCallback` when passing callbacks to memoized child components or when included in hook dependency arrays.
- **Derived State Over Duplicated State**: Prefer calculating derived values directly during render over syncing state inside `useEffect` bodies.
- **Dynamic Imports (`next/dynamic`)**: Measure bundle sizes before dynamically importing components. Only dynamic-import heavy components that are rarely opened (e.g. specialized export dialogs) to avoid first-click latency penalties.
- **Data Caching**: Prefer React Query (`@tanstack/react-query`) automatic caching over custom client-side caching implementations.
- **Table Optimization Steps**:
  1. Profile rendering bottlenecks first.
  2. Memoize row renderers if re-renders are proven expensive.
  3. Virtualize long lists (`@tanstack/react-virtual`) if DOM node count is high.
  4. Implement server-side pagination for large datasets.
