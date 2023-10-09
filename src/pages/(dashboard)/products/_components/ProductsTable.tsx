import { gql, useMutation, useQuery } from "@apollo/client";
import { useSession } from "@/components/providers/SessionProvider";
import { ColumnDef } from "@tanstack/react-table";
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

const PRODUCTS = gql`
  query Products($where: ProductWhereInput) {
    products(where: $where) {
      id
      name
      avgPrice
      store {
        currencyCode
      }
    }
  }
`;

type Product = {
  id: string;
  name: string;
  avgPrice: number;
  store: {
    currencyCode: string;
  };
};

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($where: ProductWhereUniqueInput!) {
    deleteOneProduct(where: $where) {
      id
    }
  }
`;

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
    accessorKey: "avgPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Average price" />,
    cell: ({ row, getValue }) => {
      const value = getValue() as number | null;
      return (
        <span>
          {value &&
            new Intl.NumberFormat("fr-FR", { style: "currency", currency: row.original.store.currencyCode }).format(
              value,
            )}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      const [deleteDialogOpened, openDeleteDialog] = useState(false);

      const { toast } = useToast();

      const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        variables: {
          where: {
            id: product.id,
          },
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
                  This action cannot be undone. This will permanently delete the product.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => openDeleteDialog(false)}>
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
  },
];

function ProductsTable() {
  const { selectedStoreID } = useSession();
  const { data } = useQuery(PRODUCTS, {
    variables: {
      where: {
        storeId: {
          equals: selectedStoreID,
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
