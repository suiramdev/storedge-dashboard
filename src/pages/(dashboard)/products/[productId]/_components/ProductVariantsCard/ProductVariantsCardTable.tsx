import { createColumnHelper } from "@tanstack/react-table";
import { ProductVariant } from "@/types";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DataTable, DataTableColumnHeader } from "@/components/layout/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "@/router";
import { CopyIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";

const columnHelper = createColumnHelper<ProductVariant>();

interface ProductVariantsCardTableProps {
  onVariantRemoved?: (variant: ProductVariant) => void;
}

function ProductVariantsCardTable({ onVariantRemoved }: ProductVariantsCardTableProps) {
  const form = useFormContext();
  const variants = form.watch("variants");

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
          const form = useFormContext();

          return (
            <div className="flex items-center space-x-4">
              {row.original.newlyAdded && <Badge className="h-fit">New</Badge>}
              <FormField
                control={form.control}
                name={`variants.${row.index}.name`}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        },
      }),
      columnHelper.accessor("stock", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
        cell: ({ row }) => {
          const form = useFormContext();

          return (
            <FormField
              control={form.control}
              name={`variants.${row.index}.stock`}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormControl>
                    <Input placeholder="Amount" type="number" min="0" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        },
      }),
      columnHelper.accessor("price", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
        cell: ({ row }) => {
          const form = useFormContext();

          return (
            <FormField
              control={form.control}
              name={`variants.${row.index}.price`}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormControl>
                    <Input placeholder="Amount" type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        },
      }),
      columnHelper.display({
        id: "edit",
        header: undefined,
        cell: ({ row }) => {
          const { productId } = useParams("/products/:productId");
          const form = useFormContext();
          const variants = useFieldArray({ control: form.control, name: "variants" });

          const handleRemove = () => {
            variants.remove(row.index);
            onVariantRemoved?.(row.original);
          };

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
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original.id)}>
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Copy variant ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={row.original.newlyAdded} asChild>
                    <Link to="/products/:productId/:variantId" params={{ productId, variantId: row.original.id }}>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:!bg-destructive hover:!text-destructive-foreground"
                    onClick={handleRemove}
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
    ],
    [variants],
  );

  return <DataTable className="pt-4" data={variants} columns={columns} />;
}

export default ProductVariantsCardTable;
