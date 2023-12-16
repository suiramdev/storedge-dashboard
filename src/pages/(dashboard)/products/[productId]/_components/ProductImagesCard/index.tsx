import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { ProductImage } from "@/types";
import {
  DragEndEvent,
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import ProductImagesCardItem from "./ProductImagesCardItem";
import ProductImageDropZone from "./ProductImageDropZone";
import { useToast } from "@/components/ui/use-toast";

const PRODUCT_IMAGES = gql`
  query ProductImages($productId: String!) {
    productImages(where: { productId: { equals: $productId } }, orderBy: [{ orderIndex: asc }]) {
      id
      file {
        url
      }
    }
  }
`;

const UPDATE_PRODUCT_IMAGES_ORDER = gql`
  mutation UpdateProductImagesOrder($data: [ProductImageUpdateOrderInput!]!) {
    updateProductImagesOrder(data: $data) {
      count
    }
  }
`;

function ProductImagesCard() {
  const form = useFormContext();

  const [items, setItems] = useState<ProductImage[]>([]);

  const { data } = useQuery(PRODUCT_IMAGES, {
    variables: {
      productId: form.watch("id"),
    },
  });

  useEffect(() => {
    if (data?.productImages) {
      setItems(data.productImages);
    }
  }, [data]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const { toast } = useToast();

  const [updateProductImagesOrder] = useMutation(UPDATE_PRODUCT_IMAGES_ORDER, {
    onCompleted: () => {
      toast({
        title: "Saved images order",
      });
    },
    refetchQueries: ["ProductImages"],
  });

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;

    const oldIndex = data.productImages.findIndex((image: ProductImage) => image.id === event.active.id);
    const newIndex = data.productImages.findIndex((image: ProductImage) => image.id === event.over!.id);
    if (oldIndex === newIndex) return;

    updateProductImagesOrder({
      variables: {
        data: arrayMove(items, oldIndex, newIndex).map((image, index: number) => ({
          id: (image as ProductImage).id,
          orderIndex: index,
        })),
      },
    });
  };

  return (
    <div className="col-span-3 space-y-4 rounded-lg border bg-background px-4 py-6">
      <span className="text-sm font-semibold">Images</span>
      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
              {items.map((item) => (
                <ProductImagesCardItem image={item} />
              ))}
              {items.length < 5 && <ProductImageDropZone id={form.watch("id")} orderIndex={items.length} />}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <ProductImageDropZone id={form.watch("id")} />
      )}
    </div>
  );
}

export default ProductImagesCard;
