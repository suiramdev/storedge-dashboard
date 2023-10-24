import { ProductOption, ProductOptionValue } from "@/types";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useState } from "react";
import ProductOptionExpanded from "./ProductOptionExpanded";
import ProductOptionNonExpanded from "./ProductOptionNonExpanded";

interface ProductOptionLineProps {
  index: number;
  onDeleted?: (option: ProductOption) => void;
  onValueDeleted?: (value: ProductOptionValue) => void;
  expand?: boolean;
  className?: string;
}

function ProductOptionLine({ index, onDeleted, onValueDeleted, expand = false, ...props }: ProductOptionLineProps) {
  const [expanded, setExpanded] = useState(expand);
  const form = useFormContext();
  const options = useFieldArray({ control: form.control, name: "options" });

  const handleDelete = (option: ProductOption) => {
    options.remove(index);
    onDeleted?.(option);
  };

  return expanded ? (
    <ProductOptionExpanded
      index={index}
      onSaved={() => setExpanded(false)}
      onDeleted={handleDelete}
      onValueDeleted={onValueDeleted}
      {...props}
    />
  ) : (
    <ProductOptionNonExpanded
      index={index}
      onEdited={() => setExpanded(true)}
      onDeleted={handleDelete}
      {...props}
    />
  );
}

export default ProductOptionLine;
