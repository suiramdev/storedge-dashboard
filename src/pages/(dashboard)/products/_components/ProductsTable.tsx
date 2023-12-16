import { gql, useQuery } from "@apollo/client";
import { useSession } from "@/providers/session";
import { createColumnHelper } from "@tanstack/react-table";
import { Product, ProductStatus } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link } from "@/router";
import { Button } from "@/components/ui/button";
import { CopyIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import DataTable from "@/components/layout/DataTable";
import DataTableColumnHeader from "@/components/layout/DataTable/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import DeleteProductDialog from "@/components/dialogs/DeleteProductDialog";
import DeleteProductsDialog from "@/components/dialogs/DeleteProductsDialog";

const PRODUCTS = gql`
  query Products($where: ProductWhereInput) {
    products(where: $where) {
      id
      images(orderBy: [{ orderIndex: asc }], take: 1) {
        file {
          url
        }
        alt
      }
      name
      avgPrice
      stock
      store {
        currencyCode
      }
      status
    }
  }
`;

const columnHelper = createColumnHelper<Product>();

const columns = [
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
      getValue() && (
        <img src={getValue()!.file.url} alt={getValue()!.alt} className="h-8 w-8 rounded-sm object-cover" />
      ),
  }),
  columnHelper.accessor("name", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  }),
  columnHelper.accessor("avgPrice", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Average price" />,
    cell: ({ row, getValue }) => (
      <span>
        {getValue()
          ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: row.original.store?.currencyCode }).format(
              getValue()!,
            )
          : "-"}
      </span>
    ),
  }),
  columnHelper.accessor("stock", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
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

      const [deleteDialogOpened, openDeleteDialog] = useState(false);

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to="/products/:productId" params={{ productId: product.id }}>
                <DropdownMenuItem>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="hover:!bg-destructive hover:!text-destructive-foreground"
                onClick={() => openDeleteDialog(true)}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteProductDialog id={product.id} open={deleteDialogOpened} onOpenChange={openDeleteDialog} />
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
      rowsActions={(selectedRows) => (
        <DeleteProductsDialog ids={selectedRows.map((row) => row.original.id)}>
          <Button
            variant="outline"
            className="hover:border-destructive hover:!bg-destructive hover:!text-destructive-foreground"
          >
            <TrashIcon className="mr-2 h-4 w-4" />
            Delete selected products
          </Button>
        </DeleteProductsDialog>
      )}
      paginated
    />
  );
}

export default ProductsTable;
