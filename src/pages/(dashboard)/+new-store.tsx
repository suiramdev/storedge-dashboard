import * as z from "zod";
import { gql, useMutation } from "@apollo/client";
import { useModals } from "@/router";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/components/providers/SessionProvider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 character"),
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

function NewStoreModal() {
  const modals = useModals();
  const open = useMemo(() => modals.current === "/new-store", [modals.current]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const [createStore] = useMutation(CREATE_STORE, {
    onCompleted: (data) => {
      selectStore(data.createOneStore.id);
      toast({ title: "Store created", description: `${data.createOneStore.name} store has been created` });
      modals.close();
    },
    onError: (error) => {
      toast({ title: "Couldn't create", description: error.message, variant: "destructive" });
    },
  });

  const { selectStore } = useSession();

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
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Dialog open={open} onOpenChange={() => modals.close()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new store</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
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
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}

export default NewStoreModal;
