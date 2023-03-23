import { createColumnHelper } from "@tanstack/react-table";
import Checkbox from "@/app/components/Checkbox";
import Dropdown from "@/app/components/Dropdown";
import { HiArchive, HiDotsVertical, HiPencil, HiTrash } from "react-icons/hi";

export type productsRow = {
  id: string;
  name: string;
};

const columnHelper = createColumnHelper<productsRow>();

export const productsColumns = [
  columnHelper.accessor("name", {
    header: ({ table }) => (
      <div className="flex items-center gap-12">
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          indeterminate={table.getIsSomeRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
        <div className="w-12" />
        <span>Name</span>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-12">
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
        <div className="w-12">
          <img
            src="https://via.placeholder.com/48"
            className="aspect-square h-full rounded-lg"
          />
        </div>
        <span>{getValue()}</span>
      </div>
    ),
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
          <Dropdown.Item>
            <HiTrash size={16} />
            Delete
          </Dropdown.Item>
        </Dropdown>
      </div>
    ),
  }),
];
