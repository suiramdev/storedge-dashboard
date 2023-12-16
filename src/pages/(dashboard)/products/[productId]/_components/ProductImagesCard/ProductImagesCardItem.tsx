import { ProductImage } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProductImagesCardItem {
  image: ProductImage;
}

function ProductImagesCardItem({ image }: ProductImagesCardItem) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className="group relative origin-top-left overflow-hidden rounded-lg border bg-background first:col-span-2 first:row-span-2 hover:cursor-grab active:first:origin-center hover:active:z-10 hover:active:cursor-grabbing"
      style={style}
      {...attributes}
      {...listeners}
    >
      <img className="h-full w-full object-contain object-center" src={image.file.url} alt={image.alt} />
      <div className="invisible absolute left-0 top-0 h-full w-full bg-secondary/50 group-hover:visible"></div>
    </div>
  );
}

export default ProductImagesCardItem;
