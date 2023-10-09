import { gql, useQuery } from "@apollo/client";
import { useSession } from "@/components/providers/SessionProvider";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import DataTable from "@/components/layout/DataTable";
import DataTableColumnHeader from "@/components/layout/DataTable/DataTableColumnHeader";
import { CopyIcon, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PRODUCTS = gql`
  query Products($where: ProductWhereInput) {
    products(where: $where) {
      id
      name
    }
  }
`;

type Product = {
  id: string;
  name: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:!bg-destructive hover:!text-destructive-foreground">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

function ProductsTable() {
  const { selectedStoreID } = useSession();
  const { data } = useQuery(PRODUCTS, {
    variables: {
      where: {
        storeId: selectedStoreID,
      },
    },
  });

  return (
    <DataTable
      columns={columns}
      data={data || []}
      search={{ columnId: "name", placeholder: "Search by name" }}
      viewable
      paginated
    />
  );
}

export default ProductsTable;
