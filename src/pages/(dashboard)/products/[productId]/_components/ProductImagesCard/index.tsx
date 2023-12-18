import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { ProductImage } from "@/types";
import DeleteProductImagesDialog from "@/components/dialogs/DeleteProductImagesDialog";
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
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";

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
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

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

  const handleCheckedChange = (value: boolean, image: ProductImage) => {
    if (value) {
      setCheckedItems([...checkedItems, image.id]);
    } else {
      setCheckedItems(checkedItems.filter((id) => id !== image.id));
    }
  };

  return (
    <div className="space-y-4 rounded-lg border bg-background px-4 py-6">
      {checkedItems.length > 0 ? (
        <div className="flex justify-between">
          <span className="text-sm font-semibold">{checkedItems.length} images selected</span>
          <DeleteProductImagesDialog ids={checkedItems} onCompleted={() => setCheckedItems([])}>
            <Button type="button" variant="destructive" size="sm">
              <TrashIcon className="mr-2 h-4 w-4" /> Delete selected
            </Button>
          </DeleteProductImagesDialog>
        </div>
      ) : (
        <span className="text-sm font-semibold">Images</span>
      )}
      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
              {items.map((item) => (
                <ProductImagesCardItem
                  onCheckedChange={handleCheckedChange}
                  draggable={checkedItems.length <= 0}
                  image={item}
                />
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
