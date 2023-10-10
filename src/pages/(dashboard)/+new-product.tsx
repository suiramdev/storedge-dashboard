import * as z from "zod";
import { gql, useMutation } from "@apollo/client";
import { useModals } from "@/router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { apolloClient } from "@/lib/apollo";
import { useSession } from "@/providers/session";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 character"),
  description: z.string().optional(),
});

const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductCreateInput!) {
    createOneProduct(data: $data) {
      id
      name
    }
  }
`;

function NewProductModal() {
  const modals = useModals();
  const open = useMemo(() => modals.current === "/new-product", [modals.current]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { toast } = useToast();

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: (data) => {
      toast({ title: "Product created", description: `${data.createOneProduct.name} has been created` });
      apolloClient.refetchQueries({ include: ["Products"] });
      modals.close();
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
          status: "Draft",
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
    <Dialog open={open} onOpenChange={() => modals.close()}>
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

export default NewProductModal;
