import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";

interface DataTableViewOptionsProps<TData> extends React.HTMLAttributes<HTMLInputElement> {
  table: Table<TData>;
  columnId: string;
}

export function DataTableSearchFilter<TData>({ table, columnId, ...props }: DataTableViewOptionsProps<TData>) {
  return (
    <Input
      {...props}
      value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ""}
      onChange={(event) => table.getColumn(columnId)?.setFilterValue(event.target.value)}
      className="max-w-sm"
    />
  );
}
