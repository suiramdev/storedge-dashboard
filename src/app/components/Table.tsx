"use client";

import { Table as TTable, Row, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type Props = {
  table: TTable<any>;
  rowsHref?: (row: Row<any>) => string;
};

export default function Table({ table, rowsHref }: Props) {
  const router = useRouter();

  return (
    <table className="divide-y border-gray-200 text-left">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="px-6 py-2 font-semibold">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="divide-y">
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={clsx(
              row.getIsSelected() && "!bg-indigo-50",
              rowsHref && "hover:cursor-pointer hover:bg-gray-50"
            )}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="px-6 py-2"
                onClick={() => rowsHref && router.replace(rowsHref(row))}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
