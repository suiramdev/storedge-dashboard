import { createColumnHelper } from "@tanstack/react-table";
import Checkbox from "@/app/components/Checkbox";
import Dropdown from "@/app/components/Dropdown";
import {
  HiArchive,
  HiOutlineDotsVertical,
  HiPencil,
  HiTrash,
} from "react-icons/hi";

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
        <div className="w-[48px]" />
        <span>Name</span>
      </div>
    ),
    cell: ({ row, getValue }) => (
      <div className="flex items-center gap-12">
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
        <div className="w-[48px]">
          <img src="https://via.placeholder.com/48" className="rounded-lg" />
        </div>
        <span>{getValue()}</span>
      </div>
    ),
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
          <Dropdown.Item>
            <HiTrash />
            Delete
          </Dropdown.Item>
        </Dropdown>
      </div>
    ),
  }),
];
