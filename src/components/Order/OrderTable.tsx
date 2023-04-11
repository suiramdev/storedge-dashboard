import { createColumnHelper } from "@tanstack/react-table";
import { Column } from "@/types/tables/default";
import { OrderRow, OrderStatus } from "@/types/tables/order";
import Checkbox from "@/components/Checkbox";
import Dropdown from "@/components/Dropdown";
import { HiArchive, HiDotsVertical, HiPencil } from "react-icons/hi";
import Table from "@/components/Table";
import StatusBadge, { Status } from "../StatusBadge";

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
    cell: ({ getValue }) => {
      switch (getValue()) {
        case OrderStatus.PENDING:
          return <StatusBadge status={Status.ERROR}>Pending</StatusBadge>;
        case OrderStatus.PROCESSING:
          return <StatusBadge status={Status.WARNING}>Processing</StatusBadge>;
        default:
          return <StatusBadge status={Status.SUCCESS}>Completed</StatusBadge>;
      }
    },
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

function OrderTable({ data }: Props) {
  return <Table data={data} columns={columns} />;
}

export default OrderTable;
