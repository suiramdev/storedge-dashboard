import { ProductOption, ProductOptionValue } from "@/types";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { v4 as uuid } from "uuid";
import { PlusIcon } from "lucide-react";
import ProductOptionLine from "./ProductOptionLine";
import clsx from "clsx";

interface ProductVariantsCardProps {
  onOptionDeleted?: (option: ProductOption) => void;
  onOptionValueDeleted?: (value: ProductOptionValue) => void;
}

function ProductVariantsCard({ onOptionDeleted, onOptionValueDeleted }: ProductVariantsCardProps) {
  const form = useFormContext();
  const options = useFieldArray({ control: form.control, name: "options" });

  return (
    <div className="col-span-3 rounded-lg border bg-background px-4 py-6">
      <div className="flex justify-between">
        <span className="text-sm font-semibold">Variants</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => options.append({ id: uuid(), name: "", values: [] })}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add option
        </Button>
      </div>
      <div className="divide-y">
        {options.fields.map((field, index) => (
          <ProductOptionLine
            index={index}
            className={clsx(index < options.fields.length - 1 ? "py-4" : "pt-4")}
            key={field.id}
            onDeleted={onOptionDeleted}
            onValueDeleted={onOptionValueDeleted}
            expand={field.name.length <= 0 || field.values.length <= 0}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductVariantsCard;
