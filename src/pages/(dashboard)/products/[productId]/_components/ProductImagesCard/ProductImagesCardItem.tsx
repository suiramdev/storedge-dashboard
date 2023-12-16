import { Button } from "@/components/ui/button";
import { ProductImage } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVerticalIcon } from "lucide-react";

interface ProductImagesCardItem {
  image: ProductImage;
}

function ProductImagesCardItem({ image }: ProductImagesCardItem) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className="group relative overflow-hidden rounded-lg border bg-background first:col-span-2 first:row-span-2 hover:active:z-10"
      style={style}
    >
      <img className="h-full w-full object-contain object-center" src={image.file.url} alt={image.alt} />
      <div className="invisible absolute left-0 top-0 flex h-full w-full items-center justify-center bg-secondary/50 group-hover:visible">
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
      </div>
    </div>
  );
}

export default ProductImagesCardItem;
