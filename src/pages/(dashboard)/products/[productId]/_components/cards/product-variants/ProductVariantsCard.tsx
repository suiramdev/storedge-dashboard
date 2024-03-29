import { ProductVariant } from "@/types";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { v4 as uuid } from "uuid";
import { PlusIcon } from "lucide-react";
import { ProductVariantsTable } from "./ProductVariantsTable";

interface ProductVariantsCardProps {
  onVariantRemoved?: (variant: ProductVariant) => void;
}

export function ProductVariantsCard({ onVariantRemoved }: ProductVariantsCardProps) {
  const form = useFormContext();
  const variants = useFieldArray({ control: form.control, name: "variants" });

  return (
    <div className="rounded-lg border bg-background px-4 py-6">
      <div className="flex justify-between">
        <span className="text-sm font-semibold">Variants</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            variants.append({
              id: uuid(),
              name: "",
              description: "",
              price: form.getValues("price"),
              stock: 0,
              newlyAdded: true,
            })
          }
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add variant
        </Button>
      </div>
      <div className="divide-y"></div>
      <ProductVariantsTable onVariantRemoved={onVariantRemoved} />
    </div>
  );
}
