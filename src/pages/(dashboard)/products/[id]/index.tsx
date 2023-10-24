import { gql, useQuery, useMutation } from "@apollo/client"; import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, Link } from "@/router";
import { useForm } from "react-hook-form";
import { Product, ProductOption, ProductOptionValue, productSchema } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ArrowLeftIcon } from "lucide-react";
import { ProductStatus } from "@/types";
import ProductDetailsCard from "./_components/ProductDetailsCard";
import ProductStatusCard from "./_components/ProductStatusCard";
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
        values {
          id
          value
        }
      }
    }
  }
`;

const DELETE_PRODUCT_OPTIONS = gql`
  mutation DeleteProductOptions($where: ProductOptionWhereInput!) {
    deleteManyProductOptionValue(where: { option: { is: $where } }) {
      count
    }
    deleteManyProductOption(where: $where) {
      count
    }
  }
`;

const DELETE_PRODUCT_OPTIONS_VALUES = gql`
  mutation DeleteProductOptionsValues($where: ProductOptionValueWhereInput!) {
    deleteManyProductOptionValue(where: $where) {
      count
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
        values {
          id
          value
        }
      }
    }
  }
`;

function ProductPage() {
  const { id } = useParams("/products/:id");

  const { error } = useQuery(PRODUCT, { variables: { id },
    onCompleted: (data) => {
      form.reset(data.product);
    },
  });
  if (error) throw error;

  const form = useForm<Product>({
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

  const [deletedOptions, setDeletedOptions] = useState<String[]>([]);
  const [deletedOptionsValues, setDeletedOptionsValues] = useState<String[]>([]);

  const [deleteOptions] = useMutation(DELETE_PRODUCT_OPTIONS, {
    variables: {
      where: { id: { in: deletedOptions } },
    },
  });

  const [deleteOptionsValues] = useMutation(DELETE_PRODUCT_OPTIONS_VALUES, {
    variables: {
      where: { id: { in: deletedOptionsValues } },
    },
  });

  const handleSubmit = form.handleSubmit(
    (data) => {
      if (deletedOptions.length > 0) deleteOptions();
      if (deletedOptionsValues.length > 0) deleteOptionsValues();

      updateProduct({
        variables: {
          where: { id },
          data: {
            name: { set: data.name },
            description: { set: data.description },
            status: { set: data.status },
            options: {
              upsert: data.options.map((option) => ({
                where: { id: option.id },
                update: {
                  name: { set: option.name },
                  values: {
                    upsert: option.values.map((value) => ({
                      where: { id: value.id },
                      update: { value: { set: value.value } },
                      create: { value: value.value },
                    })),
                  },
                },
                create: {
                  name: option.name,
                  values: {
                    createMany: {
                      data: option.values.map((value) => ({ value: value.value })),
                    },
                  },
                },
              })),
            },
          },
        },
      });
    },
    (errors) => console.log(errors),
  );

  const handleOptionDelete = (option: ProductOption) => {
    setDeletedOptions([...deletedOptions, option.id]);
  };

  const handleOptionValueDelete = (value: ProductOptionValue) => {
    setDeletedOptionsValues([...deletedOptionsValues, value.id]);
  };

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
          <ProductVariantsCard onOptionDeleted={handleOptionDelete} onOptionValueDeleted={handleOptionValueDelete} />
        </div>
      </form>
    </Form>
  );
}

export default ProductPage;
