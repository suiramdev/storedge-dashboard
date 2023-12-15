import { gql, useQuery } from "@apollo/client";
import { useFormContext } from "react-hook-form";
import { ProductImage } from "@/types";
import ProductImageDropZone from "./ProductImageDropZone";

const PRODUCT_IMAGES = gql`
  query ProductImages($productId: String!) {
    productImages(where: { productId: { equals: $productId } }, orderBy: [{ position: desc }]) {
      id
      file {
        url
      }
    }
  }
`;

function ProductImagesCard() {
  const form = useFormContext();
  const { data } = useQuery(PRODUCT_IMAGES, {
    variables: {
      productId: form.watch("id"),
    },
  });

  return (
    data?.productImages && (
      <div className="col-span-3 space-y-4 rounded-lg border bg-background px-4 py-6">
        <span className="text-sm font-semibold">Images</span>
        {data.productImages.length > 0 ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-4">
            {data.productImages.map((image: ProductImage) => (
              <div className="group relative rounded-lg border bg-background first:col-span-2 first:row-span-2 hover:cursor-grab">
                <img
                  className="h-full w-full rounded-lg object-contain object-center"
                  src={image.file.url}
                  alt={image.alt}
                />
                <div className="invisible absolute left-0 top-0 h-full w-full bg-black/50 group-hover:visible" />
              </div>
            ))}
            {data.productImages.length < 5 && (
              <ProductImageDropZone id={form.watch("id")} position={data.productImages.length} />
            )}
          </div>
        ) : (
          <ProductImageDropZone id={form.watch("id")} />
        )}
      </div>
    )
  );
}

export default ProductImagesCard;
