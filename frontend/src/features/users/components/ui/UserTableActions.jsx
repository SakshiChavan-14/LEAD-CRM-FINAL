"use client";

import { Edit2 } from "lucide-react";
import StatusToggle from "./StatusToggle";

export default function UserTableActions({
  user,
  onEdit,
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onEdit(user)}
        className="rounded-lg p-2 text-admin-primary-text transition hover:bg-admin-primary-subtle"
        title="Edit User"
      >
        <Edit2 size={18} />
      </button>

      <StatusToggle user={user} />
    </div>
  );
}