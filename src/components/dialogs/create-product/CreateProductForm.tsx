import { gql, useMutation } from "@apollo/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "@/providers/session";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductCreateInput!) {
    createOneProduct(data: $data) {
      id
      name
    }
  }
`;

const formSchema = z.object({
  name: z.string().trim().min(1, "Name must be at least 3 characters").max(255, "Name must not exceed 255 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
});

interface CreateProductFormProps {
  onSubmit?: () => void;
  className?: string;
}

export function CreateProductForm({ onSubmit, className }: CreateProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: () => toast.success("Product created"),
    onError: (error) => toast.error(error.message),
    refetchQueries: ["Products"],
  });

  const selectedStoreId = useSession((state) => state.selectedStoreId);

  const handleSubmit = form.handleSubmit((values) => {
    createProduct({
      variables: {
        data: {
          name: values.name,
          description: values.description,
          // NOTE: A Decimal from decimal.js is expected by the request, so we convert it to a string.
          price: values.price.toString(),
          status: "Draft",
          stock: 1,
          store: {
            connect: {
              id: selectedStoreId,
            },
          },
        },
      },
    });

    onSubmit?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn("flex flex-col space-y-4", className)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="price" min="0" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
