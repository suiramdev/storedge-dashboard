import { useParams, Link } from "@/router";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

function ProductVariantPage() {
  const { productId } = useParams("/products/:productId/:variantId");

  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="col-span-full flex justify-between">
        <Button variant="ghost" asChild>
          <Link to="/products/:productId" params={{ productId }}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to product
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default ProductVariantPage;
