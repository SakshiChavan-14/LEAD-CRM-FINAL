"use client";

import { useState } from "react";
import UsersTable from "@/features/users/components/directory/UsersTable";
import AddUserDialog from "@/features/users/components/dialogs/AddUserDialog";
import UserDirectoryHeader from "@/features/users/components/directory/UserDirectoryHeader";

export default function UserDirectoryPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <>
      <UserDirectoryHeader onAddClick={() => setIsAddOpen(true)} />
      <UsersTable />
      
      <AddUserDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </>
  );
}
