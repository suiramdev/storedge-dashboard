"use client";

import { productsColumns, productsRow } from "@/types/tables/products";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Table from "@/app/components/Table";

type Props = {
  data: productsRow[];
};

export default function ProductsTable({ data }: Props) {
  const table = useReactTable({
    data,
    columns: productsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 rounded border border-gray-200 bg-white p-6 shadow">
      <Table table={table} rowsHref={(row) => `/products/${row.original.id}`} />
      {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
        <div className="flex gap-2">
          <button className="btn btn-secondary">
            Delete selected products
          </button>
        </div>
      )}
    </div>
  );
}
