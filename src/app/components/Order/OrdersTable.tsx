"use client";

import { ordersRow, ordersColumns } from "@/types/tables/orders";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Table from "@/app/components/Table";

type Props = {
  data: ordersRow[];
};

export default function OrdersTable({ data }: Props) {
  const table = useReactTable({
    data,
    columns: ordersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-6 shadow">
      <Table table={table} rowsHref={(row) => `/orders/${row.original.id}`} />
      {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
        <div className="flex gap-2">
          <button className="btn btn-secondary">Archive selected orders</button>
        </div>
      )}
    </div>
  );
}
