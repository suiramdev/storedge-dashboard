import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
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
import { arraySwap, SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import ProductImagesCardItem from "./ProductImagesCardItem";
import ProductImageDropZone from "./ProductImageDropZone";
// import { useToast } from "@/components/ui/use-toast";

const PRODUCT_IMAGES = gql`
  query ProductImages($productId: String!) {
    productImages(where: { productId: { equals: $productId } }, orderBy: [{ position: desc }]) {
      id
      file {
        url
      }
      position
    }
  }
`;

// const SWAP_IMAGES = gql`
//   mutation SwapImages($id: String!, $position: Int!, $otherId: String!, $otherPosition: Int!) {
//     updateOneProductImage(data: { position: $otherPosition }, where: { id: $id }) {
//       id
//     }
//     updateOneProductImage(data: { position: $position }, where: { id: $otherId }) {
//       id
//     }
//   }
// `;

function ProductImagesCard() {
  const form = useFormContext();
  const [images, setImages] = useState<ProductImage[]>([]);

  const { data } = useQuery(PRODUCT_IMAGES, {
    variables: {
      productId: form.watch("id"),
    },
    onCompleted: (data) => {
      setImages(data.productImages);
    },
  });

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // const { toast } = useToast();

  // const [swapImages] = useMutation(SWAP_IMAGES, {
  //   onCompleted: () =>
  //     toast({
  //       title: "Image position updated",
  //       description: "The image position has been updated.",
  //     }),
  // });

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;

    setImages((images) => {
      const oldIndex = images.findIndex((image) => image.id === event.active.id);
      const newIndex = images.findIndex((image) => image.id === event.over?.id);

      return arraySwap(images, oldIndex, newIndex);
    });
  };

  return (
    <div className="col-span-3 space-y-4 rounded-lg border bg-background px-4 py-6">
      <span className="text-sm font-semibold">Images</span>
      {images.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data.productImages} strategy={rectSwappingStrategy}>
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
              {images.map((image) => (
                <ProductImagesCardItem image={image} />
              ))}
              {data.productImages.length < 5 && (
                <ProductImageDropZone id={form.watch("id")} position={data.productImages.length + 1} />
              )}
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
