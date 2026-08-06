# React Hooks Lint Audit & Review Document (Phase 1B)

**Objective**: Audit all 37 React Hook lint errors (`react-hooks/set-state-in-effect` and `react-hooks/refs`) WITHOUT performing automatic fixes. Provide risk evaluation and proposed refactoring strategies for user review.

---

## 1. Category 1 — `react-hooks/refs` (Ref Usage During Render)

ESLint Rule: React refs must only be accessed outside of render (in effects or event handlers). Accessing `.current` during render can lead to stale UI or missed updates.

### Occurrence 1: `src/features/telecaller/voice/hooks/useVoiceDevice.js`
- **Location**: Lines 46-49
- **Code Snippet**:
  ```javascript
  return { 
    isInitialized: initialized.current,
    disconnectAll: () => voiceManager.disconnectAll() 
  };
  ```
- **Why ESLint Reports It**: `initialized.current` is dereferenced directly in the hook return body during component rendering.
- **Is it a Bug?**: Low probability of runtime crash, but high architectural risk. If `initialized.current` changes, React will not trigger a re-render.
- **Is it Intentional?**: Written as a synchronous status getter for Twilio device state.
- **Safest Refactoring Strategy**: Maintain state in a `useState(initialized.current)` synchronization effect, or export a stable getter function `getIsInitialized: () => initialized.current`.
- **Behavioral Risk**: 🟡 Moderate (Refactoring requires verifying voice status indicator UI on telecaller dialer).

---

## 2. Category 2 — `react-hooks/set-state-in-effect` (Synchronous `setState` in `useEffect`)

ESLint Rule: Synchronous `setState` calls in `useEffect` bodies trigger cascading re-renders and can degrade rendering performance.

### Occurrence Group A: Dialog Reset Effects
1. `src/features/users/components/dialogs/AddUserDialog.jsx` (Line 44: `setForm(initialForm)`)
2. `src/features/users/components/dialogs/EditUserDialog.jsx` (Line 43: `setForm(...)`)
- **Why ESLint Reports It**: Calling `setForm(...)` synchronously when `open` prop changes.
- **Is it a Bug?**: No. It is a standard pattern for resetting form state when a modal opens/closes.
- **Is it Intentional?**: Yes, intended to sync local form state with dialog open state.
- **Safest Refactoring Strategy**: Key the modal instance on `user.slNo` or reset form state inside dialog `onClose` handlers instead of an effect.
- **Behavioral Risk**: 🟢 Low.

### Occurrence Group B: External Prop Syncing
3. `src/features/users/components/ui/StatusToggle.jsx` (Line 13: `setIsActive(user.status === "ACTIVE")`)
4. `src/features/telecaller/voice/hooks/useVoicePermissions.js` (Line 25: `setPermission(...)`)
- **Why ESLint Reports It**: Synchronizing state from incoming props inside `useEffect`.
- **Is it a Bug?**: No, but redundant. In React 18+, derived state should be computed directly during render (`const isActive = user.status === "ACTIVE";`).
- **Is it Intentional?**: Yes, written to keep toggle switch in sync with server status.
- **Safest Refactoring Strategy**: Remove internal state and derive `isActive` directly from prop, or key the toggle switch component.
- **Behavioral Risk**: 🟢 Low.

---

## 3. Summary & Recommendation
None of the 37 hook warnings represent immediate crash bugs, but refactoring them will eliminate cascading renders. Because behavioral changes are frozen in Stage 14, **zero automated fixes were executed**. These refactorings are documented here for future feature maintenance sprints.
