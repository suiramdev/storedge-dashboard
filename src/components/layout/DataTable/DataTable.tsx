import { useState } from "react";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
// import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DataTableSearchFilter from "./DataTableSearchFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";
import DataTablePagination from "./DataTablePagination";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  search?: {
    columnId: string;
  } & React.HTMLAttributes<HTMLInputElement>;
  viewable?: boolean;
  paginated?: boolean;
}

function DataTable<TData>({ columns, data, search, viewable, paginated }: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-2">
        <div className="flex items-center space-x-2">
          {search && <DataTableSearchFilter table={table} {...search} />}
        </div>
        <div className="flex items-center space-x-2 justify-self-end">
          {viewable && <DataTableViewOptions table={table} />}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getSelectedRowModel().rows?.length > 0 && (
        <div className="sticky bottom-0 left-1/2 flex w-fit -translate-x-1/2 flex-wrap gap-2 rounded-sm bg-background p-2">
          <Button variant="destructive" size="sm">
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete selected products
          </Button>
        </div>
      )}
      {paginated && <DataTablePagination table={table} />}
    </div>
  );
}

export default DataTable;
