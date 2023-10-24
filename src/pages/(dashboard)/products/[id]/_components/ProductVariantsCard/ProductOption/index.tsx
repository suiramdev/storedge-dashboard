import { useFormContext, useFieldArray } from "react-hook-form";
import { useState } from "react";
import ProductOptionExpanded from "./ProductOptionExpanded";
import ProductOptionNonExpanded from "./ProductOptionNonExpanded";

interface ProductOptionProps {
  index: number;
  expand?: boolean;
  className?: string;
}

function ProductOption({ index, expand = false, ...props }: ProductOptionProps) {
  const [expanded, setExpanded] = useState(expand);
  const form = useFormContext();
  const options = useFieldArray({ control: form.control, name: "options" });

  const onDelete = () => {
    options.remove(index);
  };

  return expanded ? (
    <ProductOptionExpanded
      index={index}
      onSave={() => setExpanded(false)}
      onDelete={onDelete}
      {...props}
    />
  ) : (
    <ProductOptionNonExpanded
      index={index}
      onEdit={() => setExpanded(true)}
      onDelete={onDelete}
      {...props}
    />
  );
}

export default ProductOption;
