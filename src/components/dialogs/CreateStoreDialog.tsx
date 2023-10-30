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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name must be at least 3 characters").max(255, "Name must not exceed 255 characters"),
  description: z.string().optional(),
  currency: z.string().min(1, "Please select a currency"),
});

const CREATE_STORE = gql`
  mutation CreateStore($data: StoreCreateInput!) {
    createOneStore(data: $data) {
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

function CreateStoreDialog({ open, onOpenChange, children, ...props }: CreateProductDialogProps) {
  const [show, setShow] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      currency: "",
    },
  });

  const { toast } = useToast();

  const [createStore] = useMutation(CREATE_STORE, {
    refetchQueries: ["Stores"],
    onCompleted: (data) => {
      selectStore(data.createOneStore.id);
      toast({ title: "Store created", description: `${data.createOneStore.name} store has been created` });
      onOpenChange ? onOpenChange(false) : setShow(false);
    },
    onError: (error) => {
      toast({ title: "Couldn't create", description: error.message, variant: "destructive" });
    },
  });

  const selectStore = useSession((state) => state.selectStore);

  const handleSubmit = form.handleSubmit((data) => {
    createStore({
      variables: {
        data: {
          name: data.name,
          description: data.description,
          currencyCode: data.currency,
        },
      },
    });
  });

  return (
    <Dialog {...props} open={open ?? show} onOpenChange={onOpenChange ?? setShow}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new store</DialogTitle>
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
              name="currency"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EUR">Euro €</SelectItem>
                    </SelectContent>
                  </Select>
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

export default CreateStoreDialog;
