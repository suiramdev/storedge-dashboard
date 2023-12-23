import { ProductImage as ProductImageType } from "@/types";
import { forwardRef } from "react";

interface ProductImageProps {
  image: ProductImageType;
  style?: React.CSSProperties;
}

export const ProductImage = forwardRef<HTMLDivElement, ProductImageProps>(({ image, style, ...props }, ref) => (
  <div
    ref={ref}
    className="group relative rounded-lg border bg-background first:col-span-2 first:row-span-2 hover:cursor-grab"
    style={style}
    {...props}
  >
    <img className="h-full w-full rounded-lg object-contain object-center" src={image.file.url} alt={image.alt} />
    <div className="invisible absolute left-0 top-0 h-full w-full bg-black/50 group-hover:visible" />
  </div>
));
