import { gql, useQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, Link } from "@/router";
import { useForm } from "react-hook-form";
import { Product, relatedProductModel } from "@/types";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeftIcon } from "lucide-react";
import { ProductStatus } from "@/types";
import { ProductDetailsCard } from "./_components/cards/product-details";
import { ProductStatusCard } from "./_components/cards/product-status";
import { ProductImagesCard } from "./_components/cards/product-images/ProductImagesCard";
import { ProductVariantsCard } from "./_components/cards/product-variants";

const PRODUCT = gql`
  query Product($id: String!) {
    product(where: { id: $id }) {
      id
      name
      description
      price
      stock
      status
      variants {
        id
        name
        price
        stock
      }
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($where: ProductWhereUniqueInput!, $data: ProductUpdateInput!) {
    updateOneProduct(where: $where, data: $data) {
      id
      name
      description
      price
      stock
      status
      variants {
        id
        name
        price
        stock
      }
    }
  }
`;

function ProductPage() {
  const { productId } = useParams("/products/:productId");

  // Get the product data
  const { error } = useQuery(PRODUCT, {
    variables: { id: productId },
    onCompleted: (data) => {
      form.reset(data.product);
    },
  });
  if (error) throw error;

  const form = useForm<Product>({
    resolver: zodResolver(relatedProductModel),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      status: ProductStatus.DRAFT,
      variants: [],
    },
  });

  const [removedVariants, setRemovedVariants] = useState<string[]>([]);

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: (data) => {
      form.reset(data.updateOneProduct);
      toast.success("Product updated");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = form.handleSubmit(
    (values) => {
      updateProduct({
        variables: {
          where: { id: productId },
          data: {
            name: { set: values.name },
            description: { set: values.description },
            // NOTE: A Decimal from decimal.js is expected by the request, so we convert it to a string.
            price: { set: values.price.toString() },
            stock: { set: values.stock },
            status: { set: values.status },
            variants: {
              deleteMany: {
                id: { in: removedVariants },
              },
              upsert: values.variants.map((variant) => ({
                where: { id: variant.id },
                update: {
                  name: { set: variant.name },
                  // description: { set: variant.description }, BUG: The description field is empty
                  // NOTE: A Decimal from decimal.js is expected by the request, so we convert it to a string.
                  price: { set: variant.price.toString() },
                  stock: { set: variant.stock },
                },
                create: {
                  name: variant.name,
                  // NOTE: A Decimal from decimal.js is expected by the request, so we convert it to a string.
                  price: variant.price.toString(),
                  // description: variant.description,
                  stock: variant.stock,
                },
              })),
            },
          },
        },
      });
    },
    (errors) => console.log(errors),
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex justify-between">
          <Button variant="ghost" asChild>
            <Link to="/products">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Back to products
            </Link>
          </Button>
          <Button disabled={!form.formState.isDirty} type="submit">
            Save changes
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <ProductDetailsCard />
            <ProductImagesCard />
            <ProductVariantsCard onVariantRemoved={(variant) => setRemovedVariants([variant.id, ...removedVariants])} />
          </div>
          <div className="space-y-4">
            <ProductStatusCard />
          </div>
        </div>
      </form>
    </Form>
  );
}

export default ProductPage;
