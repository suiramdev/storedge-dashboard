import { gql, useMutation, useQuery } from "@apollo/client";
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
import { Button } from "@/components/ui/button";
import { CopyIcon, MoreHorizontal, PencilIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import DataTable from "@/components/layout/DataTable";
import DataTableColumnHeader from "@/components/layout/DataTable/DataTableColumnHeader";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apolloClient } from "@/lib/apollo";
import { useNavigate } from "@/router";
import { Badge } from "@/components/ui/badge";
import { Product, ProductStatus } from "@/types";

const PRODUCTS = gql`
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

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteManyProductImage(where: { product: { is: { id: { equals: $id } } } }) {
      count
    }
    deleteOneProduct(where: { id: $id }) {
      id
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
      const [deleteDialogOpened, openDeleteDialog] = useState(false);

      const { toast } = useToast();

      const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        variables: {
          id: product.id,
        },
        onCompleted: () => {
          apolloClient.refetchQueries({ include: ["Products"] });
          openDeleteDialog(false);
          toast({ title: "Product deleted" });
        },
        onError: (error) => {
          toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
        },
      });

      const navigate = useNavigate();

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
              <DropdownMenuItem onClick={() => navigate("/products/:id", { params: { id: product.id } })}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:!bg-destructive hover:!text-destructive-foreground"
                onClick={() => openDeleteDialog(true)}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={deleteDialogOpened} onOpenChange={() => openDeleteDialog(false)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure ?</DialogTitle>
                <DialogDescription>
                  This action is irreversible. All the data related to this product will be deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => openDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => deleteProduct()}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
