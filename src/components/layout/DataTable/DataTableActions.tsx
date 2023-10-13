import { Table } from "@tanstack/react-table";

interface DataTableActionsProps<TData> {
  table: Table<TData>;
  children: React.ReactNode;
}

function DataTableActions<TData>({ children, table }: DataTableActionsProps<TData>) {
  return (
    table.getSelectedRowModel().rows.length > 0 && (
      <div className="sticky bottom-0 left-1/2 flex w-fit -translate-x-1/2 flex-wrap gap-2 rounded-sm bg-background p-2">
        {children}
      </div>
    )
  );
}

export default DataTableActions;
