import { gql, useQuery, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, Link } from "@/router";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { productSchema } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeftIcon } from "lucide-react";
import { ProductStatus } from "@/types";
import ProductDetailsCard from "./_components/ProductDetailsCard";
import ProductStatusCard from "./_components/ProductStatusCard";
import ProductOptionsCard from "./_components/ProductOptionsCard";
import ProductVariantsCard from "./_components/ProductVariantsCard";

const PRODUCT = gql`
  query Product($id: String!) {
    product(where: { id: $id }) {
      id
      name
      description
      status
      options {
        id
        name
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
      status
      options {
        id
        name
      }
    }
  }
`;

function ProductPage() {
  const { id } = useParams("/products/:id");

  const { error } = useQuery(PRODUCT, {
    variables: { id },
    onCompleted: (data) => {
      form.reset(data.product);
    },
  });
  if (error) throw error;

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      status: ProductStatus.DRAFT,
      options: [],
      variants: [],
    },
  });

  const { toast } = useToast();

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: (data) => {
      form.reset(data.updateOneProduct);
    },
    onError: (error) => {
      toast({
        title: "Couldn't save changes",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) =>
    updateProduct({
      variables: {
        where: { id },
        data: {
          name: { set: data.name },
          description: { set: data.description },
          status: { set: data.status },
          options: {
            connectOrCreate: data.options.map((option) => ({
              where: { id: option.id },
              create: { name: option.name },
            })),
          },
        },
      },
    }),
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-full flex justify-between">
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
          <ProductDetailsCard />
          <ProductStatusCard id={id} />
          <ProductOptionsCard />
          <ProductVariantsCard />
        </div>
      </form>
    </Form>
  );
}

export default ProductPage;
