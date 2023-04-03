"use client";

import { Row, Column } from "@/types/tables/defaults";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useRouter } from "next/navigation";

type Props = {
  data: Row[];
  columns: Column[];
};

export default function Table({ data, columns }: Props) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
              row.getIsSelected() && "bg-indigo-50",
              data[row.index].href &&
                (row.getIsSelected()
                  ? "hover:cursor-pointer hover:bg-indigo-100"
                  : "hover:cursor-pointer hover:bg-gray-50")
            )}
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="px-6 py-2"
                onClick={() =>
                  data[row.index].href && router.replace(data[row.index].href!)
                }
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
