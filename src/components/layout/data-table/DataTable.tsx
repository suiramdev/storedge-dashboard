import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  type Row,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTableSearchFilter } from "./DataTableSearchFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableRowsActions } from "./DataTableRowsActions";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  search?: {
    columnId: string;
  } & React.HTMLAttributes<HTMLInputElement>;
  viewable?: boolean;
  rowsActions?: (selectedRows: Row<TData>[]) => React.ReactNode;
  paginated?: boolean;
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  search,
  viewable,
  rowsActions,
  paginated,
  className,
}: DataTableProps<TData>) {
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

  // Reset row selection when data changes
  useEffect(() => {
    table.setRowSelection({});
  }, [data]);

  const rowsActionsChildren = useMemo(
    () => rowsActions && rowsActions(table.getSelectedRowModel().rows),
    [rowsActions, rowSelection],
  );

  return (
    <div className={clsx("flex flex-col space-y-4", className)}>
      {(search || viewable) && (
        <div className="grid grid-cols-2">
          <div className="flex items-center space-x-2">
            {search && <DataTableSearchFilter table={table} {...search} />}
          </div>
          <div className="flex items-center space-x-2 justify-self-end">
            {viewable && <DataTableViewOptions table={table} />}
          </div>
        </div>
      )}
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
      {rowsActionsChildren && <DataTableRowsActions table={table}>{rowsActionsChildren}</DataTableRowsActions>}
      {paginated && <DataTablePagination table={table} />}
    </div>
  );
}
