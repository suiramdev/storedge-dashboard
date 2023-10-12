import { gql, useQuery } from "@apollo/client";
import { useSession } from "@/providers/session";
import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useModals } from "@/router";
import { Button } from "@/components/ui/button";
import { CopyIcon, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import DataTable from "@/components/layout/DataTable";
import DataTableColumnHeader from "@/components/layout/DataTable/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Product, ProductStatus } from "@/types";

export const PRODUCTS = gql`
  query Products($where: ProductWhereInput) {
    products(where: $where) {
      id
      images(take: 1) {
        src
        alt
      }
      name
      avgPrice
      store {
        currencyCode
      }
      status
    }
  }
`;

const columnHelper = createColumnHelper<Product>();

export const columns = [
  columnHelper.display({
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
  }),
  columnHelper.accessor((row) => row.images[0], {
    id: "image",
    header: undefined,
    cell: ({ getValue }) =>
      getValue() && <img src={getValue()!.src} alt={getValue()!.alt} className="h-8 w-8 rounded-full" />,
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  }),
  columnHelper.accessor("avgPrice", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Average price" />,
    cell: ({ row, getValue }) => (
      <span>
        {getValue()
          ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: row.original.store.currencyCode }).format(
              getValue()!,
            )
          : "-"}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => (
      <Badge variant={getValue() === ProductStatus.PUBLISHED ? "default" : "outline"}>{getValue()}</Badge>
    ),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      const modals = useModals();

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
              <Link to="/products/:id" params={{ id: product.id }}>
                <DropdownMenuItem>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="hover:!bg-destructive hover:!text-destructive-foreground"
                onClick={() => modals.open("/products/[id]/delete", { state: { product: { id: product.id } } })}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  }),
];

function ProductsTable() {
  const selectedStoreId = useSession((state) => state.selectedStoreId);
  const { data } = useQuery(PRODUCTS, {
    variables: {
      where: {
        storeId: {
          equals: selectedStoreId,
        },
      },
    },
  });

  return (
    <DataTable
      columns={columns}
      data={data ? data.products : []}
      search={{ columnId: "name", placeholder: "Search by name" }}
      viewable
      paginated
    />
  );
}

export default ProductsTable;
