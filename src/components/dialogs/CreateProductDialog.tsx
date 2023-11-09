import * as z from "zod";
import { gql, useMutation } from "@apollo/client";
import { DialogProps } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/providers/session";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name must be at least 3 characters").max(255, "Name must not exceed 255 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
});

const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductCreateInput!) {
    createOneProduct(data: $data) {
      id
      name
    }
  }
`;

interface CreateProductDialogProps extends DialogProps {
  open?: boolean;
  onOpenChange?: (value: boolean) => void;
  children?: React.ReactNode;
}

function CreateProductDialog({ open, onOpenChange, children, ...props }: CreateProductDialogProps) {
  const [show, setShow] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const { toast } = useToast();

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: ["Products"],
    onCompleted: (data) => {
      toast({ title: "Product created", description: `${data.createOneProduct.name} has been created` });
      onOpenChange ? onOpenChange(false) : setShow(false);
    },
    onError: (error) => {
      toast({ title: "Couldn't create", description: error.message, variant: "destructive" });
    },
  });

  const selectedStoreId = useSession((state) => state.selectedStoreId);

  const handleSubmit = form.handleSubmit((data) => {
    createProduct({
      variables: {
        data: {
          name: data.name,
          description: data.description,
          // NOTE: A Decimal from decimal.js is expected by the request, so we convert it to a string.
          price: data.price.toString(),
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
  });

  return (
    <Dialog {...props} open={open ?? show} onOpenChange={onOpenChange ?? setShow}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-2">
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
                <FormItem className="space-y-1">
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
                <FormItem className="space-y-1">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductDialog;
