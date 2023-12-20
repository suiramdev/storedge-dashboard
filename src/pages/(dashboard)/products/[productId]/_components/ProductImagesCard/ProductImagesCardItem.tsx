import { ProductImage } from "@/types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVerticalIcon } from "lucide-react";
import clsx from "clsx";

interface ProductImagesCardItem {
  image: ProductImage;
  onCheckedChange?: (value: boolean, image: ProductImage) => void;
  draggable?: boolean;
}

function ProductImagesCardItem({ image, onCheckedChange, draggable = true }: ProductImagesCardItem) {
  const [checked, setChecked] = useState(false);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCheckedChange = (value: boolean) => {
    setChecked(value);
    onCheckedChange?.(value, image);
  };

  return (
    <div
      ref={setNodeRef}
      className="group relative overflow-hidden rounded-lg border bg-background first:col-span-2 first:row-span-2"
      style={style}
    >
      <img className="h-full w-full object-contain object-center" src={image.file.url} alt={image.alt} />
      <div
        className={clsx(
          "absolute left-0 top-0 h-full w-full bg-secondary/50",
          checked ? "visible" : "invisible group-hover:visible",
        )}
      >
        {draggable && !checked && (
          <Button
            ref={setActivatorNodeRef}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 hover:cursor-grab hover:active:cursor-grabbing"
            type="button"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="h-4 w-4" />
          </Button>
        )}
        <div className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center">
          <Checkbox aria-label="Select image" onCheckedChange={handleCheckedChange} />
        </div>
      </div>
    </div>
  );
}

export default ProductImagesCardItem;