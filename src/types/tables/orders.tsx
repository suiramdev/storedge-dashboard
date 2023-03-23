import { createColumnHelper } from "@tanstack/react-table";
import Checkbox from "@/app/components/Checkbox";
import Dropdown from "@/app/components/Dropdown";
import {
  HiArchive,
  HiOutlineDotsVertical,
  HiPencil,
  HiTrash,
} from "react-icons/hi";

export type ordersRow = {
  id: string;
  customer: string;
  total: number;
  status: string;
};

const columnHelper = createColumnHelper<ordersRow>();

export const ordersColumns = [
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
        <Dropdown button={<HiOutlineDotsVertical size={24} />}>
          <Dropdown.Item>
            <HiPencil />
            Edit
          </Dropdown.Item>
          <Dropdown.Item>
            <HiArchive />
            Archive
          </Dropdown.Item>
        </Dropdown>
      </div>
    ),
  }),
];
