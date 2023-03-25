"use client";

import { OrderRow } from "@/types/tables/orders";
import { Column } from "@/types/tables/defaults";
import { createColumnHelper } from "@tanstack/react-table";
import Checkbox from "@/app/components/Checkbox";
import Dropdown from "@/app/components/Dropdown";
import { HiArchive, HiDotsVertical, HiPencil } from "react-icons/hi";
import Table from "@/app/components/Table";

const columnHelper = createColumnHelper<OrderRow>();

export const columns: Column<OrderRow>[] = [
  columnHelper.accessor("id", {
    header: ({ table }) => (
      <div className="flex items-center gap-12">
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
        <span>Order</span>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-12">
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
        <span>#{getValue()}</span>
      </div>
    ),
  }),
  columnHelper.accessor("customer", {
    header: "Customer",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  }),
  columnHelper.accessor("total", {
    header: "Total",
    cell: ({ getValue }) => <span>${getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <span>{getValue()}</span>,
  }),
  columnHelper.display({
    id: "more",
    cell: () => (
      <div className="flex items-center justify-end">
        <Dropdown
          button={<HiDotsVertical className="text-gray-500" size={24} />}
        >
          <Dropdown.Item>
            <HiPencil size={16} />
            Edit
          </Dropdown.Item>
          <Dropdown.Item>
            <HiArchive size={16} />
            Archive
          </Dropdown.Item>
        </Dropdown>
      </div>
    ),
  }),
];

type Props = {
  data: OrderRow[];
};

export default function ProductsTable({ data }: Props) {
  return <Table data={data} columns={columns} />;
}
