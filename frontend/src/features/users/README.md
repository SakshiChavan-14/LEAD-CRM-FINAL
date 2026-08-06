# Users Feature Domain

## Overview
Handles management user directory, employee creation/edit dialogs, role assignment, and user status toggling.

## Responsibilities
- Rendering user management table.
- Form handling and validation inside `AddUserDialog` and `EditUserDialog`.
- React Query mutations for user lifecycle and status management.

## Key Entry Points
- `UserDirectoryTable.jsx` — User directory table.
- `AddUserDialog.jsx` & `EditUserDialog.jsx` — User creation & editing modals.
- `useUsers.js` & `usersService.js` — Data fetching & mutation services.
