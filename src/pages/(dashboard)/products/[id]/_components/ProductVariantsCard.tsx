import * as z from "zod";
import { ProductOption, productVariantSchema } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DataTable from "@/components/layout/DataTable";
import { useMemo } from "react";

const columnHelper = createColumnHelper<z.infer<typeof productVariantSchema>>();

function ProductVariantsCard() {
  const form = useFormContext();

  const variants = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const columns = useMemo(() => {
    const optionColumns = form.getValues("options").map((option: ProductOption) => {
      if (option.name.length <= 0) return null;
      return columnHelper.display({
        id: option.name,
        header: () => <span>{option.name}</span>,
      });
    });

    return [
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => {
          const form = useFormContext();

          return (
            <FormField
              control={form.control}
              name={`variants.${row.index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="Variant name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        },
      }),
      ...optionColumns,
      columnHelper.display({
        id: "actions",
        cell: () => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="hover:!bg-destructive hover:!text-destructive-foreground">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      }),
    ];
  }, [form.watch("options")]);

  return (
    <div className="col-span-3 space-y-4 rounded-lg border bg-background px-4 py-6">
      <div className="flex justify-between">
        <span className="text-sm font-semibold">Variants</span>
        <Button variant="ghost" size="sm" type="button" onClick={() => variants.append({})}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add variant
        </Button>
      </div>
      <DataTable columns={columns} data={form.getValues("variants")} />
    </div>
  );
}

export default ProductVariantsCard;
