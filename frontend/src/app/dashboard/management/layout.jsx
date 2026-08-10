import { TableScrollProvider } from "@/providers/TableScrollProvider";

export default function ManagementLayout({ children }) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TableScrollProvider>
        {children}
      </TableScrollProvider>
    </div>
  );
}
